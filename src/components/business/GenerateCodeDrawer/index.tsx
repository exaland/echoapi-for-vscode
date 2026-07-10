import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Spin, message } from 'antd';

import { useDebounceFn, useSafeState } from 'ahooks';
import classNames from 'classnames';
import Har2languages from 'har2languages';
import { cloneDeep, isArray, isEmpty, isObject, isString, map } from 'lodash';

import MonacoEditor from '@/components/business/MonacoEditor';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import IconFont from '@/components/ui/IconFont';
import useVarReplaces from '@/hooks/useVarReplaces';
import { catchError, copyStringToClipboard } from '@/utils/common';

import { GenerateCodeWrap, LanguagesIcon } from './style';
import { useApis, useSystemConfig } from '@/store';

interface Props {
  value: any;
  onClose: () => void;
}
const har2languages = new Har2languages();
const GenerateCodeDrawer: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { value, onClose } = props || {};

  const apiCodeHar = useApis(store => store.apiCodeHar);
  const currentServerId = useApis((state) => state.currentServerId);
  
  const systemConfig = useSystemConfig(store=>store.systemConfig);
  const updateSystemConfig = useSystemConfig(store=>store.updateSystemConfig);
  const generate_code_mode = useSystemConfig(store=>store.systemConfig?.generate_code_mode);

  const [menuKey, setMenuKey] = useSafeState<string>('shell.curl');
  const [codeText, setCodeText] = useSafeState<string>('');
  const [monacoLanguage, setMonacoLanguage] = useSafeState<string>('javascript');
  const [genLoading, setGenLoading] = useSafeState<boolean>(false);

  const { varReplace } = useVarReplaces();
  const generateMenuDom = 
    isObject(har2languages.languages) &&
    Object.keys(har2languages.languages).map((language) => {
      if (isArray(har2languages.languages[language])) {
        return har2languages.languages[language].map((subclass: string) => (
          <div
            className={classNames('menu-item', { active: `${language}.${subclass}` === menuKey })}
            key={`${language}.${subclass}`}
            onClick={() => {
              menuClick(language, subclass);
            }}
          >
            <LanguagesIcon type={`icon-${language}`} />
            {`${language}(${subclass})`}
          </div>
        ));
      }
      return '';
    });

  useEffect(() => {
     getCodeHar();
  }, []);

  useEffect(()=>{
    if(apiCodeHar && !isEmpty(apiCodeHar)){
      let language = 'shell';
      let subclass = 'curl';
      if(isArray(generate_code_mode) && generate_code_mode.length > 1){
        language = generate_code_mode[0];
        subclass =generate_code_mode[1];
      }
      menuClick(language, subclass, '');
      setGenLoading(false);
    }
  },[apiCodeHar]);

  const getCodeHar = async () => {
    setGenLoading(true);
    
    try {
      window?.vscode.postMessage({
        action: 'getCodeHar',
        data:{
          apiData:value
        },
        option:{
          server_id: currentServerId,
        }
      });
    } catch (err: any) {
      catchError(err, t('supplement.generate_err'));
    } finally {
    }
  };

  const { run: menuClick } = useDebounceFn(
    async (language: string, subclass: string, code?: any) => {
      try {
        const request = cloneDeep(code || apiCodeHar)?.log?.entries?.[0]?.request;
        request.url = request?.url?.split('#')[0];
        request.headers = map(request?.headers, (it) => {
          if (!isString(it.value)) {
            return { ...it, value: String(it.value) };
          }
          return it;
        });
        
        const languagesRes: any = har2languages.convert(request, language, subclass);

        if (languagesRes?.status === 'error') {
          message.error(`${languagesRes?.message}`);
          return;
        }
        try {
          languagesRes.data = decodeURIComponent(languagesRes?.data);
          languagesRes.data = varReplace(languagesRes.data);
        } catch (error) {}

        setCodeText(languagesRes.data || '');
        setMenuKey(`${language}.${subclass}`);
        setMonacoLanguage(isString(language) && language === 'node' ? 'javascript' : language);
        // Record selected code type
        window?.vscode.postMessage({
          action: 'setSystemConfig',
          data: {generate_code_mode: [language,subclass]}
        });
  
        updateSystemConfig({ ...systemConfig, generate_code_mode:[language,subclass] });
      } catch (err) {
        catchError(err, t('supplement.generate_err'));
      }
    },
    {
      wait: 200,
    }
  );

  return (
    <Drawer
      open
      title={t('common.code.title')}
      width={860}
      mask={true}
      maskClosable={true}
      onClose={onClose}
      styles={{
        body: {
          padding: 0,
        },
      }}
      extra={
        <Button
          onClick={() =>
            copyStringToClipboard(codeText, () => message.success(t('supplement.copy_success')))
          }
          icon={<IconFont type="icon-copy" />}
          size="small"
          mode="light"
        >
          {t('common.code.copy')}
        </Button>
      }
    >
      <GenerateCodeWrap>
        <Spin tip={t('supplement.generating')} spinning={genLoading}>
          <Flex>
            <div className="menu">{generateMenuDom}</div>
            <div className="edit">
              <MonacoEditor readOnly language={monacoLanguage} value={codeText} />
            </div>
          </Flex>
        </Spin>
      </GenerateCodeWrap>
    </Drawer>
  );
};

export default GenerateCodeDrawer;

import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, message } from 'antd';

import { snowflakeId } from 'apipost-tools';
import produce from 'immer';
import { cloneDeep, flattenDeep, isArray, isObject, isPlainObject, isString, trim } from 'lodash';

import Button from '@/components/ui/Button';
import IconFont from '@/components/ui/IconFont';

import { DomainInfoProps, ICookie } from '../../../../types';
import { BtnListContainer, TabContainer, TabItemContainer } from './styles';

const { TextArea } = Input;

interface Props {
  domain: string;
  value: DomainInfoProps;
  project_id?: string | undefined;
  onChange: Dispatch<DomainInfoProps>;
}

const Index = (props: Props) => {
  const { t } = useTranslation();
  const { project_id, value, domain, onChange } = props;

  const handleChangeDomain = (type: any, val: any) => {
    let newVal = value;
    if (isString(type)) {
      newVal = produce(value, (draft) => {
        (draft as any)[type] = val;
      });
    }
    if (isArray(type) && isObject(val)) {
      newVal = produce(value, (draft) => {
        type.forEach((key) => {
          (draft as any)[key] = (val as any)[key];
        });
      });
    }
    onChange(newVal);
  };

  const handleChangeEditorItem = (domaindata: ICookie) => {
    const { domain } = domaindata;
    handleChangeDomain(['activeItem', 'activeId', 'isShowArea'], {
      activeItem: domaindata,
      activeId: domaindata.cookie_id,
      isShowArea: domain,
    });
  };

  const handleRemoveCookieItem = (item: ICookie) => {
    const { cookieObj, activeId } = value;
    const newCookies = cloneDeep(cookieObj);

    const { domain } = item;
    newCookies[domain] = newCookies[domain].filter((d: ICookie) => d.cookie_id !== item.cookie_id);
    if (newCookies[domain].length <= 0) {
      delete newCookies[domain];
    }
    if (activeId === item.cookie_id) {
      handleChangeDomain('isShowArea', '');
    }
    handleChangeDomain(['isShowArea', 'cookieObj'], {
      isShowArea: '',
      cookieObj: newCookies,
    });
  };

  const getCookieText = (obj: ICookie) => {
    let cookieString = '';
    if (isPlainObject(obj?.value)) {
      cookieString = `${obj?.value?.cookieText}`;
    } else {
      cookieString = `${obj?.key}=${obj?.value};Path=${obj?.path};Domain=${obj?.domain};`;
      if (obj?.expires) {
        cookieString = `${cookieString}Expires=${obj.expires}`;
      }
    }
    return cookieString;
  };

  const addCookieItem = (domain: string) => {
    let lastCookieObj = value?.cookieObj;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const domainList = lastCookieObj[domain];
    const suffix = domainList.length + 1;
    const getMax = (suf: number) => {
      const res = domainList.reduce((pre: string, e: any) => {
        if (e.key?.replace('newCookie_', '') === `${suf}`) {
          pre = getMax(suf + 1);
        }
        return pre;
      }, `${suf}`);
      return res;
    };
    const newSuffix = getMax(suffix);
    const newCookie: ICookie = {
      project_id,
      cookie_id: snowflakeId(),
      path: '/',
      key: `newCookie_${newSuffix}`,
      value: 'value',
      domain,
      expires: date.toUTCString(),
      maxAge: '',
    };
    lastCookieObj = {
      ...lastCookieObj,
      [domain]: [...lastCookieObj[domain], newCookie],
    };
    handleChangeDomain(['isShowArea', 'activeId', 'activeItem', 'cookieObj'], {
      isShowArea: domain,
      activeId: newCookie.cookie_id,
      activeItem: newCookie,
      cookieObj: lastCookieObj,
    });
  };

  const confirmSaveCookie = async (key: string) => {
    const { cookieText } = value;
    const [nameAndValue, Paths, Domain, ExpiresTime] = cookieText.split(';');
    const index = nameAndValue.indexOf('=');
    let name = '';
    let tempValue = '';
    if (index === -1) {
      name = trim(nameAndValue);
    } else {
      name = trim(nameAndValue.substring(0, nameAndValue.indexOf('=')));
      tempValue = nameAndValue.substring(nameAndValue.indexOf('=') + 1, nameAndValue.length);
    }
    if (isString(name) && name.length <= 0) {
      message.error(t('supplement.cookie_not_empty'));
      return;
    }
    const Path = Paths.split('=')?.[1];
    const domain = Domain.split('=')?.[1];
    const Expires = ExpiresTime?.split('=')?.[1];
    const regDomain =
      /^(.+\.)(com|edu|gov|int|mil|net|org|biz|info|name|museum|coop|aero|[a-z][a-z])$/;
    // eslint-disable-next-line no-useless-escape
    const reg = /^[a-z\d|\:|\.|\-|_]*$/;
    if ((!regDomain.test(domain) && !reg.test(domain)) || domain.trim().length <= 0) {
      message.error(t('supplement.domain_invalid'));
      return;
    }
    const saveCookie = {
      path: Path,
      key: name,
      value: tempValue,
      expires: Expires,
      domain,
    };
    const newCookiesDB: ICookie[] = [];
    const deleteArray: string[] = [];
    const CookiesDB: ICookie[] = flattenDeep(Object.values(value?.cookieObj));
    CookiesDB.forEach((it) => {
      if (it.cookie_id === key) {
        it = {
          ...it,
          ...saveCookie,
        };
      }
      if (
        (new Date(it.expires).getTime() < new Date().getTime() && it.expires) ||
        (isString(it.name) && trim(it.name).length <= 0)
      ) {
        deleteArray.push(it.cookie_id);
      } else {
        newCookiesDB.push(it);
      }
    });
    const obj: any = {};
    newCookiesDB &&
      newCookiesDB.map((it: any) => {
        const domainObj = obj[it.domain];
        if (domainObj) {
          domainObj.push(it);
        } else {
          obj[it.domain] = [].concat(it);
        }
        return it;
      });
    handleChangeDomain(['cookieObj', 'isShowArea'], {
      cookieObj: obj,
      isShowArea: '',
    });
  };

  return (
    <TabContainer>
      {value?.cookieObj[domain].map((item: ICookie) => {
        const { key, cookie_id } = item;
        return (
          <TabItemContainer
            key={cookie_id}
            className={`cookie-list-item ${value?.activeId === cookie_id ? 'active' : ''}`}
          >
            <div
              className="cookie-name"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeEditorItem(item);
              }}
            >
              {key}
            </div>
            <div
              className="cookie-item-close"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCookieItem(item);
              }}
            >
              <IconFont type="icon-close" />
            </div>
          </TabItemContainer>
        );
      })}
      <TabItemContainer
        className={'cookie-list-item active cookie-item-add'}
        onClick={() => addCookieItem(domain)}
      >
        <div className="cookie-name">{t('global_setting.cookie_detail.add_cookie')}</div>
        <IconFont type="icon-add-line" />
      </TabItemContainer>
      {value?.isShowArea === domain ? (
        <>
          <TextArea
            autoSize
            className="beautify-scroll-bar"
            value={value?.cookieText || getCookieText(value?.activeItem)}
            onChange={(e) => {
              handleChangeDomain('cookieText', e.target.value);
            }}
          />
          <BtnListContainer>
            <Button
              size="small"
              onClick={() => {
                handleChangeDomain('isShowArea', '');
              }}
            >
              {t('global_setting.cookie_detail.cancel')}
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirmSaveCookie(value?.activeItem?.cookie_id);
              }}
            >
              {t('global_setting.cookie_detail.confirm')}
            </Button>
          </BtnListContainer>
        </>
      ) : null}
    </TabContainer>
  );
};

export default Index;

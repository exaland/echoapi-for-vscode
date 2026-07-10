import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';

import { message } from 'antd';

import breaks from '@bytemd/plugin-breaks';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Editor, EditorProps } from '@bytemd/react';
import { useDebounceFn } from 'ahooks';
import 'bytemd/dist/index.min.css';
import cn from 'classnames';
import { has } from 'lodash';

import { LANGUAGE_TYPE } from '@/constants/settings';
import useTheme from '@/hooks/useTheme';
import { useSystemConfig } from '@/store';
import { copyStringToClipboard } from '@/utils/common';
import { openUrlAndOpenTab } from '@/utils/open';

import './css/index.css';
import en from './locale/en';
import ja from './locale/ja_jp';
import zh_Hans from './locale/zh_Hans';
import Menus from './menu';
import admonitions from './plugins/admonitions';
import lightBlock from './plugins/lightBlock';
import LinkApi from './plugins/linkApi';
import mermaid from './plugins/mermaid';

import { ByteMdWrap, ThemeModeWrap } from './style';

interface ByteMDProps {
  value: string; // Markdown rendered value
  onChange?: (val: string) => void; // Triggered when value changes
  Height?: string; // Markdown height, default is 300px
  className?: string; // Independent class name for the outermost markdown div
  readonly?: boolean; // Whether to display in read-only mode
  mode?:'split' | 'tab' | 'auto';
}

const ByteMD = React.memo((props: ByteMDProps): any => {
  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const bg_color = useSystemConfig((state) => state.systemConfig.bg_color);
  const language = useSystemConfig((state) => state.systemConfig.language);

  const insert = () => {
    return {
      actions: [
        {
          title: t('supplement.insert'),
          icon: `<div
          style="color:#FA7600;display: flex;align-items: center"
          class="markdown-insert-icon"><svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6Z"
            fill="#FA7600"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.57143 5.57143V3H6.42857V5.57143H9V6.42857H6.42857V9H5.57143V6.42857H3V5.57143H5.57143Z"
            fill="white"
          />
        </svg>&nbsp;${t('supplement.insert')}</div>`,
          handler: {
            type: 'action',
            click(params: any) {
              const { root } = params;
              createRoot(root.querySelector('.markdown-insert-icon')!).render(
                <Menus {...params} />
              );
            },
          },
        },
      ],
    };
  };

  const localeMap = {
    [LANGUAGE_TYPE.en]: en,
    [LANGUAGE_TYPE.zh]: zh_Hans,
    [LANGUAGE_TYPE.ja]: ja,
  };
  const plugins = [
    gfm({ locale: has(localeMap, language) ? localeMap[language] : zh_Hans }),
    mermaid({ actions: [] }),
    breaks(),
    gemoji(),
    highlight(),
    admonitions(),
    lightBlock(),
    insert(),
    LinkApi(),
  ];
  const editorRef = React.useRef<any>(null);
  const { value, onChange = () => undefined, Height = '100%', className, readonly, mode } = props;
  /* <Menus {...options} /> */
  const defaultSettings: EditorProps & any = {
    uploadImages: null,
    locale: has(localeMap, language) ? localeMap[language] : zh_Hans,
    plugins,
    mode: mode || 'split',
    previewDebounce: 100,
    editorConfig: {
      autofocus: true,
      readOnly: readonly,
    },
  };
  const LinkMark = (e: any) => {
    if (e?.target?.tagName === 'A') {
      e && e.preventDefault();
      openUrlAndOpenTab(e?.target?.attributes?.href?.value || e?.target?.href);
    }
    if (e?.target?.tagName === 'PRE') {
      copyCode(e);
    }
  };
  const { run: copyCode } = useDebounceFn(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      copyStringToClipboard(target?.innerText || '', () => {
        target?.classList.add('success');
        setTimeout(() => {
          target?.classList.remove('success');
        }, 800);
        message.success(t('supplement.copy_success'));
      });
    },
    {
      wait: 1000,
      leading: true,
    }
  );
  useEffect(() => {
    try {
      if (
        document.querySelectorAll('.markdown-body') &&
        document.querySelectorAll('.markdown-body')?.length > 0
      ) {
        for (let index = 0; index < document.querySelectorAll('.markdown-body').length; index++) {
          const el = document.querySelectorAll('.markdown-body')[index];
          el.addEventListener('click', (e) => LinkMark(e));
        }
      }
    } catch (error) {}
    return () => {
      try {
        if (
          document.querySelectorAll('.markdown-body') &&
          document.querySelectorAll('.markdown-body')?.length > 0
        ) {
          for (let index = 0; index < document.querySelectorAll('.markdown-body').length; index++) {
            const el = document.querySelectorAll('.markdown-body')[index];
            el.removeEventListener('click', (e) => LinkMark(e));
          }
        }
      } catch (error) {}
    };
  }, []);

  return (
    <ThemeModeWrap theme_mode={['white', 'orange'].includes(bg_color) ? 'light' : 'dark'}>
      <ByteMdWrap $token={themeToken}>
        <div
          className={cn(`beautify-mark-down`, className, {})}
          style={{ height: Height, position: 'relative' }}
        >
          <Editor
            ref={editorRef}
            sanitize={(schema: any) => {
              // Add new tags and attributes
              const mapSchema = {
                ...schema,
                attributes: {
                  ...schema.attributes,
                  '*': [...schema.attributes['*'], 'bgColor'],
                },
                tagNames: [...schema.tagNames, 'font', 'center'],
              };
              return mapSchema;
            }}
            value={value}
            onChange={onChange}
            {...defaultSettings}
          />
        </div>
      </ByteMdWrap>
    </ThemeModeWrap>
  );
});

export default ByteMD;

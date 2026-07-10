import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from 'antd';

import breaks from '@bytemd/plugin-breaks';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Viewer } from '@bytemd/react';
import { useDebounceFn } from 'ahooks';

import useTheme from '@/hooks/useTheme';
import { useSystemConfig } from '@/store';
import { copyStringToClipboard } from '@/utils/common';
import { openUrlAndOpenTab } from '@/utils/open';

import admonitions from './plugins/admonitions';
import lightBlock from './plugins/lightBlock';
import mermaid from './plugins/mermaid';

import { ByteMdWrap, ThemeModeWrap } from './style';

interface Props {
  value: string;
}
const Preview = (props: Props) => {
  const { value } = props || {};

  const { t } = useTranslation();
  const { themeToken } = useTheme();

  const bg_color = useSystemConfig((state) => state.systemConfig.bg_color);
  const LinkMark = (e: any) => {
    if (e?.target?.tagName === 'A') {
      e && e.preventDefault();
      openUrlAndOpenTab(e?.target?.href);
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
        <Viewer
          value={value}
          plugins={[gfm(), breaks(), highlight(), mermaid(), gemoji(), admonitions(), lightBlock()]}
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
        />
      </ByteMdWrap>
    </ThemeModeWrap>
  );
};

export default Preview;

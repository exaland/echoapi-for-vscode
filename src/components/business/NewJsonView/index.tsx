import { CSSProperties, FC, useMemo } from 'react';
import ReactJson from 'react-json-view';

import { isPlainObject, isString } from 'lodash';

import { useSystemConfig } from '@/store';
import { EditFormat, copyStringToClipboard } from '@/utils/common';

import { NewJsonViewContainer, OtherPreViewWrap } from './style';

const reactJsonStyle = {
  fontSize: '12px',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
};

interface Props {
  value: any;
  wrapStyle?: CSSProperties;
  wrapClassName?: string;
}

const NewJsonView: FC<Props> = ({ value, wrapStyle, wrapClassName }) => {
  const { bg_color } = useSystemConfig((state) => state.systemConfig);

  const jsonView = useMemo(() => {
    let result = {
      isJson: true,
      view: {},
    };

    if (isString(value) && value.length > 0) {
      try {
        const tempObj = JSON.parse(EditFormat(value).value);
        result = isPlainObject(tempObj)
          ? {
              isJson: true,
              view: tempObj,
            }
          : { isJson: false, view: value };
      } catch (e) {
        result = {
          isJson: false,
          view: value,
        };
      }
    }
    if (isPlainObject(value)) {
      result = {
        isJson: true,
        view: value,
      };
    }
    return result;
  }, [value]);

  const handleCopyClipboard = (copyObj: any) => {
    const { name, src } = copyObj;

    let copyVal = null;

    try {
      if (!name) {
        copyVal = JSON.stringify(src);
      } else if (isString(name)) {
        copyVal = JSON.stringify({
          [name]: src,
        });
      }

      copyStringToClipboard(copyVal as string);
    } catch (e) {}
  };

  return (
    <NewJsonViewContainer style={wrapStyle} className={wrapClassName}>
      {jsonView.isJson ? (
        <ReactJson
          src={jsonView.view}
          enableClipboard={handleCopyClipboard}
          name={false}
          theme={['white', 'orange'].includes(bg_color) ? 'rjv-default' : 'eighties'}
          indentWidth={2}
          style={reactJsonStyle}
          displayDataTypes={false}
          collapsed={1}
        />
      ) : (
        <OtherPreViewWrap>{jsonView.view as string}</OtherPreViewWrap>
      )}
    </NewJsonViewContainer>
  );
};

export default NewJsonView;

import { FC } from 'react';

import { Upload as AntdUpload, UploadProps } from 'antd';
import { APIPOST_MACHINE, APIPOST_PLATFORM, APIPOST_TERMINAL, APIPOST_VERSION } from '@/constants/user';

type Props = UploadProps;

const Upload: FC<Props> = (props) => {
  return <AntdUpload {...props} />;
};

Upload.defaultProps = {
  action: '/api/upload',
  name: 'file',
  headers: {
    [APIPOST_MACHINE]: '',
    [APIPOST_TERMINAL]: 'vscode',
    [APIPOST_VERSION]: '1.0.0',
    [APIPOST_PLATFORM]: '',
  },
  data: { business: 2 },
};

export default Upload;

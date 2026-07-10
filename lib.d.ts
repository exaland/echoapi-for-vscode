import { ThemeToken } from './src/types/theme';
// src/typings.d.ts
declare module '*.png' {
  const src: string
  export default src
}
declare global {
  declare module 'remark-admonitions';
  declare module 'mockjs5-pro';
  declare module 'js-yaml';
  declare module 'type-of-is';
  declare module 'auto-json-faker';
  declare module 'convert-design-debug';
  declare module 'exp-mock';

  declare module '*.png' {
    const src: string
    export default src
  }

  declare module "*.svg?react" {
    import * as React from "react";
  
    const ReactComponent: React.FunctionComponent<
      React.ComponentProps<"svg"> & { title?: string }
    >;
  
    export default ReactComponent;
  }
 
  interface Window{
    vscode:{
      postMessage:(message:any) => Thenable<boolean>;
    };
    vscodeData?:any
    resourceBaseUrl?:string
  }

  type GlobalThemeToken = ThemeToken;
}


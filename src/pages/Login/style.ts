import { Flex } from 'antd';

import styled from 'styled-components';

export const LoginWrap = styled(Flex)`
  height: 100vh;
  background: var(--color-bg-right);
  .logo{
    display: flex;
    align-items: center;
    justify-content: center;
    /* height: 60px; */
    /* width: 60px; */
    border-radius: 50%;
    /* background: linear-gradient(325deg, #835DFF 40.4%, #CB77FF 79.25%, #F2A3FF 90.37%); box-shadow: 0px -0.833px 7px 0px #FFF inset, 0px -5px 8.333px 0px #F4E3FF inset, 0px 0px 9.5px 0px rgba(255, 255, 255, 0.54), 0px 0px 33.33px 0px #CB77FF, 0px 0px 83.33px -0.833px #C574FF; */
  }
  .user-name{
    font-size: 24px;
    font-family: 600;
    color: var(--color-primary);
  }
  .user-status{
    display: flex;
    align-items: center;
    justify-content: center;
   
    height:22px;
    padding: 0px 8px 0px 8px;
    border-radius: 18px;
    background: rgba(87, 255, 164, 0.15);
    color: rgba(0, 195, 114, 1);
    font-size: 12px;
    flex-wrap: nowrap;
  }
  .header-content{
    &>.title{
    font-size: 24px;
    font-weight: 600;
    color:var(--font-title-color)
  }
  &>.desc{
    font-size: 14px;
    color: var(--font-light-color);
  }
  }
  .sign-up{
    color: var(--color-primary);
    cursor: pointer;
    margin-left: 4px;
    &:hover{
      opacity: 0.8;
    }
  }
  .beautify-btn-primary{
    padding: 0px 15px !important;
    font-size: 14px;
  }
`;

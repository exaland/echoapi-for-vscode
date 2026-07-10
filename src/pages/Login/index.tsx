import { useEffect, useRef, useState } from 'react';
import { LoginWrap } from './style';
import { Button, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { LoginCheckService, getOauthPreLoginInfoService, getUserInfoService, userLogoutService } from '@/sevices/user';
import SvgLogo from '@/assets/icon/logo.svg?react';
import { useUserConfig } from '@/store';
import { isString } from 'lodash';

const Login = () => {
  useTranslation();

  const { userInfo, token, updateToken, updateUserInfo } = useUserConfig((state) => state);
  const [isPolling, setIsPolling] = useState(false);
  const [preLoginInfo, setPreLoginInfo]: any = useState({});
  const intervalRef: any = useRef(null);

  const getPreLoginInfo = async () => {
    const res: any = await getOauthPreLoginInfoService({ from: 'vscode' });
    if (res?.login_url && res?.login_check_url) {
      setPreLoginInfo(res);
    }
    return res;
  };

  const handleLogin = async () => {
    try {
      const res = await getPreLoginInfo();

      if (res?.login_url) {
        // Open external page
        window?.vscode.postMessage({
          action: 'openNewWindow',
          data: res?.login_url
        });
        // Start polling
        setIsPolling(true);
      }

    } catch (error) {
    }
  };

  const handleSingOut = async () => {

    // Notify main program to clear open tabs, clear local token storage, and switch to local project
    window?.vscode.postMessage({
      action: 'userSingOut',
    });
    try {
      // Call API
      await userLogoutService();
    } catch (error) { }

    // Clear token
    updateToken('');
  };

  const fetchData = async () => {
    
    try {
      const res = await LoginCheckService(preLoginInfo.login_check_url);
      if (isString(res?.token) && res.token.length > 0) {
        // Stop polling
        setIsPolling(false);
        // Login successful, initialize user info
        updateToken(res.token);
        const userData = await getUserInfoService();
        updateUserInfo(userData);
        // Pass userConfig to main program
        window?.vscode.postMessage({
          action: 'saveUserConfig',
          data: {
            token: res.token,
            userInfo: userData
          }
        });
      }

    } catch (error) {
      setIsPolling(false);
    }
  };

  useEffect(() => {
    // Start polling
    if (isPolling) {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(fetchData, 2000);
    } else {
      // Stop polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPolling, preLoginInfo?.login_check_url]);

  return (
    <LoginWrap vertical gap={32} justify='center' align='center'>
      <div className="logo">
        <SvgLogo />
      </div>
      {!token ?
        <>
          <Flex className='header-content' gap={16} vertical style={{ maxWidth: '568px', textAlign: 'center' }}>
            <div className="title">Sign in to EchoAPl</div>
            <div className="desc">You can log in to your EchoAPI account to manage your data. After logging in, you'll be able to push or pull your account data on the EchoAPI platform (like VS Code, IntelliJ IDEA, client, and cloud). Don’t worry, we won’t collect any extra information from you.</div>
          </Flex>
          <Flex gap={16} align='center'>Account Status :<div style={{ color: 'rgba(255, 88, 62, 1)', fontWeight: 600 }}>None</div></Flex>
          <Flex gap={16} vertical>
            <Button style={{width:200}} type="primary" onClick={handleLogin}>
              {'Sign in'}
            </Button>
            <Flex align='center'>Don't have an account? <div className="sign-up" onClick={handleLogin}>Sign Up</div></Flex>
          </Flex>
        </>
        :
        <>
          <Flex gap={16} vertical style={{ maxWidth: '386px', textAlign: 'center' }}>
            <div className="title">Account Status :</div>
            <Flex gap={12} align='center'><div className="user-name">{userInfo.nick_name}</div><div className="user-status">Logged in</div></Flex>
          </Flex>
          <Flex align='center' gap={16} vertical>
            <Button style={{width:200}} type="primary" onClick={handleSingOut}>
              {'Sign out'}
            </Button>
          </Flex>
        </>
      }

    </LoginWrap>
  );
};
export default Login;
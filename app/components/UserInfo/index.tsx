'use client';

import { FC, useState, useEffect } from 'react';
import styles from './sidebar.module.scss';
import Image from 'next/image';
import accauntIcon from '../../../public/Account.svg';
import settingsIcon from '../../../public/icons-settings.svg';
import { Button, Flex } from 'antd';
import steamIcon from '../../../public/steam-icon.svg';
import Link from 'next/link';
import copy from '../../../public/copy.svg';
import LogOutIcon from '../../../public/logout.svg';
// import 'antd/dist/antd.css'; временно удалено
// import { StyleProvider } from '@ant-design/cssinjs';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { useGetMeQuery, useGetFriendListQuery, useLazyGetFriendListQuery } from '../../redux';
import { useSelector } from 'react-redux';

type UserType = {
  id: number;
  steamId: string;
  registeredAt: number;
  lastAuthorizedAt: number;
  role: string;
  isBanned: boolean;
  username: string | null;
  nickname: string | null;
  about: string | null;
};

export type UserDataResponse = {
  user: UserType;
};

const UserInfo: FC = () => {
  const { data: userData } = useGetMeQuery({});
  const user: UserType | undefined = userData?.user;
  const baseUrl = process.env.BASE_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  // const [decodedToken, setDecodedToken] = useState<any>('');
  const [loadingCookies, setLoadingCookies] = useState(true);
  const [friendCount, setFriendCount] = useState<any>('');

  //@ts-ignore
  // const decodedToken = useSelector((state) => state.auth.decodedToken);

  //@ts-ignore
  // const [getFriendsList, { data: friendsData  }] = useLazyGetFriendListQuery(decodedToken?.id);

  // useEffect(() => {
  //   if (decodedToken) {
  //     setIsAuthenticated(true);
  //   }
  //   setLoadingCookies(false);
  // }, []);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
    setLoadingCookies(false);
  }, []);

  // useEffect(() => {
  //   const jwtToken = Cookies.get('jwt');
  //   if (jwtToken) {
  //   }
  // }, [isAuthenticated]);

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(decodedToken.id);
  // };

  const handleOpenProfile = () => {
    let url = `${process.env.BASE_URL}/auth-steam`;
    console.log(url);
    // window.location.href = url;
    //@ts-ignore
    getFriendsList();
  };

  const logout = () => {
    // Cookies.remove('jwt');
    setIsAuthenticated(false);
  };

  const enterLoading = (index: number) => {
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  if (loadingCookies) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <div className={styles.buttonContainer}>
            <Button
              onClick={handleOpenProfile}
              className={styles.steam_btn}
              type="primary"
              loading={loadings[0]}
              onClickCapture={() => enterLoading(0)}>
              <Image src={steamIcon} alt="steam icon" />
              Lodaing...
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  let userName = user?.username === null ? 'укажите username' : user?.username;

  if (isAuthenticated && user && user.username !== null) {
    userName = user.username;
    if (userName.length > 20) {
      userName = `${userName.slice(0, 20)}...`;
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.userInfo_container}>
          <div className={styles.avatar}>
            {/* {isAuthenticated ? (
              <Image
                src={decodedToken?.photos[1] == '' ? '' : decodedToken?.photos[1].value}
                alt="steam avatar"
                width={100}
                height={100}
              />
            ) : ( */}
            <Image
              width={100}
              height={100}
              src="https://icon-library.com/images/no-user-image-icon/no-user-image-icon-8.jpg"
              alt="steam avatar"
            />
            {/* )} */}
          </div>
          <div className={styles.textInfo}>
            <h2>{userName ? userName : 'пустой username'}</h2>
            <p>пустой status</p>
          </div>
        </div>

        {!isAuthenticated && (
          <>
            <div className={styles.loginContent}>
              <Link href={`${process.env.BASE_URL}/auth-steam`} style={{ textDecoration: 'none' }}>
                <button
                  onClick={handleOpenProfile}
                  onClickCapture={() => enterLoading(0)}
                  className={styles.login_btn}>
                  <Image src={steamIcon} alt="steam icon" />
                  <span>Login</span>
                </button>
              </Link>

              <article className={styles.loginText}>
                <p>Log in via Steam to use the site functionality</p>
              </article>
            </div>
          </>
        )}

        {isAuthenticated && (
          <div className={styles.info_block}>
            {/* <p>Information is absent.</p> */}
            <p>{user?.about === null ? 'Информация пустая' : user?.about}</p>
          </div>
        )}

        <div className={styles.lastIcon}>
          <div className={styles.settingIcon}>
            <Image src={settingsIcon} alt="setting icon" />
          </div>
        </div>

        {/* С НИЗУ СТАРЫЙ КОД  */}

        {/* {!isAuthenticated && (
          <div className={styles.buttonContainer}>
            <Link
              href={`${baseUrl}/v1/auth/steam`}
              style={{ textDecoration: 'none' }}>
              <Button
                onClick={handleOpenProfile}
                className={styles.steam_btn}
                type="primary"
                loading={loadings[0]}
                onClickCapture={() => enterLoading(0)}>
                <Image src={steamIcon} alt="steam icon" />
                Click me!
              </Button>
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <>
            <div className={styles.avatar}>
              <Image
                src={decodedToken.photos[1] == '' ? '' : decodedToken.photos[1].value}
                alt="avatar"
                width={80}
                height={80}
                style={{ borderRadius: '50%' }}
              />
            </div>
            <section>
              <article className={styles.name_email_content}>
                <h3>
                  {decodedToken
                    ? decodedToken.displayName.length > 20
                      ? decodedToken.displayName.slice(0, 20) + '...'
                      : decodedToken.displayName
                    : '<div>Username</div>'}
                </h3>
                <div>
                  <h3>ID:</h3>
                </div>
                <Image
                  src={copy}
                  onClick={handleCopy}
                  alt="account icon"
                  className="cursor-pointer"
                />
              </article>
              <article className={styles.user_info}>
                <p>Moscow, Russia</p>
                <p className={styles.friends_count}>{friendCount}Friends</p>
              </article>
              <article className={styles.desc}>
                <p>
                  Status: Не бойся противника, который практикует 10,000 ударов. Бойся того, кто
                  практикует один удар 10,000 раз.
                </p>
              </article>
              <footer className={styles.downContnet}>
                <div className={styles.links}>
                  <h3>INVENTORY</h3>
                  <h3>STEAM</h3>
                  <h3>MY LINKS</h3>
                  <h3>WRITE</h3>
                  <div className={styles.icons}>
                    <Image src={accauntIcon} alt="accaunt icon" />
                    <Image src={settingsIcon} alt="setting icon" />
                    <Image onClick={logout} src={LogOutIcon} alt="setting icon" />
                  </div>
                </div>
              </footer>
            </section>
          </>
        )} */}
      </div>
    </aside>
  );
};

export default UserInfo;

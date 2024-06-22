'use client';

import React, { useEffect, useState, FormEvent, useRef } from 'react';
import styles from './chat.module.scss';
import Image from 'next/image';

// иконки
import emojiIcon from '../../../public/smile-emoji.svg';
import clipIcon from '../../../public/clip.svg';
import videoAddIcon from '../../../public/video-add.svg';
import fileAddIcon from '../../../public/add-file.svg';
import photoAddIcon from '../../../public/add-photo.svg';
import Message from '@/components/Message';
import ChatSidebar from '@/components/ChatSidebar';
import { useSelector } from 'react-redux';
import { socket } from '../../(root)/chat/socket';
import { useParams } from 'next/navigation';
import { useGetChatMessagesQuery } from '@/redux';

function ChatWindow() {
  const chatRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [openClip, setClip] = useState(false);
  const [openMenu, setMenu] = useState(false);
  const [AllMessages, setAllMessages] = useState<Message[]>([]);

  interface User {
    id: string;
    name: string;
    UT: string;
    avatar: string;
    about: string;
    registeredAt: Date;
    role: string;
    status: string;
  }

  //@ts-ignore
  const decodedToken = useSelector((state) => state.auth.decodedToken);

  const params = useParams();
  const chatId = String(params.id);
  const { data, isLoading } = useGetChatMessagesQuery(chatId);
  const otherUsers = data?.users.filter((user: User) => user.id !== decodedToken.id);

  useEffect(() => {
    if (data && data.messages) {
      setAllMessages(data.messages);
    }
  }, [data]);

  interface sender {
    id: number;
    name: string;
    UT: string;
    avatar: string;
    about: string;
    registeredAt: Date;
    role: string;
    status: string;
  }

  interface Message {
    id: number;
    text: string;
    senderId: number;
    chatId: string;
    sender: sender;
    createdAt: Date;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('message', {
        text: message,
        senderId: decodedToken.id,
        chatId: params.id,
      });
      setMessage('');
    }
  };

  const handleCreateNewChat = () => {
    const friendId = prompt('Enter friendId');
    socket.emit('create chat', {
      user1Id: decodedToken.id,
      user2Id: friendId,
    });
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [AllMessages]);

  useEffect(() => {
    socket.on('message', (data) => {
      setAllMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('error', (data) => {
      alert(JSON.stringify(data));
    });

    return () => {
      socket.off('message');
      socket.off('error');
    };
  }, [socket]);

  const handleOpenMenu = () => {
    setMenu(!openMenu);
  };

  const handleCloseMenu = () => {
    setMenu(false);
  };

  const handleOpenClip = () => {
    setClip(!openClip);
  };

  const handleCloseClip = () => {
    setClip(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles.wrapper}>
          <div className={styles.textCenter}>
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <ChatSidebar />
          <div className={styles.chat} ref={chatRef}>
            {AllMessages.map((msg, index) => (
              <Message
                key={index}
                messageValue={msg.text}
                avatar={msg.sender.avatar}
                own={msg.senderId === decodedToken?.id}
              />
            ))}
          </div>
          <section className={styles.input}>
            <div className={styles.icons}>
              <Image
                onClick={handleOpenClip}
                src={clipIcon}
                alt="clipIcon"
                className={styles.icon}
              />
              <Image src={emojiIcon} alt="emoji icon" className={styles.icon} />
            </div>
            <div className={styles.inputBorder}>
              <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSend(e)}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="Написать сообщение"
                />
              </form>
              <div className={styles.inputIcons}>
                {openClip && (
                  <div className={styles.addSomethingSection}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Image onClick={handleCloseClip} src={photoAddIcon} alt="photo add icon" />
                      <h2 onClick={handleCloseClip}>Добавить фото</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Image onClick={handleCloseClip} src={fileAddIcon} alt="file add icon" />
                      <h2 onClick={handleCloseClip}>Добавить файл</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Image onClick={handleCloseClip} src={videoAddIcon} alt="video add icon" />
                      <h2 onClick={handleCreateNewChat}>Добавить видео</h2>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={(e) => handleSend(e)} className={styles.sendBtn}>
              Отправить
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;

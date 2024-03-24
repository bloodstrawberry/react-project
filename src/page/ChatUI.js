import React, { useState } from "react";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

const AVATAR_IMAGE =
  "https://img1.daumcdn.net/thumb/C428x428/?scode=mtistory2&fname=https%3A%2F%2Ftistory3.daumcdn.net%2Ftistory%2F4431109%2Fattach%2F3af65be1d8b64ece859b8f6d07fafadc";

const defaultMessage = [
  {
    model: {
      message: "How are you?",
      direction: "incoming",
    },
    avatar: {
      src: AVATAR_IMAGE,
      name: "bloodstrawberry",
    },
  },
  {
    model: {
      message: "I'm fine, thank you, and you?",
      direction: "outgoing",
    },
  },
  {
    model: {
      message: "I'm fine, too. thank you, and you?",
      direction: "incoming",
    },
    avatar: {
      src: AVATAR_IMAGE,
      name: "bloodstrawberry",
    },
  },
];

const getMessageComponent = (data) => {
  return data.map((item, index) => {
    return (
      <Message key={index} model={item.model}>
        {item.avatar ? (
          <Avatar src={item.avatar.src} name={item.avatar.name} />
        ) : null}
      </Message>
    );
  });
};

const ChatUI = () => {
  const [messages, setMessages] = useState(defaultMessage);

  const handleSend = (input) => {
    let newMessage = {
      model: {
        message: input,
        direction: "outgoing",
      },
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>{getMessageComponent(messages)}</MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default ChatUI;

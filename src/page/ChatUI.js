import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  Sidebar,
  ConversationList,
  Conversation,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";

const AVATAR_IMAGE =
  "https://img1.daumcdn.net/thumb/C428x428/?scode=mtistory2&fname=https%3A%2F%2Ftistory3.daumcdn.net%2Ftistory%2F4431109%2Fattach%2F3af65be1d8b64ece859b8f6d07fafadc";

const AVATAR_MAP = {
  Lilly: "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg",
  Joe: "https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg",
  Emily: "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg",
  Akane: "https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg",
  Eliot: "https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg",
  Zoe: "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg",
};

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

const defaultMessagePatrik = [
  {
    model: {
      message: "Can you take care of this for me?",
      direction: "outgoing",
    },
  },
  {
    model: {
      message: "Yes i can do it for you",
      direction: "incoming",
    },
    avatar: {
      src: "https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg",
      name: "Patrik",
    },
  },
];

const totalMessages = [defaultMessage, defaultMessagePatrik];

const defaultConversation = [
  {
    info: "I'm fine, too. thank you, and you?",
    lastSenderName: "bloodstrawberry",
    name: "bloodstrawberry",
    src: AVATAR_IMAGE,
    status: "available",
  },
  {
    info: "Yes i can do it for you",
    lastSenderName: "Patrik",
    name: "Patrik",
    src: "https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg",
    status: "invisible",
  },
];

const ChatUI = () => {
  const location = useLocation();
  const [loginID, setLoginID] = useState("");

  const [activeID, setActiveID] = useState(0);
  const [messages, setMessages] = useState(totalMessages);

  const getMessageComponent = (totalMessages) => {
    let data = totalMessages[activeID];

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

  const getConversationComponent = (data) => {
    return data.map((item, index) => {
      return (
        <Conversation
          key={index}
          active={index === activeID}
          info={item.info}
          lastSenderName={item.lastSenderName}
          name={item.name}
          onClick={() => setActiveID(index)}
        >
          <Avatar name={item.name} src={item.src} status={item.status} />
        </Conversation>
      );
    });
  };

  const handleSend = (input) => {
    let newMessage = {
      model: {
        message: input,
        direction: "outgoing",
      },
    };

    let temp = [...totalMessages];
    temp[activeID].push(newMessage);
    setMessages(temp);
  };

  const init = () => {
    setLoginID(location.state.loginID);
  };

  useEffect(init, []);

  return (
    <div>
      <Conversation
        info="I'm fine, thank you, and you?"
        lastSenderName={loginID}
        name={loginID}
      >
        <Avatar name={loginID} src={AVATAR_MAP[loginID]} status="available" />
      </Conversation>
      <MessageSeparator style={{ marginTop: 5, marginBottom: 5 }} />
      <MainContainer
        responsive
        style={{
          height: "600px",
        }}
      >
        <Sidebar position="left">
          <ConversationList>
            {getConversationComponent(defaultConversation)}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={defaultConversation[activeID].name}
              src={defaultConversation[activeID].src}
            />
            {activeID === 0 ? (
              <ConversationHeader.Content
                info="Active 10 mins ago"
                userName="bloodstrawberry"
              />
            ) : (
              <ConversationHeader.Content
                info="Active 7 hours ago"
                userName="Patrik"
              />
            )}
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>{getMessageComponent(messages)}</MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatUI;

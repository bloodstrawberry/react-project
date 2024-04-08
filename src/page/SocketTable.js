import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { io } from "socket.io-client";

import {
  Avatar,
  Conversation,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";

import SimpleHandsOnTable from "./SimpleHandsOnTable";

const AVATAR_MAP = {
  Lilly: "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg",
  Joe: "https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg",
  Emily: "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg",
  Akane: "https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg",
  Eliot: "https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg",
  Zoe: "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg",
};

const data = [
  ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
  ["2017", 10, 11, 12, 13, 15, 16],
  ["2018", 10, 11, 12, 13, 15, 16],
  ["2019", 10, 11, 12, 13, 15, 16],
  ["2020", 10, 11, 12, 13, 15, 16],
  ["2021", 10, 11, 12, 13, 15, 16],
];

let socketIO = io("http://localhost:3333", { autoConnect: false });

const customOptions = {
  afterChange: function (changes, source) {
    // changes : 변경된 데이터 정보, source : 변경을 발생시킨 원인
    if (source === "loadData") return;

    console.log("Changed Data :", source, changes);
    socketIO.emit("sendData", this.getData());
  },
  afterCreateRow: function (index, amount) {
    console.log("create row :", index, amount);
    socketIO.emit("sendData", this.getData());
  },
  afterRemoveRow: function (index, amount) {
    console.log("remove row :", index, amount);
    socketIO.emit("sendData", this.getData());
  },
  afterCreateCol: function (index, amount) {
    console.log("create col :", index, amount);
    socketIO.emit("sendData", this.getData());
  },
  afterRemoveCol: function (index, amount) {
    console.log("remove col :", index, amount);
    socketIO.emit("sendData", this.getData());
  },
};

const SocketTable = () => {
  const location = useLocation();
  const [loginID, setLoginID] = useState("");

  const [tableData, setTableData] = useState(data);
  // const [handsOnTable, setHandsOnTable] = useState(undefined);

  const init = () => {
    setLoginID(location.state.loginID);
  };

  useEffect(init, []);

  const respondDataCallback = (newData) => {
    setTableData(newData);
  };

  useEffect(() => {
    socketIO.connect();
    if (!socketIO) return;

    socketIO.on("respondData", respondDataCallback);

    return () => {
      socketIO.off("respondData", respondDataCallback);
    };
  }, []);

  useEffect(() => {
    socketIO.once("initData", (data) => {
      if(data.currentData) setTableData(data.currentData);
    });
  }, []);

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
      <SimpleHandsOnTable
        data={tableData}
        // setTable={setHandsOnTable}
        customOptions={customOptions}
      />
    </div>
  );
};

export default SocketTable;

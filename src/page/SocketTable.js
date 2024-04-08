import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

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

const data2 = [
  ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
  ["2017", 10, 11, 12, 13, 15, 16],
  ["2018", 10, 11, 12, 13, 15, 16],
];


const customOptions = {
  afterChange: function (changes, source) {
    // changes 매개변수에 변경된 데이터 정보
    // source 매개변수는 변경을 발생시킨 원인

    console.log("Changed Data :", source, changes);
  },
  afterCreateRow: function(index, amount) {
    // 행이 추가된 후에 호출되는 후크
    console.log('추가된 행:', index, amount);
  },
  afterRemoveRow: function(index, amount) {
    // 행이 삭제된 후에 호출되는 후크
    console.log('제거된 행:', index, amount);
  },
  afterCreateCol: function(index, amount) {
    // 열이 추가된 후에 호출되는 후크
    console.log('추가된 열:', index, amount);
  },
  afterRemoveCol: function(index, amount) {
    // 열이 삭제된 후에 호출되는 후크
    console.log('제거된 열:', index, amount);
  }
};

const SocketTable = () => {
  const location = useLocation();
  const [loginID, setLoginID] = useState("");

  const [tableData, setTableData] = useState(data);
  const [handsOnTable, setHandsOnTable] = useState(undefined);

  const init = () => {
    setLoginID(location.state.loginID);
  };

  useEffect(init, []);

  const test = () => {
    setTableData((table) => {
      table[2][3] = "sex";
      table[10][10] = "haza";
      console.log(table);
      return JSON.parse(JSON.stringify(table));
    });

    // tableData[2][3] = "sex";
    // setTableData(data2);

    // console.log(tableData);
    //setTableData(data2)
  }

  return (
    <div>
      <button onClick={test}>test</button>
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
        setTable={setHandsOnTable}
        customOptions={customOptions}
      />
    </div>
  );
};

export default SocketTable;

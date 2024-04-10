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
    socketIO.emit("changeData", changes);
  },
  afterCreateRow: function (index, amount) {
    console.log("create row :", index, amount);
    socketIO.emit("createRow", index, amount);
  },
  afterRemoveRow: function (index, amount) {
    console.log("remove row :", index, amount);
    socketIO.emit("removeRow", index, amount);
  },
  afterCreateCol: function (index, amount) {
    console.log("create col :", index, amount);
    socketIO.emit("createCol", index, amount);
  },
  afterRemoveCol: function (index, amount) {
    console.log("remove col :", index, amount);
    socketIO.emit("removeCol", index, amount);
  },
};

const insertRows = (table, rowIndex, amount) => {
  const afterIndex = table.slice(rowIndex);
  const emptyArray = Array.from({ length: table[0].length }, () => "");
  const newRows = Array.from({ length: amount }, () => emptyArray);  
  const newArray = table.slice(0, rowIndex).concat(newRows, afterIndex);

  return newArray;
};

const deleteRows = (table, rowIndex, amount) => {
  const newTable = [...table]; 

  newTable.splice(rowIndex, amount);

  return newTable;
};

const insertColumns = (table, colIndex, amount) => {
  const newMatrix = [];

  for (let i = 0; i < table.length; i++) {
    const newRow = [...table[i]]; 

    for (let k = 0; k < amount; k++) {
      newRow.splice(colIndex + k, 0, "");
    }

    newMatrix.push(newRow); 
  }

  return newMatrix;
};

const deleteColumns = (table, colIndex, amount) => {
  const newTable = [];
  for (let i = 0; i < table.length; i++) {
    const newRow = [...table[i]]; 
    newRow.splice(colIndex, amount); 
    newTable.push(newRow); 
  }

  return newTable;
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

  const resCreateRow = (index, amount) => {
    console.log("createRow", index, amount);
    setTableData((prev) => {
      let newTable = insertRows(prev, index, amount);
      return newTable;
    });
  };
  
  const resRemoveRow = (index, amount) => {
    console.log("removeRow", index, amount);
    setTableData((prev) => {
      let newTable = deleteRows(prev, index, amount);
      return newTable;
    });
  };

  const resCreateCol = (index, amount) => {
    console.log("createCol", index, amount); 
    setTableData((prev) => {
      let newTable = insertColumns(prev, index, amount);
      return newTable;
    });
  };

  const resRemoveCol = (index, amount) => {
    console.log("removeCol", index, amount);
    setTableData((prev) => {
      let newTable = deleteColumns(prev, index, amount);      
      return newTable;
    });
  };

  const resChangeData = (changes) => {
    console.log("changeData",changes);
    setTableData((prev) => {
      let newTable = [...prev];
      for(let change of changes) {
        let [row, col, before, after] = change;
        newTable[row][col] = after;
      }
      return newTable;
    });
  };

  useEffect(() => {
    socketIO.connect();
    if (!socketIO) return;

    socketIO.on("respondData", respondDataCallback);
    socketIO.on("resCreateRow", resCreateRow);
    socketIO.on("resRemoveRow", resRemoveRow);
    socketIO.on("resCreateCol", resCreateCol);
    socketIO.on("resRemoveCol", resRemoveCol);
    socketIO.on("resChangeData", resChangeData);
        
    return () => {
      socketIO.off("respondData", respondDataCallback);
      socketIO.off("resCreateRow", resCreateRow);
      socketIO.off("resRemoveRow", resRemoveRow);
      socketIO.off("resCreateCol", resCreateCol);
      socketIO.off("resRemoveCol", resRemoveCol);  
      socketIO.off("resChangeData", resChangeData);            
    };
  }, []);

  useEffect(() => {
    socketIO.once("initData", (data) => {
      console.log(data);
      if(data.currentData) setTableData(data.currentData);
      else {
        socketIO.emit("setCurrentData", tableData);
      }
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

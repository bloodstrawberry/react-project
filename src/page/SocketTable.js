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

const defaultData = [
  ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
  ["2017", 10, 11, 12, 13, 15, 16],
  ["2018", 10, 11, 12, 13, 15, 16],
  ["2019", 10, 11, 12, 13, 15, 16],
  ["2020", 10, 11, 12, 13, 15, 16],
  ["2021", 10, 11, 12, 13, 15, 16],
];

let socketIO = io("http://localhost:3333", { autoConnect: false });

const getRowHeights = (handsOnTable) => {
  let countRows = handsOnTable.countRows();
  let rowHeights = [];
  for(let r = 0; r < countRows; r++) rowHeights.push(handsOnTable.getRowHeight(r));
  return rowHeights;
}

const getColWidths = (handsOnTable) => {
  let countCols = handsOnTable.countCols();
  let colWidths = [];
  for(let c = 0; c < countCols; c++) colWidths.push(handsOnTable.getColWidth(c));
  return colWidths;
}

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

const transpose = (array) => {
  const rows = array.length;
  const cols = array[0].length;
  const transposedArray = [];

  for (let j = 0; j < cols; j++) {
    transposedArray[j] = [];
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      transposedArray[c][r] = array[r][c];
    }
  }

  return transposedArray;
};

const moveRowTable = (table, movedRows, finalIndex) => {
  let keyTable = table.map((item, key) => {
    return {
      index: key,
      row: item,
    };
  });

  let movedTable = table.filter(
    (item, key) => movedRows.includes(key) === true
  );
  let movedKeyTable = movedTable.map((item) => {
    return {
      index: "new",
      row: item,
    };
  });

  let left = keyTable.slice(0, finalIndex);
  let right = keyTable.slice(finalIndex);
  let newArrayKey = [...left, ...movedKeyTable, ...right];

  newArrayKey = newArrayKey.filter(
    (item) => movedRows.includes(item.index) === false
  );
  let newArray = newArrayKey.map((item) => item.row);

  return newArray;
};

const moveColumnTable = (table, movedColumns, finalIndex) => {
  let transposedTable = transpose(table);
  console.log({table});
  console.log(movedColumns, finalIndex);
  console.log({transposedTable});
  let movedTable = moveRowTable(transposedTable, movedColumns, finalIndex);
  console.log({movedTable});
  console.log(transpose(movedTable));
  return transpose(movedTable);
}

const SocketTable = () => {
  const location = useLocation();
  const [loginID, setLoginID] = useState("");

  const [tableData, setTableData] = useState(defaultData);
  const [rowHeights, setRowHeights] = useState(25);
  const [colWidths, setColWidths] = useState(60);

  const customOptions = {
    afterChange: function (changes, source) {
      // changes : 변경된 데이터 정보, source : 변경을 발생시킨 원인
      if (source === "loadData") return;
  
      console.log("Changed Data :", source, changes);
      socketIO.emit("changeData", changes);
    },
    afterCreateRow: function (index, amount) {
      console.log("create row :", index, amount);
  
      let rowHeights = getRowHeights(this);
      socketIO.emit("createRow", index, amount, rowHeights);
    },
    afterRemoveRow: function (index, amount) {
      console.log("remove row :", index, amount);
  
      let rowHeights = getRowHeights(this);
      socketIO.emit("removeRow", index, amount, rowHeights);
    },
    afterCreateCol: function (index, amount) {
      console.log("create col :", index, amount);
  
      let colWidths = getColWidths(this);
      socketIO.emit("createCol", index, amount, colWidths);
    },
    afterRemoveCol: function (index, amount) {
      console.log("remove col :", index, amount);
  
      let colWidths = getColWidths(this);
      socketIO.emit("removeCol", index, amount, colWidths);
    },
    afterRowMove: function (movedRows, finalIndex, dropIndex, movePossible, orderChanged) {
      console.log("move row", movedRows, finalIndex, dropIndex, movePossible, orderChanged);
  
      let rowHeights = getRowHeights(this);

      setRowHeights(rowHeights);
      setTableData(this.getData());  
      socketIO.emit("moveRow", movedRows, finalIndex, rowHeights);
    },
    afterColumnMove: function (movedColumns, finalIndex, dropIndex, movePossible, orderChanged) {
      console.log("move col", movedColumns, finalIndex, dropIndex, movePossible, orderChanged);
  
      let colWidths = getColWidths(this);

      setColWidths(colWidths);
      setTableData(this.getData());
      socketIO.emit("moveCol", movedColumns, finalIndex, colWidths);
    },
    afterRowResize: function (newSize, row, isDoubleClick) {
      console.log("resize row");
  
      let rowHeights = getRowHeights(this);
      socketIO.emit("resizeRow", rowHeights);
    },
    afterColumnResize: function (newSize, column, isDoubleClick) {
      console.log("resize col");
  
      let colWidths = getColWidths(this);
      socketIO.emit("resizeCol", colWidths);
    },
  };

  const init = () => {
    setLoginID(location.state.loginID);
  };

  useEffect(init, []);

  // const respondDataCallback = (newData) => {
  //   setTableData(newData);
  // };

  const resCreateRow = (index, amount, currentRowHeights) => {
    console.log("createRow", index, amount, currentRowHeights);
    setTableData((prev) => {
      let newTable = insertRows(prev, index, amount);
      return newTable;
    });

    setRowHeights(currentRowHeights);
  };

  const resRemoveRow = (index, amount, currentRowHeights) => {
    console.log("removeRow", index, amount, currentRowHeights);
    setTableData((prev) => {
      let newTable = deleteRows(prev, index, amount);
      return newTable;
    });

    setRowHeights(currentRowHeights);
  };

  const resCreateCol = (index, amount, currentColWidths) => {
    console.log("createCol", index, amount, currentColWidths);
    setTableData((prev) => {
      let newTable = insertColumns(prev, index, amount);
      return newTable;
    });

    setColWidths(currentColWidths);
  };

  const resRemoveCol = (index, amount, currentColWidths) => {
    console.log("removeCol", index, amount, currentColWidths);
    setTableData((prev) => {
      let newTable = deleteColumns(prev, index, amount);
      return newTable;
    });

    setColWidths(currentColWidths);
  };

  const resChangeData = (changes, currentRowHeights, currentColWidths) => {
    console.log("changeData", changes, currentRowHeights, currentColWidths);
    setTableData((prev) => {
      let newTable = [...prev];
      for (let change of changes) {
        let [row, col, before, after] = change;
        newTable[row][col] = after;
      }
      return newTable;
    });

    setRowHeights(currentRowHeights);
    setColWidths(currentColWidths);
  };

  const resMoveRow = (movedRows, finalIndex, currentRowHeights) => {
    console.log("resMoveRow", movedRows, finalIndex, currentRowHeights);
    setTableData((prev) => {
      let newTable = moveRowTable(prev, movedRows, finalIndex);
      return newTable;
    });
    
    setRowHeights(currentRowHeights);
  };

  const resMoveCol = (movedColumns, finalIndex, currentColWidths) => {
    console.log("resMoveCol", movedColumns, finalIndex, currentColWidths);
    setTableData((prev) => {
      console.log({prev})
      let newTable = moveColumnTable(prev, movedColumns, finalIndex);
      console.log({newTable});
      return newTable;
    });

    setColWidths(currentColWidths);
  };

  const resResizeRow = (rowHeights) => {
    console.log("resResizeRow", rowHeights);
    setRowHeights(rowHeights);
  };

  const resResizeCol = (colWidths) => {
    console.log("resResizeCol", colWidths);
    setColWidths(colWidths);
  };

  useEffect(() => {
    socketIO.connect();
    if (!socketIO) return;

    // socketIO.on("respondData", respondDataCallback);
    socketIO.on("resCreateRow", resCreateRow);
    socketIO.on("resRemoveRow", resRemoveRow);
    socketIO.on("resCreateCol", resCreateCol);
    socketIO.on("resRemoveCol", resRemoveCol);
    socketIO.on("resChangeData", resChangeData);
    socketIO.on("resMoveRow", resMoveRow);
    socketIO.on("resMoveCol", resMoveCol);
    socketIO.on("resResizeRow", resResizeRow);
    socketIO.on("resResizeCol", resResizeCol);

    return () => {
      // socketIO.off("respondData", respondDataCallback);
      socketIO.off("resCreateRow", resCreateRow);
      socketIO.off("resRemoveRow", resRemoveRow);
      socketIO.off("resCreateCol", resCreateCol);
      socketIO.off("resRemoveCol", resRemoveCol);
      socketIO.off("resChangeData", resChangeData);
      socketIO.off("resMoveRow", resMoveRow);
      socketIO.off("resMoveCol", resMoveCol);
      socketIO.off("resResizeRow", resResizeRow);
      socketIO.off("resResizeCol", resResizeCol);
    };
  }, []);

  useEffect(() => {
    socketIO.once("initData", (data) => {
      console.log(data);
      if (data.currentData) {
        setTableData(data.currentData);
        setRowHeights(data.currentRowHeights);
        setColWidths(data.currentColWidths);
      } else {
        let basicRowHeight = 25;
        let basicColWidth = 60;
        let initRowHeights = new Array(defaultData.length).fill(basicRowHeight);
        let initColWidths = new Array(defaultData[0].length).fill(
          basicColWidth
        );

        socketIO.emit("setCurrentData", tableData);
        socketIO.emit("setRowHeights", initRowHeights);
        socketIO.emit("setColWidths", initColWidths);
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
        rowHeights={rowHeights}
        colWidths={colWidths}
        customOptions={customOptions}
      />
    </div>
  );
};

export default SocketTable;

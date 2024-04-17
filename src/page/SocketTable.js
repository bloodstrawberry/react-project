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
  for (let r = 0; r < countRows; r++)
    rowHeights.push(handsOnTable.getRowHeight(r));
  return rowHeights;
};

const getColWidths = (handsOnTable) => {
  let countCols = handsOnTable.countCols();
  let colWidths = [];
  for (let c = 0; c < countCols; c++)
    colWidths.push(handsOnTable.getColWidth(c));
  return colWidths;
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
  let movedTable = moveRowTable(transposedTable, movedColumns, finalIndex);
  return transpose(movedTable);
};

const SocketTable = () => {
  const location = useLocation();
  const [loginID, setLoginID] = useState("");
  const [tableInfo, setTableInfo] = useState({
    data: defaultData,
    rowHeights: 25,
    colWidths: 60,
    highlights: [],
  });

  const customOptions = {
    afterChange: function (changes, source) {
      // changes : 변경된 데이터 정보, source : 변경을 발생시킨 원인
      if (source === "loadData") return;

      if(source === "edit") {
        let [row, col] = changes[0];
        console.log(row, col);
        socketIO.emit("sendHighlight", location.state.loginID, row, col);        
      }

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
      setTableInfo((prev) => {
        return {
          ...prev,
          data: this.getData(),
          rowHeights,
        };
      });

      socketIO.emit("moveRow", movedRows, finalIndex, rowHeights);
    },
    afterColumnMove: function (movedColumns, finalIndex, dropIndex, movePossible, orderChanged) {
      console.log("move col", movedColumns, finalIndex, dropIndex, movePossible, orderChanged);

      let colWidths = getColWidths(this);
      setTableInfo((prev) => {
        return {
          ...prev,
          data: this.getData(),
          colWidths,
        };
      });

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
    // afterSelection: function(sr, sc, er, ec) {
    //   console.log(`Selected cells: ${sr},${sc} to ${er},${ec}`);  
    //   socketIO.emit("sendHighlight", location.state.loginID, sr, sc);
    // },
    afterSetCellMeta: function(row, column, key, value) {
       //console.log(row, column, key, value);  
       //console.log(this.getCellMetaAtRow(row));
    }
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

    setTableInfo((prev) => {
      let newTable = insertRows(prev.data, index, amount);
      return {
        ...prev,
        data: newTable,
        rowHeights: currentRowHeights,
      };
    });
  };

  const resRemoveRow = (index, amount, currentRowHeights) => {
    console.log("removeRow", index, amount, currentRowHeights);

    setTableInfo((prev) => {
      let newTable = deleteRows(prev.data, index, amount);
      return {
        ...prev,
        data: newTable,
        rowHeights: currentRowHeights,
      };
    });
  };

  const resCreateCol = (index, amount, currentColWidths) => {
    console.log("createCol", index, amount, currentColWidths);

    setTableInfo((prev) => {
      let newTable = insertColumns(prev.data, index, amount);
      return {
        ...prev,
        data: newTable,
        colWidths: currentColWidths,
      };
    });
  };

  const resRemoveCol = (index, amount, currentColWidths) => {
    console.log("removeCol", index, amount, currentColWidths);

    setTableInfo((prev) => {
      let newTable = deleteColumns(prev.data, index, amount);
      return {
        ...prev,
        data: newTable,
        colWidths: currentColWidths,
      };
    });
  };

  const resChangeData = (changes, currentRowHeights, currentColWidths) => {
    console.log("changeData", changes, currentRowHeights, currentColWidths);

    setTableInfo((prev) => {
      let newTable = [...prev.data];
      for (let change of changes) {
        let [row, col, before, after] = change;
        newTable[row][col] = after;
      }

      return {
        ...prev,
        data: newTable,
        rowHeights: currentRowHeights,
        colWidths: currentColWidths,
      };
    });
  };

  const resMoveRow = (movedRows, finalIndex, currentRowHeights) => {
    console.log("resMoveRow", movedRows, finalIndex, currentRowHeights);

    setTableInfo((prev) => {
      let newTable = moveRowTable(prev.data, movedRows, finalIndex);
      return {
        ...prev,
        data: newTable,
        rowHeights: currentRowHeights,
      };
    });
  };

  const resMoveCol = (movedColumns, finalIndex, currentColWidths) => {
    console.log("resMoveCol", movedColumns, finalIndex, currentColWidths);

    setTableInfo((prev) => {
      let newTable = moveColumnTable(prev.data, movedColumns, finalIndex);
      return {
        ...prev,
        data: newTable,
        colWidths: currentColWidths,
      };
    });
  };

  const resResizeRow = (rowHeights) => {
    console.log("resResizeRow", rowHeights);
    setTableInfo((prev) => {
      return {
        ...prev,
        rowHeights,
      };
    });
  };

  const resResizeCol = (colWidths) => {
    console.log("resResizeCol", colWidths);
    setTableInfo((prev) => {
      return {
        ...prev,
        colWidths,
      };
    });
  };

  const resHighlight = (highlightsInfo) => {
    let highlights = highlightsInfo.filter((item) => item.clientId !== socketIO.id);
    
    console.log(highlights);    

    setTableInfo((prev) => {
      return {
        ...prev,
        highlights,
      };
    });
  }

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
    socketIO.on("resHighlight", resHighlight);      

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
      socketIO.off("resHighlight", resHighlight);      
    };
  }, []);

  useEffect(() => {
    socketIO.once("initData", (data) => {
      console.log(data);
      if (data.currentData) {
        setTableInfo({
          data: data.currentData,
          rowHeights: data.currentRowHeights,
          colWidths: data.currentColWidths,
          highlights: [],
        });
      } else {
        let basicRowHeight = 25;
        let basicColWidth = 60;
        let initRowHeights = new Array(defaultData.length).fill(basicRowHeight);
        let initColWidths = new Array(defaultData[0].length).fill(basicColWidth);

        socketIO.emit("setCurrentData", defaultData);
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
      <SimpleHandsOnTable tableInfo={tableInfo} customOptions={customOptions} />
    </div>
  );
};

export default SocketTable;
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import styled from "styled-components";
import styles from "./CustomTable.module.css";
import "./CustomTable.css";

import { io } from "socket.io-client";

let socketIO = io("http://localhost:3333", { autoConnect: false });

const DisplayCellStyle = styled.div`
  span {
    background-color: #33ceff;
    position: relative;
    padding: 0.4rem 0.85rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
  }
`;

const CustomHansOnTable = ({ data, customOptions }) => {
  const [handstable, setHandstable] = useState(undefined);
  const [displayCellInfo, setDisplaySetInfo] = useState("");
  const [selectedCell, setSelectedCell] = useState([0, 0]);

  const cellSelected = () => {
    let selectedLast = myTable.getSelectedLast();

    if (selectedLast[0] < 0 || selectedLast[1] < 0) return;

    let value = myTable.getValue() || "";
    setDisplaySetInfo(value);

    setSelectedCell([selectedLast[0], selectedLast[1]]);
  };

  const options = {
    data, // initData(),
    colHeaders: true,
    rowHeaders: true,
    wordWrap: false /* 줄 바꿈 off */,
    manualColumnResize: true,
    manualRowResize: true,
    manualColumnMove: true,
    manualRowMove: true,
    allowInsertColumn: true,
    allowInsertRow: true,
    allowRemoveColumn: true,
    allowRemoveRow: true,
    autoWrapCol: true /* 마지막 셀 아래에서 다음 셀 위로 이동 */,
    autoWrapRow: true /* 마지막 셀 옆에서 다음 셀 처음으로 이동 */,
    dragToScroll: true /* 표를 클릭 후 드래그를 할 때, 같이 스크롤 되는지 여부 */,
    persistentState: false /* 열 정렬 상태, 열 위치 및 열 크기를 로컬 스토리지에 저장 */,
    outsideClickDeselects: false /* 셀 외부 클릭 시, 셀 선택 해제 */,
    readOnly: false /* true : 모든 셀을 readOnly로 설정*/,
    enterBeginsEditing: true /* true : 엔터 클릭 시 편집 모드, false : 다음 셀로 이동 */,
    copyable: true /* 복사 가능 여부 */,
    copyPaste: true /* 복사, 붙여넣기 가능 여부 */,
    undo: true /* false : ctrl + z 비활성화 */,
    trimWhitespace: false /* 자동 trim() 실행 후 셀에 저장 */,
    contextMenu: true /* 마우스 왼쪽 버튼 클릭 시 컨텍스트 메뉴 */,
    comments: true /* 주석, 메모 기능 context menu에 추가 */,
    manualColumnFreeze: true /* freezeColumn context menu에 추가 */,

    className: "htMiddle htCenter" /* Cell Alignment */,
    width: 1000,
    height: 1000,
    startCols: 5 /* data가 없는 경우 기본 설정 */,
    startRows: 3 /* data가 없는 경우 기본 설정 */,
    afterSelection: cellSelected,
    colWidths: 60 /* 특정 위치 너비 변경 : [60, 120, 60, 60, 60, 60, 60] */,
    rowHeights: 25,

    licenseKey: "non-commercial-and-evaluation",
  };


  let myTable;
  const makeTable = () => {
    const container = document.getElementById("hot-app");
    container.innerHTML = "";

    myTable = new Handsontable(container, {
      ...options,
      ...customOptions,
    });

    let mouseX, mouseY, showTooltip = false;

    myTable.addHook('afterOnCellMouseOver', (event, coords, TD) => {
      const cellData = myTable.getDataAtCell(coords.row, coords.col);
      const tooltip = document.createElement('div');
      if (tooltip) {
        tooltip.remove();
      }
      tooltip.textContent = cellData;
    
      tooltip.classList.add('tooltip');
      document.body.appendChild(tooltip);
    
      const cellOffset = TD.getBoundingClientRect();
      mouseX = cellOffset.left + window.scrollX + (cellOffset.width / 2);
      mouseY = cellOffset.top + window.scrollY - 20;
    
      showTooltip = true;
    });
    
    myTable.addHook('afterOnCellMouseOut', (event, coords, TD) => {
      console.log("out");
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
      showTooltip = false;
    });

    document.addEventListener('mouseover', (event) => {
      const targetElement = event.target;
      let check = targetElement.classList.contains(`${styles.custom}`);
      const tooltip = document.querySelector('.tooltip');
      const custom = document.querySelector(`.${styles.custom}`);
      
      console.log(custom);
      console.log(targetElement, check, targetElement.classList);
      
      if (check && tooltip) {
        tooltip.style.zIndex = 1010;
        tooltip.style.position = "fixed";
        tooltip.style.top = mouseY + 10 + 'px';
        tooltip.style.left = mouseX + 10 + 'px';
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        tooltip.style.color = "white";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "3px";
        tooltip.style.display = showTooltip ? "block" : "none";
      }
    });


    myTable.render();
    setHandstable(myTable);

  };


  const makeTable2 = (data) => {
    const container = document.getElementById("hot-app");
    container.innerHTML = "";

    options.data = data;
    myTable = new Handsontable(container, {
      ...options,
      ...customOptions,
    });

    let mouseX, mouseY, showTooltip = false;

    myTable.addHook('afterOnCellMouseOver', (event, coords, TD) => {
      const cellData = myTable.getDataAtCell(coords.row, coords.col);
      const tooltip = document.createElement('div');
      if (tooltip) {
        tooltip.remove();
      }
      tooltip.textContent = cellData;
    
      tooltip.classList.add('tooltip');
      document.body.appendChild(tooltip);
    
      const cellOffset = TD.getBoundingClientRect();
      mouseX = cellOffset.left + window.scrollX + (cellOffset.width / 2);
      mouseY = cellOffset.top + window.scrollY - 20;
    
      showTooltip = true;
    });
    
    myTable.addHook('afterOnCellMouseOut', (event, coords, TD) => {
      console.log("out");
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
      showTooltip = false;
    });

    document.addEventListener('mouseover', (event) => {
      const targetElement = event.target;
      let check = targetElement.classList.contains(`${styles.custom}`);
      const tooltip = document.querySelector('.tooltip');
      const custom = document.querySelector(`.${styles.custom}`);
      
      console.log(custom);
      console.log(targetElement, check, targetElement.classList);
      
      if (check && tooltip) {
        tooltip.style.zIndex = 1010;
        tooltip.style.position = "fixed";
        tooltip.style.top = mouseY + 10 + 'px';
        tooltip.style.left = mouseX + 10 + 'px';
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        tooltip.style.color = "white";
        tooltip.style.padding = "5px";
        tooltip.style.borderRadius = "3px";
        tooltip.style.display = showTooltip ? "block" : "none";
      }
    });


    myTable.render();
    setHandstable(myTable);

  };
  useEffect(() => {
    makeTable();
  }, []);

  const respondDataCallback = (newData) => {
    makeTable2(newData);


    return;
    console.log(newData);
    setHandstable((table) => {
    
    for (let row = 0; row < newData.length; row++) {
      for (let col = 0; col < newData[row].length; col++) {
        
        table.setDataAtCell(row, col, newData[row][col]);
      }
    }
      return table;
    })
    // for (let row = 0; row < newData.length; row++) {
    //   for (let col = 0; col < newData[row].length; col++) {
        
    //     handstable.setDataAtCell(row, col, newData[row][col]);
    //   }
    // }
  }

  useEffect(() => {
    socketIO.connect();
    if (!socketIO) return;

    socketIO.on("respondData", respondDataCallback);  

    return () => {
      socketIO.off("respondData", respondDataCallback);            
    };
  }, []);


  const test = () => {
    console.log(styles.custom);
    handstable.setCellMeta(2, 2, "className", `show_tooltip ${styles.custom}`);
    handstable.render();
    // setTimeout(() => {
    //   handstable.setCellMeta(1, 1, "className", "highlighted-cell");
    //   handstable.render();
    // }, 3000);
  };

  const sync = () => {
    console.log();
    let table = handstable.getData();    
    console.log(table);

    socketIO.emit("sendData", table);
  }
  const log = () => {
    console.log(handstable);
  }

  return (
    <div>
      
      <button onClick={log}>log</button>
      <button onClick={sync}>sync</button>
      
      <button onClick={test}>test</button>

      <Box sx={{ m: 2 }}>
        <DisplayCellStyle>
          <span>{displayCellInfo}</span>
        </DisplayCellStyle>
        <div id="hot-app" style={{ marginTop: "13px" }}></div>
      </Box>
    </div>
  );
};

export default CustomHansOnTable;

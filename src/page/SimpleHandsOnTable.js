/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import Box from "@mui/material/Box";

import styled from "styled-components";
import styles from "./CustomTable.module.css";

const DisplayCellStyle = styled.div`
  span {
    background-color: grey;
    position: relative;
    padding: 0.4rem 0.85rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
  }
`;

const SimpleHandsOnTable = ({
  tableInfo,
  setTable,
  customOptions,
}) => {
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
    data: tableInfo.data,
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
    colWidths: tableInfo.colWidths /* 특정 위치 너비 변경 : [60, 120, 60, 60, 60, 60, 60] */,
    rowHeights: tableInfo.rowHeights,
    //mergeCells: [],
    licenseKey: "non-commercial-and-evaluation",
  };

  let myTable;
  const makeTable = () => {
    const container = document.getElementById("hot-app");
    container.innerHTML = "";

    console.log(tableInfo);

    //console.log(options);
    myTable = new Handsontable(container, {
      ...options,
      ...customOptions,
    });

    let highlights = tableInfo.highlights;
    let mouseX, mouseY, showTooltip = false;

    // cell에 mouse를 over하는 경우 tooltip calssName를 추가
    myTable.addHook("afterOnCellMouseOver", (event, coords, td) => {
      let highlightCell = highlights.find((item) => item.row === coords.row && item.col === coords.col);
      if(highlightCell === undefined) return;

      let tooltip = document.createElement("div");
      if (tooltip) tooltip.remove(); // 이전 tooltip이 지워지지 않았다면 삭제
      
      tooltip.textContent = highlightCell.loginID;
      tooltip.classList.add(`${styles.tooltip}`);

      document.body.appendChild(tooltip); //<div> tooltip 추가

      // tooltip이 나오는 위치 조절
      let cellOffset = td.getBoundingClientRect();
      mouseX = cellOffset.left + window.scrollX + cellOffset.width / 2 + 10;
      mouseY = cellOffset.top + window.scrollY - 30;

      showTooltip = true;
    });

    // mouse가 cell을 벗어나면 tooltip calssName 삭제
    myTable.addHook("afterOnCellMouseOut", (event, coords, TD) => {
      let tooltip = document.querySelector(`.${styles.tooltip}`);
      if (tooltip)  tooltip.remove();
      showTooltip = false;
    });

    document.addEventListener("mouseover", (event) => {
      let targetElement = event.target;
      let check = targetElement.classList.contains(`${styles.custom}`);
      let tooltip = document.querySelector(`.${styles.tooltip}`);      
      
      if (check && tooltip) {
        tooltip.style.top = mouseY + 10 + "px";
        tooltip.style.left = mouseX + 10 + "px";
        tooltip.style.display = showTooltip ? "block" : "none";
      }
    });

    for (let cell of highlights) {
      let { row, col, borderColor } = cell;
      let currentClassName = myTable.getCellMeta(row, col).className;
      myTable.setCellMeta(
        row,
        col,
        "className",
        `${currentClassName} ${styles.custom} ${styles[`box_${borderColor}`]
        }`
      );
    }

    myTable.render();
    if (setTable) setTable(myTable);
  };

  useEffect(() => {
    makeTable();
  }, [tableInfo]);

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <DisplayCellStyle>
          <span>{displayCellInfo}</span>
        </DisplayCellStyle>
        <div id="hot-app" style={{ marginTop: "13px" }}></div>
      </Box>
    </div>
  );
};

export default SimpleHandsOnTable;
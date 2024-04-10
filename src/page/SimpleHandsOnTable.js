/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import Box from "@mui/material/Box";

import styled from "styled-components";

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
  data,
  rowHeights,
  colWidths,
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
    data,
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
    colWidths /* 특정 위치 너비 변경 : [60, 120, 60, 60, 60, 60, 60] */,
    rowHeights,
    //mergeCells: [],
    licenseKey: "non-commercial-and-evaluation",
  };

  let myTable;
  const makeTable = () => {
    const container = document.getElementById("hot-app");
    container.innerHTML = "";

    //console.log(options);
    myTable = new Handsontable(container, {
      ...options,
      ...customOptions,
    });

    myTable.render();
    if (setTable) setTable(myTable);
  };

  useEffect(() => {
    makeTable();
  }, [data, rowHeights, colWidths]);

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

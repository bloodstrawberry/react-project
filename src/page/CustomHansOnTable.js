/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import styled from "styled-components";
import HandsontableToggleButton from "./HandsontableToggleButton";

class Rectangle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      mouseX: 0,
      mouseY: 0,
    };
  }

  handleMouseEnter = (event) => {
    const { clientX, clientY } = event;
    this.setState({
      showTooltip: true,
      mouseX: clientX,
      mouseY: clientY,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      showTooltip: false,
    });
  };

  render() {
    const { top, left, width, height } = this.props;
    const { showTooltip, mouseX, mouseY } = this.state;

    const style = {
      zIndex: 1000,
      position: "absolute",
      top: top,
      left: left,
      width: width,
      height: height,
      boxShadow: `inset 0 0 0 2px red`,
      backgroundColor: "transparent",
      pointerEvents: "none",
    };

    const smallSquareStyle = {
      zIndex: 1500,
      position: "absolute",
      bottom: -5,
      right: -5,
      width: 10,
      height: 10,
      backgroundColor: "blue",
      cursor: "pointer",
      pointerEvents: "auto",
    };

    const tooltipStyle = {
      position: "fixed",
      top: mouseY + 10,
      left: mouseX + 10,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "5px",
      borderRadius: "3px",
      display: showTooltip ? "block" : "none",
    };

    return (
      <div style={style}>
        <div
          style={smallSquareStyle}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        ></div>
        <div style={tooltipStyle}>This is a tooltip</div>
      </div>
    );
  }
}

const DisplayCellStyle = styled.div`
  span {
    background-color: #33ceff;
    position: relative;
    padding: 0.4rem 0.85rem;
    border: 1px solid transparent;
    border-radius: 0.35rem;
  }
`;

// const data = [
//   ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
//   ["2017", 10, 11, 12, 13, 15, 16],
//   ["2018", 10, 11, 12, 13, 15, 16],
//   ["2019", 10, 11, 12, 13, 15, 16],
//   ["2020", 10, 11, 12, 13, 15, 16],
//   ["2021", 10, 11, 12, 13, 15, 16],
// ];

const data = [
  ["", "2017", "2018", "2019", "2020", "2021", "2022"],
  ["Tesla", 10, 5, 5, 10, 14, 5],
  ["Nissan", 15, 2, 7, 11, 13, 4],
  ["Toyota", 11, 1, 10, 12, 12, 3],
  ["Honda", 5, 3, 7, 13, 11, 4],
  ["Mazda", 4, 7, 5, 14, 10, 4],
];

// dummy data for test
// const initData = () => {
//   let row = [];
//   for (let i = 0; i < 100; i++) {
//     row.push(String.fromCharCode("A".charCodeAt() + (i % 26)));
//   }

//   let table = [];
//   for (let k = 0; k < 100; k++) {
//     let tmp = JSON.parse(JSON.stringify(row));
//     let number = `${k + 1}`;
//     for (let i = 0; i < 100; i++)
//       tmp[i] = `${tmp[i]}${number.padStart(3, "0")}`;
//     table.push(tmp);
//   }

//   return table;
// };

// let searchResultCount = 0;
// function searchResultCounter(instance, row, col, value, result) {
//   const DEFAULT_CALLBACK = function(instance, row, col, data, testResult) {
//     instance.getCellMeta(row, col).isSearchResult = testResult;
//   };

//   DEFAULT_CALLBACK.apply(this, arguments);

//   if (result) {
//     searchResultCount++;
//   }
// }

// function redRenderer(instance, td) {
//   Handsontable.renderers.TextRenderer.apply(this, arguments);
//   td.style.backgroundColor = "red";
//   td.style.fontWeight = "bold";
// }

const MY_OPTIONS = "MY_OPTIONS";
const COMMENTS_KEY = "COMMENTS_KEY";
const MERGE_CELLS_KEY = "MERGE_CELLS_KEY";
const CELL_STYLE_KEY = "CELL_STYLE_KEY";

const CustomHansOnTable = ({ myOptions }) => {
  const [myHandsOnTable, setMyHandsOnTable] = useState();
  const [displayCellInfo, setDisplaySetInfo] = useState("");
  const [selectedCell, setSelectedCell] = useState([0, 0]);

  const getComments = () => {
    let comments = localStorage.getItem(COMMENTS_KEY);

    if (comments === null) return [];

    return JSON.parse(comments);
  };

  const getMergeCells = () => {
    let mergeCells = localStorage.getItem(MERGE_CELLS_KEY);

    if (mergeCells === null) return [];

    return JSON.parse(mergeCells);
  };

  // const myNewQueryMethod = (searchValue, dataValue) => {
  //   if (!searchValue) return false;

  //   dataValue = dataValue || "";
  //   return searchValue.toString() === dataValue.toString();
  // };

  const cellSelected = () => {
    let selectedLast = myTable.getSelectedLast();

    if (selectedLast[0] < 0 || selectedLast[1] < 0) return;

    let value = myTable.getValue() || "";
    setDisplaySetInfo(value);

    setSelectedCell([selectedLast[0], selectedLast[1]]);
  };

  const localCellStyle = localStorage.getItem(CELL_STYLE_KEY)
    ? JSON.parse(localStorage.getItem(CELL_STYLE_KEY))
    : null;

  const options = {
    data, // initData(),

    /* true or false options */
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

    observeChanges: true,
    afterChangesObserved: () => {
      //console.log("change !!");
    },

    // filters: true, /* 필터 기능 on 6.2.2 pro  */,
    // dropdownMenu: true, /* dropdown 메뉴 설정 6.2.2 pro */

    /* Selected Options */
    className: "htMiddle htCenter" /* Cell Alignment */,
    // stretchH: "none", /* 빈 공간을 채우는 방법 : none, last, all */
    // selectionMode: "multiple", /* Ctrl 키 + 선택 가능한 셀 : multiple, range, single */
    // fillHandle : true, /* 드래그로 자동 채움 : true, false, vertical, horizontal 옵션 */
    // disableVisualSelection: "current", /* 셀 선택 활성화 여부 : false, true, current, area, header, [option1, option2, ...] */

    /* Number Options */
    width: 1000,
    height: 1000,

    startCols: 5 /* data가 없는 경우 기본 설정 */,
    startRows: 3 /* data가 없는 경우 기본 설정 */,
    afterSelection: cellSelected,
    // maxCols: 2, /* 주어진 값보다 큰 Column은 제거 */
    // maxRows: 3, /* 주어진 값보다 큰 Row는 제거 */
    // minCols: 10, /* 최소한의 Column */
    // minRows: 10, /* 최소한의 Row */
    // minSpareRows: 1, /* 빈 열 자동 추가 */
    // minSpareCols: 2, /* 빈 행 자동 추가 */
    // fixedColumnsLeft: 2,
    // fixedRowsTop: 3,
    // fixedRowsBottom: 2,
    // rowHeaderWidth: 250, /* 행 헤더 너비 */

    /* Customizing Options */
    colWidths: 60 /* 특정 위치 너비 변경 : [60, 120, 60, 60, 60, 60, 60] */,
    rowHeights: 25,
    // placeholder: 'Empty',
    // columnSorting: {
    //   indicator: true, /* default true, 정렬 순서 표시 마크 (↑↓) on / off */
    //   sortEmptyCells: true, /* true : 빈 셀도 정렬, false : 모든 빈 셀은 테이블 끝으로 이동 */
    //   headerAction: true, /* default true, 헤더 클릭 시 정렬 기능 on / off */
    //   initialConfig: {
    //     column: 2, /* column : 2를 기준으로 정렬 */
    //     sortOrder: "asc", /* 내림차순 desc */
    //   },

    //   /* 비교함수 구현. -1, 0, 1을 return. */
    //   // compareFunctionFactory: function(sortOrder, columnMeta) {
    //   //   return function(value, nextValue) {
    //   //     if(value > 2000) return -1;
    //   //     return value - nextValue;
    //   //   }
    //   // },
    // },

    // comments: {
    //   displayDelay: 1000 /* 1초 뒤에 메모가 on */,
    // },

    cell: getComments(),
    afterSetCellMeta: (row, col, key, obj) => {
      if (key === "comment") {
        // 기존 데이터 삭제
        let temp = getComments().filter(
          (item) => (item.row === row && item.col === col) === false
        );
        if (obj !== undefined)
          temp.push({ row, col, comment: { value: obj.value } });
        localStorage.setItem(COMMENTS_KEY, JSON.stringify([...temp]));
      }
    },

    // 6.2.2 미지원
    // beforeSetCellMeta:(row, col, key, value) => {
    //   console.log("before",row, col, key, value);
    // },

    // afterChange: function(change, source) {
    //   console.log(change, source);
    //   //change [row, col, before, after];
    // },

    mergeCells: getMergeCells(),
    afterUnmergeCells: (cellRange, auto) => {
      let temp = getMergeCells().filter(
        (item) =>
          (item.row === cellRange.from.row &&
            item.col === cellRange.from.col) === false
      );

      localStorage.setItem(MERGE_CELLS_KEY, JSON.stringify([...temp]));
    },

    // search: {
    //   callback: searchResultCounter,
    //   queryMethod: myNewQueryMethod,
    //   //searchResultClass: 'customClass'
    // },

    // columns: [
    //     {data: "id", type: 'numeric'},
    //     {data: "name", renderer: redRenderer},
    //     {data: "isActive", type: 'checkbox'},
    //     {data: "date", type: 'date', dateFormat: 'YYYY-MM-DD'},
    //     {data: "color",
    //       type: 'autocomplete', // dropdown
    //       source: ["yellow", "red", "orange", "green", "blue", "gray", "black", "white"]
    //     },
    //     {
    //       editor: 'select',
    //       selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
    //     },
    //   ],

    cells: function (row, col, prop) {
      if (localCellStyle === null) return {};

      let cellProperties = {};

      cellProperties.className =
        localCellStyle[row][col].className || "htCenter htMiddle"; // undefined 처리

      cellProperties.renderer = function (instance, td) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        td.style.fontWeight = localCellStyle[row][col].style.fontWeight || "";
        td.style.fontStyle = localCellStyle[row][col].style.fontStyle || "";
        td.style.textDecoration =
          localCellStyle[row][col].style.textDecoration || "";
        td.style.color = localCellStyle[row][col].style.color || "#000000";
        td.style.backgroundColor =
          localCellStyle[row][col].style.backgroundColor || "#FFFFFF";
      };

      return cellProperties;
    },

    licenseKey: "non-commercial-and-evaluation",
  };

  const setColWidths = (table, setOptions) => {
    let colLength = table.getData()[0].length;
    let widths = [];

    for (let i = 0; i < colLength; i++) widths.push(table.getColWidth(i));

    setOptions.cellInfo.colWidths = widths;

    localStorage.setItem(MY_OPTIONS, JSON.stringify(setOptions));
  };

  const setRowHeights = (table, setOptions) => {
    let rowLength = table.getData().length;
    let heights = [];

    for (let i = 0; i < rowLength; i++) heights.push(table.getRowHeight(i));

    setOptions.cellInfo.rowHeights = heights;

    localStorage.setItem(MY_OPTIONS, JSON.stringify(setOptions));
  };

  let myTable;
  const makeTable = () => {
    const container = document.getElementById("hot-app");
    container.innerHTML = "";

    myTable = new Handsontable(container, {
      ...options,
      ...myOptions.trueFalseOptions,
      ...myOptions.numberOptions,
      ...myOptions.cellInfo,
    });

    myTable.addHook("afterMergeCells", function (cellRange, mergeParent, auto) {
      let temp = getMergeCells();
      temp.push(mergeParent);
      temp = temp.filter(
        (item) => myTable.getCellMeta(item.row, item.col).spanned === true
      );

      localStorage.setItem(MERGE_CELLS_KEY, JSON.stringify([...temp]));
    });

    myTable.addHook("afterColumnResize", function (col, width) {
      let localOptions = localStorage.getItem(MY_OPTIONS);

      if (localOptions === null) {
        setColWidths(this, myOptions);
        return;
      }

      localOptions = JSON.parse(localOptions);
      if (Array.isArray(localOptions.cellInfo.colWidths) === false) {
        setColWidths(this, localOptions);
        return;
      }

      localOptions.cellInfo.colWidths[col] = width;
      localStorage.setItem(MY_OPTIONS, JSON.stringify(localOptions));
    });

    myTable.addHook("afterRowResize", function (row, height) {
      let localOptions = localStorage.getItem(MY_OPTIONS);

      if (localOptions === null) {
        setRowHeights(this, myOptions);
        return;
      }

      localOptions = JSON.parse(localOptions);
      if (Array.isArray(localOptions.cellInfo.rowHeights) === false) {
        setRowHeights(this, localOptions);
        return;
      }

      localOptions.cellInfo.rowHeights[row] = height;
      localStorage.setItem(MY_OPTIONS, JSON.stringify(localOptions));
    });

    myTable.render();
    setMyHandsOnTable(myTable);

    // search 구현
    // let searchField = document.getElementById("search_field");
    // let resultCount = document.getElementById("resultCount");

    // Handsontable.dom.addEvent(searchField, "keyup", function(event) {
    //   searchResultCount = 0;

    //   let search = myTable.getPlugin("search");
    //   let queryResult = search.query(this.value);

    //   console.log(queryResult);

    //   resultCount.innerText = searchResultCount.toString();
    //   myTable.render();
    // });
  };

  useEffect(() => {
    makeTable();
  }, [myOptions]);

  const changeFormat = (value) => {
    value = value || "";
    value = value.toString();
    if (value.includes('"')) return '"' + value.replace(/"/g, '""') + '"';
    if (value.includes(",") || value.includes("\n")) return '"' + value + '"';
    return value;
  };

  const downloadCSV = () => {
    let data = myHandsOnTable.getData();

    let csv = "";
    for (let r = 0; r < data.length; r++) {
      let row = data[r].map(changeFormat).join(",");
      csv += row + "\n";
    }

    let fileDown = "data:csv;charset=utf-8," + csv;
    let encodedUri = encodeURI(fileDown);
    let link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "handsontable.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const test = () => {
    let selected = myHandsOnTable.getSelected();
    console.log(selected);
    console.log(selected[0][0], selected[0][1]);

    let startRow = selected[0][0];
    let startCol = selected[0][1];
    const cellElement = myHandsOnTable.getCell(startRow, startCol);

    console.log(cellElement);
    const cellRect = cellElement.getBoundingClientRect();
    console.log(cellElement.offsetLeft);
    console.log(cellElement.offsetTop);

    const x = cellRect.left + window.scrollX;
    const y = cellRect.top + window.scrollY;
    console.log("X 좌표:", x, "Y 좌표:", y);
    console.log(cellRect, cellElement);
  };

  return (
    <div>
      <Rectangle top="666px" left="194px" width="60px" height="26px" />
      <Rectangle top="332px" left="131px" width="5px" height="5px" />

      <button onClick={test}>test</button>
      <p>1</p>
      <p>1</p>

      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>
      <p>1</p>

      <Box sx={{ m: 2 }}>
        <Button
          sx={{ m: 2 }}
          variant="outlined"
          color="primary"
          onClick={downloadCSV}
        >
          Download CSV
        </Button>
        {/* <input id="search_field" type="search" placeholder="search" />
        <p>
        <span id="resultCount">0</span> results
      </p> */}
        <HandsontableToggleButton
          myHandsOnTable={myHandsOnTable}
          selectedCell={selectedCell}
        />
        <DisplayCellStyle>
          <span>{displayCellInfo}</span>
        </DisplayCellStyle>
        <div id="hot-app" style={{ marginTop: "13px" }}></div>
      </Box>
    </div>
  );
};

export default CustomHansOnTable;

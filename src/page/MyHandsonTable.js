import React, { useState, useEffect } from "react";
import CustomHansOnTable from "./CustomHansOnTable";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import Divider from "@mui/material/Divider";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

const MY_OPTIONS = "MY_OPTIONS";

const myDefaultOptions = {
  trueFalseOptions: {
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
    // outsideClickDeselects: false /* 셀 외부 클릭 시, 셀 선택 해제 */,
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
  },

  numberOptions: {
    width: 1000,
    height: 1000,
    startCols: 5 /* data가 없는 경우 기본 설정 */,
    startRows: 5 /* data가 없는 경우 기본 설정 */,
    maxCols: 100 /* 주어진 값보다 큰 Column은 제거 */,
    maxRows: 100 /* 주어진 값보다 큰 Row는 제거 */,
    minCols: 1 /* 최소한의 Column */,
    minRows: 1 /* 최소한의 Row */,
    minSpareRows: 0 /* 빈 열 자동 추가 */,
    minSpareCols: 0 /* 빈 행 자동 추가 */,
    fixedColumnsLeft: 0,
    fixedRowsTop: 0,
    fixedRowsBottom: 0,
    rowHeaderWidth: 55 /* 행 헤더 너비 */,
  },

  cellInfo: {
    colWidths: 60,
    rowHeights: 25,
  },
};

const MyHandsonTable = () => {
  const [myOptions, setMyOptions] = useState(myDefaultOptions);

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const changeTrueFalseOptions = (option, value) => {
    console.log(myOptions);
    let temp = { ...myOptions };
    temp.trueFalseOptions[option] = !value;
    setMyOptions(temp);
    localStorage.setItem(MY_OPTIONS, JSON.stringify(temp));
  };

  const makeTrueFalseCheckBox = () => {
    let pair = Object.entries(myOptions.trueFalseOptions);

    pair = pair.map((item) => [item[0], Boolean(item[1])]);

    return pair.map((item, idx) => (
      <FormControlLabel
        key={idx}
        control={<Checkbox checked={item[1]} />}
        label={item[0]}
        onChange={() => changeTrueFalseOptions(item[0], item[1])}
      />
    ));
  };

  const changeNumberOptions = (option, value) => {
    let temp = { ...myOptions };

    if (isNaN(Number(value))) return;

    temp.numberOptions[option] = Number(value);
    setMyOptions(temp);
    localStorage.setItem(MY_OPTIONS, JSON.stringify(temp));
  };

  const makeNumberInput = () => {
    let pair = Object.entries(myOptions.numberOptions);

    pair = pair.map((item) => [item[0], Number(item[1])]);

    return pair.map((item, idx) => (
      <FormControl key={idx} sx={{ m: 2 }} variant="standard">
        <InputLabel htmlFor="component-error">{item[0]}</InputLabel>
        <Input
          value={item[1]}
          onChange={(e) => changeNumberOptions(item[0], e.target.value)}
        />
      </FormControl>
    ));
  };

  const list = () => (
    <Box sx={{ width: 600 }}>
      <Box sx={{ m: 2, flexDirection: "row" }}>{makeTrueFalseCheckBox()}</Box>

      <Divider />

      <Box sx={{ m: 2, flexDirection: "row" }}>
        <FormHelperText sx={{ color: "blue" }}>
          0 이상 숫자를 입력하세요.
        </FormHelperText>
        {makeNumberInput()}
      </Box>
    </Box>
  );

  const initLocalStorage = () => {
    let localOptions = localStorage.getItem(MY_OPTIONS);

    if (localOptions === null) return;

    setMyOptions(JSON.parse(localOptions));
  };

  useEffect(() => {
    initLocalStorage();
  }, []);

  return (
    <div>
      <div>
        {["right"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button
              sx={{ m: 2 }}
              variant="contained"
              color="secondary"
              onClick={toggleDrawer(anchor, true)}
            >
              Options Setting
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list()}
            </Drawer>
          </React.Fragment>
        ))}
        <CustomHansOnTable myOptions={myOptions} />
      </div>
    </div>
  );
};

export default MyHandsonTable;

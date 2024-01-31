/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
//import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ColorizeIcon from "@mui/icons-material/Colorize";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { CompactPicker } from "react-color";
import { useEffect } from "react";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const HandsontableToggleButton = ({ myHandsOnTable, selectedCell }) => {
  const [horizontalAlignment, setHorizontalAlignment] = useState("");
  const [verticalAlignment, setVerticalAlignment] = useState("");
  const [formats, setFormats] = useState(() => []);

  const [showCompactPicker, setShowCompactPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const getCellInfoBase = () => {
    let selecetedRangeCells = myHandsOnTable.getSelectedRange();
    if (selecetedRangeCells === undefined) return undefined;

    let baseCell = selecetedRangeCells[0].from;
    return myHandsOnTable.getCell(baseCell.row, baseCell.col);
  };

  const getCellInfoRange = () => {
    let selecetedRangeCells = myHandsOnTable.getSelectedRange();
    if (selecetedRangeCells === undefined) return undefined;

    let cellPositions = [];
    for (let cell of selecetedRangeCells) {
      for (let r = cell.from.row; r <= cell.to.row; r++) {
        for (let c = cell.from.col; c <= cell.to.col; c++)
          cellPositions.push([r, c]);
      }
    }

    return cellPositions;
  };

  const getHorizontalStatus = (className) => {
    let status = ["htLeft", "htCenter", "htRight"];
    let current = className.split(" ");

    return current.filter((item) => status.includes(item))[0];
  };

  const getVerticalStatus = (className) => {
    let status = ["htTop", "htMiddle", "htBottom"];
    let current = className.split(" ");

    return current.filter((item) => status.includes(item))[0];
  };

  const handleAlignment = (event, newAlignment, type) => {
    console.log(newAlignment, type);

    let cellPositions = getCellInfoRange();
    if (cellPositions === undefined) return;

    if (type === "horizontal") setHorizontalAlignment(newAlignment);
    else if (type === "vertical") setVerticalAlignment(newAlignment);

    for (let pos of cellPositions) {
      let cellInfo = myHandsOnTable.getCell(pos[0], pos[1]);
      let className = cellInfo.className;
      let split = className.split(" ");
      if (type === "horizontal") {
        let horizontal = getHorizontalStatus(className);
        split = split.filter((item) => item !== horizontal); // 현재 설정 값 삭제
      } else if (type === "vertical") {
        let vertical = getVerticalStatus(className);
        split = split.filter((item) => item !== vertical); // 현재 설정 값 삭제
      }

      if (newAlignment) split.push(newAlignment); // 새로 설정된 값 추가.

      cellInfo.className = split.join(" ");
    }
  };

  const handleFormat = (event, newFormats) => {
    console.log(newFormats);

    let cellPositions = getCellInfoRange();
    if (cellPositions === undefined) return;

    setFormats(newFormats);

    for (let pos of cellPositions) {
      let cellInfo = myHandsOnTable.getCell(pos[0], pos[1]);

      cellInfo.style.fontWeight = newFormats.includes("bold") ? "bold" : "";
      cellInfo.style.fontStyle = newFormats.includes("italic") ? "italic" : "";

      let deco = [];
      if (newFormats.includes("underline")) deco.push("underline");
      if (newFormats.includes("line-through")) deco.push("line-through");

      cellInfo.style.textDecoration = deco.join(" ");
    }
  };

  const handleToggleCompactPicker = (event, type) => {
    let cellPositions = getCellInfoRange();
    if (cellPositions === undefined) return;

    const iconButton = event.currentTarget;
    const rect = iconButton.getBoundingClientRect();
    const pickerTop = rect.bottom + window.scrollY;
    const pickerLeft = rect.left + window.scrollX;

    setPickerPosition({ top: pickerTop, left: pickerLeft });
    setShowCompactPicker((prev) => !prev);
  };

  const handleChangeComplete = (color, event) => {
    let cellPositions = getCellInfoRange();
    if (cellPositions === undefined) return;

    let colorType = formats.includes("fontColor") ? "fontColor" : "bgColor";

    console.log(colorType, color.hex);

    if (colorType === "fontColor") setFontColor(color.hex);
    else setBgColor(color.hex);

    for (let pos of cellPositions) {
      let cellInfo = myHandsOnTable.getCell(pos[0], pos[1]);

      if (colorType === "fontColor") {
        cellInfo.style.color = color.hex;
      } else {
        cellInfo.style.backgroundColor = color.hex;
      }
    }
  };

  const getColorPicker = () => {
    let colorType = formats.includes("fontColor") ? "fontColor" : "bgColor";
    return (
      <CompactPicker
        color={colorType === "fontColor" ? fontColor : bgColor}
        onChangeComplete={handleChangeComplete}
      />
    );
  };

  const handleClose = () => {
    let fms = formats.filter(
      (item) => (item === "fontColor" || item === "bgColor") === false
    );
    setFormats(fms);

    setShowCompactPicker(false);
  };

  const setButtonState = () => {
    if (myHandsOnTable === undefined) return;

    let cellInfo = getCellInfoBase();
    let className = cellInfo.className;
    let horizontal = getHorizontalStatus(className) || ""; // undefined 처리
    let vertical = getVerticalStatus(className) || "";

    setHorizontalAlignment(horizontal);
    setVerticalAlignment(vertical);

    let fontWeight = cellInfo.style.fontWeight;
    let fontStyle = cellInfo.style.fontStyle;
    let textDecoration = cellInfo.style.textDecoration.split(" ");

    setFormats([fontWeight, fontStyle, ...textDecoration]);
    setFontColor(cellInfo.style.color);
    setBgColor(cellInfo.style.backgroundColor);
  };

  useEffect(() => {
    setButtonState();
  }, [selectedCell]);

  return (
    <div>
      <Box sx={{ m: 2, marginBottom: 5 }}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            flexWrap: "wrap",
            width: "700px",
          }}
        >
          <StyledToggleButtonGroup
            size="small"
            value={horizontalAlignment}
            exclusive
            onChange={(e, alignment) =>
              handleAlignment(e, alignment, "horizontal")
            }
            aria-label="text alignment"
          >
            <ToggleButton value="htLeft" aria-label="left aligned">
              <FormatAlignLeftIcon />
            </ToggleButton>
            <ToggleButton value="htCenter" aria-label="centered">
              <FormatAlignCenterIcon />
            </ToggleButton>
            <ToggleButton value="htRight" aria-label="right aligned">
              <FormatAlignRightIcon />
            </ToggleButton>
            {/* <ToggleButton value="justify" aria-label="justified">
              <FormatAlignJustifyIcon />
            </ToggleButton> */}
          </StyledToggleButtonGroup>

          <StyledToggleButtonGroup
            size="small"
            value={verticalAlignment}
            exclusive
            onChange={(e, alignment) =>
              handleAlignment(e, alignment, "vertical")
            }
            aria-label="text alignment"
          >
            <ToggleButton value="htTop" aria-label="top aligned">
              <VerticalAlignTopIcon />
            </ToggleButton>
            <ToggleButton value="htMiddle" aria-label="middle">
              <VerticalAlignCenterIcon />
            </ToggleButton>
            <ToggleButton value="htBottom" aria-label="bottom aligned">
              <VerticalAlignBottomIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>

          <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

          <StyledToggleButtonGroup
            size="small"
            value={formats}
            onChange={handleFormat}
            aria-label="text formatting"
          >
            <ToggleButton value="bold" aria-label="bold">
              <FormatBoldIcon />
            </ToggleButton>
            <ToggleButton value="italic" aria-label="italic">
              <FormatItalicIcon />
            </ToggleButton>
            <ToggleButton value="underline" aria-label="underline">
              <FormatUnderlinedIcon />
            </ToggleButton>
            <ToggleButton value="line-through" aria-label="line-through">
              <FormatStrikethroughIcon />
            </ToggleButton>

            <ToggleButton
              value="fontColor"
              aria-label="fontColor"
              onClick={(e) => handleToggleCompactPicker(e, "fontColor")}
            >
              <ColorizeIcon />
              <ArrowDropDownIcon />
            </ToggleButton>
            <ToggleButton
              value="bgColor"
              aria-label="bgColor"
              onClick={(e) => handleToggleCompactPicker(e, "bgColor")}
            >
              <FormatColorFillIcon />
              <ArrowDropDownIcon />
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Paper>

        {showCompactPicker && (
          <div
            className="compact-picker-container"
            style={{
              position: "absolute",
              top: pickerPosition.top + "px",
              left: pickerPosition.left + "px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
              }}
              onClick={handleClose}
            />
            {getColorPicker()}
          </div>
        )}
      </Box>
    </div>
  );
};

export default HandsontableToggleButton;

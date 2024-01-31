import React, { useState } from "react";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import ToggleButton from "@mui/material/ToggleButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Textarea from "@mui/joy/Textarea";

import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

const MyDiffViewer = () => {
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [splitView, setSplitView] = useState(true);
  const [diffMethod, setDiffMethod] = useState(DiffMethod.CHARS);

  return (
    <Box sx={{ m: 2 }}>
      <ToggleButton
        sx={{ marginBottom: 2 }}
        value="check"
        selected={splitView}
        onChange={() => {
          setSplitView(!splitView);
        }}
      >
        <CheckIcon size="small" /> split
      </ToggleButton>
      <Box
        sx={{
          m: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Textarea
          style={{
            width: "50%",
            margin: "1px",
          }}
          name="Left"
          placeholder="Old Text..."
          variant="outlined"
          color="primary"
          minRows={15}
          maxRows={15}
          value={oldCode}
          onChange={(e) => setOldCode(e.target.value)}
        />
        <Textarea
          style={{
            width: "50%",
            margin: "1px",
          }}
          name="Right"
          placeholder="New Text..."
          variant="outlined"
          color="warning"
          minRows={15}
          maxRows={15}
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />
      </Box>
      <ReactDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        compareMethod={diffMethod}
        splitView={splitView}
      />
      <FormControl sx={{ m: 2, width: "500px" }}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={diffMethod}
          label="Diff Method"
          onChange={(e) => setDiffMethod(e.target.value)}
        >
          <MenuItem value="diffChars">CHARS</MenuItem>
          <MenuItem value="diffWords">WORDS</MenuItem>
          <MenuItem value="diffWordsWithSpace">WORDS_WITH_SPACE</MenuItem>
          <MenuItem value="diffLines">LINES </MenuItem>
          <MenuItem value="diffTrimmedLines">TRIMMED_LINES </MenuItem>
          <MenuItem value="diffSentences">SENTENCES </MenuItem>
          <MenuItem value="diffCss">CSS </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MyDiffViewer;

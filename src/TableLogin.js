import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";

const ChatLogin = () => {
  const navigate = useNavigate();
  const [id, setID] = React.useState("");

  const handleChange = (event) => {
    setID(event.target.value);
  };

  const login = () => {
    if (id === "") return;
    console.log(id);
    navigate("/socket-table", { state: { loginID: id } });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl sx={{ marginRight: 1, width: 300 }}>
          <InputLabel>ID</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={id}
            label="ID"
            onChange={handleChange}
          >
            <MenuItem value="Lilly">Lilly</MenuItem>
            <MenuItem value="Joe">Joe</MenuItem>
            <MenuItem value="Emily">Emily</MenuItem>
            <MenuItem value="Akane">Akane</MenuItem>
            <MenuItem value="Eliot">Eliot</MenuItem>
            <MenuItem value="Zoe">Zoe</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={login}>
          Login
        </Button>
      </Box>
    </div>
  );
};

export default ChatLogin;

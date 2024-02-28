import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import CryptoJS from "crypto-js";

const SECRET_KEY = "MY_SECRET_KEY";

const EncryptionComponent = () => {
  const [inputText1, setInputText1] = useState("");
  const [inputText2, setInputText2] = useState("");

  const [encryptedAESText, setEncryptedAESText] = useState("");
  const [decryptedAESText, setDecryptedAESText] = useState("");
  const [hashedText, setHashedText] = useState('');

  const encryptAES = () => {
    let encrypted = CryptoJS.AES.encrypt(inputText1, SECRET_KEY).toString();
    setEncryptedAESText(encrypted);
  };

  const decryptAES = () => {
    let decrypted = CryptoJS.AES.decrypt(
      encryptedAESText,
      SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    setDecryptedAESText(decrypted);
  };

  const hashText = () => {
    let hashed = CryptoJS.SHA256(inputText2).toString();
    setHashedText(hashed);
  };

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <TextField
          label="Text for AES"
          value={inputText1}
          onChange={(e) => setInputText1(e.target.value)}
        />
        <Button
          sx={{ m: 1 }}
          variant="outlined"
          color="warning"
          onClick={encryptAES}
        >
          Encrypt
        </Button>
        <Button variant="outlined" color="success" onClick={decryptAES}>
          Decrypt
        </Button>
        <div>
          <p>Encrypted Text AES: {encryptedAESText}</p>
          <p>Decrypted Text AES: {decryptedAESText}</p>
        </div>
      </Box>

      <hr />

      <Box sx={{ m: 2 }}>
        <TextField
          label="Text for SHA256"
          value={inputText2}
          onChange={(e) => setInputText2(e.target.value)}
        />
        <Button
          sx={{ m: 1 }}
          variant="outlined"
          color="warning"
          onClick={hashText}
        >
          Hash
        </Button>
        <div>
          <p>Hashed Text SHA256 : {hashedText}</p>
        </div>
      </Box>
    </div>
  );
};

export default EncryptionComponent;

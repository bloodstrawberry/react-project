import React, { useState, useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";

const Floating = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState("");

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleButtonClick = (index) => {
    setShowAlert(true);
    setFloatingMessage(`${index} 번째 플로팅 메시지...`);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const paragraphs = Array.from({ length: 30 }, (_, index) => (
    <p key={index}>
      {`　　${index} : 번째 내용 ........................................................................................................................................................................................................   `}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleButtonClick(index)}
      >
        Button
      </Button>
    </p>
  ));

  return (
    <div>
      {paragraphs}
      {showAlert && (
        <Alert
          severity="info"
          onClose={handleAlertClose}
          style={{
            position: "fixed",
            top: 5,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            opacity: 0.8, // 투명도 조절
          }}
        >
          {floatingMessage}
        </Alert>
      )}
    </div>
  );
};

export default Floating;

import React, { useState, useEffect, useRef } from "react";
import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";

import { Transition } from "react-transition-group";
import { styled } from "@mui/system";
import { Snackbar } from "@mui/base/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

const blue = {
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const TriggerButton = styled("button")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  box-shadow: 0 1px 2px ${
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)"
      : "rgba(45, 45, 60, 0.15)"
  };

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
  }
  &:active {
    background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }
  `
);

const StyledSnackbar = styled(Snackbar)`
  position: fixed;
  z-index: 5500;
  display: flex;
  top: 16px; 
  left: 50%;
  transform: translateX(-50%); 
`;

const SnackbarContent = styled("div")(
  ({ theme }) => `
  position: relative;
  overflow: hidden;
  z-index: 5500;
  display: flex;
  left: auto;
  justify-content: space-between;
  max-width: 560px;
  min-width: 300px;
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0 2px 8px rgb(0 0 0 / 0.5)`
      : `0 2px 8px ${grey[200]}`
  };
  padding: 0.75rem;
  color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;

  & .snackbar-title {
    margin-right: 0.5rem;
  }

  & .snackbar-close-icon {
    cursor: pointer;
    font-size: 10px;
    width: 1.25rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `
);

const positioningStyles = {
  entering: "translateX(0)",
  entered: "translateX(0)",
  exiting: "translateX(1500px)",
  exited: "translateX(1500px)",
  unmounted: "translateX(1500px)",
};

const Floating = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [exited, setExited] = useState(true);
  const nodeRef = useRef(null);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleOnEnter = () => {
    setExited(false);
  };

  const handleOnExited = () => {
    setExited(true);
  };

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
      <div>
        <TriggerButton type="button" onClick={handleClick}>
          Open snackbar
        </TriggerButton>
        <StyledSnackbar
          autoHideDuration={5000}
          open={open}
          onClose={handleClose}
          exited={exited}
        >
          <Transition
            timeout={{ enter: 400, exit: 400 }}
            in={open}
            appear
            unmountOnExit
            onEnter={handleOnEnter}
            onExited={handleOnExited}
            nodeRef={nodeRef}
          >
            {(status) => (
              <SnackbarContent
                style={{
                  transform: positioningStyles[status],
                  transition: "transform 300ms ease",
                }}
                ref={nodeRef}
              >
                <div className="snackbar-title">Hello World</div>
                <CloseIcon
                  onClick={handleClose}
                  className="snackbar-close-icon"
                />
              </SnackbarContent>
            )}
          </Transition>
        </StyledSnackbar>
      </div>
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

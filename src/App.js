//App.js
import React from "react";

import { Route, Link, Routes } from "react-router-dom";

//routing components
import Home from "./page/Home";
import MyHandsonTable from "./page/MyHandsonTable";
import MyCKEditor from "./page/MyCKEditor";
import MyDiffViewer from "./page/MyDiffViewer";
import TabEditor from "./page/TabEditor";

import "./App.css";
import Floating from "./page/Floating";
import MyEncrypt from "./page/MyEncrypt";
import ChatUI from "./page/ChatUI";
import ToastUIEditor from "./page/ToastUIEditor";
import ChonkyLoader from "./page/ChonkyLoader";

function App() {
  return (
    <div className="App">
      <div className="router">
        <span>
          <Link to="/myHandsTable">HandsOnTable</Link>
        </span>
        {/* <span>
          <Link to="/ck-editor">CK Editor</Link>
        </span> */}
        <span>
          <Link to="/tui-editor">Toast UI</Link>
        </span>        
        <span>
          <Link to="/diff-viewer">Diff Viewer</Link>
        </span>
        <span>
          <Link to="/tabs">Tabs</Link>
        </span>
        <span>
          <Link to="/floating">Floating</Link>
        </span>
        <span>
          <Link to="/encrypt">Encrypt</Link>
        </span>
        <span>
          <Link to="/filebrowser">File Browser</Link>
        </span>
        <span>
          <Link to="/chat">Chat Room</Link>
        </span>        
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myHandsTable" element={<MyHandsonTable />} />
          <Route path="/ck-editor" element={<MyCKEditor />} />
          <Route path="/tui-editor" element={<ToastUIEditor />} />
          
          <Route path="/diff-viewer" element={<MyDiffViewer />} />
          <Route path="/tabs" element={<TabEditor />} />        
          <Route path="/floating" element={<Floating />} />       
          <Route path="/encrypt" element={<MyEncrypt />} />                 
          <Route path="/filebrowser" element={<ChonkyLoader />} />                 
          
          <Route path="/chat" element={<ChatUI />} />                              
        </Routes>
      </div>
    </div>
  );
}

export default App;

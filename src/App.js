//App.js
import { Route, Link, Routes } from "react-router-dom";

//routing components
import Home from "./page/Home";
import MyHandsonTable from "./page/MyHandsonTable";
import MyCKEditor from "./page/MyCKEditor";
import MyDiffViewer from "./page/MyDiffViewer";
import TabEditor from "./page/TabEditor";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="router">
        <span>
          <Link to="/myHandsTable">HandsOnTable</Link>
        </span>
        <span>
          <Link to="/ck-editor">CK Editor</Link>
        </span>
        <span>
          <Link to="/diff-viewer">Diff Viewer</Link>
        </span>
        <span>
          <Link to="/tabs">Tabs</Link>
        </span>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myHandsTable" element={<MyHandsonTable />} />
          <Route path="/ck-editor" element={<MyCKEditor />} />
          <Route path="/diff-viewer" element={<MyDiffViewer />} />
          <Route path="/tabs" element={<TabEditor />} />          
        </Routes>
      </div>
    </div>
  );
}

export default App;

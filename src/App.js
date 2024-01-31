//App.js
import { Route, Link, Routes } from "react-router-dom";

//routing components
import Home from "./page/Home";
import MyCKEditor from "./page/MyCKEditor";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="router">
        <span>
          <Link to="/ckeditor">Router1</Link>
        </span>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ckeditor" element={<MyCKEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

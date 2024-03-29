import React, { useEffect, useRef, useState } from "react";

//import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import * as gh from "./githublibrary.js";

// Toast UI Editor
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css"; // Viewer css
import { Editor } from "@toast-ui/react-editor";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";

// Dark Theme 적용
// import '@toast-ui/editor/dist/toastui-editor.css';
// import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

// Color Syntax Plugin
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

// Table Merged Cell Plugin
import "@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";

//import html2pdf from 'html2pdf.js';

const colorSyntaxOptions = {
  preset: [
    "#333333", "#666666", "#FFFFFF", "#EE2323", "#F89009", "#009A87", "#006DD7", "#8A3DB6",
    "#781B33", "#5733B1", "#953B34", "#FFC1C8", "#FFC9AF", "#9FEEC3", "#99CEFA", "#C1BEF9",
  ],
};

const CONTENT_KEY = "CONTENT_KEY";

const ToastEditor = () => {
  //const location = useLocation();

  const editorRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  let initData = `# 제목

  ***~~<span style="color: #EE2323">내용</span>~~***
  
  * [x] 체크박스
  * [ ] 체크박스 2`;

  const handleSave = () => {
    let markDownContent = editorRef.current.getInstance().getMarkdown();
    let htmlContent = editorRef.current.getInstance().getHTML();
    console.log(markDownContent);
    console.log(htmlContent);
    localStorage.setItem(CONTENT_KEY, markDownContent);

    gh.fileWrite("README.md", markDownContent);
  };

  const init = async() => {
    let item = localStorage.getItem(CONTENT_KEY);
    let open = localStorage.getItem("FILE_PATH");
    
    // if(location.state) {
    if(open) {
      // let filePath = location.state.filePath;
      let filePath = JSON.parse(open).filePath;
      let result = await gh.fileRead(`actions/${filePath}`);

      if(result !== undefined) item = result;
      
      localStorage.removeItem("FILE_PATH");
    }

    if (editMode === false) {
      const viewer = new Viewer({
        el: document.querySelector(".toast-editor-viewer"),
        viewer: true,
        height: "400px",
        usageStatistics: false, // 통계 수집 거부
        plugins: [tableMergedCell],
      });

      if (item) viewer.setMarkdown(item);
      else viewer.setMarkdown(initData);
    }

    if (item) {
      if (editorRef.current) editorRef.current.getInstance().setMarkdown(item);
    } else {
      if (editorRef.current)
        editorRef.current.getInstance().setMarkdown(initData);
    }
  }

  useEffect(() => {
    init();
  }, [editMode]);

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <h1>Toast UI Editor</h1>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ m: 1 }}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "취소하기" : "편집하기"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1 }}
          onClick={handleSave}
          disabled={editMode === false}
        >
          저장하기
        </Button>

        {editMode === false && <div id="pdf-download" className="toast-editor-viewer"></div>}

        {editMode === true && (
          <Editor
            ref={editorRef}
            // initialValue={initContents}
            height="400px"
            placeholder="Please Enter Text."
            previewStyle="tab" // or vertical
            initialEditType="wysiwyg" // or markdown
            // hideModeSwitch={true} // 하단 숨기기
            toolbarItems={[
              // 툴바 옵션 설정
              ["heading", "bold", "italic", "strike"],
              ["hr", "quote"],
              ["ul", "ol", "task", "indent", "outdent"],
              ["table", /* "image", */ "link"],
              ["code", "codeblock"],
            ]}
            //theme="dark"
            //useCommandShortcut={false} // 키보드 입력 컨트롤 방지 ex ctrl z 등
            usageStatistics={false} // 통계 수집 거부
            plugins={[[colorSyntax, colorSyntaxOptions], tableMergedCell]}
          />
        )}
      </Box>
    </div>
  );
};

export default ToastEditor;

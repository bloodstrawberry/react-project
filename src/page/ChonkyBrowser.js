import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";

//import { useNavigate } from 'react-router-dom';

import {
  setChonkyDefaults,
  ChonkyActions,
  FileHelper,
  FullFileBrowser,
} from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { customActions } from "./myCustomActions";

import Box from "@mui/material/Box";

const ChonkyBrowser = React.memo((props) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fileInputRef = useRef(null);
  //const navigate  = useNavigate();

  // const demoMap = require("./demo.json");
  const demoMap = props.chonkyMap;

  const prepareCustomFileMap = () => {
    const baseFileMap = demoMap.fileMap;
    const rootFolderId = demoMap.rootFolderId;
    return { baseFileMap, rootFolderId };
  };

  const useCustomFileMap = () => {
    const { baseFileMap, rootFolderId } = useMemo(prepareCustomFileMap, []);

    const [fileMap, setFileMap] = useState(baseFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

    const resetFileMap = useCallback(() => {
      setFileMap(baseFileMap);
      setCurrentFolderId(rootFolderId);
    }, [baseFileMap, rootFolderId]);

    const currentFolderIdRef = useRef(currentFolderId);
    useEffect(() => {
      currentFolderIdRef.current = currentFolderId;
    }, [currentFolderId]);

    const deleteFiles = useCallback((files) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };
        files.forEach((file) => {
          delete newFileMap[file.id];

          if (file.parentId) {
            const parent = newFileMap[file.parentId];
            const newChildrenIds = parent.childrenIds.filter(
              (id) => id !== file.id
            );
            newFileMap[file.parentId] = {
              ...parent,
              childrenIds: newChildrenIds,
              childrenCount: newChildrenIds.length,
            };
          }
        });

        return newFileMap;
      });
    }, []);

    const moveFiles = useCallback((files, source, destination) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };
        const moveFileIds = new Set(files.map((f) => f.id));

        const newSourceChildrenIds = source.childrenIds.filter(
          (id) => !moveFileIds.has(id)
        );
        newFileMap[source.id] = {
          ...source,
          childrenIds: newSourceChildrenIds,
          childrenCount: newSourceChildrenIds.length,
        };

        const newDestinationChildrenIds = [
          ...destination.childrenIds,
          ...files.map((f) => f.id),
        ];
        newFileMap[destination.id] = {
          ...destination,
          childrenIds: newDestinationChildrenIds,
          childrenCount: newDestinationChildrenIds.length,
        };

        files.forEach((file) => {
          newFileMap[file.id] = {
            ...file,
            parentId: destination.id,
          };
        });

        return newFileMap;
      });
    }, []);

    const idCounter = useRef(0);
    const createFolder = useCallback((folderName) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };

        const newFolderId = `new-folder-${idCounter.current++}`;
        newFileMap[newFolderId] = {
          id: newFolderId,
          name: folderName,
          isDir: true,
          modDate: new Date(),
          parentId: currentFolderIdRef.current,
          childrenIds: [],
          childrenCount: 0,
        };

        const parent = newFileMap[currentFolderIdRef.current];
        newFileMap[currentFolderIdRef.current] = {
          ...parent,
          childrenIds: [...parent.childrenIds, newFolderId],
        };

        return newFileMap;
      });
    }, []);

    const createFile = useCallback((fileName) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };

        const newFolderId = `new-folder-${idCounter.current++}`;
        newFileMap[newFolderId] = {
          id: newFolderId,
          name: fileName,
          modDate: new Date(),
          parentId: currentFolderIdRef.current,
          childrenIds: [],
          childrenCount: 0,
        };

        const parent = newFileMap[currentFolderIdRef.current];
        newFileMap[currentFolderIdRef.current] = {
          ...parent,
          childrenIds: [...parent.childrenIds, newFolderId],
        };

        return newFileMap;
      });
    }, []);

    return {
      fileMap,
      currentFolderId,
      setCurrentFolderId,
      resetFileMap,
      deleteFiles,
      moveFiles,
      createFolder,
      createFile,
    };
  };

  const useFiles = (fileMap, currentFolderId) => {
    return useMemo(() => {
      const currentFolder = fileMap[currentFolderId];
      const childrenIds = currentFolder.childrenIds;
      const files = childrenIds.map((fileId) => fileMap[fileId]);
      return files;
    }, [currentFolderId, fileMap]);
  };

  const useFolderChain = (fileMap, currentFolderId) => {
    return useMemo(() => {
      const currentFolder = fileMap[currentFolderId];
      const folderChain = [currentFolder];
      let parentId = currentFolder.parentId;
      while (parentId) {
        const parentFile = fileMap[parentId];
        if (parentFile) {
          folderChain.unshift(parentFile);
          parentId = parentFile.parentId;
        } else {
          break;
        }
      }
      return folderChain;
    }, [currentFolderId, fileMap]);
  };

  const useFileActionHandler = (
    folderChain,
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder,
    toggleDarkMode,
    fileInputRef
  ) => {
    return useCallback(
      (data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
          const { targetFile, files } = data.payload;
          const fileToOpen = targetFile || files[0];
                   
          if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
            setCurrentFolderId(fileToOpen.id);
            return;
          }

          if(targetFile.name.endsWith(".md")) {
            let fileNames = data.state.selectedFiles.map((item) => item.name);
            let dirPath = folderChain.map((item) => item.name).join("/");
            let filePath = `${dirPath}/${fileNames}`;

            // navigate("/tui-editor", { state: { filePath } });
            localStorage.setItem("FILE_PATH", JSON.stringify({ filePath }));
            window.open("/react-project/tui-editor", "_blank");
          }
        } else if (data.id === ChonkyActions.DeleteFiles.id) {
          deleteFiles(data.state.selectedFilesForAction);
        } else if (data.id === ChonkyActions.MoveFiles.id) {
          moveFiles(
            data.payload.files,
            data.payload.source,
            data.payload.destination
          );
        } else if (data.id === ChonkyActions.CreateFolder.id) {
          const folderName = prompt("Provide the name for your new folder:");
          if (folderName) createFolder(folderName);
        } else if (data.id === ChonkyActions.ToggleDarkMode.id) {
          toggleDarkMode();
        } else if (data.id === "view") {
          let fileNames = data.state.selectedFiles.map((item) => item.name);
          let dirPath = folderChain.map((item) => item.name).join("/");

          for (let name of fileNames) {
            console.log(`${dirPath}/${name}`);
          }
        } else if (data.id === "upload") {
          fileInputRef.current.click();
        } 

        console.log(data);
      },
      [createFolder, deleteFiles, moveFiles, setCurrentFolderId, toggleDarkMode]
    );
  };

  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder,
    createFile,
  } = useCustomFileMap();

  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const files = useFiles(fileMap, currentFolderId);
  const folderChain = useFolderChain(fileMap, currentFolderId);
  const handleFileAction = useFileActionHandler(
    folderChain,
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder,
    toggleDarkMode,
    fileInputRef
  );

  const fileActions = useMemo(
    () => [
      ...customActions,
      ChonkyActions.CreateFolder,
      ChonkyActions.DeleteFiles,
      // ChonkyActions.CopyFiles,
      // ChonkyActions.UploadFiles,
      // ChonkyActions.DownloadFiles,
      ChonkyActions.ToggleDarkMode,
    ],
    []
  );

  const thumbnailGenerator = useCallback(
    (file) =>
      file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
    []
  );

  const fileUpload = async (e) => {
    let files = e.target.files;
    for (let file of files) {
      if (file === undefined) continue;

      console.log(file.name); // 파일 이름

      createFile(file.name);
      // 실제 파일 내용 read
      // let fileReader = new FileReader();
      // fileReader.readAsText(file, "utf-8"); // or euc-kr
      // fileReader.onload = function () {
      //   console.log(fileReader.result);
      // };
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,.md"
        style={{ display: "none" }}
        multiple
        onChange={(e) => fileUpload(e)}
      />

      <div style={{ height: 400 }}>
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleFileAction}
          thumbnailGenerator={thumbnailGenerator}
          // disableDefaultFileActions={true} // default false
          // doubleClickDelay={500} // ms
          // disableSelection={true} // default false 파일 선택이 해제됨
          // disableDragAndDrop={true} // 드래그 앤 드랍 기능 off
          // disableDragAndDropProvider={true} // default false, Provider : 다른 드래그 앤 드롭은 유지
          // defaultSortActionId={ChonkyActions.SortFilesByDate.id} // SortFilesByName, SortFilesBySize, SortFilesByDate
          // defaultFileViewActionId={ChonkyActions.EnableListView.id} // EnableGridView, EnableListView
          // clearSelectionOnOutsideClick={false} // default true 브라우저 외부 클릭 시 파일 선택 해제
          darkMode={darkMode}
          {...props}
        />
      </div>
    </Box>
  );
});

export default ChonkyBrowser;

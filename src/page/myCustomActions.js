import { defineFileAction, ChonkyIconName } from "chonky";

const uploadFileAction = defineFileAction({
  id: "upload",
  button: {
    name: "Upload",
    toolbar: true,
    contextMenu: false, 
    icon: ChonkyIconName.upload
  }
});

const viewFileAction = defineFileAction({
  id: "view",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "View",
    toolbar: false, 
    contextMenu: true,
    icon: ChonkyIconName.file
  }
});

export const customActions = [
  viewFileAction,
  uploadFileAction
];

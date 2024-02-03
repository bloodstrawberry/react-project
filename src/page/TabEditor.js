import React, { useState } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Textarea from "@mui/joy/Textarea";
import AddIcon from "@mui/icons-material/Add";

import Swal from "sweetalert2";

const TextAreaTabPanel = (props) => {
  const { children, value, index, tabs, setTabs, ...other } = props;

  const handleChange = (event) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].content = event.target.value;
    setTabs(updatedTabs);
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Textarea
            id={`textarea-${index}`}
            placeholder="Input Text ..."
            variant="outlined"
            color="primary"
            minRows={15}
            maxRows={15}
            value={tabs[index].content}
            onChange={handleChange}
          />
        </Box>
      )}
    </div>
  );
};

const TabEditor = () => {
  const [tabs, setTabs] = useState([
    { title: "Tab 1", content: "Content 1" },
    { title: "Tab 2", content: "Content 2" },
    { title: "Tab 3", content: "Content 3" },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [editIndex, setEditIndex] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const changeTabTitle = (index, newTitle) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].title = newTitle;
    setTabs(updatedTabs);
  };

  const handleTitleBlur = (index, event) => {
    const newTitle = event.target.value.trim();
    if (newTitle !== "" && newTitle !== tabs[index].title) {
      changeTabTitle(index, newTitle);
    }
    setEditIndex(null);
  };

  const addTab = () => {
    const newTab = {
      title: `New Tab`,
      content: `New Content`,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length); // Make the newly added tab active
  };

  const deleteTab = (index) => {
    const updatedTabs = tabs.filter((tab, i) => i !== index);
    setTabs(updatedTabs);
    if (activeTab === index) {
      setActiveTab(Math.max(activeTab - 1, 0));
    }
  };

  const handleTabContextMenu = (event, index) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this tab?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTab(index);
      }
    });
  };

  return (
    <Box sx={{ m: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dynamic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                editIndex === index ? (
                  <input
                    type="text"
                    value={tab.title}
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => changeTabTitle(index, e.target.value)}
                    onBlur={(e) => handleTitleBlur(index, e)}
                    style={{ border: "none", outline: "none" }}
                  />
                ) : (
                  <span
                    onDoubleClick={() => setEditIndex(index)}
                    onContextMenu={(event) =>
                      handleTabContextMenu(event, index)
                    }
                  >
                    {tab.title}
                  </span>
                )
              }
            />
          ))}
          <Tab onClick={addTab} label={<AddIcon />} />
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TextAreaTabPanel
          key={index}
          value={activeTab}
          index={index}
          tabs={tabs}
          setTabs={setTabs}
        />
      ))}
    </Box>
  );
}

export default TabEditor;
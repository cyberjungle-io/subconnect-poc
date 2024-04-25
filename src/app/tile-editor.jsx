"use client";
import React, { useEffect, useState,useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import ShowTile from "@/components/tiles/showTile";
import ConfigureTextLine from "@/components/tiles/configureTextLine";
import ConfigureDataLine from "@/components/tiles/configureDataLine";
import ConfigureTable from "@/components/tiles/configureTable";
import { generateGUID } from "@/lib/utils";
import { setStorageData } from "@/lib/utils"; 
import { GlobalStateContext } from "@/app/page";
import { graphArray, fetchValueData } from "@/lib/graphdata";

const Modal = ({ isOpen, onClose, children }) => {
  const globalState = useContext(GlobalStateContext);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="relative bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-md max-h-full overflow-y-auto z-50">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select Content
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default function TileEditor() {
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: { text: "", color: "#000000", fontSize: 16 },
    lines: [
      { lineType: "Text", text: "", color: "#000000", fontSize: 16 },
      // Add more lines here as needed
    ],
    icon: { text: "", iconSize: 16 },
  });
  const [content, setContent] = useState([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const handleInputChange = (lineIndex, value) => {
    console.log("lineIndex", lineIndex);
    console.log("value", value);
    if (lineIndex === "icon") {
      setForm((prevForm) => ({
        ...prevForm,
        icon: { ...prevForm.icon, text: value },
      }));
    }
    if (lineIndex === "title") {
      setForm((prevForm) => ({
        ...prevForm,
        title: { ...prevForm.title, text: value },
      }));
    } else if (typeof lineIndex === "number") {
      setForm((prevForm) => {
        const newLines = [...prevForm.lines];
        if (newLines[lineIndex]) {
          newLines[lineIndex].text = value;
        } else {
          // Handle the case where newLines[lineIndex] is undefined
          console.error(`Line index ${lineIndex} is out of bounds`);
        }
        return { ...prevForm, lines: newLines };
      });
    }
  };
  useEffect(() => {
    //console.log(globalState.account);
    getLocalStorage();
  }, []);
  useEffect(() => {
    console.log("form", form);
  }, [form]);

  function handleColorChange(lineIndex, value) {
    if (lineIndex === "title") {
      setForm((prevForm) => ({
        ...prevForm,
        title: { ...prevForm.title, color: value },
      }));
    } else if (typeof lineIndex === "number") {
      // Ensure lineIndex is a number
      setForm((prevForm) => {
        const newLines = [...prevForm.lines];
        if (newLines[lineIndex]) {
          newLines[lineIndex].color = value;
          return { ...prevForm, lines: newLines };
        }
        return prevForm; // In case of an out-of-bounds index, return the previous form.
      });
    }
  }

  const handleFontSizeChange = (lineIndex, value) => {
    setForm((prevForm) => {
      if (lineIndex >= 0 && lineIndex < prevForm.lines.length) {
        const newLines = [...prevForm.lines];
        newLines[lineIndex].fontSize = value;
        return { ...prevForm, lines: newLines };
      } else {
        // lineIndex is out of bounds, return the previous state
        return prevForm;
      }
    });
  };

  function handleIconSizeChange(value) {
    const minIconSize = 10; // Set your minimum font size
    const maxIconSize = 60; // Set your maximum font size

    // Ensure the new value is within the allowed range
    if (value >= minIconSize && value <= maxIconSize) {
      setForm((prevForm) => {
        return { ...prevForm, icon: { ...prevForm.icon, iconSize: value } };
      });
    }
  }

  function addLine() {
    setForm((prevForm) => {
      const newLines = [
        ...prevForm.lines,
        { lineType: "Text", text: "", color: "#000000", fontSize: 16 },
      ];
      return { ...prevForm, lines: newLines };
    });
  }
  function handleLineUpdate(lineIndex, newLine) {
    setForm((prevForm) => {
      const newLines = [...prevForm.lines];
      newLines[lineIndex] = newLine;
      return { ...prevForm, lines: newLines };
    });
  }
  const handleLineTypeChange = (lineIndex, newValue) => {
    setForm((prevForm) => {
      const newLines = [...prevForm.lines];
      if (newLines[lineIndex]) {
        if (newValue === "Table") {
          let qry = graphArray.filter((item) => item.queryType === "table");
          if (!qry) {qry = []}
          (newLines[lineIndex] = {
            lineType: "Table",
            label: { text: "", color: "#000000", fontSize: 16 },
            value: { id: "", color: "#000000", fontSize: 16, dataQuery: qry[0],columns:[], mappings: [] }, 
          }),
            (newLines[lineIndex].label.text = "");
          console.log("newLines[lineIndex]", newLines[lineIndex]);
        } else if (newValue === "Data") {
          (newLines[lineIndex] = {
            lineType: "Data",
            label: { text: "", color: "#000000", fontSize: 16 },
            value: { id: "", color: "#000000", fontSize: 16, dataQuery: {}, mappings: [] }, 
          }),
            (newLines[lineIndex].label.text = "");
          console.log("newLines[lineIndex]", newLines[lineIndex]);
        } else if (newValue === "Video") {
          (newLines[lineIndex] = {
            lineType: "Video",
            text: "",
            color: "#000000",
            fontSize: 16,
          }),
            (newLines[lineIndex].text = "Video");
        } else if (newValue === "Image") {
          (newLines[lineIndex] = {
            lineType: "Image",
            text: "",
            color: "#000000",
            fontSize: 16,
          }),
            (newLines[lineIndex].text = "Image");
        } else {
          (newLines[lineIndex] = {
            lineType: "Text",
            text: "",
            color: "#000000",
            fontSize: 16,
          }),
            (newLines[lineIndex].text = "");
        }
      } else {
        console.error(`Line index ${lineIndex} is out of bounds`);
      }
      return { ...prevForm, lines: newLines };
    });
  };
  const handleSaveClick = () => {
    savePreferences();
  };
  const getLocalStorage = () => {
    try {
      if (globalState.data.tiles.length === 0) {
        return;
      }

      
      setContent(globalState.data.tiles);
      setCurrentContentIndex(0);
      setForm(globalState.data.tiles[0].form);
    } catch (error) {
      console.error("Error getting data:", error);
    }
    
  };
  const savePreferences = () => {
    console.log("savePreferences");
    // temporary load the content from the content array for the currentContentIndex
    let tempContent = content[currentContentIndex];
    //test if the tempContent has an element id
    if (!tempContent) {
      tempContent = { id: generateGUID() };
    }
    // save the form and elements to local storage at the currentContentIndex
    const tcontent = { id: tempContent.id, form: form };
    console.log(JSON.stringify(tcontent));
    let newContent = [...content];
    newContent[currentContentIndex] = tcontent;
    
    const newState = {
      ...globalState,
      data: {
      ...globalState.data,
      tiles: newContent
      }
    };
    console.log("newState: ", newState);
    setGlobalState(newState);
    setStorageData(newState);
  };
  const handleSelectContent = (selectedIndex) => {
    setCurrentContentIndex(selectedIndex);
    setForm(content[selectedIndex].form);
    
    setIsModalOpen(false); // Close the modal
  };
  const handleDeleteContent = (indexToDelete) => {
    const newContent = content.filter((_, index) => index !== indexToDelete);
    setContent(newContent);
    // Optionally, reset currentContentIndex or adjust it if the current content is being deleted
    if (indexToDelete === currentContentIndex) {
      setCurrentContentIndex(0); // Reset to first content or handle appropriately
    } else if (indexToDelete < currentContentIndex) {
      setCurrentContentIndex(currentContentIndex - 1); // Adjust the index accordingly
    }
    // Save the updated content array to local storage or perform any other cleanup
    localStorage.setItem("subconnect-tiles", JSON.stringify(newContent));
  };
  const handleNewClick = () => {
    console.log("handleNewClick");
    const newContent = [...content];
    setForm({
      title: { text: "New", color: "#000000", fontSize: 16 },
      lines: [
        { lineType: "Text", text: "", color: "#000000", fontSize: 16 },
        // Add more lines here as needed
      ],
      icon: { text: "", iconSize: 16 },
    }); // clear the form
    
    newContent.push({ id: generateGUID(), form: form });
    setContent(newContent);
    setCurrentContentIndex(content.length);
    console.log(content);

  }
  useEffect(() => {
    console.log("globalState: ", globalState);
  }, [globalState]);
  return (
    <>
      <Button onClick={handleSaveClick}>Save</Button>
      <Button onClick={handleNewClick}>New</Button>
      <Button onClick={() => setIsModalOpen(true)}>Select Content</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ul>
          {content.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <button onClick={() => handleSelectContent(index)}>
                {item.form.title.text}
              </button>
              <button
                onClick={() => handleDeleteContent(index)}
                className="ml-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
      <main>
        <ShowTile key={JSON.stringify(form)} form={form} />

        <section className="ms-4">
          <h3>Title</h3>
          <div className="flex">
            <Input
              name="title"
              placeholder="Title"
              value={form.title.text}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-80 me-4"
            />
            <Input
              type="color"
              value={form.title.color}
              onChange={(e) => handleColorChange("title", e.target.value)}
              className="w-15 border-none"
            />
            <div className="flex items-center ms-4">
              <button
                onClick={() =>
                  handleFontSizeChange("title", form.title.fontSize - 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <input
                type="text"
                className="mx-2 text-center w-12"
                value={form.title.fontSize}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) {
                    handleFontSizeChange("title", e.target.value);
                  }
                }}
              />
              <button
                onClick={() =>
                  handleFontSizeChange("title", form.title.fontSize + 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          </div>
          <h3>Icon</h3>
          <div className="flex">
            <Input
              name="icon"
              type="textarea"
              placeholder="Paste SVG"
              value={form.icon.text}
              onChange={(e) => handleInputChange("icon", e.target.value)}
              className="w-2/3 me-4"
            />
            <div className="flex items-center">
              <button
                onClick={() =>
                  handleIconSizeChange("icon", form.icon.iconSize - 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                  />
                </svg>
              </button>
              <input
                type="text"
                className="mx-2 text-center w-12"
                value={form.icon.iconSize}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) {
                    handleIconSizeChange("icon", e.target.value);
                  }
                }}
              />
              <button
                onClick={() =>
                  handleIconSizeChange("icon", form.icon.iconSize + 1)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-5 mt-3">
            {form.lines.map((line, index) => (
              <div key={index} className="flex ">
                <select
                  name={`lineType${index}`}
                  value={line.lineType}
                  onChange={(e) => handleLineTypeChange(index, e.target.value)}
                  className="mr-2"
                >
                  <option value="Text">Text</option>
                  <option value="Data">Data</option>
                  <option value="Table">Table</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                </select>
                {line.lineType === "Text" ? (
                  <ConfigureTextLine
                    key={index}
                    line={line}
                    index={index}
                    handleLineUpdate={handleLineUpdate} // Pass handleLineUpdate as a prop
                  />
                ) : (
                  ""
                )}

                {line.lineType === "Data" ? (
                  <ConfigureDataLine
                    key={index}
                    line={line}
                    index={index}
                    handleLineUpdate={handleLineUpdate} // Pass handleLineUpdate as a prop
                  />
                ) : (
                  ""
                )}
                {line.lineType === "Table" ? (
                  <ConfigureTable
                    key={index}
                    line={line}
                    index={index}
                    handleLineUpdate={handleLineUpdate} 
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>

          <Button className="mt-3" variant="outline" onClick={addLine}>
            Add Line
          </Button>
        </section>
      </main>
    </>
  );
}

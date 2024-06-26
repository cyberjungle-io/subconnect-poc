"use client";
import React, { useEffect, useState, useContext } from "react";
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
import ConfigureVideo from "@/components/tiles/ConfigureVideo";
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
  const [tileWidth, setTileWidth] = useState(2);
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
  const [activeTab, setActiveTab] = useState("tab1");

  const handleInputChange = (lineIndex, value) => {
    if (lineIndex === "icon") {
      setForm((prevForm) => ({
        ...prevForm,
        icon: { ...prevForm.icon, text: value },
      }));
    } else if (lineIndex === "title") {
      setForm((prevForm) => ({
        ...prevForm,
        title: { ...prevForm.title, text: value },
      }));
    } else if (typeof lineIndex === "number") {
      setForm((prevForm) => {
        const newLines = [...prevForm.lines];
        if (newLines[lineIndex]) {
          newLines[lineIndex].text = value;
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
      if (lineIndex === "title") {
        return {
          ...prevForm,
          title: { ...prevForm.title, fontSize: parseInt(value, 10) },
        };
      } else if (lineIndex >= 0 && lineIndex < prevForm.lines.length) {
        const newLines = [...prevForm.lines];
        newLines[lineIndex].fontSize = parseInt(value, 10);
        return { ...prevForm, lines: newLines };
      }
      return prevForm;
    });
  };

  const handleIconSizeChange = (value) => {
    const minIconSize = 10;
    const maxIconSize = 60;

    if (value >= minIconSize && value <= maxIconSize) {
      setForm((prevForm) => ({
        ...prevForm,
        icon: { ...prevForm.icon, iconSize: parseInt(value, 10) },
      }));
    }
  };

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
          console.log("qry", qry);
          let newmappings = [];
          for (let i = 0; i < qry[0].variables.length; i++) {
            let m = {};
            m[qry[0].variables[i]] = "";
            newmappings.push(m);

            console.log("mappings", newmappings);
          }

          if (!qry) {
            qry = [];
          }
          (newLines[lineIndex] = {
            lineType: "Table",
            label: { text: "", color: "#000000", fontSize: 16 },
            value: {
              id: "",
              color: "#000000",
              fontSize: 16,
              dataQuery: qry[0],
              columns: [],
              mappings: newmappings,
            },
          }),
            (newLines[lineIndex].label.text = "");
          console.log("newLines[lineIndex]", newLines[lineIndex]);
        } else if (newValue === "Data") {
          (newLines[lineIndex] = {
            lineType: "Data",
            label: { text: "", color: "#000000", fontSize: 16 },
            value: {
              id: "",
              color: "#000000",
              fontSize: 16,
              dataQuery: {},
              mappings: [],
            },
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
        tiles: newContent,
      },
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
      title: { color: "#000000", fontSize: 16 },
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
  };
  useEffect(() => {
    console.log("globalState: ", globalState);
  }, [globalState]);

//Customize width of tile in editor
const increaseWidth = () => {
  setTileWidth(prevWidth => (prevWidth < 10 ? prevWidth + 2 : prevWidth));
};

const decreaseWidth = () => {
        setTileWidth(prevWidth => (prevWidth > 2 ? prevWidth - 2 : prevWidth));
    };

const tileClass = `w-${tileWidth}/12`;

const handleDeleteLine = (index) => {
  setForm(prevForm => {
    return {
      ...prevForm,
      lines: prevForm.lines.filter((_, lineIndex) => lineIndex !== index)
    };
  });
};

  return (
    <>
    <div className="bg-white w-full">
      <div className="bg-gray-100 pb-16">
      <div className="flex justify-between items-center p-4 rounded-lg ">
  <div className="flex space-x-2">
    <Button className="flex items-center justify-center bg-transparent border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white py-2 px-4 rounded transition duration-150 ease-in-out" onClick={() => setIsModalOpen(true)}>
      Select Content
    </Button>
    <Button className="flex items-center justify-center bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded transition duration-150 ease-in-out" onClick={handleNewClick}>
      New
    </Button>
  </div>
  <div>
    <Button className="flex items-center justify-center bg-green-500 border-2 border-green-500 text-white hover:bg-transparent hover:text-green-500 py-2 px-4 rounded transition duration-150 ease-in-out" onClick={handleSaveClick}>
      Save
    </Button>
  </div>
</div>



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
      
      <div className="flex justify-center relative">
            <div className={tileClass + "  relative"}>
                <ShowTile key={JSON.stringify(form)} form={form} />
                <div className="absolute inset-0 flex justify-between items-center px-3 py-2 opacity-0 hover:opacity-100 hover:border-2 rounded-lg hover:border-gray-600 bg-black bg-opacity-40 transition-opacity duration-300">
                <div className="absolute top-0 right-0 p-2">
                    
                    <div onClick={increaseWidth} disabled={tileWidth >= 12} className="text-white hover:text-green-700 font-bold py-1 px-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                    </div>
                    <div onClick={decreaseWidth} disabled={tileWidth <= 2} className="text-white hover:text-red-700 font-bold py-1 px-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
                        </svg>
                    </div>
                    </div>
                </div>
            </div>
        </div></div>
        <main>
        <section className="pt-4 flex-auto ">
          <div className="flex flex-col items-center justify-center w-full px-0">
            {/* Tab Navigation */}
            <div className="w-full">
            <div className="bg-white">
              {/* Tab Headers */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("tab1")}
                  className={`flex-1 py-3 px-6 text-center cursor-pointer ${
                    activeTab === "tab1"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Tile
                </button>
                <button
                  onClick={() => setActiveTab("tab2")}
                  className={`flex-1 py-3 px-6 text-center cursor-pointer ${
                    activeTab === "tab2"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Data
                </button>
              </div>
              {/* Tab Content */}
              <div className="p-5">
                {activeTab === "tab1" ? (
                  <div >
                    
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
                          onChange={(e) =>
                            handleInputChange("icon", e.target.value)
                          }
                          className="w-2/3 me-4"
                        />
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleIconSizeChange(
                                form.icon.iconSize - 1
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
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
                                handleIconSizeChange(e.target.value);
                              }
                            }}
                          />
                          <button
                            onClick={() =>
                              handleIconSizeChange(
                                form.icon.iconSize + 1
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 24 24"
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
                    </div>
                ) : (
                  <div>
                     <div className="space-y-5 mt-3">
            {form.lines.map((line, index) => (
              <div key={index} className="relative ">
                <select
                  name={`lineType${index}`}
                  value={line.lineType}
                  onChange={(e) => handleLineTypeChange(index, e.target.value)}
                  className="w-1/5 mb-2 py-2 px-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mr-2"
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
                {line.lineType === "Video" ? (
                  <ConfigureVideo
                    key={index}
                    line={line}
                    index={index}
                    handleLineUpdate={handleLineUpdate}
                  />
                ) : (
                  ""
                )}
                {form.lines.length > 1 && (
        <button
          onClick={() => handleDeleteLine(index)}
          className="absolute right-0 top-0 p-2 text-red-500 hover:text-red-700"
        >
          <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
        </button>
      )}
              </div>

              
            ))}

            
          </div>

          <Button className="mt-3" variant="outline" onClick={addLine}>
            Add Line
          </Button>
                  </div>
                )}
              </div>
            </div></div>
          </div>
        </section>
 
      </main>
    </div></>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { generateGUID } from "@/lib/utils";
import ShowChart from "@/components/custom/showChart";
import { Button } from "@/components/ui/button";
import ShowTile from "@/components/tiles/showTile";
import { GlobalStateContext } from "@/app/page";

import { setStorageData, getStorageData } from "@/lib/utils";
import { data } from "autoprefixer";

const uniqueId = (() => {
  console.log("Generating unique ID..."); // Diagnostic log
  let count = 0;
  return () => ++count;
})();

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getColSpanClass = (colSpan) => {
  switch (colSpan) {
    case 2:
      return "w-2/12";
    case 4:
      return "w-4/12";
    case 6:
      return "w-6/12";
    case 8:
      return "w-8/12";
    case 10:
      return "w-10/12";
    case 12:
      return "w-full";
    default:
      return "w-1/12";
  }
};

const Dashboard = () => {
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  
  const [rows, setRows] = useState([
    {
      id: generateGUID(),
      cells: [{ id: generateGUID(), colSpan: 2, content: {} }],
    },
  ]);
  const [content, setContent] = useState([]);
  const [tileContent, setTileContent] = useState([]);
  const [currentTileContentIndex, setCurrentTileContentIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [selectButtonState, setSelectButtonState] = useState({
    isOpen: false,
    buttonBottom: 28, // Initial bottom position
  });
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isTileModalOpen, setIsTileModalOpen] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const openChartModal = (chartId) => {
    setSelectedChartId(chartId);
    setIsChartModalOpen(true);
  };
  const openTileModal = (chartId) => {
    setSelectedTileId(chartId);
    setIsTileModalOpen(true);
  };
  const handleSelectChart = (contentId) => {
    //get content record from the content array using the contentId
    const selectedContent = content.find((item) => item.id === contentId);
    console.log(selectedContent);
    let newRows = rows;
    for (let x = 0; x < newRows.length; x++) {
      for (let y = 0; y < newRows[x].cells.length; y++) {
        if (newRows[x].cells[y].id === selectedChartId) {
          newRows[x].cells[y].contentType = "chart";
          newRows[x].cells[y].content = selectedContent;
        }
      }
    }

    setRows(newRows);
    setIsChartModalOpen(false);
    console.log("handleSelectChart");
    console.log(newRows);
  };
  const handleSelectTile = (contentId) => {
    //get content record from the content array using the contentId
    const selectedTileContent = tileContent.find(
      (item) => item.id === contentId
    );
    console.log("selected Tile:", selectedTileContent);
    let newRows = rows;
    for (let x = 0; x < newRows.length; x++) {
      for (let y = 0; y < newRows[x].cells.length; y++) {
        if (newRows[x].cells[y].id === selectedTileId) {
          newRows[x].cells[y].contentType = "tile";
          newRows[x].cells[y].content = selectedTileContent;
        }
      }
    }
    console.log("newRows", newRows);
    setRows(newRows);
    setIsTileModalOpen(false);
    console.log("handleSelectTile");
    console.log(newRows);
  };
  function ChartSelectModal({ isOpen, content, onSelect, onClose }) {
    if (!isOpen) return null;
    console.log("ChartSelectModal");
    console.log(content);
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <h2>Select Content</h2>
          <ul>
            {content.map((item) => (
              <li
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {item.form.title.text} {/* Assuming each content has a title */}
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  function TileSelectModal({ isOpen, content, onSelect, onClose }) {
    if (!isOpen) return null;
    console.log("ChartSelectModal");
    console.log(content);
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <h2>Select Tiles</h2>
          <ul>
            {content.map((item) => (
              <li
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {item.form.title.text} {/* Assuming each content has a title */}
              </li>
            ))}
          </ul>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Save to local storage
  const saveLocalDashboard = () => {
    const newState = {
      ...globalState,
      data: {
        ...globalState.data,
        dashboards: globalState.data.dashboards.map((dashboard, index) => {
          if (index === globalState.data.currentDashboard) {
            return { ...dashboard, dashboard: rows };
          }
          return dashboard;
        }),
      },
    };

    console.log("newState: ", newState);
    setGlobalState(newState);
    setStorageData(newState);
    //setStorageData(globalState);
  };

  const getLocalStorageContent = async () => {
    //console.log("getLocalStorage")
    try {
      if (localStorage.getItem("subconnect")) {
        const acct = JSON.parse(localStorage.getItem("subconnect"));
        console.log("Account:", acct);
        let gs = await getStorageData(acct.address);
        console.log("GS:", gs);
        if (!gs) {
          gs = {
            account_id: acct.address,
            key: "subconnect-poc",
            data: {
              tiles: [],
              charts: [],
              currentDashboard: 0,
              dashboards: [
                {
                  name: "Main",
                  dashboard: [],
                },
              ],
            },
          };
        }
        setGlobalState(gs);
        setContent(gs.data.charts);
        console.log("charts:", gs.data.charts);
        setTileContent(gs.data.tiles);
        if (gs.data.dashboards[gs.data.currentDashboard].dashboard.length > 0) {
          setRows(gs.data.dashboards[gs.data.currentDashboard].dashboard);
        }
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // Find the source and destination rows by ID
    const sourceRow = rows.find(
      (row) => row.id === parseInt(source.droppableId)
    );
    const destinationRow = rows.find(
      (row) => row.id === parseInt(destination.droppableId)
    );

    if (source.droppableId === destination.droppableId) {
      // Moving within the same row
      const newRowcells = reorder(
        sourceRow.cells,
        source.index,
        destination.index
      );
      const newRows = rows.map((row) => {
        if (row.id === sourceRow.id) {
          return { ...row, cells: newRowcells };
        }
        return row;
      });
      setRows(newRows);
    } else {
      // Moving to a different row
      const sourcecells = Array.from(sourceRow.cells);
      const [removed] = sourcecells.splice(source.index, 1);
      const destinationcells = Array.from(destinationRow.cells);
      destinationcells.splice(destination.index, 0, removed);

      const newRows = rows.map((row) => {
        console.log("Row:", row); // Diagnostic log
        if (row.id === sourceRow.id) {
          return { ...row, cells: sourcecells };
        } else if (row.id === destinationRow.id) {
          return { ...row, cells: destinationcells };
        }
        return row;
      });

      setRows(newRows);
    }
  };

  const addChart = (event) => {
    console.log("Adding chart..."); // Diagnostic log

    const currentRows = rows;
    console.log("Current rows before adding:", currentRows); // Log current state before adding
    const newRows = [...currentRows];
    const lastRow = newRows[newRows.length - 1];
    const totalColSpan = lastRow.cells.reduce(
      (sum, chart) => sum + chart.colSpan,
      0
    );

    if (totalColSpan + 2 <= 12) {
      lastRow.cells.push({ id: generateGUID(), colSpan: 2, content: {} });
    } else {
      newRows.push({
        id: uniqueId(),
        cells: [{ id: generateGUID(), colSpan: 2, content: {} }],
      });
    }

    console.log("New rows after adding:", newRows); // Log new state after adding
    setRows(newRows);

    console.log("Chart added."); // Diagnostic log
  };

  const addRow = () => {
    console.log("Adding row..."); // Diagnostic log
    setRows((currentRows) => [...currentRows, { id: uniqueId(), cells: [] }]);
  };

  const extendChart = (rowId, chartId) => {
    console.log("Extending chart..."); // Diagnostic log
    setRows((currentRows) => {
      return currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.map((chart) => {
              if (chart.id === chartId && chart.colSpan < 12) {
                const newColSpan = chart.colSpan + 2;
                return { ...chart, colSpan: newColSpan };
              }
              return chart;
            }),
          };
        }
        return row;
      });
    });
  };
  const addChartToRow = (rowId) => {
    setRows((currentRows) => {
      return currentRows.map((row) => {
        if (row.id === rowId) {
          const totalColSpan = row.cells.reduce(
            (sum, chart) => sum + chart.colSpan,
            0
          );
          let newColSpan = 2; // Default new chart colSpan
          // Check if adding a new chart exceeds the row limit
          if (totalColSpan + newColSpan <= 12) {
            return {
              ...row,
              cells: [
                ...row.cells,
                { id: generateGUID(), colSpan: newColSpan, content: {} },
              ],
            };
          } else {
            // Optional: Adjust existing cells or notify the user
          }
        }
        return row;
      });
    });
  };

  const shrinkChart = (rowId, chartId) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.map((chart) => {
              if (chart.id === chartId && chart.colSpan > 2) {
                return { ...chart, colSpan: chart.colSpan - 2 };
              }
              return chart;
            }),
          };
        }
        return row;
      })
    );
  };

  const deleteChart = (rowId, chartId) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.filter((chart) => chart.id !== chartId),
          };
        }
        return row;
      })
    );
  };
  useEffect(() => {
    console.log("useEffect getLocalStorageContent");
    getLocalStorageContent();
  }, []);
  useEffect(() => {
    console.log("globalState: ", globalState);
  }, [globalState]);
  useEffect(() => {
    console.log("content");
    console.log(content);
  }, [content]);
  useEffect(() => {
    console.log("rows: ", rows);
  }, [rows]);

  const handleSaveClick = () => {
    saveLocalDashboard();
    setEditMode(false);
  };
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };
  // Function to handle deletion of a row
  const deleteRow = (rowId) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };
  const handleDashboardChange = (index) => {
    if (index !== globalState.data.currentDashboard) {
      const newState = {
        ...globalState,
        data: {
          ...globalState.data,
          currentDashboard: parseInt(index),
        },
      };
      console.log("newState: ", newState);
      setGlobalState(newState);
      setSelectButtonState(prev => ({ ...prev, isOpen: false }));
      setRows(globalState.data.dashboards[index].dashboard);

    }
  };
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setSelectButtonState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  // Adjust the button position based on scroll and window size
  useEffect(() => {
    const adjustButtonPosition = () => {
      window.requestAnimationFrame(() => {
        const scrolledFromBottom =
          document.documentElement.scrollHeight -
          window.scrollY -
          window.innerHeight;
        const newBottom =
          scrolledFromBottom < 100 ? 100 - scrolledFromBottom : 28;
        setSelectButtonState((prevState) => ({
          ...prevState,
          buttonBottom: newBottom,
        }));
      });
    };

    window.addEventListener("scroll", adjustButtonPosition);
    window.addEventListener("resize", adjustButtonPosition);

    return () => {
      window.removeEventListener("scroll", adjustButtonPosition);
      window.removeEventListener("resize", adjustButtonPosition);
    };
  }, []);
  const addDashboard = () => {
    const newDashboard = {
      name: `Dashboard ${globalState.data.dashboards.length + 1}`, // Simple naming strategy
      dashboard: [], // Start with an empty dashboard configuration
    };
    const newState = {
      ...globalState,
      data: {
        ...globalState.data,
        dashboards: [...globalState.data.dashboards, newDashboard],
        currentDashboard: globalState.data.dashboards.length, // Set the newly added dashboard as the current one
      },
    };
    setGlobalState(newState); // Update global state
    setRows([]); // Since the new dashboard is empty, set rows to an empty array
  };
  return (
    <>
      <div className="flex justify-end pt-2 pe-3">
        <button onClick={addDashboard} className="btn btn-primary ml-2">
          Add Dashboard
        </button>
        {editMode ? (
          <Button
            className="mr-2 flex items-center justify-center bg-green-500 border-2 border-green-500 text-white hover:bg-transparent hover:text-green-500 py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={handleSaveClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                clipRule="evenodd"
              />
            </svg>
            Save
          </Button>
        ) : (
          ""
        )}
        {editMode ? (
          <Button
            className="flex items-center justify-center bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={handleToggleEditMode}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
            Cancel
          </Button>
        ) : (
          <div>
            <Button
              onClick={handleToggleEditMode}
              className="flex items-center justify-center bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 pe-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                />
              </svg>
              Edit
            </Button>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <ChartSelectModal
          isOpen={isChartModalOpen}
          content={content}
          onSelect={handleSelectChart}
          onClose={() => setIsChartModalOpen(false)}
        />
        <TileSelectModal
          isOpen={isTileModalOpen}
          content={tileContent}
          onSelect={handleSelectTile}
          onClose={() => setIsTileModalOpen(false)}
        />
        {rows.map((row, rowIndex) => (
          <Droppable
            key={row.id}
            droppableId={`${row.id}`}
            direction="horizontal"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap mb-4"
              >
                {row.cells.map((cell, cellIndex) => (
                  <Draggable
                    key={cell.id}
                    draggableId={`${cell.id}`}
                    index={cellIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`px-3 mb-6 flex justify-center items-center ${getColSpanClass(
                          cell.colSpan
                        )}`}
                      >
                        <div className="flex justify-between items-center p-4 w-full">
                          {cell.contentType === "chart" ? (
                            <ShowChart chart={cell.content} />
                          ) : (
                            ""
                          )}
                          {cell.contentType === "tile" ? (
                            <ShowTile
                              key={JSON.stringify(cell.content.form)}
                              form={cell.content.form}
                            />
                          ) : (
                            ""
                          )}
                          {editMode ? (
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => openChartModal(cell.id)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded "
                              >
                                Select Chart
                              </button>
                              <button
                                onClick={() => openTileModal(cell.id)}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                              >
                                Select Tile
                              </button>

                              {cell.colSpan < 12 && (
                                <button
                                  onClick={() => extendChart(row.id, cell.id)}
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                >
                                  Extend
                                </button>
                              )}
                              {cell.colSpan > 2 && (
                                <button
                                  onClick={() => shrinkChart(row.id, cell.id)}
                                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                >
                                  Shrink
                                </button>
                              )}
                              <button
                                onClick={() => deleteChart(row.id, cell.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {editMode &&
                  row.cells.reduce((sum, chart) => sum + chart.colSpan, 0) <=
                    10 && (
                    <button
                      onClick={() => addChartToRow(row.id)} // Modify this function to add a chart to the specific row
                      type="button"
                      className="bg-black bg-opacity-40 hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded w-1/12 flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  )}
                {editMode && row.cells.length === 0 && (
                  <div
                    className="bg-transparent hover:bg-transparent hover:text-red-700 text-red-500 font-bold py-2 px-4 rounded cursor-pointer flex justify-center items-center "
                    onClick={() => deleteRow(row.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
        {editMode ? (
          <button
            onClick={addRow}
            className="bg-black mx-auto bg-opacity-40 hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded w-5/6 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        ) : (
          ""
        )}
      </DragDropContext>
      <div
        style={{
          position: "fixed",
          bottom: `${selectButtonState.buttonBottom}px`,
          right: "10px",
          zIndex: 50,
        }}
      >
        <button
          onClick={toggleDropdown}
          className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none"
          aria-label="Select Dashboard"
        >
          {selectButtonState.isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg> // X icon for closing
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
              />
            </svg>
          )}
        </button>

        {selectButtonState.isOpen && (
          <div className="absolute right-0 bottom-20 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {globalState.data.dashboards.map((dashboard, index) => (
                <button
                  key={index}
                  className={`text-gray-700 block px-4 py-2 text-sm w-full text-left ${
                    index === globalState.data.currentDashboard
                      ? "bg-blue-100"
                      : ""
                  }`}
                  role="menuitem"
                  onClick={() => handleDashboardChange(index)} // Directly passing index
                >
                  {dashboard.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;

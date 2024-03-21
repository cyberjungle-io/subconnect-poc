import React, { use, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { generateGUID } from "@/lib/utils";
import ShowChart from "@/components/custom/showChart";
import { Button } from "@/components/ui/button";
import ShowTile from "@/components/tiles/showTile";
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

const NewDashboard = () => {
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
    const selectedTileContent = tileContent.find((item) => item.id === contentId);
    console.log("selected Tile:" , selectedTileContent);
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
              <li key={item.id} onClick={() => onSelect(item.id)} className="cursor-pointer hover:bg-gray-100 p-2">
                {item.form.title.text} {/* Assuming each content has a title */}
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
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
              <li key={item.id} onClick={() => onSelect(item.id)} className="cursor-pointer hover:bg-gray-100 p-2">
                {item.form.title.text} {/* Assuming each content has a title */}
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }
  const getLocalDashboard = () => {
    //console.log("getLocalStorage");
    if (localStorage.getItem("subconnect-dashboard")) {
      const savedRows = JSON.parse(
        localStorage.getItem("subconnect-dashboard")
      );
      setRows(savedRows);
    }
  };
  // Save to local storage
const saveLocalDashboard = () => {
  console.log("saveLocalDashboard");
  
  localStorage.setItem("subconnect-dashboard", JSON.stringify(rows));
};

  const getLocalStorageContent = () => {
    //console.log("getLocalStorage");
    if (localStorage.getItem("subconnect-content")) {
      const savedContent = JSON.parse(
        localStorage.getItem("subconnect-content")
      );
      console.log(savedContent);
      setContent(savedContent);
      setCurrentContentIndex(0);
      }
      if (localStorage.getItem("subconnect-tiles")) {
        const savedTileContent = JSON.parse(
          localStorage.getItem("subconnect-tiles")
        );
        console.log("tile Content:" ,savedTileContent);
        setTileContent(savedTileContent);
        setCurrentTileContentIndex(0);

      
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
    getLocalStorageContent();
    getLocalDashboard();
  }, []);
  useEffect(() => {
    console.log("content");
    console.log(content);
  }, [content]);
  useEffect(() => {
    console.log("rows");
    console.log(rows);
  }, [rows]);

  const handleSaveClick = () => {
    saveLocalDashboard();
    setEditMode(false);
  };
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };
  return (
    <>
    {editMode ? <Button onClick={handleSaveClick}>Save</Button> : ""}
    {editMode ? <Button onClick={handleToggleEditMode}>Cancel</Button> : <Button onClick={handleToggleEditMode}>Edit</Button>}
    
    
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
                      <div className="border rounded flex justify-between items-center p-4 w-full">
                        {cell.contentType === "chart" ? (
                        <ShowChart chart={cell.content} />
                      ) : ("" )}
                      {cell.contentType === "tile" ? (
                        <ShowTile key={JSON.stringify(cell.content.form)} form={cell.content.form} />
                      ) : ("" )}
                        {editMode ?
                        <div className="flex flex-col space-y-2">
                          <button 
                          onClick={() => openChartModal(cell.id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                            Select Chart
                          </button>
                          <button 
                          onClick={() => openTileModal(cell.id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
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
                        : ""}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              
              {editMode && row.cells.reduce((sum, chart) => sum + chart.colSpan, 0) <=
                10 && (
                  
                <button
                  onClick={() => addChartToRow(row.id)} // Modify this function to add a chart to the specific row
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Cell
                </button>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
      {editMode ? 
      <button
        onClick={addRow}
        className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Row
      </button>: ""}
    </DragDropContext></>
  );
};

export default NewDashboard;

import React, { use, useState,useEffect} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { generateGUID } from "@/lib/utils";
import ShowChart from "@/components/custom/showChart";
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
    { id: generateGUID(), charts: [{ id: generateGUID(), colSpan: 2 ,content: {}}] },
  ]);
  const [content, setContent] = useState([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedChartId, setSelectedChartId] = useState(null);
const openModal = (chartId) => {
  setSelectedChartId(chartId);
  setIsModalOpen(true);
};
const handleSelectContent = (contentId) => {
  //get content record from the content array using the contentId
  const selectedContent = content.find((item) => item.id === contentId);
  console.log(selectedContent)
  let newRows = rows;
  for (let x = 0; x < newRows.length; x++) {
    for (let y = 0; y < newRows[x].charts.length; y++) {
      if (newRows[x].charts[y].id === selectedChartId) {
        newRows[x].charts[y].content = selectedContent;
      }
    }
  }

  

  setRows(newRows);
  setIsModalOpen(false);
  console.log("handleSelectContent")
  console.log(newRows)
};
function ContentSelectModal({ isOpen, content, onSelect, onClose }) {
  if (!isOpen) return null;
console.log("ContentSelectModal")
console.log(content)
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Select Content</h2>
        <ul>
          {content.map((item) => (
            <li key={item.id} onClick={() => onSelect(item.id)}>
              {item.form.title.text} {/* Assuming each content has a title */}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

  const getLocalStorageContent =   () => {
    //console.log("getLocalStorage");
    if (localStorage.getItem("subconnect-content")) {
      const savedContent = JSON.parse(localStorage.getItem("subconnect-content"));
      console.log(savedContent);
      setContent(savedContent);
      setCurrentContentIndex(0)
      //setForm(savedContent[0].form);
      
      //setElements(savedContent[0].elements);
      
      
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
      const newRowCharts = reorder(
        sourceRow.charts,
        source.index,
        destination.index
      );
      const newRows = rows.map((row) => {
        if (row.id === sourceRow.id) {
          return { ...row, charts: newRowCharts };
        }
        return row;
      });
      setRows(newRows);
    } else {
      // Moving to a different row
      const sourceCharts = Array.from(sourceRow.charts);
      const [removed] = sourceCharts.splice(source.index, 1);
      const destinationCharts = Array.from(destinationRow.charts);
      destinationCharts.splice(destination.index, 0, removed);

      const newRows = rows.map((row) => {
        console.log("Row:", row); // Diagnostic log
        if (row.id === sourceRow.id) {
          return { ...row, charts: sourceCharts };
        } else if (row.id === destinationRow.id) {
          return { ...row, charts: destinationCharts };
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
    const totalColSpan = lastRow.charts.reduce(
      (sum, chart) => sum + chart.colSpan,
      0
    );

    if (totalColSpan + 2 <= 12) {
      lastRow.charts.push({ id: uniqueId(), colSpan: 2 });
    } else {
      newRows.push({
        id: uniqueId(),
        charts: [{ id: uniqueId(), colSpan: 2 }],
      });
    }

    console.log("New rows after adding:", newRows); // Log new state after adding
    setRows(newRows);

    console.log("Chart added."); // Diagnostic log
  };

  const addRow = () => {
    console.log("Adding row..."); // Diagnostic log
    setRows((currentRows) => [...currentRows, { id: uniqueId(), charts: [] }]);
  };

  const extendChart = (rowId, chartId) => {
    console.log("Extending chart..."); // Diagnostic log
    setRows((currentRows) => {
      return currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            charts: row.charts.map((chart) => {
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
    const newRows = rows.map((row) => {
      if (row.id === rowId) {
        const totalColSpan = row.charts.reduce(
          (sum, chart) => sum + chart.colSpan,
          0
        );
        if (totalColSpan + 2 <= 12) {
          return {
            ...row,
            charts: [...row.charts, { id: uniqueId(), colSpan: 2 }],
          };
        }
      }
      return row;
    });
    setRows(newRows);
  };

  const shrinkChart = (rowId, chartId) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            charts: row.charts.map((chart) => {
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
            charts: row.charts.filter((chart) => chart.id !== chartId),
          };
        }
        return row;
      })
    );
  };
  useEffect(() => {
    getLocalStorageContent();
  }, []);
  useEffect(() => {
    console.log("content");
    console.log(content);
  }, [content]);
  useEffect(() => {
    console.log("rows");
    console.log(rows);
  }, [rows]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ContentSelectModal
  isOpen={isModalOpen}
  content={content}
  onSelect={handleSelectContent}
  onClose={() => setIsModalOpen(false)}
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
              {row.charts.map((chart, chartIndex) => (
                <Draggable
                  key={chart.id}
                  draggableId={`${chart.id}`}
                  index={chartIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`px-3 mb-6 flex justify-center items-center ${getColSpanClass(
                        chart.colSpan
                      )}`}
                    >
                      <div className="border rounded flex justify-between items-center p-4 w-full">
                        <ShowChart chart={chart.content} />
                        <div className="flex flex-col space-y-2">
                          
                        <button onClick={() => openModal(chart.id)}>Select Content</button>

                          {chart.colSpan < 12 && (
                            <button
                              onClick={() => extendChart(row.id, chart.id)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Extend
                            </button>
                          )}
                          {chart.colSpan > 2 && (
                            <button
                              onClick={() => shrinkChart(row.id, chart.id)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Shrink
                            </button>
                          )}
                          <button
                            onClick={() => deleteChart(row.id, chart.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {row.charts.reduce((sum, chart) => sum + chart.colSpan, 0) <=
                10 && (
                <button
                  onClick={() => addChartToRow(row.id)} // Modify this function to add a chart to the specific row
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Chart
                </button>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}

      <button
        onClick={addRow}
        className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Row
      </button>
    </DragDropContext>
  );
};

export default NewDashboard;

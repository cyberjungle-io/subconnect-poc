import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    { id: uniqueId(), charts: [{ id: uniqueId(), colSpan: 2 }] },
  ]);

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
              if (chart.id === chartId && chart.colSpan < 10) {
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                        <span>Chart {chart.id}</span>
                        <button
                          onClick={() => extendChart(row.id, chart.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Extend
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
      <button
        onClick={(event) => addChart(event)}
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Chart
      </button>

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

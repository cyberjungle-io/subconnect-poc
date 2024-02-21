import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const uniqueId = (() => {
  let count = 0;
  return () => ++count;
})();

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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

    if (source.droppableId === destination.droppableId) {
      const row = rows.find((row) => row.id === parseInt(source.droppableId));
      const charts = reorder(row.charts, source.index, destination.index);

      setRows(
        rows.map((row) => {
          if (row.id === parseInt(source.droppableId)) {
            return { ...row, charts };
          }
          return row;
        })
      );
    } else {
      // Handle dragging between different rows if needed
    }
  };

  const addChart = () => {
    setRows((currentRows) => {
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

      return newRows;
    });
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, { id: uniqueId(), charts: [] }]);
  };
  // This function is responsible for extending a chart's column span by 2, up to a maximum of 10.
  const extendChart = (rowId, chartId) => {
    setRows((currentRows) => {
      return currentRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            charts: row.charts.map((chart) => {
              if (chart.id === chartId && chart.colSpan < 10) {
                return { ...chart, colSpan: chart.colSpan + 2 };
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
          droppableId={String(row.id)}
          direction="horizontal"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap -mx-3 mb-4"
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "lightblue"
                  : "inherit",
              }}
            >
              {row.charts.map((chart, index) => (
                <Draggable
                  key={chart.id}
                  draggableId={String(chart.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`px-3 mb-6 md:w-1/${Math.ceil(
                        12 / chart.colSpan
                      )} flex justify-center items-center`}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
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
        onClick={addChart}
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

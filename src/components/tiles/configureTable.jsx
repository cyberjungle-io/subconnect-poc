import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { graphArray, fetchValueData } from "@/lib/graphdata";

export default function ConfigureTable({ line, index, handleLineUpdate }) {
  const [newline, setNewLine] = useState(line);

  const handleInputChangeLabel = (value, idx, field) => {
    const newColumns = [...newline.value.columns];
    const updatedColumn = { ...newColumns[idx].label, [field]: value };
    newColumns[idx].label = updatedColumn;
    setNewLine({
      ...newline,
      value: { ...newline.value, columns: newColumns },
    });
  };
  const formatType = ["round", "rTrim", "lTrim", "date", "time", "dateTime"];

  const handleInputChangeHeader = (value, idx, field) => {
    const newColumns = [...newline.value.columns];
    const updatedColumn = { ...newColumns[idx].header, [field]: value };
    newColumns[idx].header = updatedColumn;
    setNewLine({
      ...newline,
      value: { ...newline.value, columns: newColumns },
    });
  };

  const handleDropdownChange = (value, idx) => {
    const newColumns = [...newline.value.columns];
    const columnKey = newline.value.dataQuery.columns.find(
      (col) => Object.values(col)[0] === value
    );
    newColumns[idx].selectedField = value; // Store the value
    newColumns[idx].label.text = Object.keys(columnKey)[0]; // Assuming you want to store the column key as label text
    setNewLine({
      ...newline,
      value: { ...newline.value, columns: newColumns },
    });
  };

  const handleAddColumn = () => {
    const newColumns = [
      ...newline.value.columns,
      {
        label: {
          text: "",
          color: "",
          fontSize: "",
          preText: "",
          postText: "",
          format: "",
          formatValue: "",
        },
        header: { text: "", color: "", fontSize: "" },
        selectedField: "", // Initial selected field
      },
    ];
    setNewLine({
      ...newline,
      value: { ...newline.value, columns: newColumns },
    });
  };
  const handleFormatChange = (value, idx) => {
    const newColumns = [...newline.value.columns];
    newColumns[idx].label.format = value;
    setNewLine({
      ...newline,
      value: { ...newline.value, columns: newColumns },
    });
  };
  const handleInputChangeMappings = (value, idx, field) => {
    const newMappings = [...newline.value.mappings];
    const updatedMapping = {
      ...newMappings[idx],
      [Object.keys(newMappings[idx])[0]]: value,
    };
    newMappings[idx] = updatedMapping;
    setNewLine({
      ...newline,
      value: { ...newline.value, mappings: newMappings },
    });
  };

  const handleGraphElementChange = (index, field) => async (event) => {
    console.log("field", field);
    console.log("event", event.target.value);
    console.log("index", index);
    const dta = graphArray.find((item) => item.id === event.target.value);
    console.log("dta", dta);
    let newmappings = [];
    //input alert a string
    for (let i = 0; i < dta.variables.length; i++) {
      let v = dta.variables[i];

      let m = {};
      m[dta.variables[i]] = "";
      newmappings.push(m);

      console.log("mappings", newmappings);
    }
  };
  useEffect(() => {
    handleLineUpdate(index, newline);
  }, [newline]);
  function titleCase(string) {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex-1 p-2">
            <h3>Data Query</h3>
            <select
              className="w-auto md:w-3/4 py-2 px-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={newline.value.id}
              onChange={handleGraphElementChange(index)}
            >
              {graphArray
                .filter((item) => item.queryType === "table")
                .map((item, idx) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex-1 p-2">
            {newline.value.mappings.map((item, idx) => (
              <div key={idx} className="flex flex-col mb-4">
                <h3>{titleCase(Object.keys(item)[0])}</h3>
                <Input
                  value={item[Object.keys(item)[0]]}
                  className="w-1/5 py-2 px-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) =>
                    handleInputChangeMappings(e.target.value, idx, "text")
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg shadow">
          {newline.value.columns.map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-center space-x-4 bg-white p-3 shadow-md rounded-lg border-2 border-gray-300">
              <div className="flex-1 min-w-0">
              <Label>Column Header</Label>
              <Input
                value={item.header.text}
                className="w-full py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) =>
                  handleInputChangeHeader(e.target.value, idx, "text")
                }
              />
              </div>
              <div className="flex-1 min-w-0">
              <Label>Column Name</Label>
              <select
                className="w-full py-1 px-2 text-sm border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={item.selectedField || ""} // Use selectedField to maintain dropdown state
                onChange={(e) => handleDropdownChange(e.target.value, idx)}
              >
                {newline.value.dataQuery.columns.map((col) => (
                  <option
                    key={Object.values(col)[0]}
                    value={Object.values(col)[0]}
                  >
                    {Object.keys(col)[0]}
                  </option>
                ))}
              </select>
                  </div>
                  <div className="flex items-center space-x-2">
              <Label>Column Color</Label>
              <input
                type="color"
                value={item.label.color}
                onChange={(e) =>
                  handleInputChangeLabel(e.target.value, idx, "color")
                }
                className="w-12 h-8 p-0 border-none rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
              />
              </div>
              <div className="flex items-center space-x-2">
              <Label>Column Font Size</Label>
             
                <input
                  type="range"
                  min="8"
                  max="36"
                  value={item.label.fontSize}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  onChange={(e) =>
                    handleInputChangeLabel(e.target.value, idx, "fontSize")
                  }
                  
                />
                <span className="text-sm">{item.label.fontSize}px</span>
              </div>
              <div className="flex-1 min-w-0">
              <Label>Column PreText</Label>
              <Input
                value={item.label.preText}
                className="w-full py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) =>
                  handleInputChangeLabel(e.target.value, idx, "preText")
                }
              />
              </div>
              <div className="flex-1 min-w-0">
              <Label>Column PostText</Label>
              <Input
                value={item.label.postText}
                className="w-full py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) =>
                  handleInputChangeLabel(e.target.value, idx, "postText")
                }
              />
              </div>
              <div className="flex-1 min-w-0">
              <Label>Format Type</Label>
              <select
                className="w-full py-1 px-2 text-sm border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={item.label.format || ""}
                onChange={(e) => handleFormatChange(e.target.value, idx)}
              >
                {formatType.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              </div>
              <div className="flex-1 min-w-0">
              <Label>Format Value</Label>
              <Input
                value={item.label.formatValue}
                className="w-full py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onChange={(e) =>
                  handleInputChangeLabel(e.target.value, idx, "formatValue")
                }
              />
              </div>
            </div>
          ))}
          <Button onClick={handleAddColumn}>Add Column</Button>
        </div>
      </div>
    </>
  );
}

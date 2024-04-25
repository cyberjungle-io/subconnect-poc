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
  const formatType = ["round","rTrim","lTrim","date","time","dateTime"]

  
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
        label: { text: "", color: "", fontSize: "",preText:"",postText:"",format:"",formatValue:"" },
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
      
      const prmpt = `please enter ${v}`;
      let userInput = prompt(prmpt, "");
      if (userInput == null || userInput == "") {
        alert("User cancelled the prompt.");
      } else {
        
        let m = {  }
        m[dta.variables[i]] = userInput;
        newmappings.push(m);
        //let rplc = "<<" + selectedObject.variables[i] + ">>";
        //qry = qry.replace(rplc, userInput);
      }
      console.log("mappings", newmappings);
    }
  };
  useEffect(() => {
    handleLineUpdate(index, newline);
  }, [newline]);
  return (
    <>
    <div className="flex flex-col">
      <Label>Data Query:</Label>
      <select
        className="w-80 form-select"
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
    <div className="flex flex-col">
      {newline.value.columns.map((item, idx) => (
        <div key={idx} className="flex">
          <Label>Column Header:</Label>
          <Input
            value={item.header.text}
            onChange={(e) =>
              handleInputChangeHeader(e.target.value, idx, "text")
            }
          />
          <Label>Column Name:</Label>
          <select
            className="w-full form-select"
            value={item.selectedField || ""} // Use selectedField to maintain dropdown state
            onChange={(e) => handleDropdownChange(e.target.value, idx)}
          >
            {newline.value.dataQuery.columns.map((col) => (
              <option key={Object.values(col)[0]} value={Object.values(col)[0]}>
                {Object.keys(col)[0]}
              </option>
            ))}
          </select>

          <Label>Column Color:</Label>
          <Input
            value={item.label.color}
            onChange={(e) =>
              handleInputChangeLabel(e.target.value, idx, "color")
            }
          />
          <Label>Column Font Size:</Label>
          <Input
            value={item.label.fontSize}
            onChange={(e) =>
              handleInputChangeLabel(e.target.value, idx, "fontSize")
            }
          />
          <Label>Column PreText:</Label>
          <Input
            value={item.label.preText}
            onChange={(e) =>
              handleInputChangeLabel(e.target.value, idx, "preText")
            }
          />
          <Label>Column PostText:</Label>
          <Input
            value={item.label.postText}
            onChange={(e) =>
              handleInputChangeLabel(e.target.value, idx, "postText")
            }
          />
           <Label>Format Type:</Label>
            <select className="w-full form-select" value={item.label.format || ""} onChange={(e) => handleFormatChange(e.target.value, idx)}>
              {formatType.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Label>Format Value:</Label>
          <Input
            value={item.label.formatValue}
            onChange={(e) =>
              handleInputChangeLabel(e.target.value, idx, "formatValue")
            }
          />
        </div>
      ))}
      <Button onClick={handleAddColumn}>Add Column</Button>
    </div></>
  );
}

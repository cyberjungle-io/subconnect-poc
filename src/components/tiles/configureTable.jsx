"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";
import { graphArray, fetchValueData } from "@/lib/graphdata";

export default function ConfigureTable({ line, index, handleLineUpdate }) {
  const [graphQuery, setGraphQuery] = useState(
    graphArray.filter((item) => item.queryType === "table"))
  ;
  //graphArray.filter((item) => item.queryType === "table");
  const [newline, setNewLine] = useState(line);

  const handleInputChange = (value) => {
    console.log("value", value);
    setNewLine({ ...newline, label: { ...newline.label, text: value } });
  };

  function handleColorChange(value) {
    setNewLine({ ...newline, label: { ...newline.label, color: value } });
  }
  const handleFontSizeChange = (value) => {
    
    setNewLine({ ...newline, label: { ...newline.label, fontSize: value } });
  };
  useEffect(() => {
    handleLineUpdate(index, newline);
  }, [newline]);

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
    const updatedNewline = {
      ...newline,
      value: {
          ...newline.value,
          dataQuery: dta,
          mappings: newmappings
      }
  };
  console.log("updatedNewline", updatedNewline);
    setNewLine(updatedNewline);
    
    
     console.log("newline", newline);
    console.log("after fetch data")
  };
  return (
    <>
    
     
      <div className="row">
      <Label>Data Key:</Label>
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
      </select></div>
      <div className="row">test</div>
    </>
  );
}

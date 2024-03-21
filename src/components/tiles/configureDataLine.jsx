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

export default function ConfigureTextLine({ line, index, handleLineUpdate }) {
  const [graphQuery, setGraphQuery] = useState(
    graphArray.reduce((acc, item) => {
      if (item.queryType === "value") {
        return { ...acc, [item]: "" };
      }
      return acc;
    }, {})
  );
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
    setNewLine({ ...newline, value: { ...newline.value, id : event.target.value,dataQuery: dta } });
    
    console.log("after fetch data")
  };
  return (
    <>
      <Input
        name={`lineText`}
        placeholder={`Enter Label`}
        value={newline.label.text}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-80 me-4 "
      />
      <Input
        name={`lineColor`}
        type="color"
        value={newline.label.color}
        onChange={(e) => handleColorChange(e.target.value)}
        className="w-15 border-none"
      />
      <div className="flex items-center ms-4">
        <button
          onClick={() => handleFontSizeChange(newline.label.fontSize - 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <input
          type="text"
          className="mx-2 text-center w-12"
          value={newline.label.fontSize}
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              handleFontSizeChange(e.target.value);
            }
          }}
        />
        <button
          onClick={() => handleFontSizeChange(newline.label.fontSize + 1)}
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
      <Label>Data Key:</Label>
      <select
        className="w-80 form-select"
        value={newline.value.id} 
        onChange={handleGraphElementChange(index)}
      >
        {graphArray
          .filter((item) => item.queryType === "value")
          .map((item, idx) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
    </>
  );
}

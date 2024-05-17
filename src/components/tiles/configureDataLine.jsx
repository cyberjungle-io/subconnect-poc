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
    graphArray.reduce((acc, item) => {
      if (item.queryType === "value") {
        return { ...acc, [item.id]: "" };
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

  const handleGraphElementChange = (event) => {
    const selectedId = event.target.value;
    const selectedData = graphArray.find((item) => item.id === selectedId);
    
    let newMappings = [];
    for (let i = 0; i < selectedData.variables.length; i++) {
      let v = selectedData.variables[i];
      const prmpt = `Please enter ${v}`;
      let userInput = prompt(prmpt, "");
      if (userInput == null || userInput == "") {
        alert("User cancelled the prompt.");
        return;
      } else {
        let m = {};
        m[selectedData.variables[i]] = userInput;
        newMappings.push(m);
      }
    }

    const updatedNewline = {
      ...newline,
      value: {
        ...newline.value,
        id: selectedId,
        dataQuery: selectedData,
        mappings: newMappings,
      },
    };

    setNewLine(updatedNewline);
  };

  return (
    <>
      <div className="bg-white p-3 shadow-md rounded-lg border-2 border-gray-300">
        <div className="flex flex-wrap items-center space-x-4 p-3">
          <div className="min-w-0">
            <Label>Label:</Label>
            <Input
              name={`lineText`}
              placeholder={`Enter Label`}
              value={newline.label.text}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-64 py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Color:</Label>
            <Input
              name={`lineColor`}
              type="color"
              value={newline.label.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-8 p-0 border-none rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFontSizeChange(newline.label.fontSize - 1)}
              className="p-1"
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
                  d="M5 12h14"
                />
              </svg>
            </button>
            <input
              type="text"
              className="mx-2 text-center w-12 py-1 px-2 text-sm border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={newline.label.fontSize}
              onChange={(e) => {
                if (!isNaN(e.target.value)) {
                  handleFontSizeChange(e.target.value);
                }
              }}
            />
            <button
              onClick={() => handleFontSizeChange(newline.label.fontSize + 1)}
              className="p-1"
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
        
        <div className="flex flex-wrap items-center space-x-4 p-3">
          <div className="flex-row">
            <Label>Data Key:</Label>
            <div className="flex-row">
              <select
                id="dataKey"
                className="w-64 py-1 px-2 text-sm border-gray-300 border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={newline.value.id || ""}
                onChange={handleGraphElementChange}
              >
                <option value="" disabled>Select Data Key</option>
                {graphArray
                  .filter((item) => item.queryType === "value")
                  .map((item, idx) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

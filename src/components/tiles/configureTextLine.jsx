"use client";
import React, { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";



export default function ConfigureTextLine({ line,index,handleLineUpdate }) {
    const [newline, setNewLine] = useState(line);

    const handleInputChange = (value) => {
        
        console.log("value", value);
        setNewLine({ ...newline, text: value });
        
      };


      function handleColorChange( value) {
       
         
        setNewLine({ ...newline, color: value });
        
      }
      const handleFontSizeChange = ( value) => {
        setNewLine({ ...newline, fontSize: value });
        
      };
      useEffect(() => {
        handleLineUpdate(index, newline);
      }, [newline]);
    return (
        <>
            <Input
                name={`lineText`}
                placeholder={`Enter Text`}
                value={newline.text}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-80 me-4 "
            />
            <Input
                name={`lineColor`}
                type="color"
                value={newline.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-15 border-none"
            />
            <div className="flex items-center ms-4">
                <button onClick={() => handleFontSizeChange(newline.fontSize - 1)}>
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
                    value={newline.fontSize}
                    onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                            handleFontSizeChange(e.target.value);
                        }
                    }}
                />
                <button onClick={() => handleFontSizeChange(newline.fontSize + 1)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        </>
    );
}

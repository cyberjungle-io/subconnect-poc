"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from "dompurify";

export default function TileEditor() {
  const [form, setForm] = useState({
    title: { text: "", color: "#000000", fontSize: 16 },
    lines: [
      { text: "", color: "#000000", fontSize: 16 },
      // Add more lines here as needed
    ],
    icon: { text: "", iconSize: 16 },
  });

  const handleInputChange = (lineIndex, value) => {
    setForm((prevForm) => {
      const newLines = [...prevForm.lines];
      if (newLines[lineIndex]) {
        newLines[lineIndex].text = value;
      } else {
        // Handle the case where newLines[lineIndex] is undefined
        console.error(`Line index ${lineIndex} is out of bounds`);
      }
      return { ...prevForm, lines: newLines };
    });
  };

  function handleColorChange(lineIndex, value) {
    setForm((prevForm) => {
      const newLines = [...prevForm.lines];
      newLines[lineIndex].color = value;
      return { ...prevForm, lines: newLines };
    });
  }

  const handleFontSizeChange = (lineIndex, value) => {
    setForm((prevForm) => {
      if (lineIndex >= 0 && lineIndex < prevForm.lines.length) {
        const newLines = [...prevForm.lines];
        newLines[lineIndex].fontSize = value;
        return { ...prevForm, lines: newLines };
      } else {
        // lineIndex is out of bounds, return the previous state
        return prevForm;
      }
    });
  };

  function handleIconSizeChange(value) {
    const minIconSize = 10; // Set your minimum font size
    const maxIconSize = 60; // Set your maximum font size

    // Ensure the new value is within the allowed range
    if (value >= minIconSize && value <= maxIconSize) {
      setForm((prevForm) => {
        return { ...prevForm, icon: { ...prevForm.icon, iconSize: value } };
      });
    }
  }

  function addLine() {
    setForm((prevForm) => {
      const newLines = [
        ...prevForm.lines,
        { text: "", color: "#000000", fontSize: 16 },
      ];
      return { ...prevForm, lines: newLines };
    });
  }

  return (
    <main>
      <section className="flex justify-center ">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="flex flex-row">
              <div
                className="w-1/2"
                style={{
                  color: form.title.color,
                  fontSize: `${form.title.fontSize}px`,
                }}
              >
                {form.title.text ? form.title.text : "Title"}
              </div>
              <div className="w-1/2 flex justify-end me-3">
                {form.icon.text ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(form.icon.text),
                    }}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                    style={{
                      width: `${form.icon.iconSize}px`,
                      height: `${form.icon.iconSize}px`,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {form.lines.map((line, index) => (
              <div
                key={index}
                style={{
                  color: line.color,
                  fontSize: `${line.fontSize}px`,
                }}
              >
                {line.text ? line.text : `Line ${index + 1} Data`}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="ms-4">
        <h3>Title</h3>
        <div className="flex">
          <Input
            name="title"
            placeholder="Title"
            value={form.title.text}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-80 me-4"
          />
          <Input
            type="color"
            value={form.title.color}
            onChange={(e) => handleColorChange("title", e.target.value)}
            className="w-15 border-none"
          />
          <div className="flex items-center ms-4">
            <button
              onClick={() =>
                handleFontSizeChange("title", form.title.fontSize - 1)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 "
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
              className="mx-2 text-center w-12"
              value={form.title.fontSize}
              onChange={(e) => {
                if (!isNaN(e.target.value)) {
                  handleFontSizeChange("title", e.target.value);
                }
              }}
            />
            <button
              onClick={() =>
                handleFontSizeChange("title", form.title.fontSize + 1)
              }
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
        <h3>Icon</h3>
        <div className="flex">
          <Input
            name="icon"
            type="textarea"
            placeholder="Paste SVG"
            value={form.icon.text}
            onChange={(e) => handleInputChange("icon", e.target.value)}
            className="w-2/3 me-4"
          />
          <div className="flex items-center">
            <button
              onClick={() =>
                handleIconSizeChange("icon", form.icon.iconSize - 1)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 "
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
              className="mx-2 text-center w-12"
              value={form.icon.iconSize}
              onChange={(e) => {
                if (!isNaN(e.target.value)) {
                  handleIconSizeChange("icon", e.target.value);
                }
              }}
            />
            <button
              onClick={() =>
                handleIconSizeChange("icon", form.icon.iconSize + 1)
              }
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
        <div className="space-y-5 mt-3">
          {form.lines.map((line, index) => (
            <div key={index} className="flex ">
              <Input
                name={`lineText${index}`}
                placeholder={`Enter Line ${index + 1} Data`}
                value={line.text}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-80 me-4 "
              />
              <Input
                name={`lineColor${index}`}
                type="color"
                value={line.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-15 border-none"
              />
              <div className="flex items-center ms-4">
                <button
                  onClick={() => handleFontSizeChange(index, line.fontSize - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 "
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
                  className="mx-2 text-center w-12"
                  value={line.fontSize}
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) {
                      handleFontSizeChange(index, e.target.value);
                    }
                  }}
                />
                <button
                  onClick={() => handleFontSizeChange(index, line.fontSize + 1)}
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
          ))}
        </div>

        <Button className="mt-3" variant="outline" onClick={addLine}>
          Add Line
        </Button>
      </section>
    </main>
  );
}

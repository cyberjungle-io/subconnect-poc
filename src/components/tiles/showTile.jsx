"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ShowTextLine from "./showTextLine";
import ShowDataLine from "./showDataLine";
import ShowTable from "./ShowTable";
import DOMPurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowTile(param) {
  const [form, setForm] = useState(param.form);
  const [loadingStates, setLoadingStates] = useState(new Array(form.lines.length).fill(true));

  useEffect(() => {
    // Simulate fetching data and update loading states accordingly
    const loadTimes = form.lines.map(() => Math.random() * 1000 + 500); // Random load times for each line
    form.lines.forEach((line, index) => {
      setTimeout(() => {
        setLoadingStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = false; // Set loading to false for this line
          return newStates;
        });
      }, loadTimes[index]);
    });
  }, [form.lines]);
  
  // Function to sanitize and modify the SVG content
  const sanitizeAndModifySVG = (svgString, size) => {
    // Create a DOM parser
    const parser = new DOMParser();
    // Parse the SVG string to a document
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");

    if (svg) {
      // Remove existing width and height attributes
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      // Set new width and height based on the size parameter
      svg.setAttribute("width", `${size}px`);
      svg.setAttribute("height", `${size}px`);
    }

    // Serialize the document back to a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  };
  
  return (
    <>
      <section className="flex justify-center w-full">
        <Card className="w-full min-h-36">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex flex-row">
              <div
                className="w-2/3"
                style={{
                  color: form.title.color,
                  fontSize: `${form.title.fontSize}px`,
                }}
              >
                {form.title.text ? (
                  <div
                    style={{
                      color: form.title.color,
                      fontSize: `${form.title.fontSize}px`,
                    }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.title.text) }}
                  />
                ) : (
                  <Skeleton className="h-8 w-auto" />
                )}
              </div>
              <div className="w-1/3 flex justify-end me-3">
                {form.icon.text ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeAndModifySVG(DOMPurify.sanitize(form.icon.text), form.icon.iconSize),
                    }}
                  />
                ) : (
                  <Skeleton className="h-8 w-8" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        <CardContent className="p-3 pt-2">
            {form.lines.map((line, index) => (
                <div key={index}>               
                {!loadingStates[index] ? (
                  line.lineType === "Text" ? <ShowTextLine line={line} index={index} /> :
                  line.lineType === "Data" ? <ShowDataLine line={line} index={index} /> :
                  line.lineType === "Table" ? <ShowTable line={line} index={index} /> :
                  null
                ) : (
                  <div className="space-y-2">
                  <Skeleton className="h-6 w-auto" />
                  <Skeleton className="h-6 w-auto" />
                  </div>
                )}
                </div>
            ))}
        </CardContent>
        </Card>
      </section>
    </>
  );
}

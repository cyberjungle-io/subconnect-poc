"use client";
import React, { useState } from "react";
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

export default function ShowTile(param) {
  const [form, setForm] = useState(param.form);
  return (
    <>
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
                <div key={index}>               
                
                    {line.lineType === "Text"
                        ? 
                        <ShowTextLine line={line} index={index}/>
                        : ""}
                    {line.lineType === "Data"
                        ? 
                        <ShowDataLine line={line} index={index}/>
                     : ""}
                     {line.lineType === "Table"
                        ? 
                        <ShowTable line={line} index={index}/>
                     : ""}
             
                </div>
            ))}
        </CardContent>
        </Card>
      </section>
    </>
  );
}

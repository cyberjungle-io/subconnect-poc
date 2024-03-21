"use client";
import React, { useState, useEffect, use } from "react";
import { fetchValueData } from "@/lib/graphdata";

export default function ShowDataLine({ line, index }) {
    const [data, setData] = useState(null);
    

  useEffect(() => {
    console.log("line", line);
    const fetchData = async () => {
        console.log("line.value.dataQuery", line.value.dataQuery);
        const dta = await fetchValueData(line.value.dataQuery);
        setData(dta);
        console.log(dta);
      }
      fetchData();
      }, [line]);

  return (
    <div
      key={index}
      style={{
        color: line.label.color,
        fontSize: `${line.label.fontSize}px`,
      }}
    >
      {line.label.text ? line.label.text : `Data ${index + 1} `}
      {" "}
      
      {data? data : "Loading..."}
    </div>
  );
}

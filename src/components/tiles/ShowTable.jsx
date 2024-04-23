"use client";
import React, { useState, useEffect, use } from "react";
import { fetchValueData } from "@/lib/graphdata";

export default function ShowTable({ line, index }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("line", line);
    const fetchData = async () => {
      console.log("line.value", line.value);
      const dta = await fetchTableData(line.value);
      setData(dta);
      console.log(dta);
    };
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
      {line.label.text ? line.label.text : `Data ${index + 1} `}{" "}
      {data ? data : "Loading..."}
    </div>
  );
}

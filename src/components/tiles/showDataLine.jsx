"use client";
import React, { useState, useEffect, use } from "react";
import { fetchValueData } from "@/lib/graphdata";

import { Skeleton } from "@/components/ui/skeleton";

export default function ShowDataLine({ line, index }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("line", line);
    const fetchData = async () => {
      console.log("line.value", line.value);
      const dta = await fetchValueData(line.value);
      setData(dta);
      console.log(dta);
    };
    fetchData();
  }, [line]);

  return (
    <div
      key={index}
      className="flex items-center space-x-2"
      style={{
        color: line.label.color,
        fontSize: `${line.label.fontSize}px`,
      }}
    >
      {data ? (
        line.label.text
      ) : (
        <Skeleton className="h-8 w-2/3" /> 
      )}
      {" "}
      {data ? (
        data
      ) : (
        <Skeleton className="h-8 w-1/3" />
      )}
    </div>
  );
}

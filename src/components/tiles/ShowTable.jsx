"use client";
import React, { useState, useEffect, use } from "react";
import { fetchTableData } from "@/lib/graphdata";

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
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || null;
  };

  const formatValue = (value, format, formatValue) => {
    switch (format) {
      case "round":
        case "round":
        const factor = Math.pow(10, parseInt(formatValue, 10));
        return (Math.round(value * factor) / factor).toFixed(formatValue);
      case "rTrim":
        return value.toString().slice(0, formatValue);
      case "lTrim":
        return value.toString().slice(-formatValue);
      case "date":
        return new Date(value).toLocaleDateString();
      case "time":
        return new Date(value).toLocaleTimeString();
      case "dateTime":
        return new Date(value).toLocaleString();
      default:
        return value; // No formatting applied if format is unrecognized
    }
  };
  return (
    <div key={index} className={`text-${line.label.color} text-[${line.label.fontSize}px] overflow-hidden`}>
      {data ? (
        <div className="overflow-y-auto max-h-120">
        <table className="">
          <thead>
            <tr>
              {line.value.columns.map((column, idx) => (
                <th>{column.header.text}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {line.value.columns.map((column, colIdx) => (
                  <td key={colIdx}>
                    {formatValue(
                      getNestedValue(row, column.selectedField),
                      column.label.format,
                      column.label.formatValue
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust the import paths as necessary

import { fetchElementData } from "@/lib/graphdata"; // Adjust the import path as necessary

const ShowChart = ({ chart }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadAndFetchData = async () => {
      if (!chart || !chart.elements) {
        return; // Exit early if `chart` or `chart.elements` is not defined
      }
      console.log("chart");
      console.log(chart);
      console.log("charts.elements");
      console.log(chart.elements); // Log to ensure `chart.elements` is defined

      const dta = await fetchElementData(chart.elements);
      console.log(dta); // This will log the fetched data

      setData(dta); // This updates the state, but remember the update is asynchronous
    };

    loadAndFetchData();
  }, [chart]); // Depend on `chart` prop to re-run this effect if `chart` changes

  if (!chart) {
    return null;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : null;
  }

  return (
    <Card className="h-[350px] w-full">
      <CardHeader>
        <CardTitle>
          <div
            className="w-1/2"
            style={{
              color: chart?.form?.title?.color || "defaultColor",
              fontSize: `${chart?.form?.title?.fontSize || 14}px`,
            }}
          >
            {chart?.form?.title?.text ? chart.form.title.text : "Title"}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart width={500} height={300} data={data}>
            {chart?.form?.chart?.showXAxis && (
              <XAxis
                dataKey="name" // Adjust this as necessary to match your data structure
                label={{ value: chart.form.chart.xAxisLabel, position: "insideBottomRight", offset: -20 }}
                tick={{ fontSize: chart.form.axis?.xAxisFontSize || 10 }}
              />
            )}
            {chart?.form?.chart?.showYAxis && (
              <YAxis
              type="number" domain={['dataMin', 'dataMax']}
                label={{ value: chart.form.chart.yAxisLabel, angle: -90, position: "insideLeft" }}
                tick={{ fontSize: chart.form.axis?.yAxisFontSize || 10 }}
              />
            )}
            <Tooltip
              contentStyle={{
                display: chart?.form?.tooltip?.show ? "block" : "none",
                color: `rgba(${hexToRgb(chart?.form?.tooltip?.color)}, ${chart?.form?.tooltip?.textOpacity})`,
                backgroundColor: `rgba(${hexToRgb(chart?.form?.tooltip?.backgroundColor)}, ${chart?.form?.tooltip?.backgroundOpacity})`,
                borderRadius: `${chart?.form?.tooltip?.borderRadius}px`,
                border: `${chart?.form?.tooltip?.borderWidth}px ${chart?.form?.tooltip?.borderStyle} rgba(${hexToRgb(chart?.form?.tooltip?.borderColor)}, ${chart?.form?.tooltip?.borderOpacity})`,
                fontSize: `${chart?.form?.tooltip?.fontSize}px`,
              }}
            />
            {chart?.form?.chart?.showCartesianGrid && (
              <CartesianGrid stroke="#f5f5f5" />
            )}
            <Legend />
            {chart.elements?.map((element, index) => {
              const ChartComponent = element.type === "Bar" ? Bar : Line;
              return (
                <ChartComponent
                  key={index}
                  dataKey={element.dataKey}
                  fill={element.color}
                  fillOpacity={element.opacity}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ShowChart;

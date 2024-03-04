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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // replace with your actual import

import { fetchElementData } from "@/lib/graphdata";

const ShowChart = ({ chart }) => {
  const [data, setData] = useState(null);
    if (!chart) {
        return null;
    }
  useEffect(() => {
    console.log(chart);
    const loadAndFetchData = async () => {

      if (chart && chart.elements) {
        console.log("charts.elements")
        console.log(chart.elements); // Log to ensure `chart.elements` is defined

        const dta = await fetchElementData(chart.elements);
        console.log(dta); // This will log the fetched data

        setData(dta); // This updates the state, but remember the update is asynchronous
      }
    };

    loadAndFetchData();
  }, [chart]); // Depend on `chart` prop to re-run this effect if `chart` changes

  const defaultFontSize = 14; // Define a default font size

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : null;
  }

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>
          <div
            className="w-1/2"
            style={{
              color: chart?.form?.title?.color || "defaultColor",
              fontSize: `${chart?.form?.title?.fontSize || defaultFontSize}px`,
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
                dataKey="updatedTime"
                label={chart.form.chart.xAxisLabel}
                tick={{ fontSize: chart.form.axis.xAxisFontSize }}
              />
            )}
            {chart?.form?.chart?.showYAxis && (
              <YAxis
                label={chart.form.chart.yAxisLabel}
                tick={{ fontSize: chart.form.axis.yAxisFontSize }}
              />
            )}
            <Tooltip
              contentStyle={{
                display: chart?.form?.tooltip?.show ? "block" : "none",
                color: `rgba(${hexToRgb(chart?.form?.tooltip?.color)}, ${chart?.form?.tooltip?.textOpacity})`,

                backgroundColor: `rgba(${hexToRgb(chart?.form?.tooltip?.backgroundColor)}, ${chart?.form?.tooltip?.backgroundOpacity})`,
                borderRadius: `${chart?.form?.tooltip?.borderRadius}px`,
                border: `${chart?.form?.tooltip?.borderWidth}px ${chart?.form?.tooltip?.borderStyle} rgba(${hexToRgb(chart?.form?.tooltip?.borderColor)}, ${chart?.form?.tooltip?.borderOpacity})`,
                fontSize: `${chart?.form?.tooltip?.titlefontsize}px`, // This line was added correctly
              }}
            />
            {chart?.form?.chart?.CartesianGrid && (
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
``

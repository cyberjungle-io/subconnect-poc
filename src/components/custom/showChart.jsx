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
      //console.log("chart");
      //console.log(chart);
      //console.log("charts.elements");
      //console.log(chart.elements); // Log to ensure `chart.elements` is defined

      const dta = await fetchElementData(chart.elements);
      //console.log(dta); // This will log the fetched data

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
    <Card className="h-[350px] ">
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
        <ComposedChart data={data}>
  {chart?.form?.chart?.showXAxis && (
    <XAxis
      dataKey="updatedTime"
      
      tick={{ fontSize: 12, angle: -20, dy: 14}}
      label={{ value: chart.form.chart.xAxisLabel, position: "insideBottomRight", offset: -20 }}
      //tick={{ fontSize: chart.form.axis?.xAxisFontSize || 10 }}
    />
  )}
  {chart?.form?.chart?.showYAxis && chart.elements?.map((element, index) => (
    <YAxis
      yAxisId={element.elementId}
      key={element.elementId}
      
      
      //domain={['dataMin', 'dataMax']} // You might want to specify these domains dynamically
      
    />
  ))}
  <Tooltip
    contentStyle={{
      display: chart?.form?.tooltip?.show ? "block" : "none",
      // Tooltip style configuration
    }}
  />
  {chart?.form?.chart?.showCartesianGrid && (
    <CartesianGrid stroke="#f5f5f5" />
  )}
  <Legend />
  {chart.elements?.map((element, index) => {
    const ChartComponent = element.type === "Bar" ? Bar : Line;
    const dtky = element.yAxis + "_" + element.elementId
    return (
      <ChartComponent
        key={element.elementId} // Assuming elementId is unique
        yAxisId={element.elementId} // Make sure each element has a yAxisId corresponding to its YAxis component
        name={element.seriesText}
        dataKey={dtky} // Ensure you have a dataKey property that matches the data structure
        fill={element.color}
        fillOpacity={element.opacity}
        dot={false}
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

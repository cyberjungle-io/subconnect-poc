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
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { fetchElementData } from "@/lib/graphdata";

const GET_DATA = gql`
  query {
    globalStateSnapshots(
      limit: 1000
      orderBy: updatedTime_ASC
      where: { updatedTime_gt: "2024-02-01T22:00:00.000000Z" }
    ) {
      averageApr
      averageBlockTime
      delegatorCount
      totalValue
      updatedTime
    }
  }
`;

const SimpleChart = ({ chart }) => {
  const [charts, setCharts] = useState([]);
  const [data, setData] = useState(null);
  const fetchData = async () => {
    const client = new ApolloClient({
      uri: "https://khala-computation.cyberjungle.io/graphql",
      cache: new InMemoryCache(),
    });
    try {
      const result = await client.query({ query: GET_DATA });
      setData(result.data.globalStateSnapshots);
      console.log(data);
      // rest of your code
    } catch (error) {
      console.error(error);
    }
  };
  /* useEffect(() => {
    fetchData();
  }, []); */
  console.log(chart);
  // Load from local storage
  const loadChartPreferences = () => {
    const loadedCharts = [];

    // Get all keys from local storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // If the key is for a chart preference, load it
      if (key.startsWith("chartPreferences-")) {
        const chartId = key.split("-")[1];
        const form = JSON.parse(
          localStorage.getItem(`chartPreferences-${chartId}`)
        );
        const elements = JSON.parse(
          localStorage.getItem(`chartElements-${chartId}`)
        );

        loadedCharts.push({ chartId, form, elements });
      }
    }
    console.log('loadedCharts');
    
    setCharts(loadedCharts);
    console.log(charts);
    return loadedCharts;
  };

  // Call loadChartPreferences in a useEffect hook to load the preferences when the component mounts
  useEffect(() => {
    let newchart = loadChartPreferences();
    console.log('useEffect loadedCharts');
    console.log(newchart);
    const loadAndFetchData = async () => {
       // Assuming this is synchronous or its async nature is handled internally
      console.log("charts.elements")
      console.log(newchart[0].elements); // Ensure `charts` is defined and contains `elements`
  
      const dta = await fetchElementData(newchart[0].elements);
      console.log(dta); // This will log the fetched data
  
      setData(dta); // This updates the state, but remember the update is asynchronous
    };
  
    loadAndFetchData();
  }, []); // Ensure any external dependencies used inside useEffect are listed here
  
  const defaultFontSize = 14; // Define a default font size

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
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
                color: `rgba(${hexToRgb(chart?.form?.tooltip?.color)}, ${
                  chart?.form?.tooltip?.textOpacity
                })`,

                backgroundColor: `rgba(${hexToRgb(
                  chart?.form?.tooltip?.backgroundColor
                )}, ${chart?.form?.tooltip?.backgroundOpacity})`,
                borderRadius: `${chart?.form?.tooltip?.borderRadius}px`,
                border: `${chart?.form?.tooltip?.borderWidth}px ${
                  chart?.form?.tooltip?.borderStyle
                } rgba(${hexToRgb(chart?.form?.tooltip?.borderColor)}, ${
                  chart?.form?.tooltip?.borderOpacity
                })`,
                fontSize: `${chart?.form?.tooltip?.titlefontsize}px`, // Add this line
              }}
            />
            {chart?.form?.chart?.CartesianGrid && (
              <CartesianGrid stroke="#f5f5f5" />
            )}
            <Legend />
            {chart?.elements?.map((element, index) => {
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

export default SimpleChart;

"use client";
import React, { useState, useEffect, use } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import SimpleChart from "../components/custom/simple-chart.jsx";
import ShowChart from "../components/custom/showChart.jsx";


const DashboardEditor = () => {
  const [charts, setCharts] = useState([]);
  
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
          console.log(elements)
        loadedCharts.push({ chartId, form, elements });
      }
    }
  
    // Return the loaded charts
    return loadedCharts;
  };
  // Call loadChartPreferences in a useEffect hook to load the preferences when the component mounts
  useEffect(() => {
    const loadedCharts = loadChartPreferences();
    // Assign a unique chartId to each chart
    const chartsWithId = loadedCharts.map((chart, index) => ({
      ...chart,
      chartId: index, // or generate a unique ID here
    }));
    setCharts(chartsWithId);
    //console.log(chartsWithId)
    console.log(charts)
  }, []);
useEffect(() => {
  console.log(charts)
} , [charts])
  return (
    <div>
      {charts.map((chart) => (
        <>
        <h1>{chart.elements[0].xAxis}</h1>
        <ShowChart  chart={chart} />
        </>
      ))}
    </div>
  );
};

export default DashboardEditor;

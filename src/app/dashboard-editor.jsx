"use client";
import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import SimpleChart from "../components/custom/simple-chart.jsx";

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
const DashboardEditor = () => {
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
  useEffect(() => {
    fetchData();
  }, []);

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

    setCharts(loadedCharts);
  };

  // Call loadChartPreferences in a useEffect hook to load the preferences when the component mounts
  useEffect(() => {
    loadChartPreferences();
  }, []);

  return (
    <div>
      {charts.map((chart) => (
        <SimpleChart key={chart.chartId} chart={chart} data={chart.data} />
      ))}
    </div>
  );
};

export default DashboardEditor;

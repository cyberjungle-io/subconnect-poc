import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { data } from "autoprefixer";
import moment from "moment";

export const graphArray = [
  {
    id: "1",
    name: "Phala Average Apr",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `query {globalStateSnapshots(limit: 1000, orderBy: updatedTime_ASC,where: { updatedTime_gt: "<<datetime>>" }) {averageApr,updatedTime}}`,
    owner: "Cyber Jungle",
    basePath: "globalStateSnapshots",
    xAxis: "updatedTime",
    yAxis: "averageApr",
    postProcess: [{ multiplyBy: 100 }, { round: 2 }],
    variables: [],
  },
  {
    id: "2",
    name: "Phala Average Block Time",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `query {globalStateSnapshots(limit: 1000, orderBy: updatedTime_ASC,where: { updatedTime_gt: "<<datetime>>" }) {averageBlockTime,updatedTime}}`,
    
    owner: "Cyber Jungle",
    basePath: "globalStateSnapshots",
    xAxis: "updatedTime",
    yAxis: "averageBlockTime",
    postProcess: [{ devideBy: 1000 }, { round: 2 }],
    variables: [],
  },
  {
    id: "3",
    name: "Phala Delegator Count",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "<<datetime>>" }
                ) {
                    delegatorCount
                    updatedTime
                }
                }
            `,
    owner: "Cyber Jungle",
    basePath: "globalStateSnapshots",
    xAxis: "updatedTime",
    yAxis: "delegatorCount",
    postProcess: [],
    variables: [],
  },
  {
    id: "4",
    name: "Phala Total Value",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "<<datetime>>" }
                ) {
                    totalValue
                    updatedTime
                }
                }
            `,
    owner: "Cyber Jungle",
    basePath: "globalStateSnapshots",
    xAxis: "updatedTime",
    yAxis: "totalValue",
    postProcess: [],
    variables: [],
  },
  {
    id: "5",
    name: "Khala Pool Total Value",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `query {
                    basePoolSnapshots(where: {basePool: {pid_eq: "<<pool number>>"}, updatedTime_gt: "<<datetime>>"}, limit: 1000) {
                      updatedTime
                      totalValue
                    }
                  }`,
    owner: "Cyber Jungle",
    basePath: "basePoolSnapshots",
    xAxis: "updatedTime",
    yAxis: "totalValue",
    postProcess: [],
    variables: ["pool number"],
  },
  {
    id: "6",
    name: "Khala Pool Idle Worker Count",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `
                query {
                    basePoolSnapshots(where: {basePool: {pid_eq: "<<pool number>>"}}) {
                      updatedTime
                      idleWorkerCount
                    }
                  }
            `,
    owner: "Cyber Jungle",
    basePath: "basePoolSnapshots",
    xAxis: "updatedTime",
    yAxis: "idleWorkerCount",
    postProcess: [],
    variables: ["pool number"],
  },
  {
    id: "7",
    name: "Khala PoolWorker Count",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "time",
    queryVars: [{ "Update Time": "String" }, { Limit: "Int" }],
    query: `
                query {
                    basePoolSnapshots(where: {basePool: {pid_eq: "<<pool number>>"}}) {
                      updatedTime
                      workerCount
                    }
                  }
            `,
    owner: "Cyber Jungle",
    basePath: "basePoolSnapshots",
    xAxis: "updatedTime",
    yAxis: "idleWorkerCount",
    postProcess: [],
    variables: ["pool number"],
  },
  {
    id: "8",
    name: "Khala Average APR",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "value",
    queryVars: [],
    query: `
                query {
                    globalStates {
                      averageApr
                      
                    }
                  }
            `,
    owner: "Cyber Jungle",
    basePath: "globalStates",
    value: "averageApr",
    postProcess: [{ multiplyBy: 100 }, { round: 2 }],
    variables: [],
  },
  {
    id: "9",
    name: "Khala Average Block Time",
    chain: "Khala",
    URI: ["https://khala-computation.cyberjungle.io/graphql"],
    queryType: "value",
    queryVars: [],
    query: `
                query {
                    globalStates {
                      averageBlockTime
                      
                    }
                  }
            `,
    owner: "Cyber Jungle",
    basePath: "globalStates",
    value: "averageBlockTime",
    postProcess: [{ devideBy: 1000 }, { round: 2 }],
    variables: [],
  },
];

export const fetchGraphDataDateSeries = async (element, dateformat, days) => {
  //find the index of the graphArray with the id

  const dt = daysFromNow(days);
  //console.log(element.query);
  const client = new ApolloClient({
    uri: element.URI[0],
    cache: new InMemoryCache(),
  });
  console.log("Query: ", element.query.replace("<<datetime>>", dt));
  const { data } = await client.query({
    query: gql(element.query.replace("<<datetime>>", dt)),
  });
  let newArray = [];
  for (let i = 0; i < data[element.basePath].length; i++) {
    let record = data[element.basePath][i];

    record = {
      ...record,
      [element.yAxis]: postProcess(record[element.yAxis], element.postProcess),
    };
    newArray.push(record);
  }

  return newArray;
};
function postProcess(data, processArray) {
  for (let c = 0; c < processArray.length; c++) {
    let p = processArray[c];
    // condition off the element name of p
    if (p.hasOwnProperty("multiplyBy")) {
      data = multiplyBy(data, p.multiplyBy);
    }
    if (p.hasOwnProperty("devideBy")) {
      data = devideBy(data, p.devideBy);
    }
    if (p.hasOwnProperty("round")) {
      data = round(data, p.round);
    }
  }
  return data;
}

function devideBy(data, value) {
  return data / value;
}
function multiplyBy(data, value) {
  return data * value;
}
function round(data, value) {
  return data.toFixed(value);
}

//generate a datetime in the format of "2024-02-01T22:00:00.000000Z".
// input the number of days from today to generate the datetime.
export const daysFromNow = (days) => {
  let d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const fetchValueData = async (graphquery) => {
  //console.log(graphquery);
  const client = new ApolloClient({
    uri: graphquery.URI[0],
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql(graphquery.query),
  });
  //console.log("Data", data[graphquery.basePath][0][graphquery.value]);
  const tdata = postProcess(
    data[graphquery.basePath][0][graphquery.value],
    graphquery.postProcess
  );
  return tdata;
};

function formatDatesInArray(array, property, format) {
  return array.map((item) => {
    const date = moment(item[property]);
    const formattedDate = date.format(format);
    return { ...item, [property]: formattedDate };
  });
}

export const fetchElementData = async (elements) => {
  //console.log(elements);
  const dataPromises = elements.map((element) =>
    fetchGraphDataDateSeries(element, "MM/DD/YYYY", 7).then((data) => {
      return data.map((item) => ({
        ...item,
        elementId: element.elementId, // Assuming each element has an identifier 'id'
        yAxis: element.yAxis, // Preserving the 'yAxis' property from the element
        
      }));
    })
  );
  const results = await Promise.all(dataPromises);
  console.log("results: ", results);
  let combinedData = [].concat(...results);

  combinedData.sort((a, b) =>
    moment(a.updatedTime, "MM/DD/YYYY").diff(
      moment(b.updatedTime, "MM/DD/YYYY")
    )
  );

  let mergedData = combinedData.reduce((acc, data) => {
    let existingEntryIndex = acc.findIndex(
      (entry) => entry.updatedTime === data.updatedTime
    );
    if (existingEntryIndex > -1) {
      Object.keys(data).forEach((key) => {
        // Only process if key is not 'elementId' or 'yAxis' to avoid duplicating these properties
        if (key !== "elementId" && key !== "yAxis") {
          if (key === data.yAxis) {
            const uniqueKeyName = `${data.yAxis}_${data.elementId}`;
            acc[existingEntryIndex][uniqueKeyName] = data[key];
          } else {
            // For properties other than yAxis, copy them if they don't exist in the acc entry
            if (!acc[existingEntryIndex].hasOwnProperty(key)) {
              acc[existingEntryIndex][key] = data[key];
            }
          }
        }
      });
    } else {
      // Constructing new data entry for unique updatedTime
      const newData = Object.fromEntries(
        Object.keys(data)
          .map((key) => {
            if (key !== "elementId" && key !== "yAxis") {
              if (key === data.yAxis) {
                const uniqueKeyName = `${data.yAxis}_${data.elementId}`;
                return [uniqueKeyName, data[key]];
              } else {
                return [key, data[key]];
              }
            }
            // Skip 'elementId' and 'yAxis' keys to avoid adding them directly to newData
            return null;
          })
          .filter((entry) => entry !== null)
      );

      newData.updatedTime = data.updatedTime; // Ensure updatedTime is always added

      acc.push(newData);
    }
    return acc;
  }, []);

  mergedData = formatDatesInArray(mergedData, "updatedTime", "MM/DD/YYYY hh A");
  //console.log(mergedData);
  return mergedData;
};

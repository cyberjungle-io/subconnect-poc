import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import { data } from "autoprefixer";
import moment from 'moment';

export const graphArray = [
    {"id" : "1",
    "name": "Phala Average Apr",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "<<datetime>>" }
                ) {
                    averageApr
                    updatedTime
                }
                }
            `,
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "averageApr",
    "postProcess": [{"multiplyBy": 100}, {"round": 2}]
    },
    {"id" : "2",
    "name": "Phala Average Block Time",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "<<datetime>>" }
                ) {
                    averageBlockTime
                    updatedTime
                }
                }
            `,
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "averageBlockTime",
    "postProcess": [{"devideBy": 1000}, {"round": 2}]
    },
    {"id" : "3",
    "name": "Phala Delegator Count",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
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
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "delegatorCount",
    "postProcess": []
    },
    {"id" : "4",
    "name": "Phala Total Value",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
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
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "totalValue",
    "postProcess": []
    }

]

export const fetchGraphDataDateSeries = async (id,dateformat,days) => {
    //find the index of the graphArray with the id
    const index = graphArray.findIndex(x => x.id === id);
    const dt = daysFromNow(days);
    console.log(dt);
    const client = new ApolloClient({
        uri: graphArray[index].URI[0],
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql(graphArray[index].query.replace("<<datetime>>", dt))
    });
    let newArray = [];
    for (let i = 0; i < data.globalStateSnapshots.length; i++) {
        let record = data.globalStateSnapshots[i];
        console.log(graphArray[index].yAxis);
        record = { ...record, [graphArray[index].yAxis]: postProcess(record[graphArray[index].yAxis], graphArray[index].postProcess) };
        newArray.push(record);
    }
    
    return newArray;
}
function postProcess(data, processArray  ) {
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
}



function formatDatesInArray(array, property, format) {
    return array.map(item => {
        const date = moment(item[property]);
        const formattedDate = date.format(format);
        return { ...item, [property]: formattedDate };
    });
}
   
export const fetchElementData = async (elements) => {
    // Fetch all data concurrently
    console.log("fetchElementData")
    console.log(elements);
    const dataPromises = elements.map(element => 
        fetchGraphDataDateSeries(element.id, "MM/DD/YYYY", 7)
    );
    const results = await Promise.all(dataPromises);

    // Combine all arrays into a single array
    let combinedData = [].concat(...results);

    // Sort the combined array by updatedTime
    combinedData.sort((a, b) => moment(a.updatedTime, "MM/DD/YYYY").diff(moment(b.updatedTime, "MM/DD/YYYY")));

    // Merge entries with the same updatedTime
    let mergedData = combinedData.reduce((acc, data) => {
        // Find if there's already an entry with the same updatedTime
        let existingEntryIndex = acc.findIndex(entry => entry.updatedTime === data.updatedTime);
        if (existingEntryIndex > -1) {
            // If found, merge this data into the existing entry without overwriting existing fields
            acc[existingEntryIndex] = {
                ...acc[existingEntryIndex],
                ...data,
                // Ensure that no existing metrics are overwritten by only adding non-existing properties
                ...Object.keys(data).reduce((props, key) => {
                    if (!acc[existingEntryIndex].hasOwnProperty(key)) {
                        props[key] = data[key];
                    }
                    return props;
                }, {})
            };
        } else {
            // If not found, add this unique updatedTime data to the accumulator array
            acc.push(data);
        }
        return acc;
    }, []);

    console.log(mergedData);
    mergedData = formatDatesInArray(mergedData, "updatedTime", "MM/DD/YYYY hh A");
    return mergedData;
}

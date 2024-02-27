import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import moment from 'moment';

export const graphArray = [
    {"name": "Phala Average Apr",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "2024-02-01T22:00:00.000000Z" }
                ) {
                    averageApr
                    updatedTime
                }
                }
            `,
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "averageApr",
    },
    {"name": "Phala Average Block Time",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "2024-02-01T22:00:00.000000Z" }
                ) {
                    averageBlockTime
                    updatedTime
                }
                }
            `,
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "averageBlockTime",
    },
    {"name": "Phala Delegator Count",
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
    },
    {"name": "Phala Total Value",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": `
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "2024-02-01T22:00:00.000000Z" }
                ) {
                    totalValue
                    updatedTime
                }
                }
            `,
    "owner": "Cyber Jungle",
    "xAxis": "updatedTime",
    "yAxis": "totalValue",
    }

]

export const fetchGraphDataDateSeries = async (graphName,dateformat) => {
    const dt = daysFromNow(7);
    console.log(dt);
    const client = new ApolloClient({
        uri: graphArray[0].URI[0],
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql(graphArray[0].query.replace("<<datetime>>", dt))
    });

    let newdata = formatDatesInArray(data.globalStateSnapshots, "updatedTime", dateformat);
    console.log(newdata);
    return newdata;
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
   

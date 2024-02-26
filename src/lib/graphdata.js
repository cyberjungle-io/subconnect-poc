import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

const graphArray = [
    {"name": "Phala Average Apr",
    "chain": "Khala",
    "URI": ["https://khala-computation.cyberjungle.io/graphql"],
    "queryType": "time",
    "queryVars": [{"Update Time":"String"}, {"Limit":"Int"}],
    "query": gql`
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
    "query": gql`
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
    "query": gql`
                query {
                globalStateSnapshots(
                    limit: 1000
                    orderBy: updatedTime_ASC
                    where: { updatedTime_gt: "2024-02-01T22:00:00.000000Z" }
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
    "query": gql`
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

export const fetchGraphData = async (graphName) => {
    const client = new ApolloClient({
        uri: graphArray[0].URI[0],
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: graphArray[0].query
    });

    console.log(data);
    return data;
}

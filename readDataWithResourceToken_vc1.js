const { CosmosClient } = require('@azure/cosmos');

const endpoint = "https://xxx.documents.azure.com:443/";
const databaseId = "xxx";
const containerId = "test1";
const resourceToken = "type=resource&xxx";

// The resource path that corresponds to the container
const containerResourcePath = `dbs/${databaseId}/colls/${containerId}`;

// Initialize CosmosClient with resource token and resource path
const client = new CosmosClient({
    endpoint,
    resourceTokens: {
        [containerResourcePath]: resourceToken
    }
});

async function queryItems() {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Define your SQL query with a filter
    const query = {
        query: "SELECT * FROM c WHERE c.id = @value",
        parameters: [
            { name: "@value", value: "123" } // Replace "someValue" with the actual value you want to filter on
        ]
    };

    try {
        const { resources: results } = await container.items.query(query).fetchAll();
        console.log("Query results:", results);
    } catch (error) {
        console.error("Error occurred while querying items:", error.message);
    }
}

queryItems();

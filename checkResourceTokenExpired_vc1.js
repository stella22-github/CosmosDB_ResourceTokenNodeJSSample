const { CosmosClient } = require('@azure/cosmos');

const endpoint = "https://xxxx.documents.azure.com:443/";
const key = "xxx"; // Admin key used to generate resource tokens
const databaseId = "xxx";
const containerId = "xx";
const userId = "xxx"; // The user ID for whom the resource token is generated
const permissionId = "readPermission"; // ID of the permission you will create

let resourceToken = null; // To store the resource token
let tokenExpiry = null;   // To store the expiry time of the token

// Initialize CosmosClient with Admin key to manage permissions
const adminClient = new CosmosClient({ endpoint, key });

async function generateResourceToken() {
    const database = adminClient.database(databaseId);
    const user = database.user(userId);

    try {
        // Permissions API does not have `createOrUpdate` but has `upsert` to create or update
        const { resource: permission } = await user.permissions.upsert({
            id: permissionId, // The ID for the permission
            permissionMode: "Read", // or "All" if read-write access is needed
            resource: `dbs/${databaseId}/colls/${containerId}`
        });

        // Store the new token and its expiry time
        resourceToken = permission._token; // It's `_token` not `token`
        tokenExpiry = Date.now() + (60 * 60 * 1000); // Assuming 1-hour expiry (3600 seconds)

        console.log("Resource token generated:", resourceToken);
        console.log("Token expiry time set to 1 hour from now.");
    } catch (error) {
        console.error("Error generating resource token:", error.message);
    }
}

async function checkAndRefreshToken() {
    // If token is not present or is expired, regenerate it
    if (!resourceToken || Date.now() >= tokenExpiry) {
        console.log("Token is missing or expired. Regenerating token...");
        await generateResourceToken();
    } else {
        console.log("Token is still valid.");
    }
}

async function queryData() {
    // Check if the token is valid and refresh it if necessary
    await checkAndRefreshToken();

    // Initialize CosmosClient with the resource token for operations
    const client = new CosmosClient({
        endpoint,
        resourceTokens: {
            [`dbs/${databaseId}/colls/${containerId}`]: resourceToken
        }
    });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    const query = {
        query: "SELECT * FROM c WHERE c.property = @value",
        parameters: [{ name: "@value", value: "123" }]
    };

    try {
        const { resources: results } = await container.items.query(query).fetchAll();
        console.log("Query results:", results);
    } catch (error) {
        console.error("Error occurred while querying data:", error.message);
    }
}

// Example usage to demonstrate token generation and querying
(async function main() {
    console.log("Starting resource token life cycle...");
    
    // 1. Initially generate the resource token
    await generateResourceToken();

    // 2. Use the resource token to query data
    await queryData();

    // 3. Simulate the token expiring and refresh (for demonstration purposes)
    console.log("Simulating token expiry...");
    tokenExpiry = Date.now();  // Force expiry

    // 4. Query again, which will trigger token regeneration
    await queryData();
})();

const { CosmosClient } = require('@azure/cosmos');

// Replace with your actual values
const endpoint = "https://xxxx.documents.azure.com:443/";
const key = "xxxxx";
const databaseId = "xxx";
const containerId = "test1";
const userId = "testUser2";

async function main() {
    // Create a new CosmosClient instance
    const client = new CosmosClient({ endpoint, key });

    // Reference the database
    const database = client.database(databaseId);

    // Check if the user exists
    let user;
    try {
        user = await database.user(userId).read();
        console.log("User exists:", user.resource.id);
    } catch (error) {
        if (error.code === 404) {
            // User doesn't exist, create a new one
            const response = await database.users.create({ id: userId });
            user = response.resource;
            console.log("User created:", user.id);
        } else {
            throw error; // Rethrow any other errors
        }
    }

    // Define permissions for the user (e.g., Read access to a container)
    const permissionDefinition = {
        id: "readPermission", // Permission ID
        permissionMode: "Read", // Permission mode (Read, All)
        resource: database.container(containerId).url, // Resource link (container in this case)
    };

    // Assign the permission to the user
    const { resource: permission } = await database.user(userId).permissions.create(permissionDefinition);
    console.log("Permission created:", permission.id);

    // The resource token for accessing the resource
    const resourceToken = permission._token;
    console.log("Generated resource token:", resourceToken);

    // You can now use this token with the previous Node.js script for accessing Cosmos DB
}

main().catch(err => {
    console.error("An error occurred:", err);
});

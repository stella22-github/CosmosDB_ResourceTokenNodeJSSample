Resource tokens in Azure Cosmos DB are typically used to grant fine-grained access control to specific resources within a Cosmos DB account. These tokens are primarily intended for use within application code, where the token can be used to authenticate requests to Cosmos DB. Resource token generation and management are handled by the native Azure Cosmos DB client libraries.

Firstly, please use the script to generate the resource token from Cosmos DB for the user that you granted with permission. After that retrieve the resource token, pass it in with the read Data script. This script provides a straightforward way to query Cosmos DB with filters using a resource token for authorization. Ensure you replace placeholders with your actual endpoint, database ID, container ID, and other necessary values. 

Generate resource token using nodejs SDK.
 ![image](https://github.com/user-attachments/assets/0dc23cd5-dc69-46b7-983d-d2a51f9a47e7)


Pass in the resource token then read the data using resource token.
 ![image](https://github.com/user-attachments/assets/1ff29b29-4906-4129-b2b4-816d722a3d14)


Ref doc: 
https://learn.microsoft.com/en-us/azure/cosmos-db/secure-access-to-data?tabs=using-primary-key#differences-between-rbac-and-resource-tokens
[Learn how to secure access to data in Azure Cosmos DB | Microsoft Learn](https://learn.microsoft.com/en-us/azure/cosmos-db/secure-access-to-data?tabs=using-primary-key#resource-tokens)
Video concept & Demo - [Using resource tokens with Azure Cosmos DB | Microsoft Learn](https://learn.microsoft.com/en-us/shows/on-dotnet/using-resource-tokens-with-azure-cosmos-db)



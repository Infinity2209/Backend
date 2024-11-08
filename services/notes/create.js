const uuid = require('uuid');
const handler = require('./libs/handler-lib');
const dynamoDb = require('./libs/dynamodb-lib');

module.exports.main = handler(async (event, context) => {
    try {
        // Parse the incoming request data
        const data = JSON.parse(event.body);
        
        // Basic validation for required fields
        if (!data.content) {
            throw new Error("Content field is required.");
        }

        const params = {
            TableName: process.env.tableName,
            Item: {
                userId: event.requestContext.identity.cognitoIdentityId, // The ID of the author
                noteId: uuid.v4(), // A unique UUID for the note
                content: data.content, // Note content
                attachment: data.attachment || null, // Optional attachment
                createdAt: Date.now(), // Current Unix timestamp
            },
        };

        // Attempt to save to DynamoDB
        await dynamoDb.put(params);

        // Return the created item
        return params.Item;

    } catch (error) {
        console.error("Error saving note:", error);
        throw new Error("Could not save the note.");
    }
});

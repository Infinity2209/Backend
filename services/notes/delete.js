const handler = require("./libs/handler-lib");
const dynamoDb = require("./libs/dynamodb-lib");

exports.main = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key and sort key of the item to be removed
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
            noteId: event.pathParameters.id, // The id of the note from the path
        },
    };
    await dynamoDb.delete(params);
    return { status: true };
});

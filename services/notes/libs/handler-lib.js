const debug = require("./debug-lib");

module.exports = function handler(lambda) {
  return async function (event, context) {
    let body, statusCode;

    // Initialize debugger with event and context
    debug.init(event, context);

    try {
      // Execute the Lambda function passed as argument
      body = await lambda(event, context);
      statusCode = 200; // Success HTTP status code
    } catch (e) {
      // Log error details and debug messages
      debug.flush(e);

      // Set error response with proper message and status code
      body = { error: e.message || "Internal Server Error" };
      statusCode = e.statusCode || 500;
    }

    // Return the structured HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
};

const errorHandler = (err, req, res, next) => {
  console.log("Error stack:", err.stack);

  //if it is a validation error, send a 400 response with the error details
  if (err.name === 'ValidationError') {
    return res.status(400).send({ 
        type: "ValidationError",
        details: err.details,
    });
  }

  //if it is an AppError
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
        errorCode: error.errorCode,
    })
  }

  //If it is a random error
  return res.status(500).send("Something went wrong!");
}

module.exports = errorHandler;
// This middleware function logs the error stack to the console and sends a 500 Internal Server Error response to the client with a JSON object containing an error message. It is typically used as the last middleware in the Express.js middleware stack to catch any unhandled errors that occur during request processing.
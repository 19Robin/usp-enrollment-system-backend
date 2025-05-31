exports.tryCatch =(controller) => async(req, res, next) => {
    try{
        await controller(req, res);
    }
    catch(error){
        return next(error);
    }    
};   

//this function is a higher-order function that takes a controller function as an argument and returns a new function. The returned function is an asynchronous middleware function that handles errors using a try-catch block. If an error occurs during the execution of the controller, it passes the error to the next middleware in the Express.js stack using next(error). This pattern is commonly used in Express.js applications to handle errors in a clean and consistent manner. It allows you to avoid repetitive try-catch blocks in each controller function.
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'something went wrong';


/////////////////////////for debugging
    // console.error('Full Error:', err);

    // console.error('Error:', {
    //     message: err.message,
    //     stack: err.stack,
    //     statusCode: err.statusCode,
    //   });

/////////////////////////////
    
        res.status(err.statusCode).json({
            success: false,
            message: err.message, 
        }) 
    }
    
    export default errorMiddleware;
import * as stackTrace from 'stack-trace';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // Access the stackTrace object as needed
    // For example, you might want to use it like stackTrace.get();
  }
}

export default AppError;
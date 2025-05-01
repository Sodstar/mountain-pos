class MyError extends Error {
    statusCode = 500;
    constructor(message: string, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export default MyError;
  
export class AppError extends Error {
    public readonly statusCode : number
    public readonly code : string
    public readonly details? : unknown
    public readonly isOperational : unknown
    
    constructor(
    message :string,
    statusCode: number,
    code : string,
    details? : unknown        
) { 
    super(message);


    this.name = 'App-Error';
    this.statusCode = statusCode;
    this.code = code
    this.details = details
    this.isOperational = this.isOperational

    Error.captureStackTrace(this , AppError)


}


}
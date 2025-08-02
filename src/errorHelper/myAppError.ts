
class myAppError extends Error{
   public readonly statusCode:number
    constructor(statusCode:number, message:string, stack = ""){
        super(message)
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default myAppError
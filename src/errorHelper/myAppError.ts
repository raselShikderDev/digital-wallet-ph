class myAppError extends Error{
   
    constructor(public statusCode:number, message:string, stack = ""){
        super(message)
        this.statusCode = statusCode,
        this.message = message
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default myAppError
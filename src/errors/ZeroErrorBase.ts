import { ZeroErrorCode } from "@/types/error.js";

// errors/ZeroErrorBase.ts
export abstract class ZeroErrorBase extends Error {
    public readonly code: ZeroErrorCode;
    public readonly timestamp: number;
    public readonly cause?: Error;
    
    constructor(code: ZeroErrorCode, message: string, cause?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = Date.now();
        this.cause = cause;
        
        // Ensure proper prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
        
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    
    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            timestamp: this.timestamp,
            stack: this.stack,
            cause: this.cause ? {
                name: this.cause.name,
                message: this.cause.message,
                stack: this.cause.stack
            } : undefined
        };
    }
}
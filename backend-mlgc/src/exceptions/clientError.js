class ClientError extends Error {
    /**
     * Membuat instance ClientError
     * @param {string} message - 
     * @param {number} statusCode - 
     */
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "ClientError";
        this.statusCode = statusCode;


        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ClientError);
        }
    }
}

module.exports = ClientError;

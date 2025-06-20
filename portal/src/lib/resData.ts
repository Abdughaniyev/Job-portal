export class ResData<T> {

    constructor(
        public message: string,
        public statusCode: number,
        public data?: T | null,
        public error?: Error | null,
    ) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
    }
}
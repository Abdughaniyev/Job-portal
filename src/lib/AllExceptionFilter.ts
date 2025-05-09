import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { response } from "express";
import { ResData } from "./resData";

@Catch()
export class AllExceptionFlter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const responseBody = new ResData(
            '',
            HttpStatus.INTERNAL_SERVER_ERROR,
            null,
            exception,
        );

        if (exception instanceof HttpException) {
            const response = exception.getResponse();

            if (typeof response === 'string') {
                responseBody.message = response;
                responseBody.statusCode = exception.getStatus()
            }
        }

        else {
            responseBody.message = exception.message;
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode)

    }
}
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "../errors/all-exceptions/all-exceptions.filter";


export const setupGlobalConfig = (app: INestApplication<any>) => {
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    // app.useGlobalFilters(new AllExceptionsFilter())

}
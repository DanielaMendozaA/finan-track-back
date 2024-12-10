import { Transform, Type } from "class-transformer";
import { IsDate, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TransactionTypeEnum } from "src/enums/transaction-type.enum";

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({value}) => value ? new Date(value) : value)
    date: Date;

    @IsEnum(TransactionTypeEnum)
    @IsNotEmpty()
    type: TransactionTypeEnum

    @IsNotEmpty()
    @IsDecimal()
    amount: number

    @IsInt()
    @IsOptional()
    categoryId: number

    @IsInt()
    @IsOptional()
    budgetId: number

}

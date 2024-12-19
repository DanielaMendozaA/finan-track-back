import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";
import { BudgetTypeEnum } from "src/enums/budget-type.enum";
import { CurrencyEnum } from "src/enums/currency.enum";
import { FrequencyEnum } from "src/enums/frequency.enum";

export class CreateBudgetDto {
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    baseAmount: number;

    @IsEnum(BudgetTypeEnum)
    @IsNotEmpty()
    type: BudgetTypeEnum

    @IsEnum(FrequencyEnum)
    @IsOptional()
    frequency: FrequencyEnum

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : value)
    startDate: Date

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : value)
    endDate: Date

    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    @IsEnum(CurrencyEnum)
    currency : CurrencyEnum


}

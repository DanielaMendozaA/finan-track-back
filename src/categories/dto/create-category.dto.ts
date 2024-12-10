import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsNotEmpty()
    @IsDecimal()
    baseAmount: number;

    @IsNotEmpty()
    @IsDecimal()
    currentAmount: number;

    @IsInt()
    @IsNotEmpty()
    budgetId: number

    


}

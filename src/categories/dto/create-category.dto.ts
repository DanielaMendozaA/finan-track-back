import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CategoryType } from "src/enums/category-type.enum";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    baseAmount: number;

    @IsInt()
    @IsNotEmpty()
    budgetId: number

    @IsEnum(CategoryType)
    @IsNotEmpty()
    type: CategoryType




}

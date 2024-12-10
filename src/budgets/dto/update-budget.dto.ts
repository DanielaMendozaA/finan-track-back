import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateBudgetDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    baseAmount: number;

}

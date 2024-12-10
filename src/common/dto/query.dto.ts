import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @Type(() => Number) 
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be a positive integer' })
  limit?: number

  @IsOptional()
  @Type(() => Number) 
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be a positive integer' })
  page?: number

}

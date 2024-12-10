import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from 'src/common/dto/query.dto';

export class BudgetQueryDto extends QueryDto{
  @IsOptional()
  @IsUUID()
  userId: string
}

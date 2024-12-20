import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetQueryDto } from './dto/query-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get('frequency')
  findAllFrequency(@Query() query: BudgetQueryDto) {
    return this.budgetsService.findAllFrequencyByUser(query.userId)
  }

  @Get('occasional')
  findAllOccasional(@Query() query: BudgetQueryDto) {
    return this.budgetsService.findAllOccasionalByUser(query.userId)
  }

  
  @Get(':id')
  findOne(@Param('id') id: number){
    return this.budgetsService.findOne(id)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(+id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(+id);
  }
}

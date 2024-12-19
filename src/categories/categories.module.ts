import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BudgetsModule } from 'src/budgets/budgets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    BudgetsModule
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [
    TypeOrmModule,
    CategoriesService
  ]
})
export class CategoriesModule {}

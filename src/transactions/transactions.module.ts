import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { BudgetsModule } from 'src/budgets/budgets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    CategoriesModule,
    BudgetsModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

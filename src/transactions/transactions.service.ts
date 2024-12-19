import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Budget } from 'src/budgets/entities/budget.entity';
import { TransactionTypeEnum } from 'src/enums/transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,

  ) {

  }
  async create(createTransactionDto: CreateTransactionDto) {
    const { type, amount, categoryId, budgetId } = createTransactionDto;
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: ['budget']
      });
      if (!category) {
        throw new Error('La categoría no existe');
      }

      const budget = await this.budgetRepository.findOne({ where: { id: category.budget.id } });
      if (!budget) {
        throw new Error('El presupuesto asociado no existe');
      }

      if (type === TransactionTypeEnum.EXPENSE) {
        category.currentAmount = +category.currentAmount - +amount;
        budget.currentAmount = +budget.currentAmount + +amount;


        await this.categoryRepository.save(category);
        await this.budgetRepository.save(budget);
      } else if (type === TransactionTypeEnum.INCOME) {

        category.baseAmount += amount;
        category.currentAmount += amount;

        await this.categoryRepository.save(category);
      } else {
        throw new Error('Tipo de transacción no válido para categoría');
      }



    } else if (budgetId) {
      const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
      if (!budget) {
        throw new Error('El presupuesto no existe');
      }

      if (type === TransactionTypeEnum.EXPENSE) {
        if (amount > budget.currentAmount) {
          throw new Error('El gasto excede el presupuesto disponible');
        }

        budget.baseAmount -= amount;
        budget.currentAmount -= amount;
        await this.budgetRepository.save(budget);
      } else if (type === TransactionTypeEnum.INCOME) {


        budget.baseAmount = +budget.baseAmount + +amount;
        budget.currentAmount = +budget.currentAmount + +amount;
        await this.budgetRepository.save(budget);
      } else {
        throw new Error('Tipo de transacción no válido para presupuesto');
      }
    } else {
      throw new Error('Debe proporcionar un ID de categoría o un ID de presupuesto');
    }
    const createdTransaction = this.transactionRepository.create(createTransactionDto)
    return await this.transactionRepository.save(createdTransaction);
  }


  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

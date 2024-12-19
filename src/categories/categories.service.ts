import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { BudgetsService } from 'src/budgets/budgets.service';
import { isAfter, subHours } from 'date-fns';
import { DataSource } from 'typeorm';
import { Budget } from 'src/budgets/entities/budget.entity';

@Injectable()
export class CategoriesService {
  private readonly currentDate: Date;
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly budgetService: BudgetsService,
    private readonly dataSource: DataSource

  ) {
    this.currentDate = subHours(new Date(), 5)

  }


  // async create(createCategoryDto: CreateCategoryDto) {
  //   const budget = await this.budgetService.findOne(createCategoryDto.budgetId);

  //   if (isAfter(this.currentDate, budget.endDate))
  //     throw new BadRequestException("The chosen budget shoudn't be in completed status");

  //   const totalBudgetAmount = budget.categories.reduce((total, category) => total + category.baseAmount, 0);

  //   console.log("categories total", totalBudgetAmount);

  //   const availableAmount = budget.baseAmount - totalBudgetAmount;

  //   if (availableAmount < createCategoryDto.baseAmount)
  //     throw new ConflictException(
  //       `The budget does not have enough capacity. Available amount: ${availableAmount}, requested amount: ${createCategoryDto.baseAmount}.`,
  //     );

  //   const categoryToCreate = {
  //     ...createCategoryDto,
  //     currentAmount: createCategoryDto.baseAmount
  //   }

  //   const createdCategory = this.categoryRepository.create(categoryToCreate)
  //   return await this.categoryRepository.save(createdCategory)

  // }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.dataSource.transaction(async (manager) => {
      const budget = await manager.findOne(Budget, {
        where: { id: createCategoryDto.budgetId },
        relations: ['categories'],
      });

      console.log("este es el budget", budget );
      
  
      if (!budget) throw new NotFoundException("Budget not found");
  
      if (isAfter(this.currentDate, budget.endDate)) {
        throw new BadRequestException(
          "The chosen budget shouldn't be in completed status"
        );
      }
  
      const totalBudgetAmount = budget.categories.reduce(
        (total, category) => total + Number(category.baseAmount),
        0
      );

      console.log("este es el total categories",totalBudgetAmount );
      
  
      const availableAmount = Number(budget.baseAmount) - totalBudgetAmount;

      console.log("este es el monto disponible",availableAmount, typeof(availableAmount) );
  
      if (availableAmount < createCategoryDto.baseAmount) {
        throw new ConflictException(
          `The budget does not have enough capacity.Available amount: ${availableAmount} requested amount: ${createCategoryDto.baseAmount}.`
        );
      }
  
      const categoryToCreate = manager.create(Category, {
        ...createCategoryDto,
        currentAmount: createCategoryDto.baseAmount,
        budget
      });
  
      const createdCategory = await manager.save(Category, categoryToCreate);
  
      return createdCategory;
    });
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}

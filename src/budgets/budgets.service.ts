import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { startOfWeek, addDays, isBefore, subHours, isEqual, isAfter } from "date-fns";

import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { FrequencyEnum } from 'src/enums/frequency.enum';
import { BudgetTypeEnum } from 'src/enums/budget-type.enum';
import { UsersService } from 'src/users/users.service';

interface NewDates {
  startDate: Date | null,
  endDate: Date | null

}

@Injectable()
export class BudgetsService {
  private readonly currentDate: Date;
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly userService: UsersService

  ) {
    this.currentDate = subHours(new Date(), 5)

  }

  createDatesBudgetFrequency(type: FrequencyEnum) {
    console.log("esta es la fecha actual", this.currentDate);


    let newDates: NewDates = {
      startDate: null,
      endDate: null
    }

    switch (type) {
      case FrequencyEnum.MONTLY:
        newDates.startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        console.log("Esta es la fecha de inicio", newDates.startDate);
        newDates.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        console.log("Esta es la fecha de fin", newDates.endDate);
        break;

      case FrequencyEnum.BIWEEKLY:
        const dayOfMonth = this.currentDate.getDate()
        console.log("Este es el dia del mes", dayOfMonth);
        if (dayOfMonth >= 15) {
          newDates.startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 16);
          console.log("Esta es la fecha de inicio", newDates.startDate);
          newDates.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
          console.log("Esta es la fecha de fin", newDates.endDate);
        } else {
          newDates.startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
          console.log("Esta es la fecha de inicio", newDates.startDate);
          newDates.endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 15);
          console.log("Esta es la fecha de fin", newDates.endDate);
        }
        break;

      case FrequencyEnum.WEEKLY:
        newDates.startDate = startOfWeek(this.currentDate, { weekStartsOn: 1 })
        console.log("Esta es la fecha de inicio", newDates.startDate);
        newDates.endDate = addDays(newDates.startDate, 6);
        console.log("Esta es la fecha de fin", newDates.endDate);
        break;
    }
    return newDates;

  }

  validateDatesOccasional(startDate: Date, endDate: Date) {
    if (isBefore(startDate, this.currentDate))
      throw new BadRequestException("Start date should'n be before today");

    if (isBefore(endDate, startDate) || isEqual(startDate, endDate))
      throw new BadRequestException("End date should'n be before start date");

    return true
  }



  async create(createBudgetDto: CreateBudgetDto) {
    const user = await this.userService.findOneByTerm(createBudgetDto.userId);
    let createdBudget: Budget
    const budgetToCreate = {
      ...createBudgetDto,
      currentAmount: createBudgetDto.baseAmount,
      user
    }
    if (createBudgetDto.type === BudgetTypeEnum.FREQUENCY) {
      const { startDate, endDate } = this.createDatesBudgetFrequency(createBudgetDto.frequency);
      budgetToCreate.startDate = startDate
      budgetToCreate.endDate = endDate
    } else {
      this.validateDatesOccasional(createBudgetDto.startDate, createBudgetDto.endDate);
      budgetToCreate.startDate = createBudgetDto.startDate;
      budgetToCreate.endDate = createBudgetDto.endDate;
    }

    createdBudget = this.budgetRepository.create(budgetToCreate);
    return await this.budgetRepository.save(createdBudget);
  }

  async findAllFrequencyByUser(userId: string) {
    const user = await this.userService.findOneByTerm(userId);
    const budgets = await this.budgetRepository.find({
      where: {
        user,
        type: BudgetTypeEnum.FREQUENCY
      },
      relations: ['categories']
    })
    return budgets;
  }

  async findAllOccasionalByUser(userId: string) {
    const user = await this.userService.findOneByTerm(userId);
    const budgets = await this.budgetRepository.find({
      where: {
        user,
        type: BudgetTypeEnum.OCCASIONAL
      },
      relations: ['categories']
    })
    return budgets;

  }

  async findOne(id: number) {
    const budget = await this.budgetRepository.findOne({
      where: {
        id
      },
      relations: ['categories']
    })
    if (!budget)
      throw new NotFoundException("Budget not found");

    return budget;

  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.findOne(id);

    if (isAfter(this.currentDate, budget.endDate))
      throw new BadRequestException("You can't modify a completed budget");

    return this.budgetRepository.update(id, updateBudgetDto)
  }

  async remove(id: number) {
    const budget = await this.findOne(id);

    if (isAfter(this.currentDate, budget.startDate))
      throw new BadRequestException("You can't modify a completed or in progress budget");

    return this.budgetRepository.delete(id);
  }
}

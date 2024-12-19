import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './common/config/db-config';
import { JoiValidation } from './common/config/joi-validation';
import { TokensModule } from './tokens/tokens.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidation,
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService

    }),
    CommonModule,
    AuthModule,
    UsersModule,
    TokensModule,
    BudgetsModule,
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Controller, Get, Param, NotFoundException, Query, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { EmailDto } from './dto/email.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) { }

  @Get(':term')
  async findOneByTerm(@Param('term') term: string) {

    const user = await this.userService.findOneByTerm(term);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user
  }

  @Get()
  findUsers(@Query() query: QueryDto) {
    return this.userService.findAllUsers(query)

  } 

  @Post('change-password')
  changePasswordUserRequest(@Body() emailDto: EmailDto) {
    return this.userService.forgotPasswordRequest(emailDto.email);
  }



}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { AuthGuard } from '@/auth/auth.guard';
import { User } from '@/user.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@User() user) {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  // @Patch(':uuid')
  // update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+uuid, updateUserDto);
  // }

  // @Delete(':uuid')
  // remove(@Param('uuid') uuid: string) {
  //   return this.usersService.remove(+uuid);
  // }
}

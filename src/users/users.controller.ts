import { Controller, DefaultValuePipe, Get, Param, ParseDatePipe, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ArticlesService } from 'src/articles/articles.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly articleService: ArticlesService
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req){
    const userId = req.user.sub;
    return this.usersService.getProfile(userId)
  }

  @Get(':id/articles')
  async getUserArticles(
    @Param('id', ParseDatePipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ){
    return this.articleService.getUserPublishedArticles(userId, {page, limit})
  }
}

import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@nestjs/passport';
import { createArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createArticle(
    @Body() createArticleDto: createArticleDto,
    @Req() req: any
  ){
    const userId = req.user.sub;
    return this.articlesService.create(createArticleDto, userId)
  }

  @Get()
  async getFeed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('categiryId', new ParseIntPipe({optional: true})) categoryId: number,
  ){
    return this.articlesService.getArticlesFeed({page, limit, categoryId})
  }
}

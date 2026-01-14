import { ForbiddenException, Injectable } from '@nestjs/common';
import { createArticleDto } from './dto/create-article.dto';
import { ADDRGETNETWORKPARAMS } from 'dns/promises';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ArticlesService {
    constructor(
        private readonly prisma: PrismaDatabaseService){}
        
    async create(dto: createArticleDto, authorId: number){
        if(dto.categoryId){
            const categoryExists = await this.prisma.category.findUnique({
                where:{id: dto.categoryId}
            });
            if(!categoryExists){
                throw new ForbiddenException('Указанной категории не существует')
            }
        }
        const article = await this.prisma.article.create({
            data:{
                title: dto.title,
                content: dto.content,
                expert: dto.expert,
                image: dto.image,
                isPublished: dto.isPublished ?? false,
                publishedAt: dto.isPublished ? new Date() : null,
                authorId,
                categoryId: dto.categoryId || null
            },
            include:{
                author: { select:{id: true, username: true, name: true} },
                category: { select: {id: true, name: true} },
            },
        });
        return article;   
    }

    async getArticlesFeed(params: {page: number; limit: number; categoryId: number}){
        const {page, limit, categoryId} = params;
        const skip = (page - 1) * limit;

        const where: Prisma.ArticleWhereInput = {
            isPublished: true,
            publishedAt: { lte: new Date() },
        }
        if(categoryId) where.categoryId = categoryId;

        const [items, total] = await Promise.all([
            this.prisma.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{publishedAt: 'desc'}, {createdAt: 'desc'}],
                include:{
                    author: {select:{ id: true, username: true, name: true } },
                    category:{select:{id: true, name: true} }
                },
            }),
            this.prisma.article.count({where})
        ]);
        return {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }
        async getUserPublishedArticles(userId: number, params:{page: number; limit: number}){
        const {page, limit} = params;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.article.findMany({
                where:{
                    authorId: userId,
                    isPublished: true,
                    publishedAt: {lte: new Date() }
                },
                skip,
                take: limit,
                orderBy: {publishedAt: 'desc'},
                include:{
                    category: { select:{id: true, name: true}}
                },
            }),
            this.prisma.article.count({
                where: {authorId: userId, isPublished: true, publishedAt:{lte: new Date() } },
            })
        ]);
        return{
            items, 
            pagination: {total, page, limit, totalPages: Math.ceil(total / limit)}
        }
    }
}

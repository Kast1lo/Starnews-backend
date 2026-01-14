import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

@Injectable()
export class UsersService {
    constructor(
        protected readonly prisma: PrismaDatabaseService
    ){}
    async getProfile(userId: number){
        const user = await this.prisma.user.findUnique({
            where:{ id: userId },
            select:{
                id: true,
                email: true,
                username: true,
                createdAt: true
            }
        });
        if(!user){
            throw new NotFoundException('Пользователь не найден')
        }
        return user
    }
}

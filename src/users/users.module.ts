import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [PrismaDatabaseModule,
    ArticlesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

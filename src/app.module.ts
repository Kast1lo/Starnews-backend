import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDatabaseModule } from './prisma-database/prisma-database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ArticlesModule,
    UsersModule,
    ConfigModule.forRoot({                    // ← добавь это первым (или вторым после Prisma, если нужно)
      isGlobal: true,                         // ← делает ConfigService доступным во ВСЕХ модулях без импорта
      envFilePath: '.env',                    
      ignoreEnvFile: false,            
    }),
    PrismaDatabaseModule, AuthModule, UsersModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

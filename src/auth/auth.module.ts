import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,                           
    PrismaDatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },   
      }),
    }),
  ],
  controllers:[AuthController],
  providers:[AuthService, PrismaDatabaseService, ConfigService, JwtStrategy]
})
export class AuthModule {}

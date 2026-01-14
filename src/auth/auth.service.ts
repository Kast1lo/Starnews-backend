import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { RegisterRequest } from './dto/register.dto';
import * as argon2 from 'argon2'
import { LoginRequest } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaDatabaseService,
        private readonly jwtService: JwtService
    ){}

    async register(dto: RegisterRequest){
        const existsUser = await this.prisma.user.findFirst({
            where:{
                OR:[
                    {email: dto.email},
                    {username: dto.username}
                ]
            }
        });
        if(existsUser){
            throw new ConflictException("пользователь с таким email или username уже существует")
        }
        const password = await argon2.hash(dto.password, {
            type: argon2.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1
        });
        const user = await this.prisma.user.create({
            data:{
                username: dto.username,
                email: dto.email,
                password: password,
            },
            select:{
                id: true,
                username: true,
                email: true,
            }
        });
        return this.generateToken(user);
    };
    async login(dto: LoginRequest){
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            },
            select:{
                id: true,
                email: true,
                username: true,
                password: true
            }
        });
        if(!user){
            throw new UnauthorizedException("неверный e-mail или пароль")
        }
        const isValidPassword = await argon2.verify(user.password, dto.password);
        if(!isValidPassword){
            throw new NotFoundException("пользователь не найден")
        }
        const {password, ...safeUser} = user;
        return this.generateToken (safeUser)
    }
    private generateToken(user: { id: number; email: string; username: string }) {
        const payload = { sub: user.id, email: user.email, username: user.username };
        return this.jwtService.sign(payload);
    }
}

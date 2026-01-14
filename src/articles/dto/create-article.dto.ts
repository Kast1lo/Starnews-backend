import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class createArticleDto{
    @IsString({message: 'заголовок должен быть строкой'})
    @IsNotEmpty({message: 'заголовок обязателен к заполнению'})
    @MinLength(6,{message: 'заголовок должен содеражть не менее 6 символов'})
    @MaxLength(128, {message: 'заголовок не должен превышать 128 символов'})
    title: string;

    @IsString({message: 'Содержание должно быть строкой'})
    @IsNotEmpty({message: 'содержание обязательно к заполнению'})
    @MinLength(6,{message: 'содержание должно содеражть не менее 6 символов'})
    @MaxLength(1500, {message: 'содержание не должно превышать 1500 символов'})
    content: string;

    @IsString({message: 'Содержание должно быть строкой'})
    @IsNotEmpty({message: 'содержание обязательно к заполнению'})
    expert: string;

    @IsBoolean()
    @IsOptional()
    image?: string;

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsInt()
    @IsOptional()
    categoryId?: number;
}
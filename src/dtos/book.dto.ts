import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class BookDto{
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    title: string

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    author: string

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    publish_year: number

    @IsDefined()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    page_count: number
}
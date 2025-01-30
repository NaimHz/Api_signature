import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFileDto {
    @IsNotEmpty()
    @IsString()
    code: string;
}

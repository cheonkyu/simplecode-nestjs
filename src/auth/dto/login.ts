import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class Login {
    @ApiProperty({ description: '이메일' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: '비밀번호' })
    @IsString()
    password: string;
}

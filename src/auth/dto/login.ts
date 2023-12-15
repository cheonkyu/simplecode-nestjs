import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class Login {
    @ApiProperty({ description: '이메일' })
    @IsEmail()
    email: string;
}

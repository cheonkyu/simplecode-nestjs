import { IsEmail } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccount {
    @ApiProperty({ description: '이메일' })
    @IsEmail({}, { message: '이메일 양식을 확인해주세요.'})
    email: string;
}

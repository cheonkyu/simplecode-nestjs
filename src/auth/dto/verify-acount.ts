import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyAccount {
    @ApiProperty({ description: '이메일인증코드' })
    @IsString()
    code: string;
}

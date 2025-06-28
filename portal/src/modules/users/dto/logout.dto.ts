import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
    @ApiProperty({
        example: '<your-refresh-token-here>',
        description: 'Refresh token to invalidate during logout',
    })
    @IsString()
    refreshToken: string;
}

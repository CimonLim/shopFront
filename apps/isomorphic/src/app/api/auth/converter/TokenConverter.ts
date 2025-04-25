import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";
import {TokenDto} from "@/app/api/auth/dto/TokenDto.ts";

export class TokenConverter {
    public static toDto(response: TokenResponse): TokenDto {
        try {
            const accessTokenExpiredAt = new Date(response.accessTokenExpiredAt);
            const refreshTokenExpiredAt = new Date(response.refreshTokenExpiredAt);

            // 유효한 날짜인지 검증
            if (isNaN(accessTokenExpiredAt.getTime())) {
                throw new Error('Invalid accessTokenExpiredAt date format');
            }
            if (isNaN(refreshTokenExpiredAt.getTime())) {
                throw new Error('Invalid refreshTokenExpiredAt date format');
            }

            return {
                accessToken: response.accessToken,
                accessTokenExpiredAt,
                refreshToken: response.refreshToken,
                refreshTokenExpiredAt
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to convert TokenResponse to TokenDto: ${error.message}`);
            }
            // 다른 타입의 에러인 경우
            throw new Error('An unknown error occurred during token conversion');
        }
    }

    public static toDtoSafe(response: TokenResponse): TokenDto | null {
        try {
            return this.toDto(response);
        } catch (error: unknown) {
            // error를 적절히 타입 가드하여 처리
            if (error instanceof Error) {
                console.error('Token conversion failed:', error.message);
            } else {
                console.error('Token conversion failed with unknown error');
            }
            return null;
        }
    }
}
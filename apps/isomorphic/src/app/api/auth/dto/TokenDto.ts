export interface TokenDto {
    accessToken: string;
    accessTokenExpiredAt: Date; // ISO 8601 형식의 날짜 문자열
    refreshToken: string;
    refreshTokenExpiredAt: Date; // ISO 8601 형식의 날짜 문자열
}



export interface TokenResponse {
    accessToken: string;
    accessTokenExpiredAt: string; // ISO 8601 형식의 날짜 문자열
    refreshToken: string;
    refreshTokenExpiredAt: string; // ISO 8601 형식의 날짜 문자열
}
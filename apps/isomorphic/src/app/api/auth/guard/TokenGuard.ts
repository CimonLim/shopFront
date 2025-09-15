import {JWT} from "next-auth/jwt";

export class TokenGuard {
    static isValid(token: JWT): boolean {
        return Boolean(
            token?.accessToken &&
            token?.refreshToken &&
            token?.accessTokenExpiredAt &&
            token?.refreshTokenExpiredAt
        );
    }

    static isExpired(token: JWT): boolean {
        if (!this.isValid(token)) {
            return true
        }else{
            const accessTokenExpiredAt = token?.accessTokenExpiredAt;
            if(accessTokenExpiredAt) return Date.now() > new Date(accessTokenExpiredAt).getTime();
            else return true;
        }
    }
}
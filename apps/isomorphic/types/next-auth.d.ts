import { DefaultSession } from 'next-auth';
import { UserRole, UserStatus } from '@/app/api/user/response/enums';
import {DefaultJWT} from "next-auth/jwt";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: UserRole;
      status?: UserStatus;
      createdAt: string;
    } & DefaultSession['user'] // name, email, image를 포함

    accessToken: string;
    accessTokenExpiredAt: string;
    refreshToken: string;
    refreshTokenExpiredAt: string;
  }

  // User 타입 확장
  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
    refreshTokenExpiredAt: string;
    createdAt: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiredAt?: string;
    refreshTokenExpiredAt?: string;
    sub?: string;
  }

}

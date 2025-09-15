import {Account, type NextAuthOptions, User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/env.mjs';
import { pagesOptions } from './pages-options';
import {UserService} from "@/app/api/user/UserService.ts";
import {AuthService} from "@/app/api/auth/authService.ts";
import {JWT} from "next-auth/jwt";
import {TokenGuard} from "@/app/api/auth/guard/TokenGuard.ts";

export const authOptions: NextAuthOptions = {
  debug:true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: (Number(env.COOKIE_HOUR) || 12) * 60 * 60, // 12 hours
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const { email, password } = credentials;
        if (!email?.trim() || !password?.trim()) {
          throw new Error('Please provide both email and password');
        }

        try {

          // 백엔드 로그인 API 호출
          const token = await UserService.login(email, password);
          const user = await UserService.me(token.accessToken);

          return {
            ...user,
            ...token
          };
        } catch (error) {
          if (error instanceof Error) {
            pagesOptions.error = error.message;
            throw new Error(error.message);
          }
          throw new Error('Authentication failed');
        }
      },
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],

  callbacks: {

    // getSession Customize
    async session({ session, token }) {
      console.log('in session')
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
    async jwt({ token, user}: { token: JWT; user?: User;}) {
      console.log('in jwt')
      // 초기 로그인 시
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiredAt: user.accessTokenExpiredAt,
          refreshTokenExpiredAt: user.refreshTokenExpiredAt,
          sub: user.id
        };
      }

      if (!TokenGuard.isValid(token)) {
        return {};
      }

      // 액세스 토큰이 만료되었는지 확인
      if (TokenGuard.isExpired(token) ) {
        try {
            // 리프레시 토큰으로 새 액세스 토큰 발급
          const refreshToken = token?.refreshToken;

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          const tokenResponse =  await AuthService.refreshToken(refreshToken);

          return {
            ...token,
            ...tokenResponse
          };

        } catch (error) {
          // 리프레시 실패 시 로그아웃 처리를 위해 토큰 정보 삭제
          return {};
        }
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

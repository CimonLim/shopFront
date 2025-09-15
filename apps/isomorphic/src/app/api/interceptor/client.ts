// lib/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { env } from '@/env.mjs';
import {AuthService} from "@/app/api/auth/authService.ts";
import applyCaseMiddleware from 'axios-case-converter';
import { routes } from '@/config/routes';
import { TokenErrorCode } from '../common/errors/TokenErrorCode';
import { redirectToSignIn } from '@/lib/utils/redirect.ts';


// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 후 대기 중인 요청들을 처리
const onRefreshed = (token: string) => {
    refreshSubscribers.map(callback => callback(token));
    refreshSubscribers = [];
};

// 토큰 갱신 요청을 구독
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

export const apiClient = applyCaseMiddleware(axios.create({
    baseURL: env.BACKEND_BASE_URL,
    timeout: 10000,
}));

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

        console.log('Request URL:', config.url);
        console.log('Request Method:', config.method);
        console.log('Request Headers:', config.headers);
        console.log('Request Data:', config.data);

        // 인증이 필요한 엔드포인트 체크 (/api 로 시작하는 경로)
        if (config.url?.startsWith('/api')) {
            const session = await getSession();
            if (session?.accessToken) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
      const originalRequest: any = error.config;

      // 서버 응답 구조 확인
      const responseData = error.response?.data as any;
      const resultCode = responseData?.result?.result_code;
      const TOKEN_ERROR_CODES = [
        TokenErrorCode.TOKEN_EXPIRED, TokenErrorCode.INVALID_TOKEN,
        TokenErrorCode.AUTHORIZATION_TOKEN_NOT_FOUND, TokenErrorCode.TOKEN_EXCEPTION
      ];
      
      
      // 토큰 에러 체크 및 재시도 방지
      if (TOKEN_ERROR_CODES.includes(resultCode) && !originalRequest._retry) {
          
        //바로 로그인 페이지로
        const invalid_error_codes = [
            TokenErrorCode.INVALID_TOKEN, TokenErrorCode.AUTHORIZATION_TOKEN_NOT_FOUND,
            TokenErrorCode.TOKEN_EXCEPTION
        ]
        if (invalid_error_codes.includes(resultCode)) {
            redirectToSignIn('로그인이 필요합니다.');
            return Promise.reject(error);
        }
        
        // 토큰 갱신 처리
        if (isRefreshing) {
            // 토큰 갱신 중이면 새 토큰을 기다림
            return new Promise((resolve, reject) => {
                addRefreshSubscriber((token: string) => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    } else {
                        reject(error);
                    }
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const session = await getSession();
            const refreshToken = session?.refreshToken;

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const tokenResponse = await AuthService.refreshToken(refreshToken);
            const accessToken = tokenResponse.accessToken;

            // 대기 중인 요청들 처리
            onRefreshed(accessToken);

            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
            
        } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
            
            // 토큰 갱신 실패 시 로그아웃 처리
            onRefreshed(''); // 대기 중인 요청들에게 실패 알림
            
            // 로그인 페이지로 리다이렉트
            redirectToSignIn('로그인이 필요합니다.');
            
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
      }

      // 기타 에러는 그대로 전달
      return Promise.reject(error);
  }
);

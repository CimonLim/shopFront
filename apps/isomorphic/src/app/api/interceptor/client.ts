// lib/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { env } from '@/env.mjs';
import {AuthService} from "@/app/api/auth/authService.ts";
import applyCaseMiddleware from 'axios-case-converter';


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

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // 토큰 만료 에러 체크 (서버의 응답 형식에 맞게 수정 필요)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 토큰 갱신 중이면 새 토큰을 기다림
                return new Promise((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
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

                const accessToken= tokenResponse.accessToken;

                // 세션 업데이트 로직 (Next-Auth의 update 메서드 사용)
                // 이 부분은 실제 구현 환경에 맞게 수정 필요
                // await update({ accessToken });

                // 대기 중인 요청들 처리
                onRefreshed(accessToken);

                // 원래 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그아웃 처리
                // window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

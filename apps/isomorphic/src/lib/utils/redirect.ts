// lib/utils/redirect.ts
import { toast } from 'react-hot-toast'; // 또는 사용하는 토스트 라이브러리

export interface RedirectOptions {
message?: string;
showToast?: boolean;
toastType?: 'success' | 'error' | 'warning' | 'info';
delay?: number; // 리다이렉트 지연 시간 (ms)
}

/**
 * Next.js Router를 사용한 안전한 리다이렉트
 * @param path - 이동할 경로
 * @param options - 리다이렉트 옵션
 */
export const redirectTo = async (
    path: string, 
    options: RedirectOptions = {}
): Promise<void> => {
    const {
        message,
        showToast = false,
        toastType = 'info',
        delay = 0
    } = options;

    // 토스트 메시지 표시
    if (showToast && message) {
        switch (toastType) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.error(message, { icon: '⚠️' });
                break;
            case 'info':
            default:
                toast(message);
            break;
        }
    }

    // 지연 시간 적용
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 브라우저 환경에서만 리다이렉트 실행
    if (typeof window !== 'undefined') {
        try {
            const { default: Router } = await import('next/router');
            await Router.push(path);
        } catch (error) {
            console.error('리다이렉트 실패:', error);
            // 폴백: window.location 사용
            window.location.href = path;
        }
    }
};

/**
 * 로그인 페이지로 리다이렉트 (자주 사용되는 케이스)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const redirectToSignIn = async (
    message?: string,
    options: Omit<RedirectOptions, 'message'> = {}
): Promise<void> => {
    const { routes } = await import('@/config/routes');

    return redirectTo(routes.signIn, {
    message: message || '로그인이 필요합니다.',
    showToast: true,
    toastType: 'warning',
    ...options
    });
};

/**
 * 홈페이지로 리다이렉트
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const redirectToHome = async (
    message?: string,
    options: Omit<RedirectOptions, 'message'> = {}
): Promise<void> => {
    const { routes } = await import('@/config/routes');

    return redirectTo(routes.eCommerce.dashboard || '/', {
    message,
    showToast: !!message,
    toastType: 'success',
    ...options
    });
};

/**
 * 이전 페이지로 이동 (브라우저 히스토리 사용)
 * @param fallbackPath - 히스토리가 없을 때 이동할 경로
 * @param message - 표시할 메시지
 */
export const redirectBack = async (
    fallbackPath: string = '/',
    message?: string
): Promise<void> => {
    if (message) {
    toast(message);
    }

    if (typeof window !== 'undefined') {
    try {
        const { default: Router } = await import('next/router');
        
        // 히스토리가 있으면 뒤로가기, 없으면 fallback 경로로
        if (window.history.length > 1) {
            Router.back();
        } else {
            await Router.push(fallbackPath);
        }
    } catch (error) {
        console.error('뒤로가기 실패:', error);
        window.location.href = fallbackPath;
    }
    }
};

/**
 * 외부 URL로 리다이렉트
 * @param url - 외부 URL
 * @param options - 리다이렉트 옵션
 */
export const redirectToExternal = (
    url: string,
    options: RedirectOptions & { newTab?: boolean } = {}
): void => {
    const { message, showToast = false, toastType = 'info', newTab = false } = options;

    if (showToast && message) {
        toast[toastType === 'error' ? 'error' : toastType === 'success' ? 'success' : 'loading'](message);
    }

    if (typeof window !== 'undefined') {
        if (newTab) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = url;
        }
    }
};
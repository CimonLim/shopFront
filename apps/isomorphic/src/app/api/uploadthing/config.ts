// src/app/api/uploadthing/config.ts

// 바이트 단위 변환 헬퍼 함수
const MB = (size: number) => size * 1024 * 1024;

// 파일 설정
export const FILE_CONFIGS = {
    'application/pdf': { maxSize: MB(4), maxCount: 4 },    // 4MB
    'image/jpeg': { maxSize: MB(2), maxCount: 4 },         // 2MB
    'image/png': { maxSize: MB(2), maxCount: 4 },          // 2MB
    'image/gif': { maxSize: MB(2), maxCount: 4 },          // 2MB
    'video/mp4': { maxSize: MB(256), maxCount: 1 },        // 256MB
} as const;

// uploadthing 라우터 설정
export const ROUTER_CONFIG = {
    avatar: {
        image: { maxFileSize: '4MB' }
    },
    generalMedia: {
        'application/pdf': { maxFileSize: '4MB', maxFileCount: 4 },
        image: { maxFileSize: '2MB', maxFileCount: 4 },
        video: { maxFileSize: '256MB', maxFileCount: 1 },
    }
} as const;

// 파일 타입 그룹
export const FILE_TYPES = {
    images: ['image/jpeg', 'image/png', 'image/gif'],
    videos: ['video/mp4'],
    documents: ['application/pdf']
} as const;

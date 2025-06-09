// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { ROUTER_CONFIG } from './config';
import { auth } from './auth';
import { logError } from './utils';
import { validateFile, validateFileCount } from './validators'; // 상대 경로로 수정

// ... 나머지 코드


const f = createUploadthing();

export const ourFileRouter = {
  avatar: f(ROUTER_CONFIG.avatar)
      .middleware(async ({ req }) => {
        console.log('Avatar upload middleware started');
        try {
          const user = await auth(req);
          console.log('Avatar upload auth successful:', user.id);
          return user;
        } catch (error) {
          logError(error, 'avatar-middleware');
          throw error;
        }
      })
      .onUploadComplete((data) => {
        try {
          console.log('Avatar upload completed:', {
            fileInfo: {
              key: data.file.key,
              name: data.file.name,
              url: data.file.ufsUrl,
              size: data.file.size,
            },
            userId: data.metadata.id,
          });
        } catch (error) {
          logError(error, 'avatar-upload-complete', { fileData: data });
        }
      }),

  generalMedia: f(ROUTER_CONFIG.generalMedia)
      .middleware(async ({ req, files }) => {
        console.log('General media middleware started');
        try {
          const user = await auth(req);
          console.log('Auth successful, validating files...');

          // 파일 유효성 검사
          files.forEach(validateFile);
          validateFileCount(files);

          console.log('File validation successful');
          console.log('Upload initiated:', {
            userId: user.id,
            filesInfo: files.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type
            })),
            timestamp: new Date().toISOString(),
          });

          return user;
        } catch (error) {
          logError(error, 'general-media-middleware', { files });
          throw error;
        }
      })
      .onUploadComplete((data) => {
        try {
          console.log('General media upload completed:', {
            fileInfo: {
              key: data.file.key,
              name: data.file.name,
              url: data.file.ufsUrl,
              size: data.file.size,
              type: data.file.type,
            },
            userId: data.metadata.id,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logError(error, 'general-media-upload-complete', { fileData: data });
        }
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

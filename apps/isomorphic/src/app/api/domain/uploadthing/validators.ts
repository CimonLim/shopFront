import { FILE_CONFIGS } from './config.ts';
import { logError } from './utils.ts';


export const validateFile = (file: Readonly<{
  name: string;
  size: number;
  type: string;
}>) => {
  if (!(file.type in FILE_CONFIGS)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const config = FILE_CONFIGS[file.type as keyof typeof FILE_CONFIGS];
  if (file.size > config.maxSize) {
    throw new Error(
        `File size ${file.size} exceeds limit of ${config.maxSize} bytes for type ${file.type}`
    );
  }
};


export const validateFileCount = (files: ReadonlyArray<{ type: string }>) => {
  const fileTypeCounts = files.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // PDF 파일 개수 검사
  if (fileTypeCounts['application/pdf'] > FILE_CONFIGS['application/pdf'].maxCount) {
    throw new Error(`Maximum ${FILE_CONFIGS['application/pdf'].maxCount} PDF files allowed`);
  }

  // 이미지 파일 개수 검사
  const imageCount = Object.entries(fileTypeCounts)
    .filter(([type]) => type.startsWith('image/'))
    .reduce((sum, [, count]) => sum + count, 0);
  if (imageCount > 4) {
    throw new Error('Maximum 4 image files allowed');
  }

  // 비디오 파일 개수 검사
  const videoCount = Object.entries(fileTypeCounts)
    .filter(([type]) => type.startsWith('video/'))
    .reduce((sum, [, count]) => sum + count, 0);
  if (videoCount > 1) {
    throw new Error('Maximum 1 video file allowed');
  }
};

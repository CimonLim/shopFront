export const logError = (error: any, context: string, additionalInfo?: any) => {
    console.error(`UploadThing Error [${context}]:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        additionalInfo,
        timestamp: new Date().toISOString(),
    });
};

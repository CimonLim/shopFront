
export interface ApiResult {
    // 변경 필요: result 객체를 제거하고 최상위로 이동
    resultCode: number;
    resultMessage: String;
    resultDescription: String;
}
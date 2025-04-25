import {ApiResult} from "@/app/api/common/response/ApiResult.ts";

export interface ApiResponse<T> {
    // 변경 필요: result 객체를 제거하고 최상위로 이동
    result: ApiResult;
    body: T;
}
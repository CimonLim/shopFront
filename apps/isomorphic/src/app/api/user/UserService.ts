import {UserResponse} from "@/app/api/user/response/UserResponse.ts";
import {apiClient} from "@/app/api/interceptor/client.ts";
import {env} from "@/env.mjs";
import {endpoints} from "@/app/api/endpoints.ts";
import {ApiResponse} from "@/app/api/common/response/ApiResponse.ts";
import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";
import {UserErrorCode} from "@/app/api/common/errors/UserErrorCode.ts";
import {toast} from "react-hot-toast";

export class UserService {
    static async login(email: string, password: string): Promise<TokenResponse> {
        // 로그인 API 호출
        const tokenResponse = await apiClient.request<ApiResponse<TokenResponse>>({
            method: 'POST',
            url: endpoints.user.login,
            data: { email, password },
        });

        const { resultCode, resultMessage, resultDescription } = tokenResponse.data.result;

        if (resultCode === 200) {
            return tokenResponse.data.body;
        }

        switch (resultCode) {
            case UserErrorCode.USER_NOT_FOUND: // USER_NOT_FOUND
                throw new Error(resultMessage.toString());

            case UserErrorCode.INVALID_PASSWORD: // INVALID_PASSWORD
                throw new Error(resultMessage.toString());

            default:
                throw new Error(resultMessage.toString());
        }


    }

    static async me(accessToken: string): Promise<UserResponse> {

        // 로그인 API 호출
        const userResponse = await apiClient.request<ApiResponse<UserResponse>>({
            method: 'GET',
            url: endpoints.user.me,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return userResponse.data.body;
    }
}

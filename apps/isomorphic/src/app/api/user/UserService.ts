import {UserResponse} from "@/app/api/user/response/UserResponse.ts";
import {apiClient} from "@/app/api/interceptor/client.ts";
import {env} from "@/env.mjs";
import {endpoints} from "@/app/api/auth/endpoints.ts";
import {ApiResponse} from "@/app/api/common/response/ApiResponse.ts";
import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";

export class UserService {
    static async login(email: string, password: string): Promise<TokenResponse> {
        // 로그인 API 호출
        const tokenResponse = await apiClient.request<ApiResponse<TokenResponse>>({
            method: 'POST',
            url: endpoints.user.login,
            data: { email, password },
        });

        return tokenResponse.data.body;
    }

    static async me(accessToken: string): Promise<UserResponse> {

        // 로그인 API 호출
        const userResponse = await apiClient.request<ApiResponse<UserResponse>>({
            method: 'GET',
            url: env.BACKEND_BASE_URL + endpoints.auth.me,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return userResponse.data.body;
    }
}

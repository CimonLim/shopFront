import {env} from "@/env.mjs";
import {endpoints} from "@/app/api/endpoints.ts";
import {apiClient} from "@/app/api/interceptor/client.ts";
import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";
import {ApiResponse} from "@/app/api/common/response/ApiResponse.ts";

export class AuthService {


    static async refreshToken(refreshToken: string): Promise<TokenResponse> {
        try{
            const tokenResponse = await apiClient.request<ApiResponse<TokenResponse>>({
                method: 'GET',
                url: endpoints.auth.refreshToken,
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            });

            return tokenResponse.data.body;
        }catch (error){
            throw error;

        }
    }
}

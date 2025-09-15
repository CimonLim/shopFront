import {endpoints} from "@/app/api/endpoints.ts";
import {apiClient} from "@/app/api/interceptor/client.ts";
import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";
import {ApiResponse} from "@/app/api/common/response/ApiResponse.ts";
import {redirectToSignIn} from "@/lib/utils/redirect.ts";

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

            if (tokenResponse?.data?.result?.resultCode !== 200) {
                await redirectToSignIn('정상적인 요청이 아닙니다.');
                throw new Error(`${tokenResponse?.data?.result?.resultMessage || 'Token refresh failed'}`);
            }

            return tokenResponse.data.body;
        }catch (error){
            console.warn('토큰 갱신 에러');
            throw error;

        }
    }
}

import {UserResponse} from "@/app/api/user/response/UserResponse.ts";
import {TokenResponse} from "@/app/api/auth/response/TokenResponse.ts";
import {TokenDto} from "@/app/api/auth/dto/TokenDto.ts";

export interface LoginResponse {
    user: UserResponse;
    token: TokenDto;
}
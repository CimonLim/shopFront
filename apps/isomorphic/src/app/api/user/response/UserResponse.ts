import {UserRole} from "@/app/api/user/response/enums/UserRole.ts";
import {UserStatus} from "@/app/api/user/response/enums/UserStatus.ts";

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

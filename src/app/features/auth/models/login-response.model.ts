export interface LoginResponse {
    id: string;
    userName: string;
    email: string;
    token: string;
    roles: string[];
}
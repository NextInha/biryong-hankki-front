export interface LoginRequest {
    studentId: string;
    name: string;
}
export interface User {
    id: string;
    studentId: string;
    name: string;
}
export interface LoginResponse {
    accessToken: string;
    user: User;
}

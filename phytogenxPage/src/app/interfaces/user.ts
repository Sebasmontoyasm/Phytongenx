export interface User {
    username: string;
    password: string;
    lastlogin: Date;
}

export interface UserResponse {
    message: string;
    token: string;
    id: number;
    rol: string;
}

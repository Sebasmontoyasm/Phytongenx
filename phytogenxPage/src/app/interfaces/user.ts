export type Roles = 'administrator'|'cms'|'qb'|'guest';

export interface User {
    username: string;
    password: string;
}

export interface UserResponse {
    message: string;
    token: string;
    id: number;
    rol: Roles;
}

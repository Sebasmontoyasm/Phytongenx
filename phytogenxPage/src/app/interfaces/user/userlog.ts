export type Roles = 'administrator'|'cms'|'qb'|'guest';

export interface UserLog{
    id?:number;
    idrestore:number;
    username: string;
    rol: Roles;
    comment?: string;
    action: string;
    date_action:string | null;
 }
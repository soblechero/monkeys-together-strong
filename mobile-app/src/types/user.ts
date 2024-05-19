export interface User {
    email: string;
    password: string;
    username?: string;
    access_token?: string;
}

export type UsersList = User[];
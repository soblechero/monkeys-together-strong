export interface User {
    email: string;
    password: string;
    name?: string;
    access_token?: string;
}

export type UsersList = User[];
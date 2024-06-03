export interface Token {
    access_token: string;
    token_type?: string; // "bearer"
}

export interface OAuth2RequestForm {
    username: string;
    password: string;
}

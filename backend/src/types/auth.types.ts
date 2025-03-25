type LoginInput = {
    email: string;
    password: string;
}

type AuthenticationResponse = {
    token: string;
    email: string;
    admin: boolean;
}

type UserInput = {
    name: string;
    email: string;
    password: string;
    admin: boolean;
}


export type {
    LoginInput,
    AuthenticationResponse,
    UserInput
}
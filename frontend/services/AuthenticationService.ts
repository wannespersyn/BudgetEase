
const Login = (email: string, password: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}        

const Register = (email: string, password: string) => {
    return fetch(`${process.env.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}


const AuthentiacationService = {
    Login,
    Register,
}

export default AuthentiacationService;
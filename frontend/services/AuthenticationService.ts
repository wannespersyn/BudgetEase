
const Login = (email: string, password: string) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    return fetch(`${host}/LoginUserHttpTrigger`, {
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

const Register = (username: string, email: string, password: string) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    return fetch(`${host}/RegisterUserHtppTrigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            role: "USER", // Assuming role is always USER for registration
        }),
    });
}


const AuthentiacationService = {
    Login,
    Register,
}

export default AuthentiacationService;

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

const Register = (email: string, password: string) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    return fetch(`${host}/RegisterUserHtppTrigger`, {
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
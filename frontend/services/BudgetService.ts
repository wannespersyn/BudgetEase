
const CreateBudget = async (budget: any) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    const email = localStorage.getItem("email") ?? "";
    const password = localStorage.getItem("password") ?? "";

    const credentials = btoa(`${email}:${password}`);

    
    return fetch(`${host}/CreateBudgetHttpTrigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
            userEmail: email,
            budget
        }),
    });
}

const GetBudgets = async () => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    const email = localStorage.getItem("email") ?? "";
    const password = localStorage.getItem("password") ?? "";

    const credentials = btoa(`${email}:${password}`);

    return fetch(`${host}/GetAllBudgetsHttpTrigger?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
    });
}

const BudgetService = {
    CreateBudget,
    GetBudgets
}

export default BudgetService;
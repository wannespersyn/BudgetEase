const CreateGoal = async (goal: any) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    const email = localStorage.getItem("email") ?? "";
    const password = localStorage.getItem("password") ?? "";

    const credentials = btoa(`${email}:${password}`);

    return fetch(`${host}/CreateGoalHttpTrigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
            userEmail: email,
            goal
        }),
    });
}

const GetGoals = async () => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    const email = localStorage.getItem("email") ?? "";
    const password = localStorage.getItem("password") ?? "";

    const credentials = btoa(`${email}:${password}`);

    return fetch(`${host}/GetAllGoalsHttpTrigger?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
    });
}

const GoalService = {
    CreateGoal,
    GetGoals
}

export default GoalService;
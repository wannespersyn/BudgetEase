
const CreateTransaction = async (transaction: any) => {
    const host = "https://budgeteaseapi.azurewebsites.net/api"
    const email = localStorage.getItem("email") ?? "";
    const password = localStorage.getItem("password") ?? "";

    const credentials = btoa(`${email}:${password}`);

    return fetch(`${host}/CreateTransactionHttpTrigger`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
            userEmail: email,
            transaction
        }),
    });
}

const GetTransactions = async () => {
  const host = "https://budgeteaseapi.azurewebsites.net/api"
  const email = localStorage.getItem("email") ?? "";
  const password = localStorage.getItem("password") ?? "";

  const credentials = btoa(`${email}:${password}`);

  return fetch(`${host}/GetAllTransactionsHttpTrigger?email=${email}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
      },
  });
}

const TransactionService = {
    CreateTransaction,
    GetTransactions,
}

export default TransactionService;
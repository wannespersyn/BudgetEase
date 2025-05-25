# BudgetEase

BudgetEase is a cloud-native personal finance tracker designed to help users manage their income, expenses, and budgets efficiently. This project is built with a **React-based frontend** and a **Node.js backend** integrated with **Azure Functions** and **Azure Cosmos DB**.

---

## Project Structure
 ├── backend/ # Backend code (Node.js, Azure Functions)
 ├── frontend/ # Frontend code (React, Next.js) 
 └── ReadMe.md


## Prerequisites

Before starting the project, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v8 or higher)
- **Azure Functions Core Tools** (v4)
- **Azure CLI** (for deployment)
- **TypeScript** (globally installed)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BudgetEase
```

### 2. Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the Project

### 1. The backend
```bash
cd backend
npm start
```

### 2. The Frontend
```bash
cd ../frontend
npm run dev
```

## Environment Variables
### 1. The backend
COSMOS_ENDPOINT=

COSMOS_KEY=

COSMOS_DATABASE_NAME=

JWT_SECRET=

PORT=


### 2. The Frontend
NEXT_PUBLIC_API_URL= 
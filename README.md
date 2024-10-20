# Daily Expenses Sharing Application

Backend (Node.js and MongoDB) for a daily expenses sharing application that allows users to add expenses, split them based on three different methods: exact amounts, percentages, and equal splits; manage user details, validate inputs, and generate downloadable balance sheets


## Setup Instructions

1. Clone the repository.
    ```bash
    git clone https://github.com/ShivamGoel05/daily-expenses-sharing-app.git
    cd daily-expenses-sharing-app

2. Install dependencies.
    ```bash
    npm install
    
3. Set up MongoDB and ensure it’s running.

4. Create a `.env` file in the root directory as given below.
    ```bash
    MONGODB_URI=mongodb://localhost:27017/daily_expenses
    PORT=5000

5. Start the server.
    ```bash
    npm start

6. Use Postman or curl to test the API.

## API Endpoints

### User Endpoints

* `POST /api/users`: Create user
* `GET /api/users/:id`: Retrieve user details

### Expense Endpoints

* `POST /api/expenses`: Add expense
* `GET /api/expenses/user/:id`: Retrieve individual user expenses
* `GET /api/expenses`: Retrieve overall expenses

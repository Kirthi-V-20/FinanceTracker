CoinCare — Personal Finance Tracker

CoinCare is a modern full-stack personal finance application that helps users easily track daily expenses, manage budgets, and understand their spending habits through a clean and intuitive experience.

## Project Overview
CoinCare addresses the common question, “Where did my money go?” by providing a single platform to record daily transactions, organize them into custom categories, and set monthly budget limits. Real-time visual reports help users quickly understand their financial status through a clean interface.

## Features
- Track income and expenses with full create, edit, and delete support
- Manual date selection for past transactions
- Category-wise monthly budget limits
- Real-time alerts when budget limits are exceeded
- Interactive donut chart for spending analysis
- Month and year based transaction reports
- Automatic net savings calculation

## Security & UI
- JWT-based authentication
- Protected routes for authenticated users
- Environment-based configuration using .env files
- Clean, responsive UI with a calm violet theme

## Tech Stack
- **Backend:** Go (Golang) with Gin
- **Database:** PostgreSQL with GORM
- **Frontend:** React (Vite) with Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Docker and Docker Compose
- **Reverse Proxy:** Nginx

## Getting Started

### Prerequisites:
- Docker and Docker Compose (v2)
- Go 1.24 
- Node.js 20+ 

### Environment Configuration

1. **Clone the Repository:**
```bash
git clone https://github.com/Kirthi-V-20/FinanceTracker
cd FinanceTracker
```

2. **Create a .env file inside the /backend directory:**
```env
DB_HOST=postgres
DB_USER=kirthi
DB_PASSWORD=password
DB_NAME=finance_tracker
DB_PORT=5432
DB_SSLMODE=disable
JWT_SECRET=your_super_secret_random_key_123
```

3. **Build & Run**
Run the following command to build images and start the containers.
```bash
docker compose up --build -d
```
> Note: The first run may take a few minutes to download the Go and Node images.

4. **Access the App**
Once the logs show the servers are running, open your browser:
Frontend UI: `http://localhost`

## How to Use CoinCare:

1. **Sign Up / Log In**
   - Create a new account or log in using existing credentials.
   - JWT authentication ensures your session is secure.

2. **Add Categories**
   - Navigate to the Categories page.
   - Click Add Category to create custom categories (e.g., Food, Rent, Entertainment).
   - Categories help organize your transactions and budgets.    

3. **Add Transactions**
   - Go to the Transactions page.
   - Click Add Transaction to record an expense or income.
   - Enter the amount, category, description, and date (manual date selection is available for past transactions).
   - Save the transaction.

4. **Edit or Delete Transactions**
   - In the transaction list, click Edit to modify an existing transaction.
   - Click Delete to remove a transaction permanently.   

5. **Set Budgets**
   - Navigate to the Budgets page.
   - Set monthly budget limits for each category (e.g., Food, Rent, Entertainment).
   - Save your budget.      

6. **Monitor Budget Alerts**
   - The dashboard displays real-time alerts when spending in a category exceeds its limit.
   - Alerts appear as pulsing red indicators, giving you instant feedback.

7. **Analyze Spending**
   - View your spending breakdown in interactive donut charts, which show the highest expenses at a glance.
   - Click on each category to see details.    

8. **Filter Reports by Month/Year**
   - Use the Month/Year picker to view historical transactions and budget progress.
   - This “time-travel” feature allows you to track trends and past spending habits.

9. **Track Net Savings**
   - CoinCare automatically calculates your remaining balance after all income and expenses.
   - Net savings are updated in real-time on the dashboard. 

10. **Responsive UI**
    - CoinCare works seamlessly on desktop, tablet, and mobile devices.
    - Navigation is smooth, and active sections are highlighted for a clear user experience.
```

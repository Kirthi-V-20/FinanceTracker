package dto

type CategoryReport struct {
	CategoryName string  `json:"category_name"`
	TotalSpent   float64 `json:"total_spent"`
	BudgetLimit  float64 `json:"budget_limit"`
}

type MonthlySummary struct {
	Month           int              `json:"month"`
	Year            int              `json:"year"`
	TotalIncome     float64          `json:"total_income"`
	TotalExpense    float64          `json:"total_expense"`
	NetSavings      float64          `json:"net_savings"`
	CategoryReports []CategoryReport `json:"category_reports"`
}

package dto

type BudgetRequest struct {
	CategoryID *uint    `json:"category_id" binding:"required"`
	Amount     *float64 `json:"amount" binding:"required"`
	Month      *int     `json:"month" binding:"required"`
	Year       *int     `json:"year" binding:"required"`
}

type BudgetResponse struct {
	ID           uint    `json:"id"`
	CategoryID   uint    `json:"category_id"`
	CategoryName string  `json:"category_name"`
	Amount       float64 `json:"amount"`
	Month        int     `json:"month"`
	Year         int     `json:"year"`
}

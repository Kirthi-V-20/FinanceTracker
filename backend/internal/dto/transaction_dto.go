package dto

import "time"

type TransactionRequest struct {
	Amount      float64   `json:"amount" binding:"required"`
	Type        string    `json:"type" binding:"required"`
	CategoryID  uint      `json:"category_id" binding:"required"`
	Description string    `json:"description"`
	Date        time.Time `json:"date" binding:"required"`
}

type TransactionResponse struct {
	ID           uint      `json:"id"`
	Amount       float64   `json:"amount"`
	Type         string    `json:"type"`
	Description  string    `json:"description"`
	CategoryName string    `json:"category_name"`
	Date         time.Time `json:"date"`
}

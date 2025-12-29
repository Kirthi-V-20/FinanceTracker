package handlers

import (
	"financetracker/internal/dto"
	"financetracker/internal/models"
	"financetracker/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	service *services.TransactionService
}

func NewTransactionHandler(s *services.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: s}
}

func (h *TransactionHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req dto.TransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction := &models.Transaction{
		Amount:      req.Amount,
		Type:        req.Type,
		CategoryID:  req.CategoryID,
		Description: req.Description,
		Date:        req.Date,
		UserID:      userID.(uint),
	}

	if err := h.service.CreateManualTransaction(transaction); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, transaction)
}

func (h *TransactionHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	transactions, err := h.service.GetUserTransactions(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []dto.TransactionResponse
	for _, t := range transactions {
		response = append(response, dto.TransactionResponse{
			ID:           t.ID,
			Amount:       t.Amount,
			Type:         t.Type,
			Description:  t.Description,
			CategoryName: t.Category.Name,
			Date:         t.Date,
		})
	}

	c.JSON(http.StatusOK, response)
}

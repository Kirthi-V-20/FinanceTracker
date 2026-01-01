package handlers

import (
	"financetracker/internal/dto"
	"financetracker/internal/models"
	"financetracker/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	service *services.TransactionService
}

func NewTransactionHandler(s *services.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: s}
}

func (h *TransactionHandler) Create(c *gin.Context) {
	val, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userID := val.(uint)

	var req dto.TransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction := &models.Transaction{
		Amount:      *req.Amount,
		Type:        req.Type,
		CategoryID:  *req.CategoryID,
		Description: req.Description,
		Date:        req.Date,
		UserID:      userID,
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

func (h *TransactionHandler) Delete(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}

	if err := h.service.DeleteTransaction(uint(id), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted successfully"})
}

func (h *TransactionHandler) Update(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	var req dto.TransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation failed: " + err.Error()})
		return
	}

	transaction := &models.Transaction{
		ID:          uint(id),
		UserID:      userID,
		Amount:      *req.Amount,
		Type:        req.Type,
		CategoryID:  *req.CategoryID,
		Description: req.Description,
		Date:        req.Date,
	}

	if err := h.service.UpdateTransaction(transaction); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed in database"})
		return
	}
	c.JSON(http.StatusOK, transaction)
}

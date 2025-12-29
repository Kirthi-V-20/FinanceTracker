package handlers

import (
	"encoding/csv"
	"financetracker/internal/dto"
	"financetracker/internal/models"
	"financetracker/internal/services"
	"net/http"
	"strconv"
	"strings"
	"time"

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

func (h *TransactionHandler) ImportCSV(c *gin.Context) {
	userID, _ := c.Get("user_id")

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not read CSV"})
		return
	}

	var transactions []models.Transaction

	for i, record := range records {
		if i == 0 {
			continue
		}

		amount, _ := strconv.ParseFloat(record[0], 64)
		catID, _ := strconv.Atoi(record[2])

		transactions = append(transactions, models.Transaction{
			Amount:      amount,
			Type:        strings.ToLower(record[1]),
			CategoryID:  uint(catID),
			Description: record[3],
			UserID:      userID.(uint),
			Date:        time.Now(),
		})
	}

	if err := h.service.ImportFromCSV(transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully imported " + strconv.Itoa(len(transactions)) + " transactions"})
}

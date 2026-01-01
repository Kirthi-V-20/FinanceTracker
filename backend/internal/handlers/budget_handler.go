package handlers

import (
	"financetracker/internal/dto"
	"financetracker/internal/models"
	"financetracker/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BudgetHandler struct {
	service *services.BudgetService
}

func NewBudgetHandler(s *services.BudgetService) *BudgetHandler {
	return &BudgetHandler{service: s}
}

func (h *BudgetHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req dto.BudgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	budget := &models.Budget{
		UserID:     userID.(uint),
		CategoryID: *req.CategoryID,
		Amount:     *req.Amount,
		Month:      *req.Month,
		Year:       *req.Year,
	}

	if err := h.service.CreateBudget(budget); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, budget)
}

func (h *BudgetHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	budgets, err := h.service.GetUserBudgets(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []dto.BudgetResponse
	for _, b := range budgets {
		response = append(response, dto.BudgetResponse{
			ID:           b.ID,
			CategoryID:   b.CategoryID,
			CategoryName: b.Category.Name,
			Amount:       b.Amount,
			Month:        b.Month,
			Year:         b.Year,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *BudgetHandler) Update(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	var req dto.BudgetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	budget := &models.Budget{
		ID:         uint(id),
		UserID:     userID,
		CategoryID: *req.CategoryID,
		Amount:     *req.Amount,
		Month:      *req.Month,
		Year:       *req.Year,
	}

	if err := h.service.UpdateBudget(budget); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update budget"})
		return
	}

	c.JSON(http.StatusOK, budget)
}

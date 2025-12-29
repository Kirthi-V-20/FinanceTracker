package handlers

import (
	"financetracker/internal/dto"
	"financetracker/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *services.CategoryService
}

func NewCategoryHandler(service *services.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req dto.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category, err := h.service.CreateCategory(req.Name, userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dto.CategoryResponse{
		ID:   category.ID,
		Name: category.Name,
	})
}

func (h *CategoryHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("user_id")

	categories, err := h.service.GetUserCategories(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []dto.CategoryResponse
	for _, cat := range categories {
		response = append(response, dto.CategoryResponse{
			ID:   cat.ID,
			Name: cat.Name,
		})
	}

	c.JSON(http.StatusOK, response)
}

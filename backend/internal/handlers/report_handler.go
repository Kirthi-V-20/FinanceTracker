package handlers

import (
	"financetracker/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ReportHandler struct {
	service *services.ReportService
}

func NewReportHandler(s *services.ReportService) *ReportHandler {
	return &ReportHandler{service: s}
}

func (h *ReportHandler) GetSummary(c *gin.Context) {
	userID, _ := c.Get("user_id")

	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, _ := strconv.Atoi(monthStr)
	year, _ := strconv.Atoi(yearStr)

	if month < 1 || month > 12 || year < 2000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month or year"})
		return
	}

	report, err := h.service.GetMonthlyReport(userID.(uint), month, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, report)
}

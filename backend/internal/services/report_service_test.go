package services

import (
	"financetracker/internal/models"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGetMonthlyReport_Calculation(t *testing.T) {
	mockTrans := new(MockTransactionRepository)
	mockBudget := new(MockBudgetRepository)
	service := NewReportService(mockTrans, mockBudget)

	testDate := time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)

	dummyTransactions := []models.Transaction{
		{ID: 1, Amount: 1000, Type: "income", Date: testDate, UserID: 1},
		{ID: 2, Amount: 50, Type: "expense", Date: testDate, UserID: 1, CategoryID: 1},
	}

	dummyTransactions[1].Category.Name = "Food"

	dummyBudgets := []models.Budget{
		{ID: 1, CategoryID: 1, Amount: 500, Month: 12, Year: 2025, UserID: 1},
	}
	dummyBudgets[0].Category.Name = "Food"

	mockTrans.On("GetAllByUserID", uint(1)).Return(dummyTransactions, nil)
	mockBudget.On("GetByUserID", uint(1)).Return(dummyBudgets, nil)

	report, err := service.GetMonthlyReport(1, 12, 2025)

	assert.NoError(t, err)
	assert.Equal(t, 1000.0, report.TotalIncome)
	assert.Equal(t, 50.0, report.TotalExpense)
	assert.Equal(t, 950.0, report.NetSavings)

	assert.Len(t, report.CategoryReports, 1)
	assert.Equal(t, "Food", report.CategoryReports[0].CategoryName)
	assert.Equal(t, 50.0, report.CategoryReports[0].TotalSpent)
	assert.Equal(t, 500.0, report.CategoryReports[0].BudgetLimit)
}

package services

import (
	"financetracker/internal/models"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

// WHY: There are NO "type Mock..." or "func (m *Mock...)" blocks here.
// This file "borrows" them from your other test files in the same folder.

func TestGetMonthlyReport_Calculation(t *testing.T) {
	// 1. Setup
	mockTrans := new(MockTransactionRepository)
	mockBudget := new(MockBudgetRepository)
	service := NewReportService(mockTrans, mockBudget)

	testDate := time.Date(2025, 12, 1, 0, 0, 0, 0, time.UTC)

	// 2. Create Dummy Data
	dummyTransactions := []models.Transaction{
		{
			ID: 1, Amount: 1000, Type: "income", Date: testDate, UserID: 1,
		},
		{
			ID: 2, Amount: 50, Type: "expense", Date: testDate, UserID: 1, CategoryID: 1,
			Category: models.Category{Name: "Food"},
		},
	}

	// 3. Set Expectations
	// Why: We tell the mock what to return when the service calls it.
	mockTrans.On("GetAllByUserID", uint(1)).Return(dummyTransactions, nil)

	// 4. Execute
	report, err := service.GetMonthlyReport(1, 12, 2025)

	// 5. Assert (The Checks)
	assert.NoError(t, err)
	assert.Equal(t, 1000.0, report.TotalIncome)
	assert.Equal(t, 50.0, report.TotalExpense)
	assert.Equal(t, 950.0, report.NetSavings)

	if len(report.CategoryReports) > 0 {
		assert.Equal(t, "Food", report.CategoryReports[0].CategoryName)
		assert.Equal(t, 50.0, report.CategoryReports[0].TotalSpent)
	}

	// Verify the call happened
	mockTrans.AssertExpectations(t)
}

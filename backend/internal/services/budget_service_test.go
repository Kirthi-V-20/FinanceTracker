package services

import (
	"financetracker/internal/models"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockBudgetRepository struct {
	mock.Mock
}

func (m *MockBudgetRepository) Create(budget *models.Budget) error {
	args := m.Called(budget)
	return args.Error(0)
}

func (m *MockBudgetRepository) GetByUserID(userID uint) ([]models.Budget, error) {
	args := m.Called(userID)
	return args.Get(0).([]models.Budget), args.Error(1)
}

func (m *MockBudgetRepository) Update(budget *models.Budget) error {
	args := m.Called(budget)
	return args.Error(0)
}
func TestCreateBudget_Success(t *testing.T) {
	mockRepo := new(MockBudgetRepository)
	service := NewBudgetService(mockRepo)

	testBudget := &models.Budget{
		UserID:     1,
		CategoryID: 1,
		Amount:     500.0,
		Month:      12,
		Year:       2025,
	}

	mockRepo.On("Create", testBudget).Return(nil)

	err := service.CreateBudget(testBudget)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestGetUserBudgets_Success(t *testing.T) {
	mockRepo := new(MockBudgetRepository)
	service := NewBudgetService(mockRepo)

	dummyBudgets := []models.Budget{
		{ID: 1, Amount: 300.0, UserID: 1},
	}

	mockRepo.On("GetByUserID", uint(1)).Return(dummyBudgets, nil)

	result, err := service.GetUserBudgets(1)

	assert.NoError(t, err)
	assert.Len(t, result, 1)
	assert.Equal(t, 300.0, result[0].Amount)
	mockRepo.AssertExpectations(t)
}

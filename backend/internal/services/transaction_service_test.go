package services

import (
	"financetracker/internal/models"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockTransactionRepository struct {
	mock.Mock
}

func (m *MockTransactionRepository) Create(t *models.Transaction) error {
	args := m.Called(t)
	return args.Error(0)
}

func (m *MockTransactionRepository) GetAllByUserID(userID uint) ([]models.Transaction, error) {
	args := m.Called(userID)
	return args.Get(0).([]models.Transaction), args.Error(1)
}

func TestCreateManualTransaction_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockRepo)

	testTrans := &models.Transaction{
		Amount:      50.0,
		Type:        "expense",
		Description: "Test Transaction",
		UserID:      1,
		CategoryID:  1,
		Date:        time.Now(),
	}

	mockRepo.On("Create", testTrans).Return(nil)

	err := service.CreateManualTransaction(testTrans)

	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}

func TestGetUserTransactions_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockRepo)

	dummyData := []models.Transaction{
		{ID: 1, Amount: 10.0, UserID: 1},
		{ID: 2, Amount: 20.0, UserID: 1},
	}

	mockRepo.On("GetAllByUserID", uint(1)).Return(dummyData, nil)

	result, err := service.GetUserTransactions(1)

	assert.NoError(t, err)
	assert.Len(t, result, 2)
	assert.Equal(t, 10.0, result[0].Amount)
	mockRepo.AssertExpectations(t)
}

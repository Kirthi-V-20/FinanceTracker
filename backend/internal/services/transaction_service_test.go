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

func (m *MockTransactionRepository) Delete(id uint, userID uint) error {
	args := m.Called(id, userID)
	return args.Error(0)
}

func (m *MockTransactionRepository) Update(t *models.Transaction) error {
	args := m.Called(t)
	return args.Error(0)
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
}

func TestGetUserTransactions_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockRepo)

	dummyData := []models.Transaction{
		{ID: 1, Amount: 10.0, UserID: 1},
	}

	mockRepo.On("GetAllByUserID", uint(1)).Return(dummyData, nil)

	result, err := service.GetUserTransactions(1)

	assert.NoError(t, err)
	assert.Len(t, result, 1)
}

func TestDeleteTransaction_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockRepo)

	mockRepo.On("Delete", uint(10), uint(1)).Return(nil)

	err := service.DeleteTransaction(10, 1)

	assert.NoError(t, err)
}

func TestUpdateTransaction_Success(t *testing.T) {
	mockRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockRepo)

	testTrans := &models.Transaction{ID: 1, Amount: 100.0, UserID: 1}

	mockRepo.On("Update", testTrans).Return(nil)

	err := service.UpdateTransaction(testTrans)

	assert.NoError(t, err)
}

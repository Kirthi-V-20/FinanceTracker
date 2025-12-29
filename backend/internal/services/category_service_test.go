package services

import (
	"financetracker/internal/models"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockCategoryRepository struct {
	mock.Mock
}

func (m *MockCategoryRepository) Create(category *models.Category) error {
	args := m.Called(category)
	return args.Error(0)
}

func (m *MockCategoryRepository) GetAllByUserID(userID uint) ([]models.Category, error) {
	args := m.Called(userID)
	return args.Get(0).([]models.Category), args.Error(1)
}

func TestCreateCategory_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)
	service := NewCategoryService(mockRepo)

	mockRepo.On("Create", mock.Anything).Return(nil)

	cat, err := service.CreateCategory("Food", 1)

	assert.NoError(t, err)
	assert.Equal(t, "Food", cat.Name)
	assert.Equal(t, uint(1), cat.UserID)
	mockRepo.AssertExpectations(t)
}

func TestGetUserCategories_Success(t *testing.T) {
	mockRepo := new(MockCategoryRepository)
	service := NewCategoryService(mockRepo)

	dummyCategories := []models.Category{
		{ID: 1, Name: "Food", UserID: 1},
		{ID: 2, Name: "Rent", UserID: 1},
	}

	mockRepo.On("GetAllByUserID", uint(1)).Return(dummyCategories, nil)

	result, err := service.GetUserCategories(1)

	assert.NoError(t, err)
	assert.Len(t, result, 2)
	assert.Equal(t, "Food", result[0].Name)
}

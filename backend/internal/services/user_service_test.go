package services

import (
	"financetracker/internal/models"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(user *models.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepository) FindByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.User), args.Error(1)
}

func TestRegisterUser_Success(t *testing.T) {
	mockRepo := new(MockUserRepository)
	service := NewUserService(mockRepo)

	mockRepo.On("FindByEmail", "new@example.com").Return(nil, nil)
	mockRepo.On("Create", mock.Anything).Return(nil)

	user, err := service.RegisterUser("testuser", "new@example.com", "password123")

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.Equal(t, "testuser", user.Username)
	mockRepo.AssertExpectations(t)
}
func TestRegisterUser_DuplicateEmail(t *testing.T) {
	mockRepo := new(MockUserRepository)
	service := NewUserService(mockRepo)

	existingUser := &models.User{ID: 1, Email: "exists@example.com"}
	mockRepo.On("FindByEmail", "exists@example.com").Return(existingUser, nil)

	user, err := service.RegisterUser("testuser", "exists@example.com", "password123")

	assert.Error(t, err)
	assert.Nil(t, user)
	assert.Equal(t, "user already exists with this email", err.Error())
}

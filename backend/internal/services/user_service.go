package services

import (
	"errors"
	"financetracker/internal/models"

	"golang.org/x/crypto/bcrypt"
)

type UserRepositoryInterface interface {
	Create(user *models.User) error
	FindByEmail(email string) (*models.User, error)
}

type UserService struct {
	repo UserRepositoryInterface
}

func NewUserService(repo UserRepositoryInterface) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) RegisterUser(username, email, password string) (*models.User, error) {
	existingUser, _ := s.repo.FindByEmail(email)
	if existingUser != nil && existingUser.ID != 0 {
		return nil, errors.New("user already exists with this email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
	}

	err = s.repo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

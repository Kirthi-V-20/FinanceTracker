package services

import (
	"financetracker/internal/models"
)

type CategoryRepositoryInterface interface {
	Create(category *models.Category) error
	GetAllByUserID(userID uint) ([]models.Category, error)
}

type CategoryService struct {
	repo CategoryRepositoryInterface
}

func NewCategoryService(repo CategoryRepositoryInterface) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) CreateCategory(name string, userID uint) (*models.Category, error) {
	category := &models.Category{
		Name:   name,
		UserID: userID,
	}

	err := s.repo.Create(category)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (s *CategoryService) GetUserCategories(userID uint) ([]models.Category, error) {
	return s.repo.GetAllByUserID(userID)
}

package services

import (
	"financetracker/internal/models"
	"financetracker/internal/repository"
)

type CategoryService struct {
	repo *repository.CategoryRepository
}

func NewCategoryService(repo *repository.CategoryRepository) *CategoryService {
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

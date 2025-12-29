package services

import (
	"financetracker/internal/models"
)

type BudgetRepositoryInterface interface {
	Create(budget *models.Budget) error
	GetByUserID(userID uint) ([]models.Budget, error)
}

type BudgetService struct {
	repo BudgetRepositoryInterface
}

func NewBudgetService(repo BudgetRepositoryInterface) *BudgetService {
	return &BudgetService{repo: repo}
}

func (s *BudgetService) CreateBudget(budget *models.Budget) error {
	return s.repo.Create(budget)
}

func (s *BudgetService) GetUserBudgets(userID uint) ([]models.Budget, error) {
	return s.repo.GetByUserID(userID)
}

package services

import (
	"financetracker/internal/models"
)

type TransactionRepositoryInterface interface {
	Create(t *models.Transaction) error
	GetAllByUserID(userID uint) ([]models.Transaction, error)
	Delete(id uint, userID uint) error
	Update(t *models.Transaction) error
}

type TransactionService struct {
	repo TransactionRepositoryInterface
}

func NewTransactionService(repo TransactionRepositoryInterface) *TransactionService {
	return &TransactionService{repo: repo}
}

func (s *TransactionService) CreateManualTransaction(t *models.Transaction) error {
	return s.repo.Create(t)
}

func (s *TransactionService) GetUserTransactions(userID uint) ([]models.Transaction, error) {
	return s.repo.GetAllByUserID(userID)
}

func (s *TransactionService) DeleteTransaction(id uint, userID uint) error {
	return s.repo.Delete(id, userID)
}

func (s *TransactionService) UpdateTransaction(t *models.Transaction) error {
	return s.repo.Update(t)
}

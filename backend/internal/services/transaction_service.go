package services

import (
	"financetracker/internal/models"
)

type TransactionRepositoryInterface interface {
	Create(t *models.Transaction) error
	GetAllByUserID(userID uint) ([]models.Transaction, error)
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

func (s *TransactionService) ImportFromCSV(transactions []models.Transaction) error {
	for _, t := range transactions {
		err := s.repo.Create(&t)
		if err != nil {
			return err
		}
	}
	return nil
}

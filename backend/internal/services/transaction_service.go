package services

import (
	"financetracker/internal/models"
	"fmt"
	"strings"
)

type TransactionRepositoryInterface interface {
	Create(t *models.Transaction) error
	GetAllByUserID(userID uint) ([]models.Transaction, error)
	Delete(id uint, userID uint) error
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
func (s *TransactionService) ExportToCSV(userID uint) (string, error) {
	transactions, err := s.repo.GetAllByUserID(userID)
	if err != nil {
		return "", err
	}

	var builder strings.Builder

	builder.WriteString("Date,Description,Category,Type,Amount\n")

	for _, t := range transactions {
		row := fmt.Sprintf("%s,%s,%s,%s,%.2f\n",
			t.Date.Format("2006-01-02"),
			t.Description,
			t.Category.Name,
			t.Type,
			t.Amount,
		)
		builder.WriteString(row)
	}

	return builder.String(), nil
}

func (s *TransactionService) DeleteTransaction(id uint, userID uint) error {
	return s.repo.Delete(id, userID)
}

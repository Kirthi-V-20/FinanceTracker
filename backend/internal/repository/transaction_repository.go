package repository

import (
	"financetracker/internal/models"

	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(t *models.Transaction) error {
	return r.db.Create(t).Error
}

func (r *TransactionRepository) GetAllByUserID(userID uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Preload("Category").Where("user_id = ?", userID).Order("date desc").Find(&transactions).Error
	return transactions, err
}

func (r *TransactionRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Transaction{}).Error
}

func (r *TransactionRepository) Update(t *models.Transaction) error {
	return r.db.Model(&models.Transaction{}).
		Where("id = ? AND user_id = ?", t.ID, t.UserID).
		Updates(t).Error
}

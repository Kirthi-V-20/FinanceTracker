package repository

import (
	"financetracker/internal/models"

	"gorm.io/gorm"
)

type BudgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) *BudgetRepository {
	return &BudgetRepository{db: db}
}

func (r *BudgetRepository) GetByUserID(userID uint) ([]models.Budget, error) {
	var budgets []models.Budget
	err := r.db.Preload("Category").Where("user_id = ?", userID).Find(&budgets).Error
	return budgets, err
}

func (r *BudgetRepository) Create(budget *models.Budget) error {
	return r.db.Where(models.Budget{
		UserID:     budget.UserID,
		CategoryID: budget.CategoryID,
		Month:      budget.Month,
		Year:       budget.Year,
	}).Assign(models.Budget{Amount: budget.Amount}).FirstOrCreate(budget).Error
}

func (r *BudgetRepository) Update(b *models.Budget) error {
	return r.db.Model(&models.Budget{}).
		Where("id = ? AND user_id = ?", b.ID, b.UserID).
		Updates(b).Error
}

package repository

import (
	"errors"
	"financetracker/internal/models"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) GetAllByUserID(userID uint) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Where("user_id = ?", userID).Find(&categories).Error
	return categories, err
}

func (r *CategoryRepository) GetByNameAndUserID(name string, userID uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("LOWER(name) = LOWER(?) AND user_id = ?", name, userID).First(&category).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &category, nil
}

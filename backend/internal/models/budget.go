package models

import "time"

type Budget struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Amount     float64   `json:"amount" gorm:"not null"`
	Month      int       `json:"month" gorm:"not null"`
	Year       int       `json:"year" gorm:"not null"`
	UserID     uint      `json:"user_id" gorm:"not null"`
	CategoryID uint      `json:"category_id" gorm:"not null"`
	CreatedAt  time.Time `json:"created_at"`
	Category   Category  `json:"category" gorm:"foreignKey:CategoryID"`
}

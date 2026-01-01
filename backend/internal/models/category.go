package models

type Category struct {
	ID     uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name   string `gorm:"not null" json:"name"`
	UserID uint   `gorm:"not null" json:"user_id"`
}

package main

import (
	"financetracker/configs"
	"financetracker/internal/database"
	"financetracker/internal/handlers"
	"financetracker/internal/repository"
	"financetracker/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := configs.LoadConfig()

	database.ConnectDatabase(cfg)

	userRepo := repository.NewUserRepository(database.DB)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Finance Tracker API is online!",
		})
	})

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	r.Run(":" + cfg.ServerPort)
}

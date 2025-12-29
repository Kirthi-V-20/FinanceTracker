package main

import (
	"financetracker/configs"
	"financetracker/internal/database"
	"financetracker/internal/handlers"
	"financetracker/internal/middleware"
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

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{

		protected.GET("/ping-auth", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			c.JSON(200, gin.H{
				"message": "Auth is working!",
				"user_id": userID,
			})
		})
	}

	r.Run(":" + cfg.ServerPort)
}

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

	categoryRepo := repository.NewCategoryRepository(database.DB)
	categoryService := services.NewCategoryService(categoryRepo)
	categoryHandler := handlers.NewCategoryHandler(categoryService)

	r := gin.Default()

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	protected := r.Group("/api")

	protected.Use(middleware.AuthMiddleware())
	{

		protected.POST("/categories", categoryHandler.Create)
		protected.GET("/categories", categoryHandler.GetAll)

		protected.GET("/ping-auth", func(c *gin.Context) {
			userID, _ := c.Get("user_id")
			c.JSON(200, gin.H{
				"message": "Authentication successful!",
				"user_id": userID,
			})
		})
	}

	r.Run(":" + cfg.ServerPort)
}

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

	transactionRepo := repository.NewTransactionRepository(database.DB)
	transactionService := services.NewTransactionService(transactionRepo)
	transactionHandler := handlers.NewTransactionHandler(transactionService)

	budgetRepo := repository.NewBudgetRepository(database.DB)
	budgetService := services.NewBudgetService(budgetRepo)
	budgetHandler := handlers.NewBudgetHandler(budgetService)

	reportService := services.NewReportService(transactionRepo, budgetRepo)
	reportHandler := handlers.NewReportHandler(reportService)

	r := gin.Default()

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/categories", categoryHandler.Create)
		protected.GET("/categories", categoryHandler.GetAll)

		protected.POST("/transactions", transactionHandler.Create)
		protected.GET("/transactions", transactionHandler.GetAll)

		protected.POST("/budgets", budgetHandler.Create)
		protected.GET("/budgets", budgetHandler.GetAll)

		protected.GET("/reports", reportHandler.GetSummary)
	}

	r.Run(":" + cfg.ServerPort)
}

package main

import (
	"financetracker/configs"
	"financetracker/internal/database"
	"financetracker/internal/handlers"
	"financetracker/internal/repository"
	"financetracker/internal/routes"
	"financetracker/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := configs.LoadConfig()
	database.ConnectDatabase(cfg)

	userRepo := repository.NewUserRepository(database.DB)
	catRepo := repository.NewCategoryRepository(database.DB)
	transRepo := repository.NewTransactionRepository(database.DB)
	budgetRepo := repository.NewBudgetRepository(database.DB)

	userService := services.NewUserService(userRepo)
	catService := services.NewCategoryService(catRepo)
	transService := services.NewTransactionService(transRepo)
	budgetService := services.NewBudgetService(budgetRepo)
	reportService := services.NewReportService(transRepo, budgetRepo)

	userHandler := handlers.NewUserHandler(userService)
	catHandler := handlers.NewCategoryHandler(catService)
	transHandler := handlers.NewTransactionHandler(transService)
	budgetHandler := handlers.NewBudgetHandler(budgetService)
	reportHandler := handlers.NewReportHandler(reportService)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r, userHandler, catHandler, transHandler, budgetHandler, reportHandler)

	r.Run(":" + cfg.ServerPort)
}

package routes

import (
	"financetracker/internal/handlers"
	"financetracker/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	r *gin.Engine,
	userHandler *handlers.UserHandler,
	categoryHandler *handlers.CategoryHandler,
	transactionHandler *handlers.TransactionHandler,
	budgetHandler *handlers.BudgetHandler,
	reportHandler *handlers.ReportHandler,
) {

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

		protected.GET("/reports/summary", reportHandler.GetSummary)
		protected.DELETE("/transactions/:id", transactionHandler.Delete)

		protected.PUT("/transactions/:id", transactionHandler.Update)
		protected.PUT("/budgets/:id", budgetHandler.Update)
	}
}

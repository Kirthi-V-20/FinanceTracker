package main

import (
	"financetracker/configs"
	"financetracker/internal/database"

	"github.com/gin-gonic/gin"
)

func main() {

	cfg := configs.LoadConfig()

	database.ConnectDatabase(cfg)

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Finance Tracker API is online!",
		})
	})

	r.Run(":" + cfg.ServerPort)
}

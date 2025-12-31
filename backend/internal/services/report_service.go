package services

import (
	"financetracker/internal/dto"
)

type ReportService struct {
	transRepo  TransactionRepositoryInterface
	budgetRepo BudgetRepositoryInterface
}

func NewReportService(tr TransactionRepositoryInterface, br BudgetRepositoryInterface) *ReportService {
	return &ReportService{
		transRepo:  tr,
		budgetRepo: br,
	}
}

func (s *ReportService) GetMonthlyReport(userID uint, month int, year int) (dto.MonthlySummary, error) {
	transactions, err := s.transRepo.GetAllByUserID(userID)
	if err != nil {
		return dto.MonthlySummary{}, err
	}

	summary := dto.MonthlySummary{
		Month:           month,
		Year:            year,
		CategoryReports: []dto.CategoryReport{},
	}

	spendingMap := make(map[string]float64)

	for _, t := range transactions {
		// Only look at the requested month and year
		if int(t.Date.Month()) == month && t.Date.Year() == year {
			if t.Type == "income" {
				summary.TotalIncome += t.Amount
			} else if t.Type == "expense" {
				summary.TotalExpense += t.Amount

				// Get the category name (default to "Other" if missing)
				catName := "Other"
				if t.Category.Name != "" {
					catName = t.Category.Name
				}

				// ADD the amount to this specific category bucket
				spendingMap[catName] += t.Amount
			}
		}
	}

	summary.NetSavings = summary.TotalIncome - summary.TotalExpense

	// 3. Convert the grouped map back into the list for the Pie Chart
	for name, total := range spendingMap {
		summary.CategoryReports = append(summary.CategoryReports, dto.CategoryReport{
			CategoryName: name,
			TotalSpent:   total,
		})
	}

	return summary, nil
}

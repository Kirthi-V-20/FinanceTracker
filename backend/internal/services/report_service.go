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

	budgets, err := s.budgetRepo.GetByUserID(userID)
	if err != nil {
		return dto.MonthlySummary{}, err
	}

	summary := dto.MonthlySummary{
		Month:           month,
		Year:            year,
		CategoryReports: []dto.CategoryReport{},
	}

	catTotals := make(map[uint]float64)

	for _, t := range transactions {
		if int(t.Date.Month()) == month && t.Date.Year() == year {
			if t.Type == "income" {
				summary.TotalIncome += t.Amount
			} else {
				summary.TotalExpense += t.Amount
				catTotals[t.CategoryID] += t.Amount
			}
		}
	}

	summary.NetSavings = summary.TotalIncome - summary.TotalExpense

	for _, b := range budgets {
		if b.Month == month && b.Year == year {
			summary.CategoryReports = append(summary.CategoryReports, dto.CategoryReport{
				CategoryName: b.Category.Name,
				TotalSpent:   catTotals[b.CategoryID],
				BudgetLimit:  b.Amount,
			})
		}
	}

	return summary, nil
}

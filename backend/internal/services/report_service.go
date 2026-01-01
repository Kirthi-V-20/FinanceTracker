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

	budgetLimits := make(map[uint]float64)
	for _, b := range budgets {
		if b.Month == month && b.Year == year {
			budgetLimits[b.CategoryID] = b.Amount
		}
	}

	summary := dto.MonthlySummary{
		Month:           month,
		Year:            year,
		CategoryReports: []dto.CategoryReport{},
	}

	catTotals := make(map[uint]float64)
	catNames := make(map[uint]string)

	for _, t := range transactions {
		if int(t.Date.Month()) == month && t.Date.Year() == year {
			if t.Type == "income" {
				summary.TotalIncome += t.Amount
			} else if t.Type == "expense" {
				summary.TotalExpense += t.Amount
				catTotals[t.CategoryID] += t.Amount
				catNames[t.CategoryID] = t.Category.Name
			}
		}
	}

	summary.NetSavings = summary.TotalIncome - summary.TotalExpense

	for id, total := range catTotals {
		summary.CategoryReports = append(summary.CategoryReports, dto.CategoryReport{
			CategoryName: catNames[id],
			TotalSpent:   total,
			BudgetLimit:  budgetLimits[id],
		})
	}

	return summary, nil
}

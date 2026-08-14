namespace Talanton.Api.Models;

public class LoanApplication
{
    public Guid Id { get; set; }

    public string ApplicationNumber { get; set; } = string.Empty;

    public Guid ApplicantId { get; set; }

    public Applicant Applicant { get; set; } = null!;

    public Guid SaccoId { get; set; }

    public Sacco Sacco { get; set; } = null!;

    public Guid? AssignedUnderwriterUserId { get; set; }

    public User? AssignedUnderwriter { get; set; }

    public Guid CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public string CurrentStatus { get; set; } = "Draft";

    public decimal PrincipalAmount { get; set; }

    public decimal AnnualSimpleInterestRatePct { get; set; }

    public int TermMonths { get; set; }

    public decimal AdministrativeFeeAmount { get; set; }

    public string Purpose { get; set; } = string.Empty;

    public DateTime? SubmittedAt { get; set; }

    public DateTime? DecisionAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // --- Scorecard / underwriting inputs & outputs -----------------------------------
    // Added Wednesday sprint: previously these lived only in an in-memory DTO and were
    // never persisted, so the scorecard could not survive a refresh or be recalculated
    // from real submitted data. See ScoringService for the calculation.

    public decimal SavingsBalance { get; set; }

    public decimal MonthlyIncome { get; set; }

    public decimal MonthlyDebt { get; set; }

    public decimal Multiplier { get; set; } = 3.0m;

    /// <summary>Debt-to-income ratio including the estimated new loan installment, as a percentage.</summary>
    public decimal? DtiNetRatio { get; set; }

    /// <summary>Monthly income minus existing debt minus the estimated new loan installment.</summary>
    public decimal? NetTakeHome { get; set; }

    public bool? GuardrailDepositMultiplierPassed { get; set; }

    public bool? GuardrailOneThirdPayPassed { get; set; }

    /// <summary>Deterministic 0-100 trust score computed by ScoringService from the fields above.</summary>
    public int? TrustScore { get; set; }

    /// <summary>APPROVED or DECLINED, derived from the guardrail checks.</summary>
    public string? Verdict { get; set; }
}
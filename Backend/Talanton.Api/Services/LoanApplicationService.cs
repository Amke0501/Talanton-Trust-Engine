using Talanton.Api.DTOs;
using Talanton.Api.Services.Interfaces;

namespace Talanton.Api.Services;

public class LoanApplicationService : ILoanApplicationService
{
    private static readonly List<LoanApplicationDto> Applications = new()
    {
        new LoanApplicationDto
        {
            Id = Guid.Parse("941a0000-0000-0000-0000-000000000001"),
            Reference = "LA-2026-0941A",
            ApplicantName = "Nakamya Grace",
            MemberId = "M-8842",
            ApplicantType = "individual",
            Status = "in_review",
            Stage = "verification",
            Principal = 15000000m,
            Purpose = "Working capital & store upgrade",
            TenureMonths = 12,
            SavingsBalance = 4000000m,
            MonthlyIncome = 2500000m,
            MonthlyDebt = 500000m,
            Multiplier = 3.0m,
            SubmittedOn = "Aug 04, 2026",
            StatusNote = "File LA-2026-0941A is declined. BOSA multiplier breach; Payslip take-home deficit.",
            DtiNetRatio = 82.0m,
            NetTakeHome = 450000m,
            GuardrailDepositMultiplierPassed = false,
            GuardrailOneThirdPayPassed = false,
            GuardrailGuarantorPassed = true,
            Verdict = "DECLINED",
            Guarantors = new List<GuarantorDto>
            {
                new GuarantorDto { Id = "g1", Name = "Kato Joseph", MemberId = "M-1104", PledgedShares = 8000000m, AvailableShares = 8000000m },
                new GuarantorDto { Id = "g2", Name = "Namatovu Sarah", MemberId = "M-2309", PledgedShares = 5000000m, AvailableShares = 9500000m }
            },
            CommitteeVotes = new List<CommitteeVoteDetailDto>
            {
                new CommitteeVoteDetailDto { MemberName = "Chairman", MemberRole = "Chairperson", Vote = "APPROVE" },
                new CommitteeVoteDetailDto { MemberName = "Sec. General", MemberRole = "Risk Head", Vote = "APPROVE" },
                new CommitteeVoteDetailDto { MemberName = "Mrs. Nabukenya", MemberRole = "Credit Officer", Vote = "APPROVE" },
                new CommitteeVoteDetailDto { MemberName = "Dr. Ochieng", MemberRole = "Treasurer", Vote = "ABSTAIN" },
                new CommitteeVoteDetailDto { MemberName = "Eng. Museveni", MemberRole = "Board Member", Vote = "ABSTAIN" }
            }
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("938b0000-0000-0000-0000-000000000002"),
            Reference = "LA-2026-0938B",
            ApplicantName = "Ssemakula Enterprises Ltd",
            MemberId = "SME-0412",
            ApplicantType = "cooperative",
            Status = "in_review",
            Stage = "underwriting",
            Principal = 42000000m,
            Purpose = "Agricultural machinery purchase",
            TenureMonths = 24,
            SavingsBalance = 15000000m,
            MonthlyIncome = 8500000m,
            MonthlyDebt = 1200000m,
            Multiplier = 3.0m,
            SubmittedOn = "Aug 02, 2026",
            StatusNote = "Underwriting review in progress.",
            DtiNetRatio = 38.5m,
            NetTakeHome = 4200000m,
            GuardrailDepositMultiplierPassed = true,
            GuardrailOneThirdPayPassed = true,
            GuardrailGuarantorPassed = true,
            Verdict = "APPROVED"
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("912c0000-0000-0000-0000-000000000003"),
            Reference = "LA-2026-0912C",
            ApplicantName = "Kato Joseph",
            MemberId = "M-1104",
            ApplicantType = "individual",
            Status = "disbursed",
            Stage = "disbursed",
            Principal = 8000000m,
            Purpose = "Poultry farm expansion",
            TenureMonths = 10,
            SavingsBalance = 3500000m,
            MonthlyIncome = 2100000m,
            MonthlyDebt = 300000m,
            Multiplier = 3.0m,
            SubmittedOn = "Jun 15, 2026",
            StatusNote = "Disbursed. Active repayment status.",
            RepaymentProgress = "4/10 paid",
            DueDate = "Feb 05, 2026",
            Arrears = 0m
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("899d0000-0000-0000-0000-000000000004"),
            Reference = "LA-2026-0899D",
            ApplicantName = "Auma Florence",
            MemberId = "M-4511",
            ApplicantType = "individual",
            Status = "disbursed",
            Stage = "disbursed",
            Principal = 6500000m,
            Purpose = "Tailoring shop upgrade",
            TenureMonths = 8,
            SavingsBalance = 3100000m,
            MonthlyIncome = 1900000m,
            MonthlyDebt = 210000m,
            Multiplier = 3.0m,
            SubmittedOn = "Jul 28, 2026",
            StatusNote = "Active loan with minor arrears.",
            RepaymentProgress = "6/8 paid",
            DueDate = "Feb 12, 2026",
            Arrears = 320000m
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("871e0000-0000-0000-0000-000000000005"),
            Reference = "LA-2026-0871E",
            ApplicantName = "Mukasa Agro Supplies",
            MemberId = "SME-9022",
            ApplicantType = "cooperative",
            Status = "approved",
            Stage = "committee",
            Principal = 28000000m,
            Purpose = "Fertilizer inventory restocking",
            TenureMonths = 18,
            SavingsBalance = 10000000m,
            MonthlyIncome = 6200000m,
            MonthlyDebt = 900000m,
            Multiplier = 3.0m,
            SubmittedOn = "Jul 20, 2026",
            StatusNote = "Approved by Board. Pending disbursement release.",
            Verdict = "APPROVED"
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("842f0000-0000-0000-0000-000000000006"),
            Reference = "LA-2025-0842F",
            ApplicantName = "Namatovu Sarah",
            MemberId = "M-2309",
            ApplicantType = "individual",
            Status = "disbursed",
            Stage = "disbursed",
            Principal = 4000000m,
            Purpose = "School fees payment",
            TenureMonths = 6,
            SavingsBalance = 2500000m,
            MonthlyIncome = 1800000m,
            MonthlyDebt = 150000m,
            Multiplier = 3.0m,
            SubmittedOn = "Dec 10, 2025",
            StatusNote = "Loan completed and fully paid.",
            RepaymentProgress = "6/6 paid",
            DueDate = "Jun 10, 2026",
            Arrears = 0m
        },
        new LoanApplicationDto
        {
            Id = Guid.Parse("80300000-0000-0000-0000-000000000007"),
            Reference = "LA-2025-0803G",
            ApplicantName = "Okello Trading Co.",
            MemberId = "SME-1189",
            ApplicantType = "cooperative",
            Status = "declined",
            Stage = "committee",
            Principal = 55000000m,
            Purpose = "Fleet vehicle acquisition",
            TenureMonths = 36,
            SavingsBalance = 12000000m,
            MonthlyIncome = 7000000m,
            MonthlyDebt = 3500000m,
            Multiplier = 3.0m,
            SubmittedOn = "Nov 05, 2025",
            StatusNote = "Declined due to excessive debt service coverage ratio.",
            Verdict = "DECLINED"
        }
    };

    private static readonly List<CreditPassportMemberDto> PassportMembers = new()
    {
        new CreditPassportMemberDto
        {
            Id = "cp1",
            Name = "Namatovu Sarah",
            MemberId = "M-2309",
            Classification = "BOSA",
            Tier = "PLATINUM",
            TrustScore = 92,
            OnTimeRatePct = 100,
            LoansCompleted = 4,
            TotalRepaid = 18500000m,
            CurrentLimit = 25000000m,
            LastLoanDate = "Dec 2025"
        },
        new CreditPassportMemberDto
        {
            Id = "cp2",
            Name = "Ssemakula Agro Ltd",
            MemberId = "SME-0412",
            Classification = "SME",
            Tier = "PLATINUM",
            TrustScore = 88,
            OnTimeRatePct = 97,
            LoansCompleted = 3,
            TotalRepaid = 76000000m,
            CurrentLimit = 90000000m,
            LastLoanDate = "Nov 2025"
        },
        new CreditPassportMemberDto
        {
            Id = "cp3",
            Name = "Kato Joseph",
            MemberId = "M-1104",
            Classification = "BOSA",
            Tier = "GOLD",
            TrustScore = 84,
            OnTimeRatePct = 95,
            LoansCompleted = 2,
            TotalRepaid = 9200000m,
            CurrentLimit = 15000000m,
            LastLoanDate = "Oct 2025"
        },
        new CreditPassportMemberDto
        {
            Id = "cp4",
            Name = "Auma Florence",
            MemberId = "M-4511",
            Classification = "BOSA",
            Tier = "GOLD",
            TrustScore = 76,
            OnTimeRatePct = 89,
            LoansCompleted = 3,
            TotalRepaid = 11400000m,
            CurrentLimit = 12000000m,
            LastLoanDate = "Jan 2026"
        },
        new CreditPassportMemberDto
        {
            Id = "cp5",
            Name = "Mukasa Peter",
            MemberId = "M-9022",
            Classification = "BOSA",
            Tier = "SILVER",
            TrustScore = 71,
            OnTimeRatePct = 92,
            LoansCompleted = 1,
            TotalRepaid = 3500000m,
            CurrentLimit = 6000000m,
            LastLoanDate = "Sep 2025"
        },
        new CreditPassportMemberDto
        {
            Id = "cp6",
            Name = "Kiiza Wholesale Co.",
            MemberId = "SME-0755",
            Classification = "SME",
            Tier = "GOLD",
            TrustScore = 83,
            OnTimeRatePct = 94,
            LoansCompleted = 2,
            TotalRepaid = 44000000m,
            CurrentLimit = 60000000m,
            LastLoanDate = "Dec 2025"
        }
    };

    public Task<IEnumerable<LoanApplicationDto>> GetAllLoanApplicationsAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IEnumerable<LoanApplicationDto>>(Applications);
    }

    public Task<LoanApplicationDto?> GetLoanApplicationByRefAsync(string reference, CancellationToken cancellationToken = default)
    {
        var app = Applications.FirstOrDefault(a => a.Reference.Equals(reference, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(app);
    }

    public Task<LoanApplicationDto> CreateLoanApplicationAsync(CreateLoanApplicationDto dto, CancellationToken cancellationToken = default)
    {
        var refNo = $"LA-2026-{Random.Shared.Next(1000, 9999)}X";
        var created = new LoanApplicationDto
        {
            Id = Guid.NewGuid(),
            Reference = refNo,
            ApplicantName = dto.ApplicantName,
            MemberId = dto.MemberId,
            ApplicantType = dto.ApplicantType,
            Status = "in_review",
            Stage = "verification",
            Principal = dto.Principal,
            Purpose = dto.Purpose,
            TenureMonths = dto.TenureMonths,
            SavingsBalance = dto.SavingsBalance,
            MonthlyIncome = dto.MonthlyIncome,
            MonthlyDebt = dto.MonthlyDebt,
            Multiplier = dto.Multiplier,
            SubmittedOn = DateTime.UtcNow.ToString("MMM dd, yyyy"),
            StatusNote = "Application submitted. Verification in progress.",
            DtiNetRatio = dto.MonthlyIncome > 0 ? Math.Round((dto.MonthlyDebt / dto.MonthlyIncome) * 100, 1) : 0,
            NetTakeHome = dto.MonthlyIncome - dto.MonthlyDebt,
            Verdict = "IN_REVIEW"
        };
        Applications.Insert(0, created);
        return Task.FromResult(created);
    }

    public Task<LoanApplicationDto?> UpdateUnderwritingAsync(string reference, UpdateUnderwritingOverrideDto dto, CancellationToken cancellationToken = default)
    {
        var app = Applications.FirstOrDefault(a => a.Reference.Equals(reference, StringComparison.OrdinalIgnoreCase));
        if (app == null) return Task.FromResult<LoanApplicationDto?>(null);

        app.ApplicantType = dto.ApplicantType;
        app.Multiplier = dto.Multiplier;
        app.TenureMonths = dto.TenureMonths;
        app.Principal = dto.RequestedPrincipal;
        app.SavingsBalance = dto.SavingsBalance;
        app.MonthlyIncome = dto.BasicMonthlyPay;
        app.MonthlyDebt = dto.MonthlyDeductions;

        // Recalculate guardrail metrics
        var maxCap = app.SavingsBalance * app.Multiplier;
        var estMonthlyPayment = app.TenureMonths > 0 ? (app.Principal / app.TenureMonths) : 0;
        var residualPay = app.MonthlyIncome - app.MonthlyDebt - estMonthlyPayment;

        app.GuardrailDepositMultiplierPassed = app.Principal <= maxCap;
        app.GuardrailOneThirdPayPassed = residualPay >= (app.MonthlyIncome / 3.0m);
        app.DtiNetRatio = app.MonthlyIncome > 0 ? Math.Round(((app.MonthlyDebt + estMonthlyPayment) / app.MonthlyIncome) * 100, 1) : 0;
        app.NetTakeHome = residualPay;

        var totalPledged = app.Guarantors.Sum(g => g.PledgedShares);
        var uncollateralized = Math.Max(0, app.Principal - app.SavingsBalance);
        app.GuardrailGuarantorPassed = totalPledged >= uncollateralized;

        app.Verdict = (app.GuardrailDepositMultiplierPassed && app.GuardrailOneThirdPayPassed) ? "APPROVED" : "DECLINED";
        app.StatusNote = app.Verdict == "APPROVED" 
            ? $"File {reference} meets all underwriting guardrail checks." 
            : $"File {reference} is declined. BOSA multiplier breach or Payslip take-home deficit.";

        return Task.FromResult<LoanApplicationDto?>(app);
    }

    public Task<LoanApplicationDto?> AddGuarantorAsync(string reference, GuarantorDto guarantor, CancellationToken cancellationToken = default)
    {
        var app = Applications.FirstOrDefault(a => a.Reference.Equals(reference, StringComparison.OrdinalIgnoreCase));
        if (app == null) return Task.FromResult<LoanApplicationDto?>(null);

        guarantor.Id = Guid.NewGuid().ToString("N");
        app.Guarantors.Add(guarantor);

        // Recalculate guarantor cover
        var totalPledged = app.Guarantors.Sum(g => g.PledgedShares);
        var uncollateralized = Math.Max(0, app.Principal - app.SavingsBalance);
        app.GuardrailGuarantorPassed = totalPledged >= uncollateralized;

        return Task.FromResult<LoanApplicationDto?>(app);
    }

    public Task<LoanApplicationDto?> CastVoteAsync(string reference, CastCommitteeVoteDto voteDto, CancellationToken cancellationToken = default)
    {
        var app = Applications.FirstOrDefault(a => a.Reference.Equals(reference, StringComparison.OrdinalIgnoreCase));
        if (app == null) return Task.FromResult<LoanApplicationDto?>(null);

        var existing = app.CommitteeVotes.FirstOrDefault(v => v.MemberRole.Equals(voteDto.MemberRole, StringComparison.OrdinalIgnoreCase));
        if (existing != null)
        {
            existing.Vote = voteDto.Vote;
        }
        else
        {
            app.CommitteeVotes.Add(new CommitteeVoteDetailDto
            {
                MemberName = voteDto.MemberRole,
                MemberRole = voteDto.MemberRole,
                Vote = voteDto.Vote
            });
        }

        return Task.FromResult<LoanApplicationDto?>(app);
    }

    public Task<LoanApplicationDto?> RouteStageAsync(string reference, string targetStage, CancellationToken cancellationToken = default)
    {
        var app = Applications.FirstOrDefault(a => a.Reference.Equals(reference, StringComparison.OrdinalIgnoreCase));
        if (app == null) return Task.FromResult<LoanApplicationDto?>(null);

        app.Stage = targetStage;
        if (targetStage == "committee")
        {
            app.StatusNote = $"File {reference} routed to Committee Board for authorization.";
        }
        else if (targetStage == "underwriting")
        {
            app.StatusNote = $"File {reference} in Underwriting review stage.";
        }

        return Task.FromResult<LoanApplicationDto?>(app);
    }

    public Task<IEnumerable<CreditPassportMemberDto>> GetCreditPassportMembersAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IEnumerable<CreditPassportMemberDto>>(PassportMembers);
    }
}

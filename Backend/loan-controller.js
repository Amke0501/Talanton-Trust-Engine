const db = require('./db');

const initialApplications = [
  {
    id: "941a0000-0000-0000-0000-000000000001",
    reference: "LA-2026-0941A",
    applicantName: "Nakamya Grace",
    memberId: "M-8842",
    applicantType: "individual",
    status: "in_review",
    stage: "verification",
    principal: 15000000,
    purpose: "Working capital & store upgrade",
    tenureMonths: 12,
    savingsBalance: 4000000,
    monthlyIncome: 2500000,
    monthlyDebt: 500000,
    multiplier: 3.0,
    submittedOn: "Aug 04, 2026",
    statusNote: "File LA-2026-0941A is declined. BOSA multiplier breach; Payslip take-home deficit.",
    dtiNetRatio: 82.0,
    netTakeHome: 450000,
    guardrailDepositMultiplierPassed: false,
    guardrailOneThirdPayPassed: false,
    guardrailGuarantorPassed: true,
    verdict: "DECLINED",
    guarantors: [
      { id: "g1", name: "Kato Joseph", memberId: "M-1104", pledgedShares: 8000000, availableShares: 8000000 },
      { id: "g2", name: "Namatovu Sarah", memberId: "M-2309", pledgedShares: 5000000, availableShares: 9500000 }
    ],
    committeeVotes: [
      { memberName: "Chairman", memberRole: "Chairperson", vote: "APPROVE" },
      { memberName: "Sec. General", memberRole: "Risk Head", vote: "APPROVE" },
      { memberName: "Mrs. Nabukenya", memberRole: "Credit Officer", vote: "APPROVE" },
      { memberName: "Dr. Ochieng", memberRole: "Treasurer", vote: "ABSTAIN" },
      { memberName: "Eng. Museveni", memberRole: "Board Member", vote: "ABSTAIN" }
    ]
  },
  {
    id: "938b0000-0000-0000-0000-000000000002",
    reference: "LA-2026-0938B",
    applicantName: "Ssemakula Enterprises Ltd",
    memberId: "SME-0412",
    applicantType: "cooperative",
    status: "in_review",
    stage: "underwriting",
    principal: 42000000,
    purpose: "Agricultural machinery purchase",
    tenureMonths: 24,
    savingsBalance: 15000000,
    monthlyIncome: 8500000,
    monthlyDebt: 1200000,
    multiplier: 3.0,
    submittedOn: "Aug 02, 2026",
    statusNote: "Underwriting review in progress.",
    dtiNetRatio: 38.5,
    netTakeHome: 4200000,
    guardrailDepositMultiplierPassed: true,
    guardrailOneThirdPayPassed: true,
    guardrailGuarantorPassed: true,
    verdict: "APPROVED",
    guarantors: [],
    committeeVotes: []
  },
  {
    id: "912c0000-0000-0000-0000-000000000003",
    reference: "LA-2026-0912C",
    applicantName: "Kato Joseph",
    memberId: "M-1104",
    applicantType: "individual",
    status: "disbursed",
    stage: "disbursed",
    principal: 8000000,
    purpose: "Poultry farm expansion",
    tenureMonths: 10,
    savingsBalance: 3500000,
    monthlyIncome: 2100000,
    monthlyDebt: 300000,
    multiplier: 3.0,
    submittedOn: "Jun 15, 2026",
    statusNote: "Disbursed. Active repayment status.",
    repaymentProgress: "4/10 paid",
    dueDate: "Feb 05, 2026",
    arrears: 0,
    guarantors: [],
    committeeVotes: []
  },
  {
    id: "899d0000-0000-0000-0000-000000000004",
    reference: "LA-2026-0899D",
    applicantName: "Auma Florence",
    memberId: "M-4511",
    applicantType: "individual",
    status: "disbursed",
    stage: "disbursed",
    principal: 6500000,
    purpose: "Tailoring shop upgrade",
    tenureMonths: 8,
    savingsBalance: 3100000,
    monthlyIncome: 1900000,
    monthlyDebt: 210000,
    multiplier: 3.0,
    submittedOn: "Jul 28, 2026",
    statusNote: "Active loan with minor arrears.",
    repaymentProgress: "6/8 paid",
    dueDate: "Feb 12, 2026",
    arrears: 320000,
    guarantors: [],
    committeeVotes: []
  },
  {
    id: "871e0000-0000-0000-0000-000000000005",
    reference: "LA-2026-0871E",
    applicantName: "Mukasa Agro Supplies",
    memberId: "SME-9022",
    applicantType: "cooperative",
    status: "approved",
    stage: "committee",
    principal: 28000000,
    purpose: "Fertilizer inventory restocking",
    tenureMonths: 18,
    savingsBalance: 10000000,
    monthlyIncome: 6200000,
    monthlyDebt: 900000,
    multiplier: 3.0,
    submittedOn: "Jul 20, 2026",
    statusNote: "Approved by Board. Pending disbursement release.",
    verdict: "APPROVED",
    guarantors: [],
    committeeVotes: []
  },
  {
    id: "842f0000-0000-0000-0000-000000000006",
    reference: "LA-2025-0842F",
    applicantName: "Namatovu Sarah",
    memberId: "M-2309",
    applicantType: "individual",
    status: "disbursed",
    stage: "disbursed",
    principal: 4000000,
    purpose: "School fees payment",
    tenureMonths: 6,
    savingsBalance: 2500000,
    monthlyIncome: 1800000,
    monthlyDebt: 150000,
    multiplier: 3.0,
    submittedOn: "Dec 10, 2025",
    statusNote: "Loan completed and fully paid.",
    repaymentProgress: "6/6 paid",
    dueDate: "Jun 10, 2026",
    arrears: 0,
    guarantors: [],
    committeeVotes: []
  },
  {
    id: "80300000-0000-0000-0000-000000000007",
    reference: "LA-2025-0803G",
    applicantName: "Okello Trading Co.",
    memberId: "SME-1189",
    applicantType: "cooperative",
    status: "declined",
    stage: "committee",
    principal: 55000000,
    purpose: "Fleet vehicle acquisition",
    tenureMonths: 36,
    savingsBalance: 12000000,
    monthlyIncome: 7000000,
    monthlyDebt: 3500000,
    multiplier: 3.0,
    submittedOn: "Nov 05, 2025",
    statusNote: "Declined due to excessive debt service coverage ratio.",
    verdict: "DECLINED",
    guarantors: [],
    committeeVotes: []
  }
];

// In-memory array containing the active set of items, populated initially by our static list
const inMemoryApplications = [...initialApplications];

async function getApplications(req, res) {
  try {
    const dbResult = await db.query(
      `SELECT la.*, a."DisplayName" as "ApplicantName", a."ApplicantType"
       FROM "LoanApplications" la
       LEFT JOIN "Applicants" a ON la."ApplicantId" = a."Id"
       ORDER BY la."CreatedAt" DESC`
    );

    const merged = [];
    const dbRefs = new Set();

    dbResult.rows.forEach(row => {
      const ref = row.ApplicationNumber;
      dbRefs.add(ref.toLowerCase());

      const inMem = inMemoryApplications.find(a => a.reference.toLowerCase() === ref.toLowerCase() || a.id === row.Id);
      if (inMem) {
        merged.push(inMem);
      } else {
        const isSubmitted = row.CurrentStatus.toUpperCase() === 'SUBMITTED';
        const submittedOnDate = row.SubmittedAt ? new Date(row.SubmittedAt) : new Date(row.CreatedAt);
        const formattedDate = submittedOnDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

        merged.push({
          id: row.Id,
          reference: row.ApplicationNumber,
          applicantName: row.ApplicantName || 'Amara Trading Ltd',
          memberId: 'APP-TEST-001',
          applicantType: row.ApplicantType || 'cooperative',
          status: isSubmitted ? 'submitted' : row.CurrentStatus.toLowerCase(),
          stage: isSubmitted ? 'verification' : 'underwriting',
          principal: parseFloat(row.PrincipalAmount),
          purpose: row.Purpose,
          tenureMonths: row.TermMonths,
          savingsBalance: 2000000,
          monthlyIncome: 1500000,
          monthlyDebt: 300000,
          multiplier: 3.0,
          submittedOn: formattedDate,
          statusNote: `Application ${row.ApplicationNumber} submitted. Verification in progress.`,
          dtiNetRatio: 20.0,
          netTakeHome: 1200000,
          verdict: 'IN_REVIEW',
          guarantors: [],
          committeeVotes: []
        });
      }
    });

    // Add remaining in-memory applications that are not in the db query results
    inMemoryApplications.forEach(app => {
      if (!dbRefs.has(app.reference.toLowerCase())) {
        merged.push(app);
      }
    });

    return res.json(merged);
  } catch (error) {
    console.error('[LOAN] Error fetching applications:', error);
    return res.json(inMemoryApplications);
  }
}

async function getApplicationByRef(req, res) {
  const { reference } = req.params;
  try {
    const apps = await getApplicationsInternal();
    const app = apps.find(a => a.reference.toLowerCase() === reference.toLowerCase());
    if (!app) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    return res.json(app);
  } catch (error) {
    console.error('[LOAN] Error getting application:', error);
    return res.status(500).json({ message: 'Error getting application.' });
  }
}

async function getApplicationsInternal() {
  const dbResult = await db.query(
    `SELECT la.*, a."DisplayName" as "ApplicantName", a."ApplicantType"
     FROM "LoanApplications" la
     LEFT JOIN "Applicants" a ON la."ApplicantId" = a."Id"
     ORDER BY la."CreatedAt" DESC`
  );

  const merged = [];
  const dbRefs = new Set();

  dbResult.rows.forEach(row => {
    const ref = row.ApplicationNumber;
    dbRefs.add(ref.toLowerCase());

    const inMem = inMemoryApplications.find(a => a.reference.toLowerCase() === ref.toLowerCase() || a.id === row.Id);
    if (inMem) {
      merged.push(inMem);
    } else {
      const isSubmitted = row.CurrentStatus.toUpperCase() === 'SUBMITTED';
      const submittedOnDate = row.SubmittedAt ? new Date(row.SubmittedAt) : new Date(row.CreatedAt);
      const formattedDate = submittedOnDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

      merged.push({
        id: row.Id,
        reference: row.ApplicationNumber,
        applicantName: row.ApplicantName || 'Amara Trading Ltd',
        memberId: 'APP-TEST-001',
        applicantType: row.ApplicantType || 'cooperative',
        status: isSubmitted ? 'submitted' : row.CurrentStatus.toLowerCase(),
        stage: isSubmitted ? 'verification' : 'underwriting',
        principal: parseFloat(row.PrincipalAmount),
        purpose: row.Purpose,
        tenureMonths: row.TermMonths,
        savingsBalance: 2000000,
        monthlyIncome: 1500000,
        monthlyDebt: 300000,
        multiplier: 3.0,
        submittedOn: formattedDate,
        statusNote: `Application ${row.ApplicationNumber} submitted. Verification in progress.`,
        dtiNetRatio: 20.0,
        netTakeHome: 1200000,
        verdict: 'IN_REVIEW',
        guarantors: [],
        committeeVotes: []
      });
    }
  });

  inMemoryApplications.forEach(app => {
    if (!dbRefs.has(app.reference.toLowerCase())) {
      merged.push(app);
    }
  });

  return merged;
}

async function createApplication(req, res) {
  const {
    principal,
    purpose,
    tenureMonths,
    applicantName,
    memberId,
    applicantType,
    savingsBalance,
    monthlyIncome,
    monthlyDebt,
    multiplier
  } = req.body;

  if (!principal || principal <= 0) {
    return res.status(400).json({ message: 'Loan principal must be greater than 0.' });
  }
  if (!purpose || !purpose.trim()) {
    return res.status(400).json({ message: 'Loan purpose is required.' });
  }
  if (!tenureMonths || tenureMonths <= 0) {
    return res.status(400).json({ message: 'Tenure months must be greater than 0.' });
  }

  const refNo = `LA-2026-${Math.floor(1000 + Math.random() * 9000)}X`;
  const newId = 'c2f8db11-0000-0000-0000-' + Math.random().toString(16).substr(2, 12).padEnd(12, '0');

  try {
    // Check if Sacco exists
    let saccoResult = await db.query('SELECT * FROM "Saccos" LIMIT 1');
    let sacco = saccoResult.rows[0];
    if (!sacco) {
      const saccoId = 'a1f8db11-0000-0000-0000-000000000001';
      await db.query(
        `INSERT INTO "Saccos" ("Id", "Name", "RegistrationNumber", "Status", "ContactEmail", "CreatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [saccoId, 'Talanton SACCO', 'SACCO-UG-001', 'Active', 'info@talanton.demo']
      );
      sacco = { Id: saccoId };
    }

    // Check if default user exists
    let userResult = await db.query('SELECT * FROM "Users" LIMIT 1');
    let user = userResult.rows[0];
    if (!user) {
      const userId = 'd1f8db11-0000-0000-0000-000000000001';
      await db.query(
        `INSERT INTO "Users" ("Id", "Email", "PasswordHash", "FullName", "IsActive", "CreatedAt", "SaccoId")
         VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
        [userId, 'applicant@talanton.demo', 'Demo123!', 'Demo Applicant', true, sacco.Id || sacco.id]
      );
      user = { Id: userId };
    }

    // Check if Applicant exists
    const appDisplayName = applicantName ? applicantName.trim() : 'Amara Trading Ltd';
    let applicantResult = await db.query(
      'SELECT * FROM "Applicants" WHERE LOWER("DisplayName") = $1 LIMIT 1',
      [appDisplayName.toLowerCase()]
    );
    let applicant = applicantResult.rows[0];
    if (!applicant) {
      const appType = applicantType || 'cooperative';
      const applicantId = 'b2f8db11-0000-0000-0000-' + Math.random().toString(16).substr(2, 12).padEnd(12, '0');
      await db.query(
        `INSERT INTO "Applicants" ("Id", "ApplicantType", "DisplayName", "IsActive", "SaccoId", "ApplicantUserId", "CreatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [applicantId, appType, appDisplayName, true, sacco.Id || sacco.id, user.Id || user.id]
      );
      applicant = { Id: applicantId, DisplayName: appDisplayName, ApplicantType: appType };
    }

    // Insert Loan Application
    await db.query(
      `INSERT INTO "LoanApplications" 
       ("Id", "ApplicationNumber", "ApplicantId", "SaccoId", "CreatedByUserId", "CurrentStatus", "PrincipalAmount", "AnnualSimpleInterestRatePct", "TermMonths", "AdministrativeFeeAmount", "Purpose", "SubmittedAt", "CreatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        newId,
        refNo,
        applicant.Id || applicant.id,
        sacco.Id || sacco.id,
        user.Id || user.id,
        'SUBMITTED',
        principal,
        12.0,
        tenureMonths,
        50000,
        purpose.trim()
      ]
    );

  } catch (error) {
    console.error('[LOAN] DB Error creating application:', error);
  }

  const createdDto = {
    id: newId,
    reference: refNo,
    applicantName: applicantName || 'Amara Trading Ltd',
    memberId: memberId || 'APP-TEST-001',
    applicantType: applicantType || 'cooperative',
    status: 'submitted',
    stage: 'verification',
    principal,
    purpose,
    tenureMonths,
    savingsBalance: savingsBalance || 0,
    monthlyIncome: monthlyIncome || 0,
    monthlyDebt: monthlyDebt || 0,
    multiplier: multiplier || 3.0,
    submittedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    statusNote: `Application ${refNo} submitted. Verification in progress.`,
    dtiNetRatio: monthlyIncome > 0 ? parseFloat(((monthlyDebt / monthlyIncome) * 100).toFixed(1)) : 0,
    netTakeHome: monthlyIncome - monthlyDebt,
    verdict: 'IN_REVIEW',
    guarantors: [],
    committeeVotes: []
  };

  inMemoryApplications.unshift(createdDto);
  return res.status(201).json(createdDto);
}

function updateUnderwriting(req, res) {
  const { reference } = req.params;
  const dto = req.body;

  const app = inMemoryApplications.find(a => a.reference.toLowerCase() === reference.toLowerCase());
  if (!app) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  app.applicantType = dto.applicantType;
  app.multiplier = parseFloat(dto.multiplier);
  app.tenureMonths = parseInt(dto.tenureMonths, 10);
  app.principal = parseFloat(dto.requestedPrincipal);
  app.savingsBalance = parseFloat(dto.savingsBalance);
  app.monthlyIncome = parseFloat(dto.basicMonthlyPay);
  app.monthlyDebt = parseFloat(dto.monthlyDeductions);

  // Recalculate guardrail metrics
  const maxCap = app.savingsBalance * app.multiplier;
  const estMonthlyPayment = app.tenureMonths > 0 ? (app.principal / app.tenureMonths) : 0;
  const residualPay = app.monthlyIncome - app.monthlyDebt - estMonthlyPayment;

  app.guardrailDepositMultiplierPassed = app.principal <= maxCap;
  app.guardrailOneThirdPayPassed = residualPay >= (app.monthlyIncome / 3.0);
  app.dtiNetRatio = app.monthlyIncome > 0 ? parseFloat((((app.monthlyDebt + estMonthlyPayment) / app.monthlyIncome) * 100).toFixed(1)) : 0;
  app.netTakeHome = residualPay;

  const totalPledged = (app.guarantors || []).reduce((acc, g) => acc + parseFloat(g.pledgedShares || 0), 0);
  const uncollateralized = Math.max(0, app.principal - app.savingsBalance);
  app.guardrailGuarantorPassed = totalPledged >= uncollateralized;

  app.verdict = (app.guardrailDepositMultiplierPassed && app.guardrailOneThirdPayPassed) ? 'APPROVED' : 'DECLINED';
  app.statusNote = app.verdict === 'APPROVED'
    ? `File ${reference} meets all underwriting guardrail checks.`
    : `File ${reference} is declined. BOSA multiplier breach or Payslip take-home deficit.`;

  return res.json(app);
}

function addGuarantor(req, res) {
  const { reference } = req.params;
  const guarantor = req.body;

  const app = inMemoryApplications.find(a => a.reference.toLowerCase() === reference.toLowerCase());
  if (!app) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  guarantor.id = 'g_' + Math.random().toString(36).substr(2, 9);
  if (!app.guarantors) {
    app.guarantors = [];
  }
  app.guarantors.push(guarantor);

  // Recalculate guarantor cover
  const totalPledged = app.guarantors.reduce((acc, g) => acc + parseFloat(g.pledgedShares || 0), 0);
  const uncollateralized = Math.max(0, app.principal - app.savingsBalance);
  app.guardrailGuarantorPassed = totalPledged >= uncollateralized;

  return res.json(app);
}

function castVote(req, res) {
  const { reference } = req.params;
  const { memberRole, vote } = req.body;

  const app = inMemoryApplications.find(a => a.reference.toLowerCase() === reference.toLowerCase());
  if (!app) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (!app.committeeVotes) {
    app.committeeVotes = [];
  }

  const existing = app.committeeVotes.find(v => v.memberRole.toLowerCase() === memberRole.toLowerCase());
  if (existing) {
    existing.vote = vote;
  } else {
    app.committeeVotes.push({
      memberName: memberRole,
      memberRole: memberRole,
      vote: vote
    });
  }

  return res.json(app);
}

function routeStage(req, res) {
  const { reference } = req.params;
  const { stage } = req.query;

  const app = inMemoryApplications.find(a => a.reference.toLowerCase() === reference.toLowerCase());
  if (!app) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  app.stage = stage;
  if (stage === 'committee') {
    app.statusNote = `File ${reference} routed to Committee Board for authorization.`;
  } else if (stage === 'underwriting') {
    app.statusNote = `File ${reference} in Underwriting review stage.`;
  }

  return res.json(app);
}

module.exports = {
  getApplications,
  getApplicationByRef,
  createApplication,
  updateUnderwriting,
  addGuarantor,
  castVote,
  routeStage,
};

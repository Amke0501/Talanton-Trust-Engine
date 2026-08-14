const passportMembers = [
  {
    id: "cp1",
    name: "Namatovu Sarah",
    memberId: "M-2309",
    classification: "BOSA",
    tier: "PLATINUM",
    trustScore: 92,
    onTimeRatePct: 100,
    loansCompleted: 4,
    totalRepaid: 18500000,
    currentLimit: 25000000,
    lastLoanDate: "Dec 2025"
  },
  {
    id: "cp2",
    name: "Ssemakula Agro Ltd",
    memberId: "SME-0412",
    classification: "SME",
    tier: "PLATINUM",
    trustScore: 88,
    onTimeRatePct: 97,
    loansCompleted: 3,
    totalRepaid: 76000000,
    currentLimit: 90000000,
    lastLoanDate: "Nov 2025"
  },
  {
    id: "cp3",
    name: "Kato Joseph",
    memberId: "M-1104",
    classification: "BOSA",
    tier: "GOLD",
    trustScore: 84,
    onTimeRatePct: 95,
    loansCompleted: 2,
    totalRepaid: 9200000,
    currentLimit: 15000000,
    lastLoanDate: "Oct 2025"
  },
  {
    id: "cp4",
    name: "Auma Florence",
    memberId: "M-4511",
    classification: "BOSA",
    tier: "GOLD",
    trustScore: 76,
    onTimeRatePct: 89,
    loansCompleted: 3,
    totalRepaid: 11400000,
    currentLimit: 12000000,
    lastLoanDate: "Jan 2026"
  },
  {
    id: "cp5",
    name: "Mukasa Peter",
    memberId: "M-9022",
    classification: "BOSA",
    tier: "SILVER",
    trustScore: 71,
    onTimeRatePct: 92,
    loansCompleted: 1,
    totalRepaid: 3500000,
    currentLimit: 6000000,
    lastLoanDate: "Sep 2025"
  },
  {
    id: "cp6",
    name: "Kiiza Wholesale Co.",
    memberId: "SME-0755",
    classification: "SME",
    tier: "GOLD",
    trustScore: 83,
    onTimeRatePct: 94,
    loansCompleted: 2,
    totalRepaid: 44000000,
    currentLimit: 60000000,
    lastLoanDate: "Dec 2025"
  }
];

function getPassportMembers(req, res) {
  return res.json(passportMembers);
}

module.exports = {
  getPassportMembers,
  passportMembers,
};

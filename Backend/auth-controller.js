const db = require('./db');

function normalizeRole(role) {
  if (!role) return null;
  const r = role.trim().toLowerCase();
  if (['applicant', 'underwriter', 'committee'].includes(r)) {
    return r;
  }
  return null;
}

function toDisplayRole(role) {
  switch (role) {
    case 'applicant': return 'Applicant';
    case 'underwriter': return 'Underwriter';
    case 'committee': return 'Committee';
    default: return role;
  }
}

async function login(req, res) {
  const { email: rawEmail, password, portalRole } = req.body;

  const normalizedPortalRole = normalizeRole(portalRole);
  if (!normalizedPortalRole) {
    return res.status(400).json({ message: 'Invalid portal selection.' });
  }

  if (!rawEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const email = rawEmail.trim().toLowerCase();

  try {
    // 1. Fetch user
    const userResult = await db.query(
      'SELECT * FROM "Users" WHERE LOWER("Email") = $1',
      [email]
    );

    const user = userResult.rows[0];

    if (!user || !user.IsActive || user.PasswordHash !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2. Fetch assigned role
    const roleResult = await db.query(
      `SELECT r."Name" 
       FROM "UserRoleAssignments" ura
       JOIN "Roles" r ON ura."RoleId" = r."Id"
       WHERE ura."UserId" = $1 AND ura."IsActive" = true
       ORDER BY r."Name" DESC
       LIMIT 1`,
      [user.Id]
    );

    const assignedRoleName = roleResult.rows[0] ? roleResult.rows[0].Name : null;
    const assignedRole = normalizeRole(assignedRoleName);

    if (!assignedRole) {
      return res.status(403).json({
        message: 'This account does not have an active portal role assignment.'
      });
    }

    if (assignedRole !== normalizedPortalRole) {
      const displayRole = toDisplayRole(assignedRole);
      return res.status(403).json({
        message: `This account is registered as an ${displayRole}. Please sign in through the ${displayRole} Portal.`
      });
    }

    // 3. Update LastLoginAt
    await db.query(
      'UPDATE "Users" SET "LastLoginAt" = NOW() WHERE "Id" = $1',
      [user.Id]
    );

    let applicantId = null;
    if (assignedRole === 'applicant') {
      // 4. Resolve applicant profile
      const appResult = await db.query(
        'SELECT * FROM "Applicants" WHERE "ApplicantUserId" = $1 LIMIT 1',
        [user.Id]
      );
      
      let applicant = appResult.rows[0];
      if (!applicant) {
        // Find first Sacco
        const saccoResult = await db.query('SELECT * FROM "Saccos" LIMIT 1');
        let sacco = saccoResult.rows[0];
        
        if (!sacco) {
          // If no sacco, insert a default one
          const saccoId = 'a1f8db11-0000-0000-0000-000000000001';
          await db.query(
            `INSERT INTO "Saccos" ("Id", "Name", "RegistrationNumber", "Status", "ContactEmail", "CreatedAt")
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [saccoId, 'Talanton SACCO', 'SACCO-UG-001', 'Active', 'info@talanton.demo']
          );
          sacco = { Id: saccoId };
        }

        const newApplicantId = 'b2f8db11-0000-0000-0000-' + Math.random().toString(16).substr(2, 12).padEnd(12, '0');
        await db.query(
          `INSERT INTO "Applicants" ("Id", "ApplicantType", "DisplayName", "IsActive", "SaccoId", "ApplicantUserId", "CreatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [newApplicantId, 'individual', user.FullName, true, sacco.Id || sacco.id, user.Id]
        );
        applicantId = newApplicantId;
      } else {
        applicantId = applicant.Id || applicant.id;
      }
    }

    return res.json({
      email: user.Email,
      fullName: user.FullName,
      role: assignedRole,
      userId: user.Id,
      applicantId: applicantId,
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

function logout(req, res) {
  return res.json({ message: 'Logged out.' });
}

module.exports = {
  login,
  logout,
};

const db = require('./db');

async function getAllApplicants(req, res) {
  try {
    const result = await db.query('SELECT * FROM "Applicants" ORDER BY "CreatedAt" DESC');
    // Map database fields to camelCase DTO fields
    const applicants = result.rows.map(row => ({
      id: row.Id,
      applicantType: row.ApplicantType,
      displayName: row.DisplayName,
      isActive: row.IsActive,
      saccoId: row.SaccoId,
      applicantUserId: row.ApplicantUserId,
      createdAt: row.CreatedAt,
    }));
    return res.json(applicants);
  } catch (error) {
    console.error('[APPLICANT] Error getting applicants:', error);
    return res.status(500).json({ message: 'Error getting applicants.' });
  }
}

async function getApplicantById(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM "Applicants" WHERE "Id" = $1', [id]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }
    return res.json({
      id: row.Id,
      applicantType: row.ApplicantType,
      displayName: row.DisplayName,
      isActive: row.IsActive,
      saccoId: row.SaccoId,
      applicantUserId: row.ApplicantUserId,
      createdAt: row.CreatedAt,
    });
  } catch (error) {
    console.error('[APPLICANT] Error getting applicant:', error);
    return res.status(500).json({ message: 'Error getting applicant.' });
  }
}

async function createApplicant(req, res) {
  const { applicantType, displayName, isActive, saccoId, applicantUserId } = req.body;
  if (!applicantType || !displayName || !saccoId) {
    return res.status(400).json({ message: 'applicantType, displayName, and saccoId are required.' });
  }

  try {
    const id = 'b2f8db11-0000-0000-0000-' + Math.random().toString(16).substr(2, 12).padEnd(12, '0');
    await db.query(
      `INSERT INTO "Applicants" ("Id", "ApplicantType", "DisplayName", "IsActive", "SaccoId", "ApplicantUserId", "CreatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [id, applicantType.trim(), displayName.trim(), isActive !== false, saccoId, applicantUserId || null]
    );

    return res.status(211).json({
      id,
      applicantType,
      displayName,
      isActive: isActive !== false,
      saccoId,
      applicantUserId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[APPLICANT] Error creating applicant:', error);
    return res.status(500).json({ message: 'Error creating applicant.' });
  }
}

async function updateApplicant(req, res) {
  const { id } = req.params;
  const { applicantType, displayName, isActive, saccoId, applicantUserId } = req.body;

  try {
    const check = await db.query('SELECT * FROM "Applicants" WHERE "Id" = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    const current = check.rows[0];
    const newType = applicantType !== undefined ? applicantType.trim() : current.ApplicantType;
    const newName = displayName !== undefined ? displayName.trim() : current.DisplayName;
    const newActive = isActive !== undefined ? isActive : current.IsActive;
    const newSacco = saccoId !== undefined ? saccoId : current.SaccoId;
    const newUserId = applicantUserId !== undefined ? (applicantUserId || null) : current.ApplicantUserId;

    await db.query(
      `UPDATE "Applicants"
       SET "ApplicantType" = $1, "DisplayName" = $2, "IsActive" = $3, "SaccoId" = $4, "ApplicantUserId" = $5
       WHERE "Id" = $6`,
      [newType, newName, newActive, newSacco, newUserId, id]
    );

    return res.json({
      id,
      applicantType: newType,
      displayName: newName,
      isActive: newActive,
      saccoId: newSacco,
      applicantUserId: newUserId,
      createdAt: current.CreatedAt,
    });
  } catch (error) {
    console.error('[APPLICANT] Error updating applicant:', error);
    return res.status(500).json({ message: 'Error updating applicant.' });
  }
}

async function deleteApplicant(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM "Applicants" WHERE "Id" = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('[APPLICANT] Error deleting applicant:', error);
    return res.status(500).json({ message: 'Error deleting applicant.' });
  }
}

module.exports = {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicant,
  deleteApplicant,
};

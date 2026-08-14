namespace Talanton.Api.DTOs;

public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string PortalRole { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Real authenticated user identity (Users.Id). Used by the frontend to scope
    /// subsequent API calls to the correct user instead of returning global/unfiltered data.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Present only when Role == "applicant". Identifies the Applicant row this user
    /// owns (Applicants.ApplicantUserId == UserId), created on first login if missing.
    /// </summary>
    public Guid? ApplicantId { get; set; }
}
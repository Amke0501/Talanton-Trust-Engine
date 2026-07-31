using Microsoft.AspNetCore.Mvc;

namespace Talanton.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicantController : ControllerBase
{
    [HttpGet]
    public IActionResult GetApplicants()
    {
        var applicants = new[]
        {
            new
            {
                Id = 1,
                FullName = "Demo Applicant",
                Email = "demo@talanton.com",
                Status = "Pending"
            }
        };

        return Ok(applicants);
    }
}

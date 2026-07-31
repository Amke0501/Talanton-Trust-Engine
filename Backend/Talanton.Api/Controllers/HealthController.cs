using Microsoft.AspNetCore.Mvc;

namespace Talanton.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Status = "Backend is running",
            Message = "Talanton Trust Engine API"
        });
    }
}
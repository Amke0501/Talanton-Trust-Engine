using Microsoft.EntityFrameworkCore;
using Talanton.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ===========================
// Database Connection
// ===========================
var connectionString =
    builder.Configuration["SUPABASE_DB_CONNECTION"]
    ?? builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString) || HasPlaceholderConnectionString(connectionString))
{
    throw new InvalidOperationException(
        "No valid PostgreSQL connection string configured. Set SUPABASE_DB_CONNECTION or ConnectionStrings:DefaultConnection.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql =>
        npgsql.EnableRetryOnFailure()));

// ===========================
// Services
// ===========================
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// ===========================
// CORS
// ===========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ===========================
// Authentication (Coming Soon)
// ===========================

// builder.Services.AddAuthentication();

// ===========================
// Authorization (Coming Soon)
// ===========================

// builder.Services.AddAuthorization();

var app = builder.Build();

// ===========================
// Middleware
// ===========================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

// app.UseAuthentication();

// app.UseAuthorization();

app.MapControllers();

app.Run();

static bool HasPlaceholderConnectionString(string value)
{
    return value.Contains("YOUR_SUPABASE_HOST", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV__", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV_OR_USE_SUPABASE_DB_CONNECTION__", StringComparison.OrdinalIgnoreCase);
}
using Microsoft.EntityFrameworkCore;
using Talanton.Api.Data;

var builder = WebApplication.CreateBuilder(args);
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

<<<<<<< HEAD
// ===========================
// Database Connection
// ===========================
var connectionString =
    builder.Configuration["SUPABASE_DB_CONNECTION"]
    ?? builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
=======
var connectionString = FirstNonEmpty(
    builder.Configuration["SUPABASE_DB_CONNECTION"],
    builder.Configuration["DATABASE_URL"],
    builder.Configuration.GetConnectionString("DefaultConnection"));

var source = "none";
if (!string.IsNullOrWhiteSpace(builder.Configuration["SUPABASE_DB_CONNECTION"]))
{
    source = "SUPABASE_DB_CONNECTION";
}
else if (!string.IsNullOrWhiteSpace(builder.Configuration["DATABASE_URL"]))
{
    source = "DATABASE_URL";
}
else if (!string.IsNullOrWhiteSpace(builder.Configuration.GetConnectionString("DefaultConnection")))
{
    source = "ConnectionStrings:DefaultConnection";
}
>>>>>>> develop

if (string.IsNullOrWhiteSpace(connectionString) || HasPlaceholderConnectionString(connectionString))
{
    throw new InvalidOperationException(
        "No valid PostgreSQL connection string configured. Set SUPABASE_DB_CONNECTION or ConnectionStrings:DefaultConnection.");
}

<<<<<<< HEAD
=======
static bool HasPlaceholderConnectionString(string value)
{
    return value.Contains("YOUR_SUPABASE_HOST", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV__", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV_OR_USE_SUPABASE_DB_CONNECTION__", StringComparison.OrdinalIgnoreCase);
}

static string? FirstNonEmpty(params string?[] values)
{
    foreach (var value in values)
    {
        if (!string.IsNullOrWhiteSpace(value))
        {
            return value;
        }
    }

    return null;
}

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddControllers();

>>>>>>> develop
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

app.UseCors("FrontendPolicy");

app.UseHttpsRedirection();

<<<<<<< HEAD
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
=======
app.MapControllers();

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        Application = "Talanton Trust Engine API",
        Status = "Running",
        Environment = app.Environment.EnvironmentName,
        Timestamp = DateTime.UtcNow
    });
});

app.Run();
>>>>>>> develop

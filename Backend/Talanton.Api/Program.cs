using Microsoft.EntityFrameworkCore;
using Talanton.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration["SUPABASE_DB_CONNECTION"]
    ?? builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

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

Console.WriteLine($"[DEBUG] connectionString present: {!string.IsNullOrWhiteSpace(connectionString)}");
Console.WriteLine($"[DEBUG] connectionString source: {source}");

if (string.IsNullOrWhiteSpace(connectionString) || HasPlaceholderConnectionString(connectionString))
{
    throw new InvalidOperationException(
        "No valid PostgreSQL connection string configured. Set SUPABASE_DB_CONNECTION (recommended) or ConnectionStrings:DefaultConnection.");
}

static bool HasPlaceholderConnectionString(string value)
{
    return value.Contains("YOUR_SUPABASE_HOST", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV__", StringComparison.OrdinalIgnoreCase)
        || value.Contains("__SET_IN_ENV_OR_USE_SUPABASE_DB_CONNECTION__", StringComparison.OrdinalIgnoreCase);
}

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
        npgsqlOptions.EnableRetryOnFailure()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

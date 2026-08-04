
// Configure the HTTP request pipeline.
using Microsoft.EntityFrameworkCore;
using Talanton.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Read connection string
var envConnection = Environment.GetEnvironmentVariable("SUPABASE_DB_CONNECTION");
Console.WriteLine($"Environment variable: {envConnection}");

var configConnection = builder.Configuration["SUPABASE_DB_CONNECTION"];
Console.WriteLine($"Configuration variable: {configConnection}");

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Default connection: {defaultConnection}");

var connectionString =
    envConnection
    ?? configConnection
    ?? builder.Configuration["DATABASE_URL"]
    ?? defaultConnection;

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("No connection string found.");
}

// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Controllers
builder.Services.AddControllers();

// OpenAPI / Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

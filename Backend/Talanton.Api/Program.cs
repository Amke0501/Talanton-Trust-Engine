
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();


var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =using Microsoft.EntityFrameworkCore;
using Talanton.Api.Data;

var builder = WebApplication.CreateBuilder(args);

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
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
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

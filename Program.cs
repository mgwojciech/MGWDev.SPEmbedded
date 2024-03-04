using MGWDev.SPEmbedded.StartupConfiguration;
using MGWDev.SPEmbedded.Utilities;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "client-app/build";
});
builder.Services.ConfigureAuthorization(builder.Configuration);
builder.Services.AddScoped<AccessTokenUtilities>();
builder.Services.AddScoped<HttpClientUtilities>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseHttpsRedirection();

app.UseAuthentication();
app.Use(async (context, next) =>
{
    if (context.User.Identity is { IsAuthenticated: false })
    {
        if (context.Request.Path.StartsWithSegments("/login") || context.Request.Headers.Referer.Any(referer => referer.EndsWith("/login")))
        {
            await context.ChallengeAsync(new AuthenticationProperties()
            {
                RedirectUri = $"https://{context.Request.Host.Value}"
            });
            if (context.User.Identity.IsAuthenticated)
            {

            }
        }

        else if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = 401;
            await next();
        }
        else await next();
    }
    else
    {
        await next();
    }
});
app.UseRouting();
app.UseAuthorization();
//app.MapControllers();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
});
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "client-app";

    if (builder.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    }
});
app.Run();

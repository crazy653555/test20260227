using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;

using MyTrainingPlan.Api.Repositories;
using MyTrainingPlan.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Use Autofac as the DI container
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    // Register Repositories
    containerBuilder.RegisterType<ProjectRepository>().As<IProjectRepository>().InstancePerLifetimeScope();
    containerBuilder.RegisterType<StageRepository>().As<IStageRepository>().InstancePerLifetimeScope();

    // Register Services
    containerBuilder.RegisterType<ProjectService>().As<IProjectService>().InstancePerLifetimeScope();
    containerBuilder.RegisterType<StageService>().As<IStageService>().InstancePerLifetimeScope();
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configure SQLite DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=mytrainingplan.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();

// Apply migrations automatically on startup (optional for local dev)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

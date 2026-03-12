using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;

using MyTrainingPlan.Api.Repositories;
using MyTrainingPlan.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 設定使用 Autofac 作為相依性注入 (DI) 的容器工廠
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    // 註冊資料存取層 Repositories
    containerBuilder.RegisterType<ProjectRepository>().As<IProjectRepository>().InstancePerLifetimeScope();
    containerBuilder.RegisterType<StageRepository>().As<IStageRepository>().InstancePerLifetimeScope();

    // 註冊業務邏輯層 Services
    containerBuilder.RegisterType<ProjectService>().As<IProjectService>().InstancePerLifetimeScope();
    containerBuilder.RegisterType<StageService>().As<IStageService>().InstancePerLifetimeScope();
});

// 配置 CORS 跨來源資源共用原則
// 目前開發階段設定為 AllowAll，允許所有來源、標頭與方法
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

// 配置 SQLite 資料庫上下文 (DbContext)
// 由設定檔取得連接字串，若無則預設產生 mytrainingplan.db
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=mytrainingplan.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// 註冊標準的控制器服務
builder.Services.AddControllers();
// 啟用 OpenAPI / Swagger 解析 (適用於 .NET 9+)
builder.Services.AddOpenApi();

var app = builder.Build();

// 配置 HTTP 請求管線
if (app.Environment.IsDevelopment())
{
    // 在開發環境下暴露 API 文件
    app.MapOpenApi();
}

// 啟用預設的 HTTPS 重新導向
app.UseHttpsRedirection();
// 套用先前定義的 CORS 策略
app.UseCors("AllowAll");
// 對應控制器端點
app.MapControllers();

// 程式啟動時自動進行資料庫遷移 (Apply Migrations)
// 確保資料庫結構與目前程式碼一致，並注入預設資料
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 啟動應用程式
app.Run();

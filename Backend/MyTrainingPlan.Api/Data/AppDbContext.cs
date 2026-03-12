using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Data
{
    /// <summary>
    /// 應用程式資料庫內容類別，繼承自 Entity Framework Core 的 DbContext
    /// 負責定義資料庫資料表對應與初始化設定
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// 專案 (Projects) 資料表
        /// </summary>
        public DbSet<Project> Projects { get; set; } = null!;

        /// <summary>
        /// 訓練階段 (Stages) 資料表
        /// </summary>
        public DbSet<Stage> Stages { get; set; } = null!;

        /// <summary>
        /// 設定資料模型對應關係與種子資料 (Seed Data)
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 配置 Project 模型
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.GlobalRestVideoUrl).HasMaxLength(500);

                // 因為目前 UI 僅支援單一專案管理，故在此預先注入一筆種子專案
                entity.HasData(new Project
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Name = "預設專案",
                    GlobalRestVideoUrl = "",
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                });
            });

            // 配置 Stage 模型
            modelBuilder.Entity<Stage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.StageName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.YoutubeUrl).IsRequired().HasMaxLength(500);

                // 設定一對多關係：一個 Project 有多個 Stage，刪除 Project 時級聯刪除 Stage
                entity.HasOne(d => d.Project)
                      .WithMany(p => p.Stages)
                      .HasForeignKey(d => d.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

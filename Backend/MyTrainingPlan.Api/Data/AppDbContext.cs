using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<Stage> Stages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.GlobalRestVideoUrl).HasMaxLength(500);

                // Initialize default project since the UI expects a single project for now
                entity.HasData(new Project
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Name = "預設專案",
                    GlobalRestVideoUrl = "",
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                });
            });

            modelBuilder.Entity<Stage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.StageName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.YoutubeUrl).IsRequired().HasMaxLength(500);

                // One-to-Many setup
                entity.HasOne(d => d.Project)
                      .WithMany(p => p.Stages)
                      .HasForeignKey(d => d.ProjectId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

using System;
using System.Collections.Generic;

namespace MyTrainingPlan.Api.Models
{
    public class Project
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string? GlobalRestVideoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for EF Core
        public ICollection<Stage> Stages { get; set; } = new List<Stage>();
    }
}

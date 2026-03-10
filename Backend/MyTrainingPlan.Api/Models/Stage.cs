using System;

namespace MyTrainingPlan.Api.Models
{
    public class Stage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProjectId { get; set; }
        public string StageName { get; set; } = string.Empty;
        public string YoutubeUrl { get; set; } = string.Empty;
        public int PracticeSeconds { get; set; }
        public int RestSeconds { get; set; }
        public int StartSecond { get; set; }
        public int? EndSecond { get; set; }
        public int OrderIdx { get; set; }

        // Navigation property
        public Project? Project { get; set; }
    }
}

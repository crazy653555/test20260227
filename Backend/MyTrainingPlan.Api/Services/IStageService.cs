using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Services
{
    public interface IStageService
    {
        Task<IEnumerable<Stage>> GetStagesByProjectAsync(Guid projectId);
        Task<Stage?> GetStageAsync(Guid id);
        Task<Stage> CreateStageAsync(Stage stage);
        Task UpdateStageAsync(Stage stage);
        Task DeleteStageAsync(Guid id);
        Task UpdateStagesOrderAsync(Guid projectId, IEnumerable<StageOrderUpdateDto> updates);
    }

    public class StageOrderUpdateDto
    {
        public Guid Id { get; set; }
        public int OrderIdx { get; set; }
    }
}

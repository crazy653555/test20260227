using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Repositories;

namespace MyTrainingPlan.Api.Services
{
    public class StageService : IStageService
    {
        private readonly IStageRepository _stageRepository;

        public StageService(IStageRepository stageRepository)
        {
            _stageRepository = stageRepository;
        }

        public async Task<IEnumerable<Stage>> GetStagesByProjectAsync(Guid projectId)
        {
            return await _stageRepository.GetStagesByProjectIdAsync(projectId);
        }

        public async Task<Stage?> GetStageAsync(Guid id)
        {
            return await _stageRepository.GetByIdAsync(id);
        }

        public async Task<Stage> CreateStageAsync(Stage stage)
        {
            stage.Id = Guid.NewGuid();

            // Generate sequence roughly based on max + 1
            if (stage.OrderIdx == 0)
            {
                var maxOrder = await _stageRepository.GetMaxOrderIdxAsync(stage.ProjectId);
                stage.OrderIdx = maxOrder < 0 ? 0 : maxOrder + 1;
            }

            await _stageRepository.AddAsync(stage);
            await _stageRepository.SaveChangesAsync();
            return stage;
        }

        public async Task UpdateStageAsync(Stage stage)
        {
            await _stageRepository.UpdateAsync(stage);
            await _stageRepository.SaveChangesAsync();
        }

        public async Task DeleteStageAsync(Guid id)
        {
            await _stageRepository.DeleteByIdAsync(id);
            await _stageRepository.SaveChangesAsync();
        }

        public async Task UpdateStagesOrderAsync(Guid projectId, IEnumerable<StageOrderUpdateDto> updates)
        {
            foreach (var update in updates)
            {
                var stage = await _stageRepository.GetByIdAsync(update.Id);
                if (stage != null && stage.ProjectId == projectId)
                {
                    stage.OrderIdx = update.OrderIdx;
                    await _stageRepository.UpdateAsync(stage);
                }
            }
            await _stageRepository.SaveChangesAsync();
        }
    }
}

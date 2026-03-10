using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    public interface IStageRepository : IRepository<Stage>
    {
        Task<IEnumerable<Stage>> GetStagesByProjectIdAsync(Guid projectId);
        Task<int> GetMaxOrderIdxAsync(Guid projectId);
    }
}

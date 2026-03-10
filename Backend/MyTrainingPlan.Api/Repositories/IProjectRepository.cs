using System;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    public interface IProjectRepository : IRepository<Project>
    {
        Task<Project?> GetProjectWithStagesAsync(Guid projectId);
    }
}

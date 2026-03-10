using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        public ProjectRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Project?> GetProjectWithStagesAsync(Guid projectId)
        {
            return await _dbSet
                .Include(p => p.Stages.OrderBy(s => s.OrderIdx))
                .FirstOrDefaultAsync(p => p.Id == projectId);
        }
    }
}

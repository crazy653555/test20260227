using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    public class StageRepository : Repository<Stage>, IStageRepository
    {
        public StageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Stage>> GetStagesByProjectIdAsync(Guid projectId)
        {
            return await _dbSet
                .Where(s => s.ProjectId == projectId)
                .OrderBy(s => s.OrderIdx)
                .ToListAsync();
        }

        public async Task<int> GetMaxOrderIdxAsync(Guid projectId)
        {
            var hasStages = await _dbSet.AnyAsync(s => s.ProjectId == projectId);
            if (!hasStages)
            {
                return -1;
            }
            return await _dbSet
                .Where(s => s.ProjectId == projectId)
                .MaxAsync(s => s.OrderIdx);
        }
    }
}

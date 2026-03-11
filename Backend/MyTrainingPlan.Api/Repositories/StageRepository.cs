using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 階段 (Stage) 的資料庫操作實作類別
    /// </summary>
    public class StageRepository : Repository<Stage>, IStageRepository
    {
        /// <summary>
        /// 初始化 <see cref="StageRepository"/> 類別的新執行個體
        /// </summary>
        /// <param name="context">應用程式的資料庫內容</param>
        public StageRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// 非同步根據專案 ID 取得所有關聯的階段清單，並依順序排序
        /// </summary>
        /// <param name="projectId">關聯專案的唯一識別碼</param>
        /// <returns>該專案下的非同步階段集合列表</returns>
        public async Task<IEnumerable<Stage>> GetStagesByProjectIdAsync(Guid projectId)
        {
            return await _dbSet
                .Where(s => s.ProjectId == projectId)
                .OrderBy(s => s.OrderIdx)
                .ToListAsync();
        }

        /// <summary>
        /// 非同步取得指定專案中，階段目前的最大排序索引值 (OrderIdx)
        /// 此方法可用於計算新增下一個階段的預設排序值
        /// </summary>
        /// <param name="projectId">關聯專案的唯一識別碼</param>
        /// <returns>專案中階段最大的預設排序索引；若沒有專案會回傳 -1</returns>
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

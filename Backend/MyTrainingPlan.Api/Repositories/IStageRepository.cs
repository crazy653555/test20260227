using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 定義階段 (Stage) 特定的資料庫操作介面
    /// </summary>
    public interface IStageRepository : IRepository<Stage>
    {
        /// <summary>
        /// 非同步根據專案 ID 取得所有關聯的階段清單，並依順序排序
        /// </summary>
        /// <param name="projectId">關聯專案的唯一識別碼</param>
        /// <returns>該專案下的階段集合</returns>
        Task<IEnumerable<Stage>> GetStagesByProjectIdAsync(Guid projectId);

        /// <summary>
        /// 非同步取得指定專案中，階段的最大排序索引值 (OrderIdx)
        /// </summary>
        /// <param name="projectId">關聯專案的唯一識別碼</param>
        /// <returns>專案中階段最大的排序索引；若專案尚無任何階段，會回傳 -1</returns>
        Task<int> GetMaxOrderIdxAsync(Guid projectId);
    }
}

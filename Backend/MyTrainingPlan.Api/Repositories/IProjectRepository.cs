using System;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 定義專案 (Project) 特定的資料庫操作介面
    /// </summary>
    public interface IProjectRepository : IRepository<Project>
    {
        /// <summary>
        /// 非同步取得專案，並包含其關聯的所有階段 (Stages) 資料
        /// </summary>
        /// <param name="projectId">欲取得的專案唯一識別碼</param>
        /// <returns>包含階段資料的專案實體；若找不到則回傳 null</returns>
        Task<Project?> GetProjectWithStagesAsync(Guid projectId);
    }
}

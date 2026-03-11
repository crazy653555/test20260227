using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;
using MyTrainingPlan.Api.Models;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 專案 (Project) 的資料庫操作實作類別
    /// </summary>
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        /// <summary>
        /// 初始化 <see cref="ProjectRepository"/> 類別的新執行個體
        /// </summary>
        /// <param name="context">應用程式的資料庫內容</param>
        public ProjectRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// 非同步取得專案，並透過 Include 預先載入其關聯的所有階段，依排序索引值排序
        /// </summary>
        /// <param name="projectId">欲取得的專案唯一識別碼</param>
        /// <returns>找到的專案與其關聯的階段資料，若不存在則回傳 null</returns>
        public async Task<Project?> GetProjectWithStagesAsync(Guid projectId)
        {
            return await _dbSet
                .Include(p => p.Stages.OrderBy(s => s.OrderIdx))
                .FirstOrDefaultAsync(p => p.Id == projectId);
        }
    }
}

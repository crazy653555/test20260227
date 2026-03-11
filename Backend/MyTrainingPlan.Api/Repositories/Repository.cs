using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTrainingPlan.Api.Data;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 定義基礎資料庫操作的共用實作類別
    /// </summary>
    /// <typeparam name="T">實體的型別</typeparam>
    public class Repository<T> : IRepository<T> where T : class
    {
        /// <summary>
        /// 資料庫內容 (Database Context)
        /// </summary>
        protected readonly AppDbContext _context;

        /// <summary>
        /// 資料庫實體集合 (DbSet)
        /// </summary>
        protected readonly DbSet<T> _dbSet;

        /// <summary>
        /// 初始化 <see cref="Repository{T}"/> 類別的新執行個體
        /// </summary>
        /// <param name="context">應用程式的資料庫內容 (AppDbContext)</param>
        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        /// <summary>
        /// 非同步取得所有實體資料
        /// </summary>
        /// <returns>回傳包含所有實體的集合</returns>
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        /// <summary>
        /// 非同步根據唯一識別碼 (ID) 取得單一實體資料
        /// </summary>
        /// <param name="id">實體的唯一識別碼</param>
        /// <returns>符合條件的實體；若找不到則回傳 null</returns>
        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        /// <summary>
        /// 非同步根據特定條件搜尋符合的實體資料
        /// </summary>
        /// <param name="predicate">用來篩選實體的 Lambda 條件運算式</param>
        /// <returns>符合條件的實體集合</returns>
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        /// <summary>
        /// 非同步新增單一實體
        /// </summary>
        /// <param name="entity">欲新增的實體</param>
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        /// <summary>
        /// 提供非同步的簽章以更新實體屬性狀態
        /// </summary>
        /// <param name="entity">欲標記為已修改狀態的實體</param>
        public Task UpdateAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        /// <summary>
        /// 刪除指定的實體
        /// </summary>
        /// <param name="entity">欲標記為已刪除的實體</param>
        public Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            return Task.CompletedTask;
        }

        /// <summary>
        /// 非同步根據唯一識別碼 (ID) 刪除實體
        /// </summary>
        /// <param name="id">欲刪除的實體唯一識別碼</param>
        public async Task DeleteByIdAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                await DeleteAsync(entity);
            }
        }

        /// <summary>
        /// 非同步檢查指定 ID 的實體是否存在於資料庫中
        /// </summary>
        /// <param name="id">實體的唯一識別碼</param>
        /// <returns>若實體存在則回傳 true，否則回傳 false</returns>
        public async Task<bool> ExistsAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);
            return entity != null;
        }

        /// <summary>
        /// 非同步儲存所有對實體所做的變更至資料庫中
        /// </summary>
        /// <returns>成功寫入資料庫的狀態實體數量</returns>
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}

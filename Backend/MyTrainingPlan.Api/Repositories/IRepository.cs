using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MyTrainingPlan.Api.Repositories
{
    /// <summary>
    /// 定義基礎資料庫操作的泛型共用介面
    /// </summary>
    /// <typeparam name="T">實體的型別</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// 取得所有實體資料
        /// </summary>
        /// <returns>包含所有實體的集合</returns>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// 根據唯一識別碼 (ID) 取得單一實體資料
        /// </summary>
        /// <param name="id">實體的唯一識別碼</param>
        /// <returns>符合條件的實體；若找不到則回傳 null</returns>
        Task<T?> GetByIdAsync(Guid id);

        /// <summary>
        /// 根據特定條件搜尋符合的實體資料
        /// </summary>
        /// <param name="predicate">用來篩選實體的條件運算式</param>
        /// <returns>符合條件的實體集合</returns>
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// 新增單一實體
        /// </summary>
        /// <param name="entity">欲新增的實體</param>
        Task AddAsync(T entity);

        /// <summary>
        /// 更新已存在的實體
        /// </summary>
        /// <param name="entity">欲更新的實體</param>
        Task UpdateAsync(T entity);

        /// <summary>
        /// 刪除指定的實體
        /// </summary>
        /// <param name="entity">欲刪除的實體</param>
        Task DeleteAsync(T entity);

        /// <summary>
        /// 根據唯一識別碼 (ID) 刪除實體
        /// </summary>
        /// <param name="id">欲刪除的實體唯一識別碼</param>
        Task DeleteByIdAsync(Guid id);

        /// <summary>
        /// 檢查指定 ID 的實體是否存在
        /// </summary>
        /// <param name="id">實體的唯一識別碼</param>
        /// <returns>若實體存在則回傳 true，否則回傳 false</returns>
        Task<bool> ExistsAsync(Guid id);

        /// <summary>
        /// 儲存所有對實體所做的變更至資料庫
        /// </summary>
        /// <returns>成功寫入資料庫的狀態實體數量</returns>
        Task<int> SaveChangesAsync();
    }
}

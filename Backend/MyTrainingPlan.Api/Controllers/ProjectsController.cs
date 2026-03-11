using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Services;

namespace MyTrainingPlan.Api.Controllers
{
    /// <summary>
    /// 專案 (Project) 管理的 API 控制器
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        /// <summary>
        /// 初始化 <see cref="ProjectsController"/> 類別的新執行個體
        /// </summary>
        /// <param name="projectService">專案業務邏輯服務</param>
        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// 取得所有專案的清單
        /// </summary>
        /// <returns>所有專案的陣列</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        /// <summary>
        /// 根據專案 ID 取得單一專案及其詳細階段資料
        /// </summary>
        /// <param name="id">專案的唯一識別碼</param>
        /// <returns>專案資訊；若找不到則回傳 404 NotFound</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(Guid id)
        {
            var project = await _projectService.GetProjectWithStagesAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        /// <summary>
        /// 建立新的專案
        /// </summary>
        /// <param name="project">要建立的專案內容</param>
        /// <returns>回傳 201 Created 狀態碼並附帶新建專案資訊</returns>
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            var createdProject = await _projectService.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProject), new { id = createdProject.Id }, createdProject);
        }

        /// <summary>
        /// 更新現有的專案資訊
        /// </summary>
        /// <param name="id">欲更新的專案 ID</param>
        /// <param name="project">新的專案資料</param>
        /// <returns>成功則回傳 204 NoContent</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            var existingProject = await _projectService.GetProjectAsync(id);
            if (existingProject == null)
            {
                return NotFound();
            }

            // Map fields manually or via AutoMapper
            existingProject.Name = project.Name;
            existingProject.GlobalRestVideoUrl = project.GlobalRestVideoUrl;

            await _projectService.UpdateProjectAsync(existingProject);

            return NoContent();
        }

        /// <summary>
        /// 刪除指定的專案
        /// </summary>
        /// <param name="id">欲刪除的專案唯一識別碼</param>
        /// <returns>成功則回傳 204 NoContent</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _projectService.GetProjectAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            await _projectService.DeleteProjectAsync(id);
            return NoContent();
        }
    }
}

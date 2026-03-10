using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Services;

namespace MyTrainingPlan.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

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

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            var createdProject = await _projectService.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProject), new { id = createdProject.Id }, createdProject);
        }

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

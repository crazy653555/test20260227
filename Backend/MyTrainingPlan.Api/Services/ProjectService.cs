using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTrainingPlan.Api.Models;
using MyTrainingPlan.Api.Repositories;

namespace MyTrainingPlan.Api.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return await _projectRepository.GetAllAsync();
        }

        public async Task<Project?> GetProjectAsync(Guid id)
        {
            return await _projectRepository.GetByIdAsync(id);
        }

        public async Task<Project?> GetProjectWithStagesAsync(Guid id)
        {
            return await _projectRepository.GetProjectWithStagesAsync(id);
        }

        public async Task<Project> CreateProjectAsync(Project project)
        {
            project.Id = Guid.NewGuid();
            project.CreatedAt = DateTime.UtcNow;
            project.UpdatedAt = DateTime.UtcNow;

            await _projectRepository.AddAsync(project);
            await _projectRepository.SaveChangesAsync();
            return project;
        }

        public async Task UpdateProjectAsync(Project project)
        {
            project.UpdatedAt = DateTime.UtcNow;
            await _projectRepository.UpdateAsync(project);
            await _projectRepository.SaveChangesAsync();
        }

        public async Task DeleteProjectAsync(Guid id)
        {
            await _projectRepository.DeleteByIdAsync(id);
            await _projectRepository.SaveChangesAsync();
        }
    }
}

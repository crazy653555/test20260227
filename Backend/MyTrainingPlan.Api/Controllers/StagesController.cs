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
    public class StagesController : ControllerBase
    {
        private readonly IStageService _stageService;

        public StagesController(IStageService stageService)
        {
            _stageService = stageService;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<Stage>>> GetStagesByProject(Guid projectId)
        {
            var stages = await _stageService.GetStagesByProjectAsync(projectId);
            return Ok(stages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stage>> GetStage(Guid id)
        {
            var stage = await _stageService.GetStageAsync(id);
            if (stage == null)
            {
                return NotFound();
            }
            return Ok(stage);
        }

        [HttpPost]
        public async Task<ActionResult<Stage>> CreateStage(Stage stage)
        {
            var createdStage = await _stageService.CreateStageAsync(stage);
            return CreatedAtAction(nameof(GetStage), new { id = createdStage.Id }, createdStage);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStage(Guid id, Stage stage)
        {
            if (id != stage.Id)
            {
                return BadRequest();
            }

            var existingStage = await _stageService.GetStageAsync(id);
            if (existingStage == null)
            {
                return NotFound();
            }

            existingStage.StageName = stage.StageName;
            existingStage.YoutubeUrl = stage.YoutubeUrl;
            existingStage.PracticeSeconds = stage.PracticeSeconds;
            existingStage.RestSeconds = stage.RestSeconds;
            existingStage.StartSecond = stage.StartSecond;
            existingStage.EndSecond = stage.EndSecond;

            await _stageService.UpdateStageAsync(existingStage);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStage(Guid id)
        {
            var stage = await _stageService.GetStageAsync(id);
            if (stage == null)
            {
                return NotFound();
            }

            await _stageService.DeleteStageAsync(id);
            return NoContent();
        }

        [HttpPut("project/{projectId}/reorder")]
        public async Task<IActionResult> UpdateStagesOrder(Guid projectId, [FromBody] IEnumerable<StageOrderUpdateDto> updates)
        {
            await _stageService.UpdateStagesOrderAsync(projectId, updates);
            return NoContent();
        }
    }
}

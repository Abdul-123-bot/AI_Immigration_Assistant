using Bal.ImmiBot.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bal.ImmiBot.Api.Controllers;

[ApiController]
[Route("api/controller")]
public class DocumentController: ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentController(IDocumentService documentService){
        _documentService = documentService;
    }

    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadDocument(IFormFile file){
        if (file == null || file.Length == 0){
            return BadRequest(new { Message = "No file uploaded or file is empty." });
        }
        var analysisResult = await _documentService.AnalyzeDocumentAsync(file);

        return Ok(analysisResult);
    }
}
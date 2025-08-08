using Bal.ImmiBot.Api.Models;

namespace Bal.ImmiBot.Api.Interfaces;

public interface IDocumentService
{
    Task<DocumentAnalysisResponse> AnalyzeDocumentAsync(IFormFile file);
}
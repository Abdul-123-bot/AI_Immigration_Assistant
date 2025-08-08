
namespace Bal.ImmiBot.Api.Models;

public class DocumentAnalysisResponse
{
    public Guid DocumentId { get; set; }
    public string? BlobUrl { get; set; } // <-- Add this line
    public string? FileName { get; set; }
    public string? Summary { get; set; }
    public Dictionary<string, string>? Entities { get; set; }
    public string? Status { get; set; }
}
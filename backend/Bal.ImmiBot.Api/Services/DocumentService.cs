// /backend/Bal.ImmiBot.Api/Services/DocumentService.cs

using Azure.Storage.Blobs; // Add this using statement
using Bal.ImmiBot.Api.Interfaces;
using Bal.ImmiBot.Api.Models;
using System.Text.Json;

namespace Bal.ImmiBot.Api.Services;

public class DocumentService : IDocumentService
{
    private readonly ILogger<DocumentService> _logger;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration; // To read app settings

    // Inject IConfiguration into the constructor
    public DocumentService(ILogger<DocumentService> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _configuration = configuration;
    }

    public async Task<DocumentAnalysisResponse> AnalyzeDocumentAsync(IFormFile file)
    {
        // --- NEW: UPLOAD TO AZURE BLOB STORAGE ---
        var connectionString = _configuration.GetConnectionString("AzureBlobStorage");
        var blobServiceClient = new BlobServiceClient(connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient("documents");

        // Create a unique name for the file to prevent overwrites
        var blobName = $"{Guid.NewGuid()}-{file.FileName}";
        var blobClient = containerClient.GetBlobClient(blobName);

        _logger.LogInformation("Uploading file '{FileName}' to Azure Blob Storage as '{BlobName}'.", file.FileName, blobName);

        // Upload the file's stream directly to Azure
        await blobClient.UploadAsync(file.OpenReadStream(), true);
        _logger.LogInformation("Upload complete.");
        // ------------------------------------------

        _logger.LogInformation("Forwarding file '{FileName}' to Python analysis service.", file.FileName);

        using var content = new MultipartFormDataContent();
        // We need to reset the stream's position to the beginning before re-reading it
        file.OpenReadStream().Position = 0; 
        content.Add(new StreamContent(file.OpenReadStream()), "file", file.FileName);

        var pythonServiceUrl = "http://localhost:5001/analyze";
        var response = await _httpClient.PostAsync(pythonServiceUrl, content);

        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();

        var pythonResponse = JsonSerializer.Deserialize<PythonAnalysisResponse>(jsonResponse, 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (pythonResponse == null)
        {
            throw new InvalidOperationException("Failed to deserialize the analysis response.");
        }

        var finalResponse = new DocumentAnalysisResponse
        {
            DocumentId = Guid.NewGuid(), // We'll link this to a DB record later
            BlobUrl = blobClient.Uri.ToString(), // Let's store the URL of the uploaded blob
            FileName = file.FileName,
            Summary = pythonResponse.Summary,
            Entities = pythonResponse.Entities,
            Status = "Completed"
        };

        _logger.LogInformation("Analysis successful for file '{FileName}'.", file.FileName);

        return finalResponse;
    }

    private class PythonAnalysisResponse
    {
        public string? Summary { get; set; }
        public Dictionary<string, string>? Entities { get; set; }
    }
}
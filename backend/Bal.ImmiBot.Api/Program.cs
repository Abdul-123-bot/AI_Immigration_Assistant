using Bal.ImmiBot.Api.Interfaces;
using Bal.ImmiBot.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Services.AddScoped<IDocumentService, DocumentService>();

var app = builder.Build();

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

using System;
using System.Collections.Generic;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Services.Dto;

public class CreateServicePresentationsDto
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    public IEnumerable<IFormFile> Attachments { get; set; }
}
using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Videos.Dto;

[AutoMapTo(typeof(VideoAttachment))]
public class CreateVideoAttachmentsDto
{
    public Guid VideoId { get; set; }
    public IEnumerable<IFormFile> Attachments { get; set; }
}
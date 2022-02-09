using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.Contents.Dto
{
    [AutoMap(typeof(Content))]
    public class ContentDto
    {
        public string PageContent { get; set; }
        public string ReferenceId { get; set; }
    }
}

using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.ContentMargins.Dto
{
    [AutoMap(typeof(ContentMargin))]
    public class ContentMarginDto : EntityDto<Guid?>
    {
        public string Name { get; set; }
        public int Top { get; set; }
        public int Bottom { get; set; }
        public int Width { get; set; }
    }
}

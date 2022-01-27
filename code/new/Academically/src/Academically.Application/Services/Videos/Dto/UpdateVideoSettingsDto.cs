using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Videos.Dto
{
    [AutoMapTo(typeof(Video))]
    public class UpdateVideoSettingsDto : EntityDto<Guid>
    {
        public DelayType? DelayType { get; set; }
        public string DelayValue { get; set; }
        public CommentSetting CommentSetting { get; set; }
        public bool CommentModeration { get; set; }
        public string CustomUrl { get; set; }
        public bool IsVisible { get; set; }
    }
}


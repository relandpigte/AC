using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Articles.Dto
{
    public class UpdateArticleSettingsDto
	{
        public Guid Id { get; set; }

        public bool IsVisible { get; set; }

        public CommentSetting CommentSetting { get; set; }

        public bool CommentModeration { get; set; }

        public string CustomUrl { get; set; }
    }
}


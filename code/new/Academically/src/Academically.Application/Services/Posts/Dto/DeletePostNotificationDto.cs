using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Academically.Services.Documents.Dto;

namespace Academically.Services.Posts.Dto
{
    public class DeletePostNotificationDto
    {
        public Guid PostId { get; set; }
        public long CreatorUserId { get; set; }
    }
}

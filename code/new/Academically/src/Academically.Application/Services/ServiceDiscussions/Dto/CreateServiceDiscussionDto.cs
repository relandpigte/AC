using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.ServiceDiscussions.Dto
{
    [AutoMap(typeof(ServiceDiscussion))]
    public class CreateServiceDiscussionDto
    {
        public Guid ServiceId { get; set; }
        public int ServiceType { get; set; }
        public Guid PostId { get; set; }
    }
}
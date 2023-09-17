using System;
using Abp.Domain.Entities;
using Academically.Domain.Entities;
using AutoMapper;

namespace Academically.Services.ServiceDiscussions.Dto
{
    [AutoMap(typeof(ServiceDiscussion))]
    public class ServiceDiscussionDto: Entity<long>
    {
        public Guid ServiceId { get; set; }
        public int ServiceType { get; set; }
        public Guid PostId { get; set; } 
    }
}
using System;
using System.ComponentModel.DataAnnotations;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;

namespace Academically.Users.Dto;

[AutoMapFrom(typeof(UserBlocking))]
public class UserBlockingDto: CreationAuditedEntity<Guid>
{
    public long BlockedUserId { get; set; }
    public UserDto CreatorUser { get; set; }
    public UserDto BlockedUser { get; set; }
}
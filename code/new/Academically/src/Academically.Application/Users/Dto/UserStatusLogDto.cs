using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Users.Dto;

[AutoMapFrom(typeof(UserStatusLog))]
public class UserStatusLogDto : CreationAuditedEntity<long>
{
    public UserStatus Status { get; set; }
    public UserDto CreatorUser { get; set; }
}
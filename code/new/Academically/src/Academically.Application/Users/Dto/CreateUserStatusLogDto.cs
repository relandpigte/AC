using Academically.Domain.Enums;

namespace Academically.Users.Dto;

public class CreateUserStatusLogDto
{
    public long UserId { get; set; }
    public UserStatus Status { get; set; }
}
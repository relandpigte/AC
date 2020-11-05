using Abp.AutoMapper;
using Academically.Authorization.Users;
using Academically.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(UserProfile))]
    public class SearchTutorDto
    {
        public string ProfilePictureFileName { get; set; }
        public User User { get; set; }
    }
}

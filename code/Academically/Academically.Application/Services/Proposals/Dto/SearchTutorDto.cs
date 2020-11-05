using Abp.AutoMapper;
using Academically.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(UserProfile))]
    public class SearchTutorDto
    {
        public UserDto User { get; set; }
    }
}

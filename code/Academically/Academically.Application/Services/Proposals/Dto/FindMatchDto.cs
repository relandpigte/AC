using Abp.AutoMapper;
using Academically.DomainServices.Tutorials;
using Academically.Services.UserProfiles.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(SearchTutorDomainDto))]
    public class FindMatchDto
    {
        public UserDto User { get; set; }
        public double Score { get; set; }
    }
}

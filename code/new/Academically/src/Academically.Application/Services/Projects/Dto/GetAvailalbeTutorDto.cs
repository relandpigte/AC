using Academically.Services.UserServices.Dto;
using Academically.Users.Dto;
using System.Collections.Generic;

namespace Academically.Services.Projects.Dto
{
    public class GetAvailalbeTutorDto
    {
        public UserDto Tutor { get; set; }
        public IEnumerable<UserServiceForListDto> Services { get; set; }
    }
}

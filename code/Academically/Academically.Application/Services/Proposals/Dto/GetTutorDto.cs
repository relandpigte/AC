using Abp.AutoMapper;
using Academically.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(UserProfile))]
    public class GetTutorDto
    {
        public string ProfilePictureFileName { get; set; }
        public UserDto User { get; set; }
    }
}

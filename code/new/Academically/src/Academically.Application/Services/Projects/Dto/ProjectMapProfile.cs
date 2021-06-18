using System;
using System.Linq;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using AutoMapper;

namespace Academically.Services.Projects.Dto
{
    public class ProjectMapProfile : Profile
    {
        public ProjectMapProfile()
        {
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.CurrentUniversity,
                    opt => opt.MapFrom(t => t.UserEducations.OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                    .Select(e => e.University.HeProvider)
                    .FirstOrDefault()));

        }
    }
}

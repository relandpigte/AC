using System;
using System.Linq;
using Academically.Domain.Entities;
using AutoMapper;

namespace Academically.Services.UserServices.Dto
{
    public class UserServiceMapProfile : Profile
    {
        public UserServiceMapProfile()
        {
            CreateMap<UserService, UserServiceForListDto>()
                .ForMember(dest => dest.DisciplineTaxonomies,
                    opt => opt.MapFrom(t => t.UserServiceDisciplineTaxonomies.OrderBy(e => e.DisciplineTaxonomy.Name)
                        .Select(e => e.DisciplineTaxonomy.Name)))
                .ForMember(dest => dest.Subjects,
                    opt => opt.MapFrom(t => t.UserServiceSubjects.OrderBy(e => e.Subject.Name)
                        .Select(e => e.Subject.Name)));
        }
    }
}

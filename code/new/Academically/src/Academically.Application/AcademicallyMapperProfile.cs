using Academically.Domain.Entities;
using Academically.Services.UserEducations.Dto;
using Academically.Services.UserServices.Dto;
using AutoMapper;
using System.Linq;

namespace Academically
{
    public class AcademicallyMapperProfile : Profile
    {
        public AcademicallyMapperProfile()
        {
            CreateMap<UserEducation, UserEducationDto>()
                .ForMember(dest => dest.UniversityName, opt =>
                {
                    opt.PreCondition(src => src.University != null);
                    opt.MapFrom(src => src.University.HeProvider);
                })
                .ForMember(dest => dest.UniversityCountryCode, opt =>
                {
                    opt.PreCondition(src => src.University != null);
                    opt.MapFrom(src => src.University.CountryCode);
                });
            CreateMap<UserService, UserServiceDto>()
                .ForMember(dest => dest.Subjects, opt =>
                {
                    opt.PreCondition(src => src.UserServiceSubjects != null);
                    opt.MapFrom(src => src.UserServiceSubjects.Select(e => e.Subject));
                })
                .ForMember(dest => dest.DisciplineTaxonomies, opt =>
                {
                    opt.PreCondition(src => src.UserServiceDisciplineTaxonomies != null);
                    opt.MapFrom(src => src.UserServiceDisciplineTaxonomies.Select(e => e.DisciplineTaxonomy));
                });
        }
    }
}

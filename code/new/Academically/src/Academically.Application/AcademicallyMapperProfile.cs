using Academically.Domain.Entities;
using Academically.Services.UserEducations.Dto;
using AutoMapper;

namespace Academically
{
    public class AcademicallyMapperProfile : Profile
    {
        public AcademicallyMapperProfile()
        {
            CreateMap<UserEducationLevel, UserEducationLevelDto>()
                .ForMember(dest => dest.EducationLevelName, opt =>
                {
                    opt.PreCondition(src => src.EducationLevel != null);
                    opt.MapFrom(src => src.EducationLevel.ShortName);
                });
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
        }
    }
}

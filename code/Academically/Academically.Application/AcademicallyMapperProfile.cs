using Academically.Entities;
using Academically.Services.DisciplineTaxonomies.Dto;
using Academically.Services.UserProfiles.Dto;
using Academically.Services.UserTutorials.Dto;
using AutoMapper;

namespace Academically
{
    public class AcademicallyMapperProfile : Profile
    {
        public AcademicallyMapperProfile()
        {
            CreateMap<UserProfile, GetProfileDetailDto>();
            CreateMap<SaveProfileDetailDto, UserProfile>()
                .ForMember(dest => dest.ProfilePictureFileName, opt => opt.Ignore())
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth.Value.Date));
            CreateMap<DisciplineTaxonomy, GetAllDisciplineTaxonomyDto>();
            CreateMap<SaveUserTutorialDto, UserTutorial>();
        }
    }
}

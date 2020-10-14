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
            CreateMap<DisciplineTaxonomy, GetAllDisciplineTaxonomyDto>()
                .ForMember(dest => dest.Size, opt => {
                    opt.PreCondition(src => src.Children == null || src.Children.Count == 0);
                    opt.MapFrom(src => 1);
                });
            CreateMap<SaveUserTutorialDto, UserTutorial>();
        }
    }
}

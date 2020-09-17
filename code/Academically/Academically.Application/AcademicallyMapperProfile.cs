using Academically.Entities;
using Academically.Services.UserProfiles.Dto;
using Academically.Services.UserPublications.Dto;
using AutoMapper;

namespace Academically
{
    public class AcademicallyMapperProfile : Profile
    {
        public AcademicallyMapperProfile()
        {
            CreateMap<UserProfile, GetProfileDetailDto>();
            CreateMap<SaveProfileDetailDto, UserProfile>()
                .ForMember(dest => dest.ProfilePictureFileName, opt => opt.Ignore());
            CreateMap<UserPublication, GetPublicationDto>();
            CreateMap<SavePublicationDto, UserPublication>();
        }
    }
}

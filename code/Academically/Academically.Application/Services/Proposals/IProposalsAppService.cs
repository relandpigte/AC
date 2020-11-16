using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Entities.Enums;
using Academically.Services.Proposals.Dto;
using Academically.Services.UserProfiles.Dto;

namespace Academically.Services.Proposals
{
    public interface IProposalsAppService : IApplicationService
    {
        Task<IEnumerable<SearchTutorDto>> SearchTutors(int distance, int? level);
        Task<GetStudentProposalDto> GetStudentProposal(Guid tutorialId);
        Task<string> GetTutorDisciplineTaxonomies();
        Task<UserSupportServiceDto> GetTutorSupportService();
    }
}

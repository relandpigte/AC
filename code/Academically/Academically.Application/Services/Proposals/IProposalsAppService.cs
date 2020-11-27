using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Proposals.Dto;

namespace Academically.Services.Proposals
{
    public interface IProposalsAppService : IApplicationService
    {
        Task<IEnumerable<SearchTutorDto>> SearchTutors(int distance, int? level);
        Task<GetStudentProposalDto> GetStudentProposal(Guid tutorialId);
        Task<string> GetTutorDisciplineTaxonomies();
        Task<UserSupportServiceDto> GetTutorSupportService(long? tutorId);

        //TODO: this endpoint will replace the SearchTutors
        Task<IEnumerable<FindMatchDto>> FindMatch(Guid userTutorialId);
    }
}

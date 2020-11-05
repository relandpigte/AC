using System.Collections.Generic;
using System.Threading.Tasks;
using Academically.Entities.Enums;
using Academically.Services.Proposals.Dto;

namespace Academically.Services.Proposals
{
    public interface IProposalsAppService
    {
        Task<IEnumerable<SearchTutorDto>> SearchTutors(int distance, int? level);
    }
}

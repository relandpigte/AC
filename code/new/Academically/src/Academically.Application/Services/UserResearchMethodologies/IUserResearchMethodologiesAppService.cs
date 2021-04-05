using Academically.Services.UserResearchMethodologies.Dto;
using System.Threading.Tasks;

namespace Academically.Services.UserResearchMethodologies
{
    public interface IUserResearchMethodologiesAppService
    {
        Task Create(UserResearchMethodologyDto input);
    }
}

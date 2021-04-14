using Abp.Application.Services;
using System.Threading.Tasks;

namespace Academically.Services.TestDataGenerator
{
    public interface ITestDataGeneratorAppService : IApplicationService
    {
        Task GenerateTestRatingsForStudent(long studentId, int numberOfRatings);
        Task GenerateTestRatingsForTutor(long tutorId, int numberOfRatings);
        Task GenerateTestUsers();
    }
}

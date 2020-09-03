using Abp.Domain.Services;

namespace Academically
{
    public class AcademicallyDomainServiceBase : DomainService
    {
        public AcademicallyDomainServiceBase()
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
        }
    }
}

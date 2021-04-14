using Abp.Domain.Services;

namespace Academically.Domain
{
    public class AcademicallyDomainServiceBase : DomainService
    {
        public AcademicallyDomainServiceBase()
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
        }
    }
}

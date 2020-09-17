using Abp.Application.Services;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Entities;
using Academically.Services.UserPublications.Dto;
using Academically.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Academically.Services.UserPublications
{
    public class UserPublicationsAppService  : AsyncCrudAppService<UserPublication, GetPublicationDto, Guid, PagedPublicationResultRequestDto, SavePublicationDto, GetPublicationDto>, IUserPublicationsAppService
    {
        public UserPublicationsAppService(IRepository<UserPublication, Guid> repository) : base(repository)
        {

        }

        protected override IQueryable<UserPublication> CreateFilteredQuery(PagedPublicationResultRequestDto input)
        {
           return Repository.GetAll()
                    .Where(x => x.UserId == input.UserId)
                    .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x =>
                    x.PublicationCertificate.Contains(input.Keyword)
                    || x.Publisher.Contains(input.Keyword)
                    || x.Summary.Contains(input.Keyword));
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Academically.Authorization.Roles;
using Academically.Entities;
using Academically.Services.Proposals.Dto;
using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Proposals
{
    public class ProposalsAppService : AcademicallyAppServiceBase, IProposalsAppService
    {
        private const double METER_TO_MILE_CONVERSION = 0.00062137;

        private readonly IRepository<UserProfile, Guid> _userProfilesAppService;
        private readonly RoleManager _roleManager;

        public ProposalsAppService(
            IRepository<UserProfile, Guid> userProfilesAppService,
            RoleManager roleManager
            )
        {
            _userProfilesAppService = userProfilesAppService;
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<SearchTutorDto>> SearchTutors(int distance)
        {
            var tutorRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.Tutor);
            var currentUserProfile = await _userProfilesAppService.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            var userLocationCoordinate = new GeoCoordinate(currentUserProfile.Latitude ?? 0, currentUserProfile.Longitude ?? 0);

            // TODO: this query is not optimized. new version of EF for .NET Core does not support GenoCoordinate.GetDistanceTo method
            // and is not able to convert it to a linq to SQL query. will need to change this code in the future to either:
            // 1.) use stored procedure and laverage Geography methods from SQL
            // 2.) find a propery way to do this using LINQ
            var userProfiles = (await _userProfilesAppService.GetAll()
                .Include(e => e.User)
                .Where(e => e.User.Roles.Any(e => e.RoleId == tutorRole.Id))
                .ToListAsync())
                .Select(e => new
                {
                    up = e,
                    gc = (new GeoCoordinate(e.Latitude ?? 0, e.Longitude ?? 0).GetDistanceTo(userLocationCoordinate)) * METER_TO_MILE_CONVERSION
                })
                .WhereIf(distance >= 0, e => e.gc <= distance)
                .OrderBy(e => e.gc)
                .Select(e => ObjectMapper.Map<SearchTutorDto>(e.up));

            return userProfiles;
        }


    }
}

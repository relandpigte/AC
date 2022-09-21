using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Abp.Application.Services;
using Abp.IdentityFramework;
using Abp.Runtime.Session;
using Academically.Authorization.Users;
using Academically.MultiTenancy;
using System.Collections.Generic;
using Academically.Domain.Interfaces;
using System.Linq;
using Academically.Services.Videos.Dto;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Extensions;
using Abp.Domain.Entities.Auditing;

namespace Academically
{
    /// <summary>
    /// Derive your application services from this class.
    /// </summary>
    public abstract class AcademicallyAppServiceBase : ApplicationService
    {
        public TenantManager TenantManager { get; set; }

        public UserManager UserManager { get; set; }

        protected AcademicallyAppServiceBase()
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
        }

        protected virtual async Task<User> GetCurrentUserAsync()
        {
            var user = await UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }

            return user;
        }

        protected virtual Task<Tenant> GetCurrentTenantAsync()
        {
            return TenantManager.GetByIdAsync(AbpSession.GetTenantId());
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        protected virtual Dictionary<string, List<DtoType>> GroupByTopic<DtoType>(List<DtoType> list) where DtoType : IHasTopic
        {
            var topics = list.Select(x => x.Categories).ToList();
            var allTopicsInString = String.Join(",", topics.ToArray());
            var distinctTopics = allTopicsInString.Split(",").Where(x => !String.IsNullOrEmpty(x)).OrderBy(x => x).Distinct();

            var result = new Dictionary<string, List<DtoType>>();
            foreach (var topic in distinctTopics)
            {
                var dtoList = list.Where(x => x.Categories != null && x.Categories.Contains(topic)).Take(6).ToList();
                result.Add(topic, dtoList);
            }
            return result;
        }

        protected virtual Dictionary<string, List<DtoType>> GroupByDateRange<DtoType>(List<DtoType> list, DateGrains grain, int itemsPerGroup = 6) where DtoType : IHasCreationTime
        {
            const int maxItems = 10;
            itemsPerGroup = itemsPerGroup > maxItems ? maxItems : itemsPerGroup;

            var dateRanges = new List<string>();

            var result = new Dictionary<string, List<DtoType>>();
            switch (grain)
            {
                case DateGrains.Daily:
                    dateRanges = list.GroupBy(x => new { DateRange = CreateDailyRangeString(x.CreationTime) }).Select(x => x.Key.DateRange).ToList();
                    foreach (var range in dateRanges)
                    {
                        var dtoList = list.Where(x => range.Equals(CreateDailyRangeString(x.CreationTime))).Take(itemsPerGroup).ToList();
                        result.Add(range, dtoList);
                    }
                    break;

                case DateGrains.Weekly:
                    dateRanges = list.GroupBy(x => new { DateRange = CreateWeekRangeString(x.CreationTime) }).Select(x => x.Key.DateRange).ToList();
                    foreach (var range in dateRanges)
                    {
                        var dtoList = list.Where(x => range.Equals(CreateWeekRangeString(x.CreationTime))).Take(itemsPerGroup).ToList();
                        result.Add(range, dtoList);
                    }
                    break;

                case DateGrains.Monthly:
                    dateRanges = list.GroupBy(x => new { DateRange = CreateMonthRangeString(x.CreationTime) }).Select(x => x.Key.DateRange).ToList();
                    foreach (var range in dateRanges)
                    {
                        var dtoList = list.Where(x => range.Equals(CreateMonthRangeString(x.CreationTime))).Take(itemsPerGroup).ToList();
                        result.Add(range, dtoList);
                    }
                    break;

                default:
                    break;
            }

            return result;
        }

        private string CreateDailyRangeString(DateTime date)
        {
            var start = date.SetTime(0, 0, 0, 0);
            var end = date.SetTime(23, 59, 59, 999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }

        private string CreateWeekRangeString(DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            var start = date.AddDays(-(int)dayOfWeek).SetTime(0,0,0,0);
            var end = date.AddDays((int)DayOfWeek.Saturday - (int)dayOfWeek).SetTime(23,59,59,999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }

        private string CreateMonthRangeString(DateTime date)
        {
            var start = new DateTime(date.Year, date.Month, 1, 0,0,0);
            var end = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59, 999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }


    }
}

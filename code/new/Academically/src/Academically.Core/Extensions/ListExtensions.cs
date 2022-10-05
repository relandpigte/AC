using Abp.Application.Services.Dto;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Enums;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Academically.Extensions
{
    public static class ListExtensions
    {
        
        public static Dictionary<string, List<DtoType>> GroupByTopicExt<DtoType>(this List<DtoType> list) where DtoType : IHasTopic
        {
            const int defaultItems = 6;
            int itemPerGroup = defaultItems;
            var topics = list.Select(x => x.Categories).ToList();
            var allTopicsInString = String.Join(",", topics.ToArray());
            var distinctTopics = allTopicsInString.Split(",").Where(x => !String.IsNullOrEmpty(x)).OrderBy(x => x).Distinct();

            var result = new Dictionary<string, List<DtoType>>();
            foreach (var topic in distinctTopics)
            {
                var dtoList = list.Where(x => x.Categories != null && x.Categories.Contains(topic)).Take(itemPerGroup).ToList();
                result.Add(topic, dtoList);
            }
            return result;
        }

        public static Dictionary<string, PagedResultDto<DtoType>> GroupByTopicsPagedExt<DtoType>(this List<DtoType> list) where DtoType : IHasTopic
        {
            var topics = list.Select(x => x.Categories).ToList();
            var allTopicsInString = String.Join(",", topics.ToArray());
            var distinctTopics = allTopicsInString.Split(",").Where(x => !String.IsNullOrEmpty(x)).OrderBy(x => x).Distinct();

            var result = new Dictionary<string, PagedResultDto<DtoType>>();
            foreach (var topic in distinctTopics)
            {
                var dtoList = list.Where(x => x.Categories != null && x.Categories.Contains(topic)).Take(6).ToList();
                result.Add(topic, new PagedResultDto<DtoType>(dtoList.Count, dtoList));
            }
            return result;
        }

        public static Dictionary<string, List<DtoType>> GroupByDateRangeExt<DtoType>(this List<DtoType> list, DateGrains grain, int itemsPerGroup = 6) where DtoType : IHasCreationTime
        {
            const int maxItems = 10;
            itemsPerGroup = itemsPerGroup > maxItems ? maxItems : itemsPerGroup;
            // Get the earliest creation time
            DateTime earliestCreationTime = list.Min(x => x.CreationTime);
            DateTime olderThanThisMonth = list.Max(x => x.CreationTime);

            return list.GroupBy(x => new { DateRange = ToDateRangeString(x.CreationTime, grain, earliestCreationTime, olderThanThisMonth) })
                                .Select(x => new
                                {
                                    Range = x.Key.DateRange,
                                    Items = list.Where(l => x.Key.DateRange.Equals(ToDateRangeString(l.CreationTime, grain, earliestCreationTime, olderThanThisMonth))).Take(itemsPerGroup).ToList()
                                })
                                .ToDictionary(key => key.Range, value => value.Items);
        }

        public static Dictionary<string, PagedResultDto<DtoType>> GroupByDateRangePagedExt<DtoType>(this List<DtoType> list, DateGrains grain, int itemsPerGroup) where DtoType : IHasCreationTime
        {
            if (list.Count == 0)
                return null;
            const int maxItems = 10;
            itemsPerGroup = itemsPerGroup > maxItems ? maxItems : itemsPerGroup;
            // Get the earliest creation time
            DateTime today = DateTime.Now;
            DateTime earliestCreationTime = list.Min(x => x.CreationTime);
            DateTime olderThanThisMonth = new DateTime(today.Year, today.Month-1, DateTime.DaysInMonth(today.Year, today.Month-1), 23, 59, 59, 999);

            return list.GroupBy(x => new { DateRange = ToDateRangeString(x.CreationTime, grain, earliestCreationTime, olderThanThisMonth) })
                                .Select(x => new
                                {
                                    Range = x.Key.DateRange,
                                    Items = list.Where(l => x.Key.DateRange.Equals(ToDateRangeString(l.CreationTime, grain, earliestCreationTime, olderThanThisMonth))).Take(itemsPerGroup).ToList(),
                                    MaxItems = list.Where(l => x.Key.DateRange.Equals(ToDateRangeString(l.CreationTime, grain, earliestCreationTime, olderThanThisMonth))).Count()
                                })
                                .ToDictionary(key => key.Range, value => new PagedResultDto<DtoType>(value.MaxItems, value.Items));
        }

        public static Dictionary<string, PagedResultDto<DtoType>> GroupByPopularityPagedExt<DtoType>(this List<DtoType> list, int itemsPerGroup) where DtoType : IHasPopularityWeight
        {
            return list.GroupBy(x => new { Label = "Popular" })
                                .Select(x => new
                                {
                                    Range = x.Key.Label,
                                    Items = list
                                })
                                .ToDictionary(key => key.Range, value => new PagedResultDto<DtoType>(value.Items.Count, value.Items));
        }

        private static string ToDateRangeString(DateTime date, DateGrains grain, DateTime earliestDate, DateTime olderThanThisMonth)
        {
            switch (grain)
            {
                case DateGrains.Daily:
                    return CreateDailyRangeString(date);
                case DateGrains.Weekly:
                    return CreateWeekRangeString(date);
                case DateGrains.Monthly:
                    return CreateMonthRangeString(date);
                case DateGrains.Aged30:
                    return CreateAged30RangeString(date, earliestDate, olderThanThisMonth);
                default:
                    return String.Empty;
            }
        }

        private static string CreateDailyRangeString(DateTime date)
        {
            var start = date.SetTime(0, 0, 0, 0);
            var end = date.SetTime(23, 59, 59, 999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }

        private static string CreateWeekRangeString(DateTime date)
        {
            var dayOfWeek = date.DayOfWeek;
            var start = date.AddDays(-(int)dayOfWeek).SetTime(0, 0, 0, 0);
            var end = date.AddDays((int)DayOfWeek.Saturday - (int)dayOfWeek).SetTime(23, 59, 59, 999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }

        private static string CreateMonthRangeString(DateTime date)
        {
            var start = new DateTime(date.Year, date.Month, 1, 0, 0, 0);
            var end = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59, 999);
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }
        
        private static string CreateAged30RangeString(DateTime date, DateTime earliestCreationTime, DateTime olderThanThisMonth)
        {
            DateTime start;
            DateTime end;
            if (date.Month == DateTime.Now.Month)
            {
                start = new DateTime(date.Year, date.Month, 1, 0, 0, 0);
                end = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59, 999);
            }
            else
            {
                start = earliestCreationTime;
                end = new DateTime(olderThanThisMonth.Year, olderThanThisMonth.Month, DateTime.DaysInMonth(olderThanThisMonth.Year, olderThanThisMonth.Month), 23, 59, 59, 999);
            }

            
            return $"{start.ToString("MM/dd/yyyy HH:mm:ss")} - {end.ToString("MM/dd/yyyy HH:mm:ss")}";
        }
    }
}

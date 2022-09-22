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

        public static Dictionary<string, List<DtoType>> GroupByDateRangeExt<DtoType>(this List<DtoType> list, DateGrains grain, int itemsPerGroup = 6) where DtoType : IHasCreationTime
        {
            const int maxItems = 10;
            itemsPerGroup = itemsPerGroup > maxItems ? maxItems : itemsPerGroup;

            return list.GroupBy(x => new { DateRange = ToDateRangeString(x.CreationTime, grain) })
                                .Select(x => new
                                {
                                    Range = x.Key.DateRange,
                                    Items = list.Where(l => x.Key.DateRange.Equals(ToDateRangeString(l.CreationTime, grain))).Take(itemsPerGroup).ToList()
                                })
                                .ToDictionary(key => key.Range, value => value.Items);

        }

        private static string ToDateRangeString(DateTime date, DateGrains grain)
        {
            switch (grain)
            {
                case DateGrains.Daily:
                    return CreateDailyRangeString(date);
                case DateGrains.Weekly:
                    return CreateWeekRangeString(date);
                case DateGrains.Monthly:
                    return CreateMonthRangeString(date);
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
    }
}

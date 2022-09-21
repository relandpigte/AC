using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Academically.Extensions
{
    public static class ListExtensions
    {
        public static Dictionary<string, List<T>> GroupByTopic<T>(this List<T> list)  where T : IHasTopic
        {
            // Get all topics
            var topics = list.Select(x => x.Categories).ToList();
            var allTopicsInString = String.Join(",", topics.ToArray());
            var distinctTopics = allTopicsInString.Split(",").OrderBy(x => x);

            var result = new Dictionary<string, List<T>>();
            foreach (var topic in distinctTopics)
            {
                result.Add(topic, list.Where(x => x.Categories.Contains(topic)).ToList());
            }
            return result;
        }
    }
}

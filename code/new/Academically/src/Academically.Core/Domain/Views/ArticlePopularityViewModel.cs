using Academically.Domain.Entities;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Views
{
    public class ArticlePopularityViewModel : Article, IHasPopularityWeight
    {
        public ArticlePopularityViewModel()  {  }
        
        public ArticlePopularityViewModel(Article article, int popularityPoints)
        {
             Id = article.Id;
             Type = article.Type;
             Name = article.Name;
             Description = article.Description;
             Status = article.Status;
             ParentId = article.ParentId;
             ThumbnailDocumentId = article.ThumbnailDocumentId;
             LanguageId = article.LanguageId;
             IsVisible = article.IsVisible;
             CommentSetting = article.CommentSetting;
             CommentModeration = article.CommentModeration;
             CustomUrl = article.CustomUrl;
             Categories = article.Categories;
             DelayType = article.DelayType;
             DelayValue = article.DelayValue;
             Price = article.Price;
             PricingType = article.PricingType;
             Language = article.Language;
             CreatorUser = article.CreatorUser;
             Parent = article.Parent;
             ThumbnailDocument = article.ThumbnailDocument;
             Children = article.Children;
             PopularityWeight = popularityPoints;
             CreationTime = article.CreationTime;
             CreatorUserId = article.CreatorUserId;
        }

        public int PopularityWeight { get; set; }
    }
}

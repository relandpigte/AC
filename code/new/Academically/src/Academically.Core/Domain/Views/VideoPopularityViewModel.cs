using Academically.Domain.Entities;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Academically.Domain.Views
{
    public class VideoPopularityViewModel : Video, IHasPopularityWeight
    {
        public VideoPopularityViewModel()
        {
            
        }

        public VideoPopularityViewModel(Video video, int popularityPoints)
        {
            Id = video.Id;
            Type = video.Type;
            Name = video.Name;
            Description = video.Description;
            Status = video.Status;
            ParentId = video.ParentId;
            DocumentId = video.DocumentId;
            ThumbnailDocumentId = video.ThumbnailDocumentId;
            Language = video.Language;
            IsVisible = video.IsVisible;
            CommentSetting = video.CommentSetting;
            CommentModeration = video.CommentModeration;
            CustomUrl = video.CustomUrl;
            Categories = video.Categories;
            Price = video.Price;
            PricingType = video.PricingType;
            DelayType = video.DelayType;
            DelayValue = video.DelayValue;
            Language = video.Language;
            CreatorUser = video.CreatorUser;
            Parent = video.Parent;
            Document = video.Document;
            ThumbnailDocument = video.ThumbnailDocument;
            Children = video.Children;

            PopularityWeight = popularityPoints;
        }

        public int PopularityWeight { get; set; }
    }
}

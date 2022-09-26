using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Interfaces
{
    public interface IHasThumbnail
    {
        string ThumbnailImageUrl { get; set; }
    }
}

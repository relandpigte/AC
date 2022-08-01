using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.EventOffers.Dto
{
    public class MyServiceViewDto
    {
        public string ServiceType { get; set; }
        public List<MyServiceItemViewDto> Items { get; set; }
    }

    public class MyServiceItemViewDto
    {
        public Guid Id { get; set; }
        public string ServiceType { get; set; }
        public string Title { get; set; }
    }

}

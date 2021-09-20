using Academically.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Academically.EntityFrameworkCore.Seed.Tenants.DataSeeder
{
    public class CurrenciesBuilder
    {
        public CurrenciesBuilder(AcademicallyDbContext context)
        {
            var currenciesCount = context.Currencies.Count();
            if (currenciesCount == 0)
            {
                var currencies = new List<Currency>()
                {
                    new Currency()
                    {
                        Id = new Guid("46461e5d-64f4-4e3c-b416-9cc1f867c433"),
                        Name = "Pound Sterling",
                        Code = "GBP",
                        IsEnabled = true,
                    },
                    new Currency()
                    {
                        Id = new Guid("33d3be7c-b49a-4ccd-9805-0821d7689572"),
                        Name = "United States Dollar",
                        Code = "USD",
                        IsEnabled = true,
                    },
                    new Currency()
                    {
                        Id = new Guid("c3643ae8-5a61-4bb3-879a-23d18363aebe"),
                        Name = "Chinese Yuan",
                        Code = "CNY",
                        IsEnabled = true,
                    },
                    new Currency()
                    {
                        Id = new Guid("cfa7c1ad-38f8-4872-8a7e-322949537f91"),
                        Name = "Indian Rupee",
                        Code = "INR",
                        IsEnabled = true,
                    },
                    new Currency()
                    {
                        Id = new Guid("711660f1-6f93-4412-b680-3c5627bee5fb"),
                        Name = "Australian Dollar",
                        Code = "AUD",
                        IsEnabled = true,
                    },
                };
                foreach (var currency in currencies)
                {
                    context.Currencies.Add(currency);
                }
                context.SaveChanges();
            }
        }
    }
}

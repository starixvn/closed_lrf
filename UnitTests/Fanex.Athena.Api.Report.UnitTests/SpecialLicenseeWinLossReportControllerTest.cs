namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using DataAccess.Report.Interfaces;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Configuration.Interfaces;
    using Session.Model;

    public class SpecialLicenseeWinLossReportControllerTest : BaseApiControllerHelperTest
    {
        private IReportSettingService _reportSettingService;

        private ISpecialLicenseeWinLossDataAccess _dataAccess;

        private SpecialLicenseeWinLossReportController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _dataAccess = Substitute.For<ISpecialLicenseeWinLossDataAccess>();
            _reportSettingService = Substitute.For<IReportSettingService>();

            _controller = Substitute.ForPartsOf<SpecialLicenseeWinLossReportController>(
                SessionService,
                ProductService,
                _reportSettingService,
                LangService,
                _dataAccess);

            MockSessionData();

            _reportSettingService.GetSetting(PermissionKeys.ReportLicenseeWinLoss)
               .Returns(new ReportSetting { MinDate = new DateTime(2018, 1, 1), MaxDate = new DateTime(2018, 1, 31), BaseCurrencies = "USD,MYR" });
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _controller = null;
            _dataAccess = null;
        }

        [Test]
        public async Task Index_InvalidDateRange_ReturnEmptyData()
        {
            // Arrange
            var model = new SpecialLicenseeWinLossMetaModel
            {
                FromDate = new DateTime(2018, 1, 30),
                ToDate = new DateTime(2018, 3, 1)
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
            });
        }

        [Test]
        public async Task Index_EmptyProductCode_ReturnEmptyData()
        {
            // Arrange
            var model = new SpecialLicenseeWinLossMetaModel
            {
                ProductCodeList = null,
                FromDate = new DateTime(2018, 1, 1),
                ToDate = new DateTime(2018, 1, 31)
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
            });
        }

        [Test]
        public async Task Index_InvalidProductCode_ReturnEmptyData()
        {
            // Arrange
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<string>(), true)
                .Returns(new ProductAccess(
                    new List<Product>
                        {
                            new Product { ProductCode = "P1" },
                            new Product { ProductCode = "P2" },
                            new Product { ProductCode = "P3" }
                        }));

            var model = new SpecialLicenseeWinLossMetaModel
            {
                ProductCodeList = new[] { "P1", "P2", "Invalid" },
                FromDate = new DateTime(2018, 1, 1),
                ToDate = new DateTime(2018, 1, 31)
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
            });
        }

        [Test]
        public async Task Index_InvalidCurrency_ReturnEmptyData()
        {
            // Arrange
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<string>(), true)
                .Returns(new ProductAccess(
                    new List<Product>
                        {
                            new Product { ProductCode = "P1" },
                            new Product { ProductCode = "P2" },
                            new Product { ProductCode = "P3" }
                        }));

            StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string> { { 1, "1" } } });

            var model = new SpecialLicenseeWinLossMetaModel
            {
                ProductCodeList = new[] { "P1", "P2" },
                CurrencyId = 2,
                FromDate = new DateTime(2018, 1, 1),
                ToDate = new DateTime(2018, 1, 31)
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
            });
        }

        [TestCase(LicenseeIdentity.IvoryBet, "ivorysport")]
        [TestCase(LicenseeIdentity.Opal88, "opal88")]
        public async Task Index_ValidRequest_CallServiceWithCorrectParameters(int licenseeId, string expectedSiteName)
        {
            // Arrange
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<string>(), true)
                .Returns(new ProductAccess(
                    new List<Product>
                        {
                            new Product { ProductCode = "P1" }
                        }));

            SessionService.LicenseeSession.Returns(new LicenseeSession { LicenseeId = licenseeId });
            StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string> { { 1, "C1" }, { 2, "C2" } } });

            var model = new SpecialLicenseeWinLossMetaModel
            {
                ProductCodeList = new[] { "P1" },
                CurrencyId = 0,
                FromDate = new DateTime(2018, 1, 1),
                ToDate = new DateTime(2018, 1, 31)
            };

            _dataAccess.GetData(model, Arg.Any<IDictionary<int, string>>())
                .Returns(new ReportResultModel<LicenseeWinLoss> { DataList = Enumerable.Empty<LicenseeWinLoss>() });

            var expectedCurrencyXML = $"<ROOT><CR Id=\"1\" Code=\"C1\" /><CR Id=\"2\" Code=\"C2\" /></ROOT>";

            // Action
            await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                _dataAccess.Received().GetData(model, Arg.Any<IDictionary<int, string>>());
                Assert.That(string.Join(",", model.BaseCurrencies), Is.EqualTo("USD"));
                Assert.That(model.SiteName, Is.EqualTo(expectedSiteName));
                Assert.That(model.CurrencyListXml, Is.EqualTo(expectedCurrencyXML));
            });
        }

        [Test]
        public async Task Index_ValidRequest_ReturnCorrectData()
        {
            // Arrange
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<string>(), true)
                .Returns(new ProductAccess(
                    new List<Product>
                        {
                            new Product { ProductCode = "P1" }
                        }));

            StubUserSessionData(new UserSession { CurrencyList = new Dictionary<int, string> { { 1, "C1" }, { 2, "C2" } } });

            var model = new SpecialLicenseeWinLossMetaModel
            {
                ProductCodeList = new[] { "P1" },
                CurrencyId = 0,
                FromDate = new DateTime(2018, 1, 1),
                ToDate = new DateTime(2018, 1, 31)
            };

            var data = CreateResultModel();
            _dataAccess.GetData(model, UserCurrencyList).Returns(data);

            // Action
            var result = await _controller.Index(model);

            // Assert
            AssertReturnedData(data, result);
        }

        private ReportResultModel<LicenseeWinLoss> CreateResultModel()
        {
            return new ReportResultModel<LicenseeWinLoss>
            {
                DataList = new List<LicenseeWinLoss>
                {
                    new LicenseeWinLoss
                    {
                        TurnOver = new Dictionary<string, decimal> { { Product.SB, 1 }, { Product.NG, 2 } },
                        LicenseeWL = new Dictionary<string, decimal> { { Product.SB, 3 }, { Product.NG, 4 } }
                    }
                },
                TotalDataList = new List<LicenseeWinLoss>
                {
                    new LicenseeWinLoss
                    {
                        TurnOver = new Dictionary<string, decimal> { { Product.SB, 5 }, { Product.NG, 6 } },
                        LicenseeWL = new Dictionary<string, decimal> { { Product.SB, 7 }, { Product.NG, 8 } }
                    }
                },
                SummaryTotal = new Dictionary<string, LicenseeWinLoss>
                {
                    {
                        "C1",
                        new LicenseeWinLoss
                        {
                            TurnOver = new Dictionary<string, decimal> { { Product.SB, 9 }, { Product.NG, 10 } },
                            LicenseeWL = new Dictionary<string, decimal> { { Product.SB, 11 }, { Product.NG, 12 } }
                        }
                    }
                }
            };
        }

        private void AssertReturnedData(ReportResultModel<LicenseeWinLoss> data, dynamic actualData)
        {
            var firstData = data.DataList.First();
            var firstActual = actualData.Data[0];

            var firstTotalData = data.TotalDataList.First();
            var firstTotalActual = actualData.Total[0];

            var firstSumData = data.SummaryTotal.First();
            var firstSumActual = actualData.SummaryTotal[firstSumData.Key];

            Assert.Multiple(() =>
            {
                Assert.That(firstActual.TurnOverSB, Is.EqualTo(firstData.TurnOver[Product.SB]));
                Assert.That(firstActual.TurnOverNG, Is.EqualTo(firstData.TurnOver[Product.NG]));
                Assert.That(firstActual.LicenseeWLSB, Is.EqualTo(firstData.LicenseeWL[Product.SB]));
                Assert.That(firstActual.LicenseeWLNG, Is.EqualTo(firstData.LicenseeWL[Product.NG]));

                Assert.That(firstTotalActual.TurnOverSB, Is.EqualTo(firstTotalData.TurnOver[Product.SB]));
                Assert.That(firstTotalActual.TurnOverNG, Is.EqualTo(firstTotalData.TurnOver[Product.NG]));
                Assert.That(firstTotalActual.LicenseeWLSB, Is.EqualTo(firstTotalData.LicenseeWL[Product.SB]));
                Assert.That(firstTotalActual.LicenseeWLNG, Is.EqualTo(firstTotalData.LicenseeWL[Product.NG]));

                Assert.That(firstSumActual.TurnOverSB, Is.EqualTo(firstSumData.Value.TurnOver[Product.SB]));
                Assert.That(firstSumActual.TurnOverNG, Is.EqualTo(firstSumData.Value.TurnOver[Product.NG]));
                Assert.That(firstSumActual.LicenseeWLSB, Is.EqualTo(firstSumData.Value.LicenseeWL[Product.SB]));
                Assert.That(firstSumActual.LicenseeWLNG, Is.EqualTo(firstSumData.Value.LicenseeWL[Product.NG]));
            });
        }
    }
}
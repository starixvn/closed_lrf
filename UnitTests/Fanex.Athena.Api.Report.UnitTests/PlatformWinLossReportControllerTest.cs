namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Hosting;
    using System.Web.Http.Results;
    using Base.UnitTests;
    using DataAccess.Report.Interfaces;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using NPOI.SS.UserModel;
    using NSubstitute;
    using NUnit.Framework;
    using Report;
    using Resources;

    public partial class PlatformWinLossReportControllerTest : BaseApiControllerHelperTest
    {
        private const int ExpectedCustomerComm = 999;

        private PlatformWinLossReportController _controller;
        private IPlatformWinLossDataAccess _dataAccess;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            MockSessionData();

            _dataAccess = Substitute.For<IPlatformWinLossDataAccess>();
            _controller = Substitute.ForPartsOf<PlatformWinLossReportController>(SessionService, ProductService, LangService, _dataAccess);
            _controller.Request = new HttpRequestMessage();
            _controller.Request.Properties.Add(HttpPropertyKeys.HttpConfigurationKey, new HttpConfiguration());
            _controller.When(x => x.ExcelStream(Arg.Any<IWorkbook>(), Arg.Any<string>())).DoNotCallBase();

            var validProduct = SetUpProductOption(new string[0]).Select(x => x.Code).ToArray();
            StubProductAccess(validProduct, FunctionNames.PlatformWinloss, true);
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _dataAccess = null;
            _controller = null;
        }

        [TestCase(2)]
        public async Task Index_WhenCallWithLevel0_ReturnCorrectData(int numberOfRow)
        {
            // Arrange
            SetUpDataAccessGetSummaryData();

            // Action
            var result = await _controller.Index(CreateMetaModel(0));

            // Assert
            Assert.Multiple(async () =>
            {
                await _dataAccess.ReceivedWithAnyArgs().GetSummaryData(Arg.Any<PlatformWinLossMetaModel>());
                Assert.That(result.Data.Count, Is.EqualTo(numberOfRow));
                Assert.That(result.Total.CustomerComm, Is.EqualTo(ExpectedCustomerComm));
            });
        }

        [Test]
        public async Task Index_WhenCallWithInvalidModel_ReturnBadRequestWithCorrectMessage()
        {
            // Arrange
            var metaModel = new PlatformWinLossMetaModel
            {
                CurrencyId = 99,
                ProductOptions = new List<ProductOption>
                {
                    new ProductOption { Code = "SB" }
                }
            };

            // Action
            var result = await _controller.Index(metaModel) as BadRequestErrorMessageResult;

            // Assert
            Assert.That(result.Message, Is.EqualTo(ViewResources.InvalidParams));
        }

        [Test]
        public async Task Index_WhenCallWithLevel1_ReturnCorrectData()
        {
            // Arrange
            StubDataAccessGetMemberData();

            // Action
            var result = await _controller.Index(CreateMetaModel(1));

            // Assert
            Assert.Multiple(async () =>
            {
                await _dataAccess.ReceivedWithAnyArgs().GetMemberData(Arg.Any<PlatformWinLossMetaModel>(), Arg.Any<IDictionary<int, string>>());
                Assert.That(result.Data.Count, Is.EqualTo(3));
                Assert.That(result.Total.CustomerComm, Is.EqualTo(ExpectedCustomerComm));
            });
        }

        [Test]
        public void Index_InvalidProductCode_ThowArgumentException()
        {
            // Arrange
            SetUpDataAccessGetSummaryData();

            var product = new List<ProductOption>
            {
                new ProductOption { Code = "SB", Status = true },
                new ProductOption { Code = "Invalid", Status = true }
            };

            var expectedProduct = new List<ProductOption>
            {
                new ProductOption { Code = "SB", Status = true }
            };

            var metaModel = CreateMetaModel(0);
            metaModel.ProductOptions = product;

            // Action
            AsyncTestDelegate testDelegate = async () => await _controller.Index(metaModel);

            // Assert
            Assert.ThrowsAsync<ArgumentException>(testDelegate);
        }

        private static PlatformWinLossMetaModel CreateMetaModel(int level, bool isExportExcel = false)
        {
            return new PlatformWinLossMetaModel
            {
                Level = level,
                PlatformType = PlatformType.Asia,
                Year = 2017,
                Month = 1,
                FromDay = 1,
                ToDay = 2,
                IsExportExcel = isExportExcel,
                ProductOptions = new List<ProductOption>
                {
                    new ProductOption
                    {
                        Code = "SB",
                        Status = true
                    }
                }
            };
        }

        private SortableList<PlatformWinLossMember> StubDataAccessGetMemberData()
        {
            var data1 = new PlatformWinLossMember { Index = 5, AmtDueToBA = 5 };
            var data2 = new PlatformWinLossMember { Index = 2, AmtDueToBA = 2 };
            var data3 = new PlatformWinLossMember { Index = 3, AmtDueToBA = 3 };

            var memberData = new SortableList<PlatformWinLossMember>
            {
                data1,
                data2,
                data3
            };

            var result = new SortableReportResultModel<PlatformWinLossMember>
            {
                TotalData = new PlatformWinLossMember
                {
                    CustomerComm = ExpectedCustomerComm
                },
                DataList = memberData
            };

            _dataAccess.GetMemberData(Arg.Any<PlatformWinLossMetaModel>(), UserCurrencyList).ReturnsForAnyArgs(Task.FromResult(result));

            return new SortableList<PlatformWinLossMember>
            {
                data1,
                data2,
                data3
            };
        }

        private void SetUpDataAccessGetSummaryData()
        {
            var summaryData = new List<PlatformWinLossSummary>
            {
                new PlatformWinLossSummary(),
                new PlatformWinLossSummary()
            };

            _dataAccess.GetSummaryData(Arg.Any<PlatformWinLossMetaModel>()).ReturnsForAnyArgs(
                Task.FromResult(new ReportResultModel<PlatformWinLossSummary>
                {
                    TotalData = new PlatformWinLossSummary
                    {
                        CustomerComm = ExpectedCustomerComm
                    },
                    DataList = summaryData
                }));
        }
    }
}
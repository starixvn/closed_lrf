namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using Excel.Report;
    using Excel.Report.Models;
    using Fanex.Athena.DataAccess.Report.Interfaces;
    using Model.Core.DataDomain;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using NPOI.SS.UserModel;
    using NSubstitute;
    using NUnit.Framework;

    public class CustomerPendingFundsReportControllerTest : BaseApiControllerHelperTest
    {
        private ICustPendingFundsDataAccess _dataAccess;
        private CustomerPendingFundsReportController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _dataAccess = Substitute.For<ICustPendingFundsDataAccess>();

            _controller = Substitute.ForPartsOf<CustomerPendingFundsReportController>(AppSetting, _dataAccess, SessionService, ProductService, LangService);

            _controller.When(x => x.ExcelStream(Arg.Any<IWorkbook>(), Arg.Any<string>())).DoNotCallBase();

            StubProductAccess(new[] { "SB", "AB" }, FunctionNames.CustomerPendingFunds, true);

            MockSessionData();
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _controller = null;
            _dataAccess = null;
        }

        [Test]
        public async Task Index_InvalidModel_ReturnEmptyData()
        {
            // Arrange
            var model = Substitute.ForPartsOf<CustomerPendingFundsMetaModel>();
            model.ProductOptions = new List<ProductOption> { new ProductOption() };
            model.IsValid.Returns(false);

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.IsEmpty(result.Data);
                Assert.That(result.TotalRows, Is.Zero);
            });
        }

        [Test]
        public void Index_InvalidProductCode_ThowArgumentException()
        {
            // Arrange
            var product = new List<ProductOption>
            {
                new ProductOption { Code = "SB", Status = true },
                new ProductOption { Code = "Invalid", Status = true }
            };

            var expectedProduct = new List<ProductOption>
            {
                new ProductOption { Code = "SB", Status = true }
            };

            var metaModel = CreateValidMetaModel();
            metaModel.ProductOptions = product;
            SetUpForGettingData(metaModel);

            // Action
            AsyncTestDelegate testDelegate = async () => await _controller.Index(metaModel);

            // Assert
            Assert.ThrowsAsync<ArgumentException>(testDelegate);
        }

        [Test]
        public async Task Index_ValidModel_GetDataFromDataAccess()
        {
            // Arrange
            var metaModel = CreateValidMetaModel();
            var expectedData = SetUpForGettingData(metaModel);

            // Action
            var result = await _controller.Index(metaModel);

            // Assert
            Assert.That(result.Data, Is.EqualTo(expectedData));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task ExportExcel_ExportToExcel_ExportWithCorrectData(bool isFakeLicensee)
        {
            // Arrange
            var metaModel = CreateValidMetaModel();
            var expectedDataList = SetUpForGettingData(metaModel);
            const int PageSizeExcel = int.MaxValue - 1000;

            AppSetting.FakeLicenseeList.Returns(x => isFakeLicensee ? new int[1] { SessionLicenseeId } : new int[0]);

            var excel = Substitute.ForPartsOf<CustomerPendingFundsExcel>();
            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcel(Arg.Any<string>(), Arg.Any<CustomerPendingFundsExcelModel>()).ReturnsForAnyArgs(excel);

            // Action
            await _controller.ExportExcel(metaModel);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(metaModel.PageIndex, Is.EqualTo(1));
                Assert.That(metaModel.PageSize, Is.EqualTo(PageSizeExcel));
            });
        }

        private static CustomerPendingFundsMetaModel CreateValidMetaModel()
        {
            return new CustomerPendingFundsMetaModel
            {
                AgentListXml = string.Empty,
                ProductOptions = new List<ProductOption> { new ProductOption { Code = "SB" } }
            };
        }

        private IEnumerable<CustPendingFunds> SetUpForGettingData(CustomerPendingFundsMetaModel metaModel)
        {
            var expectedData = new List<CustPendingFunds>();

            var random = new Random();
            var total = random.Next(5, 10);
            for (int i = 0; i < total; i++)
            {
                var item = new CustPendingFunds
                {
                    CustId = random.Next(1, 10),
                    ExternalId = random.Next(1, 10).ToString(),
                    SystemId = random.Next(1, 10).ToString(),
                    BetCounts = random.Next(1, 10),
                    PendingFunds = random.Next(1, 10)
                };
                expectedData.Add(item);
            }

            _dataAccess.GetDataList(metaModel).Returns(Task.FromResult(new ReportResultModel<CustPendingFunds>
            {
                TotalData = new CustPendingFunds(),
                TotalRows = total,
                DataList = expectedData
            }));

            return expectedData;
        }
    }
}
namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using Excel.Base.Entities;
    using Excel.Report;
    using Fanex.Athena.DataAccess.Report.Interfaces;
    using Model.Core.DataDomain;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using NPOI.SS.UserModel;
    using NSubstitute;
    using NUnit.Framework;

    public class CustomerBalanceReportControllerTest : BaseApiControllerHelperTest
    {
        private ICustBalanceDataAccess _dataAccess;
        private CustomerBalanceReportController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _dataAccess = Substitute.For<ICustBalanceDataAccess>();

            _controller = Substitute.ForPartsOf<CustomerBalanceReportController>(_dataAccess, SessionService, ProductService, LangService);

            _controller.When(x => x.ExcelStream(Arg.Any<IWorkbook>(), Arg.Any<string>())).DoNotCallBase();

            MockSessionData();

            StubProductAccess(new[] { "SB", "AB" }, FunctionNames.CustomerBalance, true);
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
            var model = new CustomerBalanceMetaModel
            {
                IsExportExcel = false,
                FromDate = DateTime.Now.AddDays(1),
                ToDate = DateTime.Now,
                ProductOptions = new List<ProductOption> { new ProductOption { Code = "SB" } }
            };

            var result = await _controller.Index(model);

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
            Assert.Multiple(() =>
            {
                Assert.That(expectedData.DataList, Is.EqualTo(result.Data));
                Assert.That(expectedData.TotalData, Is.EqualTo(result.Total));
                Assert.That(expectedData.TotalRows, Is.EqualTo(result.TotalRows));
            });
        }

        [Test]
        public async Task ExportExcel_ExportToExcel_ExportWithCorrectData()
        {
            // Arrange
            var metaModel = CreateValidMetaModel();
            var expectedDataList = SetUpForGettingData(metaModel);
            const int PageSizeExcel = int.MaxValue - 1000;

            var actualDataList = Enumerable.Empty<CustBalance>();
            var excel = Substitute.ForPartsOf<CustomerBalanceExcel>();
            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcel(
                   Arg.Any<string>(),
                   Arg.Any<CustomerBalanceMetaModel>(),
                   Arg.Any<ReportResultModel<CustBalance>>(),
                   Arg.Any<ShowingOption>(),
                   Arg.Any<ConvertingOption>()).ReturnsForAnyArgs(excel);

            // Action
            await _controller.ExportExcel(metaModel);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(metaModel.PageIndex, Is.EqualTo(1));
                Assert.That(metaModel.PageSize, Is.EqualTo(PageSizeExcel));
            });
        }

        private static CustomerBalanceMetaModel CreateValidMetaModel()
        {
            return new CustomerBalanceMetaModel
            {
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddDays(1),
                ProductOptions = new List<ProductOption> { new ProductOption { Code = "SB", Status = true } },
                AgentListXml = string.Empty
            };
        }

        private ReportResultModel<CustBalance> SetUpForGettingData(CustomerBalanceMetaModel metaModel)
        {
            var expectedData = new ReportResultModel<CustBalance>
            {
                TotalData = new CustBalance { Index = 1 },
                TotalRows = 1,
                DataList = new List<CustBalance> { new CustBalance { Index = 1 } }
            };

            _dataAccess.GetDataList(metaModel).Returns(Task.FromResult(expectedData));

            return expectedData;
        }
    }
}
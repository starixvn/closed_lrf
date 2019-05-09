namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using Excel.Report;
    using Excel.Report.Models;
    using Extension.Utility;
    using Fanex.Athena.DataAccess.Report.Interfaces;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using NPOI.SS.UserModel;
    using NSubstitute;
    using NUnit.Framework;

    public class CustomerWinLossReportControllerTest : BaseApiControllerHelperTest
    {
        private ICustWinlossDataAccess _dataAccess;
        private CustomerWinLossReportController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _dataAccess = Substitute.For<ICustWinlossDataAccess>();

            _controller = Substitute.ForPartsOf<CustomerWinLossReportController>(AppSetting, _dataAccess, SessionService, ProductService, LangService);

            _controller.When(x => x.ExcelStream(Arg.Any<IWorkbook>(), Arg.Any<string>())).DoNotCallBase();

            StubProductAccess(new[] { "SB", "AB" }, FunctionNames.CustomerWinLoss, true);
        }

        [OneTimeTearDown]
        public override void FixtureTearDown()
        {
            base.FixtureTearDown();

            _controller = null;
            _dataAccess = null;
        }

        [SetUp]
        public void SetUp()
        {
            MockSessionData();
        }

        [Test]
        public async Task Index_InvalidModel_ReturnEmptyData()
        {
            var model = new CustomerWinLossMetaModel
            {
                IsExportExcel = false,
                FromDate = DateTime.Now.AddDays(1),
                ToDate = DateTime.Now
            };

            var result = await _controller.Index(model);

            Assert.Multiple(() =>
            {
                Assert.IsEmpty(result.Data);
                Assert.That(result.TotalRows, Is.Zero);
            });
        }

        [TestCase("", "")]
        [TestCase(nameof(CustomerWinLoss.CustId), "asc")]
        public async Task Index_ValidModel_GetDataFromDataAccess(string sortColumn, string sortDirection)
        {
            // Arrange
            var metaModel = CreateValidMetaModel(sortColumn, sortDirection);
            var expectedData = SetUpForGettingData(metaModel);

            // Action
            var result = await _controller.Index(metaModel);

            // Assert
            Assert.That(result.Data, Is.EqualTo(expectedData));
        }

        [TestCase(true)]
        [TestCase(false)]
        public async Task Index_ExportToExcel_ExportWithCorrectData(bool isFakeLicensee)
        {
            // Arrange
            var metaModel = CreateValidMetaModel(nameof(CustomerWinLoss.CustId), "asc");
            metaModel.IsExportExcel = true;
            var expectedDataList = SetUpForGettingData(metaModel);

            StubProductAccess(new[] { Product.BA, Product.SB }, FunctionNames.CustomerWinLoss, true);
            AppSetting.FakeLicenseeList.Returns(x => isFakeLicensee ? new int[1] { SessionLicenseeId } : new int[0]);

            var excel = Substitute.ForPartsOf<CustomerWinLossExcel>(
                Arg.Any<string>(),
                new CustomerWinLossExcelModel
                {
                    MetaModel = new CustomerWinLossMetaModel(),
                    DataList = new CustomerWinLoss[] { }
                });
            excel.When(x => x.Export()).DoNotCallBase();
            StubGetValueAppSettings("FakeLicenseeList", "1,2");

            var actualExcelModel = new CustomerWinLossExcelModel();
            _controller.CreateExcel(Arg.Any<string>(), Arg.Do<CustomerWinLossExcelModel>(x => actualExcelModel = x))
                .ReturnsForAnyArgs(excel);

            // Action
            await _controller.Index(metaModel);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(actualExcelModel.DataList, Is.EqualTo(expectedDataList.AsEnumerable()));
                Assert.That(actualExcelModel.BAVisible, Is.True);
                Assert.That(actualExcelModel.SystemIdVisible, Is.EqualTo(!isFakeLicensee));
            });
        }

        private static CustomerWinLossMetaModel CreateValidMetaModel(string sortColumn, string sortDirection)
        {
            return new CustomerWinLossMetaModel
            {
                FromDate = DateTime.Now,
                ToDate = DateTime.Now.AddDays(1),
                ProductOptions = new List<ProductOption> { new ProductOption { Code = "SB", Status = true } },
                AgentListXml = string.Empty
            };
        }

        private IEnumerable<CustomerWinLoss> SetUpForGettingData(CustomerWinLossMetaModel metaModel)
        {
            var expectedData = new SortableList<CustomerWinLoss>();

            var random = new Random();
            var totalRows = random.Next(5, 10);

            for (int i = 0; i < totalRows; i++)
            {
                var item = new CustomerWinLoss
                {
                    CustId = random.Next(1, 10),
                    ExternalId = random.Next(1, 10).ToString(),
                    SystemId = random.Next(1, 10).ToString()
                };
                expectedData.Add(item);
            }

            _dataAccess.GetDataList(metaModel).Returns(new ReportResultModel<CustomerWinLoss>
            {
                TotalData = new CustomerWinLoss(),
                TotalRows = totalRows,
                DataList = expectedData
            });

            var index = 1;
            foreach (var item in expectedData)
            {
                item.Index = index++;
            }

            return expectedData;
        }
    }
}
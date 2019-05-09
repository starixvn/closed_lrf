namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Base.UnitTests;
    using DataAccess.Report.Interfaces;
    using Excel.Report;
    using Excel.Report.Models;
    using Extension.Helper;
    using Extension.Utility;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Model.Core.ResultModel;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ViewModel;
    using NPOI.SS.UserModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Core.Configuration.Interfaces;
    using Session.Model;

    public class LicenseeWinLossReportControllerTest : BaseApiControllerHelperTest
    {
        private IReportSettingService _reportSettingService;

        private ILicenseeWinLossDataAccess _dataAccess;

        private LicenseeWinLossReportController _controller;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();

            _dataAccess = Substitute.For<ILicenseeWinLossDataAccess>();
            _reportSettingService = Substitute.For<IReportSettingService>();

            _controller = Substitute.ForPartsOf<LicenseeWinLossReportController>(
                SessionService, 
                ProductService, 
                _reportSettingService, 
                LangService,
                _dataAccess);

            _controller.When(x => x.ExcelStream(Arg.Any<IWorkbook>(), Arg.Any<string>())).DoNotCallBase();

            StubProductAccess(new[] { "SB", "AB" }, FunctionNames.LicenseeWinLoss, true);

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
            var model = new LicenseeWinLossMetaModel
            {
                ProductOptions = new List<ProductOption>
                {
                    new ProductOption()
                }
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
                Assert.That(result.ProductOptions, Is.EqualTo(model.ProductOptions.ToJson()));
            });
        }

        [Test]
        public async Task Index_InvalidRequest_ReturnEmptyData()
        {
            // Arrange
            var model = new LicenseeWinLossMetaModel
            {
                CurrencyId = 3,
                ProductOptions = new List<ProductOption> { new ProductOption { Code = "SB" } }
            };

            // Action
            var result = await _controller.Index(model);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result.Data, Is.Empty);
                Assert.That(result.Total, Is.Empty);
                Assert.That(result.SummaryTotal, Is.Empty);
                Assert.That(result.ProductOptions, Is.EqualTo(model.ProductOptions.ToJson()));
            });
        }

        [Test]
        public async Task Index_ValidModelNoSorting_GetCorrectDataFromDataAccess()
        {
            // Arrange
            var metaModel = CreateValidMetaModel();
            var expectedResult = SetUpForGettingData(metaModel, totalItem: 5);

            // Action
            var result = await _controller.Index(metaModel);

            // Assert
            Assert.That(result.Data.Count, Is.EqualTo(expectedResult.DataList.Count));
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
            SetUpForGettingData(metaModel, totalItem: 0);

            // Action
            AsyncTestDelegate testDelegate = async () => await _controller.Index(metaModel);

            // Assert
            Assert.ThrowsAsync<ArgumentException>(testDelegate);
        }

        [TestCase("ActualStake")]
        [TestCase("ActualStakeSingle")]
        public async Task Index_ExportToExcel_SortByActualStake__SortDataByActualStake(string sortBy)
        {
            // Arrange
            var metaModel = CreateValidMetaModel(sortBy: sortBy);
            var expectedResult = SetUpForGettingData(metaModel, totalItem: 5);
            expectedResult.DataList.Sort("ActualStake", true);

            var expectedSortResult = expectedResult.DataList.Select(x => x.ActualStake).ToArray();

            SetUpForExportingExcel();

            var actualExcelModel = new LicenseeWinLossExcelModel();
            _controller.When(x => x.CreateExcel(
               Arg.Any<string>(),
               Arg.Any<LicenseeWinLossExcelModel>())).Do(p => actualExcelModel = (LicenseeWinLossExcelModel)p[1]);

            // Action
            var result = await _controller.Index(metaModel);
            IList<LicenseeWinLossGridViewModel> dataList = result.Data;

            // Assert
            Assert.That(dataList.Select(x => x.ActualStake).ToArray(), Is.EqualTo(expectedSortResult));
        }

        [Test]
        public async Task Index_ExportToExcel_SortByLicenseeWLSB_SortDataByDictionary()
        {
            // Arrange
            var metaModel = CreateValidMetaModel(sortBy: "LicenseeWLSB");
            metaModel.IsExportExcel = true;

            var resultModel = SetUpForGettingData(metaModel, totalItem: 5);
            resultModel.DataList.SortByDictionary("SB", "LicenseeWL", true);

            var expectedResult = resultModel.DataList.Select(x => x.LicenseeWL["SB"]).ToArray();

            SetUpForExportingExcel();

            var actualExcelModel = new LicenseeWinLossExcelModel();
            _controller.When(x => x.CreateExcel(
               Arg.Any<string>(),
               Arg.Any<LicenseeWinLossExcelModel>())).Do(p => actualExcelModel = (LicenseeWinLossExcelModel)p[1]);

            // Action
            var result = await _controller.Index(metaModel);

            // Assert
            Assert.That(actualExcelModel.DataList.SelectMany(x => x.LicenseeWL.Values).ToArray(), Is.EqualTo(expectedResult));
        }

        [Test]
        public async Task Index_ExportToExcel_SortByTurnOverSB_SortDataByDictionary()
        {
            // Arrange
            var metaModel = CreateValidMetaModel(sortBy: "TurnOverSB");
            metaModel.IsExportExcel = true;

            var resultModel = SetUpForGettingData(metaModel, totalItem: 5);
            resultModel.DataList.SortByDictionary("SB", "TurnOver", true);

            var expectedResult = resultModel.DataList.Select(x => x.TurnOver["SB"]).ToArray();

            SetUpForExportingExcel();

            var actualExcelModel = new LicenseeWinLossExcelModel();
            _controller.When(x => x.CreateExcel(
               Arg.Any<string>(),
               Arg.Any<LicenseeWinLossExcelModel>())).Do(p => actualExcelModel = (LicenseeWinLossExcelModel)p[1]);

            // Action
            await _controller.Index(metaModel);

            // Assert
            Assert.That(actualExcelModel.DataList.SelectMany(x => x.TurnOver.Values).ToArray(), Is.EqualTo(expectedResult));
        }

        [Test]
        public async Task Index_ExportToExcel_ExportWithCorrectData()
        {
            // Arrange
            var metaModel = CreateValidMetaModel();
            metaModel.IsExportExcel = true;

            var expectedResult = SetUpForGettingData(metaModel, totalItem: 5);

            SetUpForExportingExcel();

            var actualExcelModel = new LicenseeWinLossExcelModel();
            _controller.When(x => x.CreateExcel(
               Arg.Any<string>(),
               Arg.Any<LicenseeWinLossExcelModel>())).Do(p => actualExcelModel = (LicenseeWinLossExcelModel)p[1]);

            // Action
            await _controller.Index(metaModel);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(actualExcelModel.DataList.Count(), Is.EqualTo(expectedResult.DataList.Count()));
                Assert.That(actualExcelModel.SBVisible, Is.True);
                Assert.That(actualExcelModel.BAVisible, Is.False);
            });
        }

        [TestCase(1, 1)]
        [TestCase(2, 0)]
        public void Index_ExportToExcel_LevelGreaterThan0_ExportWithCorrectData(int level, int currencyId)
        {
            // Arrange
            const int CustId = 1;
            const string CurrencyName = "USD";
            const int DrillDownCurrencyId = 0;
            var fdate = DateTime.Today;
            var tdate = DateTime.Today.AddDays(1);

            var metaModel = CreateValidMetaModel();
            metaModel.CurrencyId = currencyId;
            metaModel.IsExportExcel = true;

            var expectedResult = SetUpForGettingData(metaModel, level, totalItem: 0);

            SetUpForExportingExcel();

            var actualExcelModel = new LicenseeWinLossExcelModel();
            _controller.When(x => x.CreateExcel(
               Arg.Any<string>(),
               Arg.Any<LicenseeWinLossExcelModel>())).Do(p => actualExcelModel = (LicenseeWinLossExcelModel)p[1]);

            // Action
            _controller.Index(metaModel, fdate, tdate, level, DrillDownCurrencyId, CustId, CurrencyName);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(actualExcelModel.MetaModel, Is.EqualTo(metaModel));
                Assert.That(metaModel.FromDate, Is.EqualTo(metaModel.DrillDownFromDate));
                Assert.That(metaModel.ToDate, Is.EqualTo(metaModel.DrillDownToDate));
                Assert.That(metaModel.CurrencyId, Is.EqualTo(currencyId > 0 ? metaModel.DrillDownCurrencyId : metaModel.CurrencyId));
            });
        }

        private void SetUpForExportingExcel()
        {
            ProductService.GetProductAccess(Arg.Any<int>(), Arg.Any<string>()).Returns(
                new ProductAccess(
                    new List<Product>
                    {
                        new Product { ProductCode = "SB" },
                        new Product { ProductCode = "BA" }
                    }));

            var excel = Substitute.ForPartsOf<LicenseeWinLossExcel>(
                   string.Empty);
            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcel(
                  string.Empty,
                  Arg.Any<LicenseeWinLossExcelModel>()).ReturnsForAnyArgs(excel);
        }

        private LicenseeWinLossMetaModel CreateValidMetaModel(string sortBy = null, string sortOrder = "asc")
        {
            var model = new LicenseeWinLossMetaModel
            {
                SortBy = sortBy,
                SortOrder = sortOrder,
                FromDate = new DateTime(2016, 1, 1),
                ToDate = new DateTime(2017, 1, 1),
                ProductOptions = new List<ProductOption>
                {
                    new ProductOption
                    {
                        Code = "SB",
                        Status = true
                    }
                }
            };

            StubUserSessionData(new UserSession
            {
                CurrencyList = new Dictionary<int, string>
                {
                    { model.CurrencyId, nameof(model.CurrencyId) }
                },
                FunctionIdList = new int[0]
            });
            StubLicenseeSessionData(new LicenseeSession { LicenseeId = 1 });
            SessionService.GenerateAgentListXml(Arg.Any<int>(), Arg.Any<bool>()).Returns(string.Empty);

            return model;
        }

        private SortableReportResultModel<LicenseeWinLoss> SetUpForGettingData(LicenseeWinLossMetaModel metaModel, int level = 0, int totalItem = 0)
        {
            var dataList = new SortableList<LicenseeWinLoss>();

            var random = new Random();
            for (int i = 0; i < totalItem; i++)
            {
                dataList.Add(new LicenseeWinLoss
                {
                    ActualStake = random.Next(1, 100),
                    LicenseeWL = new Dictionary<string, decimal>
                    {
                        { "SB", random.Next(1, 100) }
                    },
                    TurnOver = new Dictionary<string, decimal>
                    {
                        { "SB", random.Next(1, 100) }
                    }
                });
            }

            var result = new SortableReportResultModel<LicenseeWinLoss>
            {
                DataList = dataList,
                TotalDataList = new List<LicenseeWinLoss>(),
                SummaryTotal = new Dictionary<string, LicenseeWinLoss>()
            };

            if (level == 0)
            {
                _dataAccess.GetSummaryWinloss(metaModel, Arg.Any<IDictionary<int, string>>()).Returns(Task.FromResult(result));
            }
            else if (level == 1)
            {
                _dataAccess.GetAgentWinlossDetail(metaModel, Arg.Any<IDictionary<int, string>>()).Returns(Task.FromResult(result));
            }
            else
            {
                _dataAccess.GetCustomerWinlossDetail(metaModel, Arg.Any<IDictionary<int, string>>()).Returns(Task.FromResult(result));
            }

            return result;
        }
    }
}
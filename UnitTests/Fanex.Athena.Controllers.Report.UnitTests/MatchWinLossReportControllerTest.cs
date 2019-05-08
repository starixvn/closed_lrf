namespace Fanex.Athena.Controllers.TotalBets.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Base.UnitTests;
    using DataAccess.Core.Configuration.Interfaces;
    using Excel.Report;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using Model.Report.DTO;
    using Model.Report.MetaModel;
    using Model.Report.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using Report;
    using Service.Core.Common.Interfaces;
    using Service.Report.Interfaces;
    using VendorAdapter.Interfaces;

    [TestFixture]
    public partial class MatchWinLossReportControllerTest : CultureBaseControllerHelperTest
    {
        private const int CurrencyId = 999;

        private const string AgentListXml = "melody";

        private static readonly DateTime BalanceUpDate = new DateTime(2017, 3, 4);

        private IBalanceUpDataAccess _balanceUpDataAccess;

        private IMatchWinLossService _matchWinLossService;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            _balanceUpDataAccess = Substitute.For<IBalanceUpDataAccess>();
            _matchWinLossService = Substitute.For<IMatchWinLossService>();

            _balanceUpDataAccess.GetBalanceUp().Returns(new BalanceUp
            {
                BalanceUpDay = BalanceUpDate
            });

            base.FixtureSetUp();

            SetUpDefaultFakeData();
            SessionService.GenerateAgentListXml(CurrencyId).Returns(AgentListXml);
        }

        [Test]
        public async Task Detail_WhenGet_ReturnCorrectViewResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = new MatchWinLossMetaModel
                {
                    CurrencyId = CurrencyId
                };
                var dataList = new List<MatchWinLoss>
                {
                    new MatchWinLoss()
                };
                _matchWinLossService.GetDetailDataList(metaModel).Returns(dataList);

                // Action
                var viewResult = await controller.Detail(metaModel) as ViewResult;
                var viewModel = viewResult.Model as MatchWinLossViewModel;

                // Assert
                Assert.Multiple(() =>
                {
                    Assert.That(viewResult.ViewName, Is.EqualTo("~/Views/Desktop/Report/MatchWinLoss/Content.data.Detail.cshtml"));
                    Assert.That(viewModel.MainResult, Is.EqualTo(dataList));
                    Assert.That(metaModel.AgentListXml, Is.EqualTo(AgentListXml));
                });
            }
        }

        private static void MockCreatingExcel(MatchWinLossReportController controller)
        {
            var excel = Substitute.ForPartsOf<MatchWinLossExcel>();
            excel.When(x => x.Export()).DoNotCallBase();
            controller.CreateExcel(string.Empty, null, null, null, null, null).ReturnsForAnyArgs(excel);
        }

        private MatchWinLossReportController CreateController(string productCodeList = null)
        {
            var productList = string.IsNullOrEmpty(productCodeList) ?
                new List<Product>() :
                productCodeList.Split(',').Select(x => new Product
                {
                    ProductCode = x
                });
            var productService = Substitute.For<IProductService>();
            productService.GetProductAccess(
                SessionService.LicenseeSession.LicenseeId,
                SessionService.UserSession.Language,
                FunctionNames.MatchWinLoss,
                true).Returns(new ProductAccess(productList.ToList()));
            var controller = Substitute.ForPartsOf<MatchWinLossReportController>(
                LangService,
                SessionService,
                AppSettings,
                productService,
                _balanceUpDataAccess,
                Substitute.For<ICacheRefAdapter>(),
                _matchWinLossService);
            controller.When(x => x.CreateExcel(string.Empty, null, null, null, null, null)).DoNotCallBase();
            return controller;
        }
    }
}
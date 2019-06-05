namespace Fanex.Athena.Controllers.TotalBets.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Base.UnitTests;
    using DataAccess.Core.Configuration.Interfaces;
    using Model.Core.DTO.Common;
    using Model.Core.DTO.Configuration;
    using NSubstitute;
    using NUnit.Framework;
    using Report.Result;
    using Service.Core.Common.Interfaces;
    using Service.Core.Utility.Interfaces;
    using UnitTest.Common.Extensions;

    [TestFixture]
    public partial class ResultReportControllerTest : CultureBaseControllerHelperTest
    {
        private static readonly DateTime BalanceUpDate = new DateTime(2017, 3, 4);

        private IBalanceUpDataAccess _balanceUpDataAccess;

        private IBetListApiClient _betListApiClient;

        [OneTimeSetUp]
        public override void FixtureSetUp()
        {
            base.FixtureSetUp();
            _balanceUpDataAccess = Substitute.For<IBalanceUpDataAccess>();

            _balanceUpDataAccess.GetBalanceUp().Returns(new BalanceUp
            {
                BalanceUpDay = BalanceUpDate
            });

            SetUpDefaultFakeData();
        }

        [SetUp]
        public void SetUp()
        {
            _betListApiClient = Substitute.For<IBetListApiClient>();
        }

        [Test]
        public void ShowRngCasinoSingleWalletResult_WhenCall_ReturnCorrectResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                const string RefNo = "hohoho";
                const string ExpectedData = "huhuhu";
                const string Url = "/ResultReport/ShowRngCasinoSingleWalletResult";
                _betListApiClient.PostAsyncString(Url, Arg.Any<object>(), SessionService.UserSession.Language).Returns(ExpectedData);

                // Action
                var result = controller.ShowRngCasinoSingleWalletResult(RefNo).Result as ContentResult;

                // Assert
                Assert.Multiple(() =>
                {
                    _betListApiClient.Received(1).PostAsyncString(
                           Url,
                           Arg.Is<object>(x => (string)x.GetValue("refNo") == RefNo),
                           SessionService.UserSession.Language);
                    Assert.That(result.Content, Is.EqualTo(ExpectedData));
                });
            }
        }

        [Test]
        public void ResultDetail_DataIsNull_ReturnCorrectResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                const string Url = "/ResultReport/ResultDetail";
                _betListApiClient.PostAsyncString(Url, Arg.Any<object>(), SessionService.UserSession.Language).Returns(x => (string)null);

                // Action
                var result = controller.ResultDetail(0, 0).Result as RedirectResult;

                // Assert
                Assert.That(result.Url, Is.EqualTo("~/Utility/Error?err=400"));
            }
        }

        [Test]
        public void ResultDetail_WhenCall_ReturnCorrectResult()
        {
            using (var controller = CreateController())
            {
                // Arrange
                const string ExpectedData = "Abc";
                const int MatchId = 1;
                const int SportId = 11111;
                const string Url = "/ResultReport/ResultDetail";
                _betListApiClient.PostAsyncString(Url, Arg.Any<object>(), SessionService.UserSession.Language).Returns(ExpectedData);

                // Action
                var result = controller.ResultDetail(MatchId, SportId).Result as ViewResult;

                // Assert
                Assert.Multiple(() =>
                {
                    _betListApiClient.Received(1).PostAsyncString(
                        Url,
                        Arg.Is<object>(
                            x => (int)x.GetValue("matchId") == MatchId &&
                                (int)x.GetValue("sportType") == SportId &&
                                (string)x.GetValue("languageCode") == SessionService.UserSession.Language),
                        SessionService.UserSession.Language);
                    Assert.That(result.ViewBag.Data, Is.EqualTo(ExpectedData));
                    Assert.That(result.ViewName, Is.EqualTo("~/Views/Desktop/Report/Result/Popup/Main.cshtml"));
                });
            }
        }

        private ResultReportController CreateController(string productCodeList = null)
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
                Arg.Any<string>()).Returns(new ProductAccess(productList.ToList()));
            var controller = new ResultReportController(
                LangService,
                SessionService,
                AppSettings,
                productService,
                _balanceUpDataAccess,
                _betListApiClient);
            controller.ControllerContext = ControllerContext;
            return controller;
        }
    }
}
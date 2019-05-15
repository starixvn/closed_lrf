namespace Fanex.Athena.BetList.Service.UnitTests.Extensions
{
    using System.Collections;
    using System.Collections.Generic;
    using Common.Constant;
    using Fanex.BetList.Core.App_GlobalResources;
    using Fanex.BetList.Core.Builder;
    using Fanex.BetList.Core.Entities;
    using Model.DTO;
    using Model.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Resources;
    using Service.Extensions;

    public class LrfBetListHtmlBuilderTest
    {
        private BetListHTMLBuilder _betListBuilder;

        private ITicketHelper _ticketHelper;

        /// <summary>
        /// Return test cases to test special ticket - include Bet type 'P2PGames' & 'MiniGames' and Sport type 'RNG Keno'
        /// </summary>
        private static IEnumerable StatusNormalTextTestCase
        {
            get
            {
                yield return new TestCaseData(BetType.P2PGames, SportType.AllBet, BetStatus.Running, CoreBetList.running);
                yield return new TestCaseData(BetType.CorrectScore, SportType.Keno, BetStatus.Won, CoreBetList.won);
                yield return new TestCaseData(BetType.P2PGames, SportType.Keno, BetStatus.Lose, CoreBetList.lose);
                yield return new TestCaseData(BetType.Handicap, SportType.Keno, BetStatus.Draw, CoreBetList.draw);
                yield return new TestCaseData(BetType.Ft1X2, SportType.Keno, BetStatus.Waiting, CoreBetList.waiting);
                yield return new TestCaseData(BetType.MixParlay, SportType.Keno, BetStatus.Void, CoreBetList.voided);
                yield return new TestCaseData(BetType.FirstHalFirsGoalLastGoal, SportType.Keno, BetStatus.Refund, CoreBetList.refund);
                yield return new TestCaseData(BetType.OverUnder, SportType.Keno, BetStatus.Reject, CoreBetList.reject);
                yield return new TestCaseData(BetType.MiniGames, SportType.Keno, string.Empty, string.Empty);
            }
        }

        private static IEnumerable CasinoHandHistoryParamTestCase
        {
            get
            {
                yield return new TestCaseData(
                    new Dictionary<string, object> { { "UserName", string.Empty }, { "ExternalId", string.Empty }, { "CustId", 0 } },
                    new Dictionary<string, object> { { "SystemId", "SystemId model" }, { "ExternalId", "ExternalId model" }, { "CustId", 1 } },
                    new Dictionary<string, object> { { "SystemId", "SystemId model" }, { "ExternalId", "ExternalId model" }, { "CustId", 1 } });
                yield return new TestCaseData(
                    new Dictionary<string, object> { { "UserName", "SystemId ticket" }, { "ExternalId", "ExternalId ticket" }, { "CustId", 2 } },
                    new Dictionary<string, object> { { "SystemId", "SystemId model" }, { "ExternalId", "ExternalId model" }, { "CustId", 1 } },
                    new Dictionary<string, object> { { "SystemId", "SystemId ticket" }, { "ExternalId", "ExternalId ticket" }, { "CustId", 2 } });
            }
        }

        [OneTimeSetUp]
        public void FixtureSetUp()
        {
            _betListBuilder = Substitute.ForPartsOf<BetListHTMLBuilder>();

            _ticketHelper = Substitute.For<ITicketHelper>();
        }

        [Test]
        public void BuildLrfStatus_CasinoGamesBetType_ReturnCorrectFormat()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                RefNo = "RefTest",
                BetTypeId = (int)BetType.CasinoGames,
                Status = string.Empty
            };

            var expectedHtmlId = "casino-hand-history-" + ticket.RefNo;

            // Action
            var result = _betListBuilder.BuildLrfStatus(ticket, _ticketHelper, new List<ITicketData>(), new BetListMetaModel());

            // Assert
            StringAssert.Contains(expectedHtmlId, result);
        }

        [TestCaseSource(nameof(CasinoHandHistoryParamTestCase))]
        public void BuildLrfStatus_CasinoGamesBetType_GetCasinoHandHistoryParam_ReturnCorrectFormat(
            Dictionary<string, object> ticket,
            Dictionary<string, object> model,
            Dictionary<string, object> expected)
        {
            // Arrange
            var defaultTicket = new LrfTicket
            {
                RefNo = "RefTest",
                BetTypeId = (int)BetType.CasinoGames,
                Status = BetStatus.Lose,
                UserName = (string)ticket["UserName"],
                ExternalId = (string)ticket["ExternalId"],
                CustId = (int)ticket["CustId"]
            };
            var defaultModel = new BetListMetaModel
            {
                CurrencyName = "USD",
                BaseCurrency = "USD",
                FromDate = new System.DateTime(2018, 1, 1),
                ToDate = new System.DateTime(2018, 1, 2),
                SystemId = (string)model["SystemId"],
                ExternalId = (string)model["ExternalId"],
                CustId = (int)model["CustId"]
            };
            var expectedHtml = $"?RefNo=RefTest&FromDate={defaultModel.FromDate}&ToDate={defaultModel.ToDate}&SystemId={expected["SystemId"]}"
                + $"&ExternalId={expected["ExternalId"]}&CustId={expected["CustId"]}&CurrencyId=0&CurrencyName=USD&BaseCurrency=usd";

            // Action
            var result = _betListBuilder.BuildLrfStatus(defaultTicket, _ticketHelper, new List<ITicketData>(), defaultModel);

            // Assert
            StringAssert.Contains(expectedHtml, result);
        }

        [TestCaseSource(nameof(StatusNormalTextTestCase))]
        public void BuildLrfStatus_SpecicalTicket_ReturnStatusNormalText(BetType betType, SportType sportType, string status, string expectedStatus)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                RefNo = "RefTest",
                BetTypeId = (int)betType,
                Status = status,
                SportTypeId = (int)sportType
            };

            var expectedHtml = $"<div class='status'>{expectedStatus}</div>";

            // Action
            var result = _betListBuilder.BuildLrfStatus(ticket, _ticketHelper, new List<ITicketData>(), new BetListMetaModel());

            // Assert
            Assert.That(result, Is.EqualTo(expectedHtml));
        }

        [TestCase(BetType.BetTradeBought)]
        [TestCase(BetType.CashOutBought)]
        public void BuildLicenseeWL_BoughtTicket_PositiveValue_SeparateWLandComm(BetType betType)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)betType,
                Status = BetStatus.Won,
                Comm = 1,
                LicenseeWL = 2
            };

            const string ExpectedHtml = "<div class ='lic-win-loss'>2.00<br/>1.00</div>";

            // Action
            var result = _betListBuilder.BuildLicenseeWL(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(ExpectedHtml));
        }

        [TestCase(18000)]
        [TestCase(18007)]
        public void BuildLicenseeWL_ColossusBetTicket_NegativeValue_SeparateWLandComm(BetType betType)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)betType,
                Status = BetStatus.Won,
                Comm = 1,
                LicenseeWL = -2
            };

            const string ExpectedHtml = "<div class ='lic-win-loss'>"
                + "<span class='negative-number'>-2.00</span>"
                + "<br/>1.00</div>";

            // Action
            var result = _betListBuilder.BuildLicenseeWL(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(ExpectedHtml));
        }

        [Test]
        public void BuildLicenseeWL_RemainingRunningTicket_ShowHyphenCharacter()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)BetType.Handicap,
                Status = BetStatus.Running,
                Comm = 1,
                LicenseeWL = 3
            };

            const string ExpectedHtml = "-";

            // Action
            var result = _betListBuilder.BuildLicenseeWL(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(ExpectedHtml));
        }

        [TestCase(1, 3, "4.00")]
        [TestCase(-1, -3, "<span class='negative-number'>-4.00</span>")]
        public void BuildLicenseeWL_RemainingTicket_CombineWLandCom(decimal winloss, decimal comm, string expected)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = (int)BetType.Handicap,
                Status = BetStatus.Won,
                Comm = comm,
                LicenseeWL = winloss
            };

            var expectedHtml = $"<div class='lic-win-loss'>{expected}</div>";

            // Action
            var result = _betListBuilder.BuildLicenseeWL(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(expectedHtml));
        }

        [Test]
        public void BuildBetEffective_WhenCall_ReturnCorrectFormat()
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetEffective = 3
            };

            const string ExpectedHtml = "<div class='underdog'>3.00</div>";

            // Action
            var result = _betListBuilder.BuildBetEffective(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(ExpectedHtml));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void BuildCustomerWL_RunningTicket_ReturnHyphenCharacter(bool showPlayerComm)
        {
            // Arrange
            const string ExpectedResult = "-";

            var ticket = new LrfTicket
            {
                Winlost = 1,
                PlayerComm = 2,
                Status = BetStatus.Running,
            };

            // Action
            var result = _betListBuilder.BuildCustomerWL(ticket, showPlayerComm);

            // Assert
            Assert.That(result, Is.EqualTo(ExpectedResult));
        }

        [TestCase(2, 1)]
        [TestCase(1, 2)]
        [TestCase(6, 5)]
        public void BuildCustomerWL_ShowPlayerComm_AppendPlayerCommToResult(decimal winloss, decimal playerComm)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                Winlost = winloss,
                PlayerComm = playerComm,
                Status = BetStatus.Won,
            };

            var expected = $"<div class='underdog'>{winloss.ToString("#,##0.00")}</div>"
                + $"<div class='underdog'>{playerComm.ToString("#,##0.00")}</div>";

            // Action
            var result = _betListBuilder.BuildCustomerWL(ticket, true);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(3)]
        public void BuildCustomerWL_NoShowPlayerComm_DoNotAppendPlayerCommToResult(decimal winloss)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                Winlost = winloss,
                Status = BetStatus.Won,
            };

            var expected = $"<div class='underdog'>{winloss.ToString("#,##0.00")}</div>";

            // Action
            var result = _betListBuilder.BuildCustomerWL(ticket, false);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [TestCase(true, "#cc0033", "Live")]
        [TestCase(false, "#000", "NoneLive")]
        public void BuildLiveStatus_IsNotParlayTicket_ReturnCorrectStatus(bool isLive, string expectedColor, string expectStatus)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = 0,
                IsLive = isLive
            };

            var expected = $"<label style='color:{expectedColor}'>{ViewResources.ResourceManager.GetString(expectStatus)}</label>";

            // Action
            var result = _betListBuilder.BuildLiveStatus(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [TestCase(BetType.MixParlay, LiveStatusTypes.Live, "#cc0033", "Live")]
        [TestCase(BetType.MixParlay, LiveStatusTypes.Mix, "#0033ff", "MixLiveAndNoneLive")]
        [TestCase(BetType.MixParlay, LiveStatusTypes.NonLive, "#000", "NoneLive")]
        [TestCase(BetType.CombinationMixParlay, LiveStatusTypes.Live, "#cc0033", "Live")]
        [TestCase(BetType.CombinationMixParlay, LiveStatusTypes.Mix, "#0033ff", "MixLiveAndNoneLive")]
        [TestCase(BetType.CombinationMixParlay, LiveStatusTypes.NonLive, "#000", "NoneLive")]
        public void BuildLiveStatus_ParlayTicket_ReturnCorrectStatus(int betType, int status, string expectedColor, string expectStatus)
        {
            // Arrange
            var ticket = new LrfTicket
            {
                BetTypeId = betType,
                LiveHomeScore = status
            };

            var expected = $"<label style='color:{expectedColor}'>{ViewResources.ResourceManager.GetString(expectStatus)}</label>";

            // Action
            var result = _betListBuilder.BuildLiveStatus(ticket);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }

        [TestCase("running", BetStatus.Running)]
        [TestCase("Reject", BetStatus.Reject)]
        [TestCase("WON", BetStatus.Won)]
        [TestCase("lOse", BetStatus.Lose)]
        [TestCase("draW", BetStatus.Draw)]
        [TestCase("WaitIng", BetStatus.Waiting)]
        [TestCase("Void", "voided")]
        [TestCase("RefunD", BetStatus.Refund)]
        public void BuildSingleMatchParlaySelectionStatus_WhenCall_ReturnCorrectStatus(string status, string expectStatus)
        {
            // Arrange
            var sourceType = typeof(CoreBetList);
            var statusProp = sourceType.GetProperty(expectStatus);
            var expected = statusProp.GetValue(sourceType, null);

            // Action
            var result = _betListBuilder.BuildSingleMatchParlaySelectionStatus(status);

            // Assert
            Assert.That(result, Is.EqualTo(expected));
        }
    }
}
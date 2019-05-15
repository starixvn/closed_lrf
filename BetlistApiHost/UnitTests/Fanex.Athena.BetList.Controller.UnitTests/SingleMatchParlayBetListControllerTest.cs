namespace Fanex.Athena.BetList.Controller.UnitTests
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Common.Utility.Services.Interfaces;
    using Fanex.BetList.Core.App_GlobalResources;
    using Fanex.BetList.Core.Builder;
    using Fanex.BetList.Core.Entities;
    using Model.DTO;
    using Model.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using Service.Interfaces;
    using UnitTest.Common.Helpers;

    public class SingleMatchParlayBetListControllerTest : BaseControllerHelperTest
    {
        private const string TextRenderTemplate = "<div class='single-match-parlay-selection'><span class='selection'>{0}</span>{1}</div>";

        private const string StatusTextTemplate = " - <span class='status'>{0}</span>";

        private ICacheRefAdapter _cacheRefAdapter;

        private IBetListService _betListService;

        private IBetListHTMLBuilder _betlistHtmlBuilder;

        [SetUp]
        public void SetUp()
        {
            _cacheRefAdapter = Substitute.For<ICacheRefAdapter>();
            _betListService = Substitute.For<IBetListService>();
            _betlistHtmlBuilder = Substitute.For<IBetListHTMLBuilder>();
        }

        [TearDown]
        public void TearDown()
        {
            _cacheRefAdapter = null;
            _betListService = null;
            _betlistHtmlBuilder = null;
        }

        [Test]
        public async Task Detail_NoData_ReturnNull()
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>();

                var data = new List<SingleMatchParlayDetail>();
                _betListService.GetSingleMatchParlayDetail(metaModel).Returns(Task.FromResult<IList<SingleMatchParlayDetail>>(data));

                // Action
                var result = await controller.Detail(metaModel);

                // Assert
                Assert.That(result, Is.Null);
            }
        }

        [TestCase("running")]
        [TestCase("void")]
        public async Task Detail_TicketIsNotSettled_SelectionStatusIsNotShown(string status)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>(x => x.Status, status);

                var selection = new SingleMatchParlayDetail { SelectionType = FakeHelper.Create<int>(), Result = BetStatus.Won };
                var data = new List<SingleMatchParlayDetail> { selection };
                _betListService.GetSingleMatchParlayDetail(metaModel).Returns(Task.FromResult<IList<SingleMatchParlayDetail>>(data));

                var selectionText = FakeHelper.Create<string>();
                _cacheRefAdapter.GetBetBuilderSelectionNames(Arg.Any<int[]>()).Returns(new[] { selectionText });

                // Action
                var result = (List<string>)(await controller.Detail(metaModel)).Data;

                // Assert
                Assert.That(result[0], Is.EqualTo(string.Format(TextRenderTemplate, selectionText, string.Empty)));
            }
        }

        [TestCase("won")]
        [TestCase("lose")]
        [TestCase("refund")]
        public async Task Detail_SelectionIsNotSettled_SelectionStatusIsNotShown(string status)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>(x => x.Status, status);

                var selection = new SingleMatchParlayDetail { SelectionType = FakeHelper.Create<int>(), Result = null };
                var data = new List<SingleMatchParlayDetail> { selection };
                _betListService.GetSingleMatchParlayDetail(metaModel).Returns(Task.FromResult<IList<SingleMatchParlayDetail>>(data));

                var selectionText = FakeHelper.Create<string>();
                _cacheRefAdapter.GetBetBuilderSelectionNames(Arg.Any<int[]>()).Returns(new[] { selectionText });

                // Action
                var result = (List<string>)(await controller.Detail(metaModel)).Data;

                // Assert
                Assert.That(result[0], Is.EqualTo(string.Format(TextRenderTemplate, selectionText, string.Empty)));
            }
        }

        [TestCase("won")]
        [TestCase("lose")]
        [TestCase("refund")]
        public async Task Detail_TicketIsSettled_ShowSelectionStatus(string status)
        {
            using (var controller = CreateController())
            {
                // Arrange
                var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>(x => x.Status, status);

                var selection = new SingleMatchParlayDetail { SelectionType = FakeHelper.Create<int>(), Result = BetStatus.Won };
                var data = new List<SingleMatchParlayDetail> { selection };
                _betListService.GetSingleMatchParlayDetail(metaModel).Returns(Task.FromResult<IList<SingleMatchParlayDetail>>(data));

                var selectionText = FakeHelper.Create<string>();
                _cacheRefAdapter.GetBetBuilderSelectionNames(Arg.Any<int[]>()).Returns(new[] { selectionText });

                // Action
                var result = (List<string>)(await controller.Detail(metaModel)).Data;

                // Assert
                Assert.That(result[0], Is.EqualTo(string.Format(TextRenderTemplate, selectionText, string.Format(StatusTextTemplate, CoreBetList.won))));
            }
        }

        private SingleMatchParlayBetListController CreateController()
        {
            return new SingleMatchParlayBetListController(_cacheRefAdapter, _betListService, _betlistHtmlBuilder);
        }
    }
}
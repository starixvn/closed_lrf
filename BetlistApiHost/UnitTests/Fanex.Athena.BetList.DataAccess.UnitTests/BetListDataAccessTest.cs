namespace Fanex.Athena.BetList.DataAccess.UnitTests
{
    using System.Threading.Tasks;
    using Athena.BetList.DataAccess;
    using Athena.BetList.Model.MetaModel;
    using Common.DataAccess.UnitTests;
    using Model.DTO;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    [TestFixture]
    public partial class BetListDataAccessTest : BaseDataAccessHelperTest<BetListDataAccess>
    {
        private const string GetMixParlayDetailTicketSp = "Lrf_BetList_SelParlayDetail";

        private const string GetBetBuilderDetailTicketSp = "Lrf_BetList_BetBuilder_Detail";

        private readonly BetListMetaModel _metaModel;

        public BetListDataAccessTest()
        {
            _metaModel = FakeHelper.Create<BetListMetaModel>(x => x.ProductCodeList, "SB,NG,BA");
        }

        protected override void SetUpDataAccess()
        {
            DataAccess = Substitute.ForPartsOf<BetListDataAccess>();
        }

        [Test]
        public async Task GetMixParlayDetailTicket_WhenCall_ParametersPassedCorrectly()
        {
            // Arrange
            DataAccess.GetObjectDb(Arg.Is(GetMixParlayDetailTicketSp)).Returns(ObjectDb);
            var metaModel = new MixParlayDetailMetaModel
            {
                TransId = 123,
                CustId = 232,
                UserCurrencyList = UserCurrencyList
            };

            // Action
            await DataAccess.GetMixParlayDetailTicket(metaModel);

            // Assert
            ObjectDb.Received(1).SetParameterValue("TransId", metaModel.TransId);
            ObjectDb.Received(1).SetParameterValue("CustId", metaModel.CustId);
        }

        [Test]
        public async Task GetSingleMatchParlayDetail_WhenCall_ParametersPassedCorrectly()
        {
            // Arrange
            DataAccess.GetObjectDb(Arg.Is(GetBetBuilderDetailTicketSp)).Returns(ObjectDb);
            var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>();

            Reader.Read().Returns(false);

            // Action
            await DataAccess.GetSingleMatchParlayDetail(metaModel).ConfigureAwait(false);

            // Assert
            Assert.Multiple(() =>
            {
                ObjectDb.Received(1).SetParameterValue("TransId", metaModel.TransId);
                ObjectDb.Received(1).SetParameterValue("CustId", metaModel.CustId);
            });
        }

        [Test]
        public async Task GetSingleMatchParlayDetail_WhenCall_ReturnCorrectData()
        {
            // Arrange
            DataAccess.GetObjectDb(Arg.Is(GetBetBuilderDetailTicketSp)).Returns(ObjectDb);
            var metaModel = FakeHelper.Create<SingleMatchParlayDetailMetaModel>();

            Reader.Read().Returns(true, false);

            var expectedResutl = FakeHelper.Create<SingleMatchParlayDetail>();
            MapReaderData(expectedResutl);

            // Action
            var result = await DataAccess.GetSingleMatchParlayDetail(metaModel).ConfigureAwait(false);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result[0].SelectionType, Is.EqualTo(expectedResutl.SelectionType));
                Assert.That(result[0].Result, Is.EqualTo(expectedResutl.Result));
            });
        }
    }
}
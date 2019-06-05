namespace Fanex.Athena.Module.Dashboard.UnitTests.Api
{
    using System.Threading.Tasks;
    using System.Web.Http.Controllers;
    using Fanex.Athena.Module.Dashboard.Api;
    using Fanex.Athena.Module.Dashboard.Data.Interfaces;
    using Fanex.Athena.Module.Dashboard.MetaModel;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    [TestFixture]
    public class TodayDepositControllerTest
    {
        private ISingleValueDataAccess _dataAccess;

        [OneTimeSetUp]
        public void Setup()
        {
            _dataAccess = Substitute.For<ISingleValueDataAccess>();
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            _dataAccess = null;
        }

        [TestCase("CLMV")]
        public async Task GetData_InvalidBaseCurrency_ReturnZero(string baseCurrency)
        {
            // Arrange
            var metaModel = new DashboardBaseModel
            {
                BaseCurrency = baseCurrency
            };

            using (var controller = CreateController())
            {
                // Action
                var result = await controller.GetData(metaModel);

                // Assert
                Assert.That(result, Is.Zero);
            }
        }

        [Test]
        public async Task Index_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var metaModel = new DashboardBaseModel
            {
                BaseCurrency = "EUR"
            };

            var expected = FakeHelper.Create<decimal>();
            _dataAccess.GetTodayDeposit(metaModel).Returns(expected);

            using (var controller = CreateController())
            {
                // Action
                var result = await controller.GetData(metaModel);

                // Assert
                Assert.That(result, Is.EqualTo(expected));
            }
        }

        private TodayDepositController CreateController()
        {
            var mockActionContext = new HttpActionContext
            {
                ControllerContext = new HttpControllerContext(),
                ActionArguments = { { "licenseeid", 1 }, { "userid", 2 }, { "currencyIDList", "1" } }
            };

            return new TodayDepositController(_dataAccess)
            {
                ActionContext = mockActionContext
            };
        }
    }
}
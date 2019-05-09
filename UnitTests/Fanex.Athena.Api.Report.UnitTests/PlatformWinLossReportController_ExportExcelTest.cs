namespace Fanex.Athena.Api.Report.UnitTests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Excel.Base.Entities;
    using Excel.Report;
    using Model.Core.DataDomain;
    using Model.Core.DTO.Common;
    using Model.Core.MetaModel.Product;
    using Model.Report.DTO;
    using Model.Report.ViewModel;
    using NSubstitute;
    using NUnit.Framework;
    using Session.Model;

    public partial class PlatformWinLossReportControllerTest
    {
        [TestCase(true, new[] { Product.BA, Product.NG }, new[] { Product.BA })]
        [TestCase(false, new[] { Product.SB, Product.VS, Product.CS, Product.KN }, new string[] { })]
        [TestCase(false, new string[0], new string[0])]
        public void Index_ExportExcelMemberWithLevel1_PassCorrectParamsToCreateExcel(
            bool hasLicenseeComm,
            string[] productOptions,
            string[] productAccess)
        {
            // Arrange
            StubLicenseeSessionData(new LicenseeSession
            {
                LicenseeId = 1,
                IsAllowedCustomerComm = hasLicenseeComm
            });
            var metalModel = CreateMetaModel(1, true);
            metalModel.ProductOptions = SetUpProductOption(productOptions);

            var data = StubDataAccessGetMemberData();
            StubProductAccess(productAccess, FunctionNames.PlatformWinloss);

            ShowingOption expectedShowingOption = null;
            var excelModel = new PlatformWinLossViewModel
            {
                Param = metalModel,
                MainResult = new PlatformWinLossMember[] { }
            };
            var excel = Substitute.ForPartsOf<PlatformWinLossMemberExcel>(
               Arg.Any<string>(),
               excelModel,
               Arg.Do<ShowingOption>(x => expectedShowingOption = x));
            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcelMember(
                Arg.Any<string>(),
                excelModel,
                Arg.Any<ShowingOption>()).ReturnsForAnyArgs(excel);

            var expectedColSpan = GetExpectedColSpan(productAccess);

            // Action
            _controller.Index(metalModel);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.IsTrue(expectedShowingOption.CustomerCommVisible == hasLicenseeComm);
                VerifyShowingOption(metalModel.ProductOptions, expectedShowingOption);
                _controller.Received().CreateExcelMember(Arg.Any<string>(), Arg.Is<PlatformWinLossViewModel>(p => p.Colspan == expectedColSpan), Arg.Any<ShowingOption>());
            });
        }

        [TestCase(null, false)]
        [TestCase("InvalidProperty", false)]
        [TestCase(nameof(PlatformWinLossMember.AmtDueToBA), true)]
        public void Index_ExportExcelMember_SortByNull_DataIsNotSorted(string sortBy, bool toBeSorted)
        {
            // Arrange
            var products = new[] { Product.SB };
            var metalModel = CreateMetaModel(1, true);
            metalModel.ProductOptions = SetUpProductOption(products);
            metalModel.SortBy = sortBy;
            metalModel.SortOrder = "asc";

            var dataList = StubDataAccessGetMemberData();
            if (toBeSorted)
            {
                dataList.Sort(sortBy, true, nameof(PlatformWinLossMember.Index), true);
            }

            var expectedSortedData = dataList.Select(x => x.Index).ToArray();

            StubProductAccess(products, FunctionNames.PlatformWinloss);

            var excelModel = new PlatformWinLossViewModel
            {
                Param = metalModel,
                MainResult = new PlatformWinLossMember[] { }
            };
            var excel = Substitute.ForPartsOf<PlatformWinLossMemberExcel>(
               Arg.Any<string>(),
               excelModel,
               Arg.Any<ShowingOption>());
            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcelMember(
                Arg.Any<string>(),
                excelModel,
                Arg.Any<ShowingOption>()).ReturnsForAnyArgs(excel);

            var actualExcelModel = new PlatformWinLossViewModel();
            _controller.When(x => x.CreateExcelMember(
               Arg.Any<string>(),
               Arg.Any<PlatformWinLossViewModel>(),
               Arg.Any<ShowingOption>())).Do(p => actualExcelModel = (PlatformWinLossViewModel)p[1]);

            // Action
            _controller.Index(metalModel);

            // Assert
            Assert.That(actualExcelModel.MainResult.Select(x => x.Index).ToArray(), Is.EqualTo(expectedSortedData));
        }

        [Test]
        public void Index_ExportExcelSummaryWithLevel0_PassCorrectParamsToCreateExcel()
        {
            // Arrange
            var metalModel = CreateMetaModel(0, true);
            SetUpDataAccessGetSummaryData();

            var excel = Substitute.ForPartsOf<PlatformWinLossSummaryExcel>();

            excel.When(x => x.Export()).DoNotCallBase();

            _controller.CreateExcelSummary(
                Arg.Any<string>(),
                metalModel,
                Arg.Any<IList<PlatformWinLossSummary>>(),
                Arg.Any<PlatformWinLossSummary>())
                .ReturnsForAnyArgs(excel);

            // Action
            _controller.Index(metalModel);

            // Assert
            Assert.Multiple(() =>
            {
                _controller.Received().CreateExcelSummary(
                    Arg.Any<string>(),
                    metalModel,
                    Arg.Is<IList<PlatformWinLossSummary>>(x => x.Count == 2),
                    Arg.Is<PlatformWinLossSummary>(x => x.CustomerComm == ExpectedCustomerComm));
                Assert.That(metalModel.AgentListXml, Is.EqualTo(AgentListXml));
            });
        }

        private static IList<ProductOption> SetUpProductOption(string[] productCodes)
        {
            var productOptions = new List<string>
            {
                Product.BA,
                Product.NG,
                Product.SB,
                Product.VS,
                Product.CS,
                Product.KN
            };

            return productOptions.Select(p => new ProductOption { Code = p, Status = productCodes.Contains(p) }).ToList();
        }

        private static void VerifyShowingOption(IEnumerable<ProductOption> productOptions, ShowingOption expetedShowingOption)
        {
            Assert.Multiple(() =>
            {
                Assert.IsTrue(expetedShowingOption.SBVisible == productOptions.Any(i => i.Code == Product.SB && i.Status));
                Assert.IsTrue(expetedShowingOption.BAVisible == productOptions.Any(i => i.Code == Product.BA && i.Status));
                Assert.IsTrue(expetedShowingOption.BTVisible == productOptions.Any(i => i.Code == Product.BT && i.Status));
                Assert.IsTrue(expetedShowingOption.CSVisible == productOptions.Any(i => i.Code == Product.CS && i.Status));
                Assert.IsTrue(expetedShowingOption.KNVisible == productOptions.Any(i => i.Code == Product.KN && i.Status));
                Assert.IsTrue(expetedShowingOption.NGVisible == productOptions.Any(i => i.Code == Product.NG && i.Status));
                Assert.IsTrue(expetedShowingOption.VSVisible == productOptions.Any(i => i.Code == Product.VS && i.Status));
            });
        }

        private static int GetExpectedColSpan(string[] productAccess)
        {
            var expectedColSpan = 7;

            if (productAccess.Contains(Product.BA))
            {
                expectedColSpan += 2;
            }

            return expectedColSpan;
        }
    }
}
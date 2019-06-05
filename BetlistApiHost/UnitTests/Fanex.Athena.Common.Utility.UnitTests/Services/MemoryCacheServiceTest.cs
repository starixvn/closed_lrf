namespace Fanex.Athena.Common.Utility.UnitTests.Helpers
{
    using System;
    using Fanex.Athena.Common.Utility.Services;
    using Fanex.Athena.Common.Utility.Services.Internal;
    using NSubstitute;
    using NUnit.Framework;
    using UnitTest.Common.Helpers;

    [TestFixture]
    public class MemoryCacheServiceTest
    {
        private const string REGIONNAME = "LAP_BETLIST_MAIN_MEMORY";

        private ICustomMemoryCache _cache;

        private MemoryCacheService _memoryCacheService;

        [SetUp]
        public void SetUp()
        {
            _cache = Substitute.For<ICustomMemoryCache>();

            _memoryCacheService = new MemoryCacheService(_cache);
        }

        [TearDown]
        public void TearDown()
        {
            _cache = null;
            _memoryCacheService = null;
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Contains_WhenCall_ReturnFromCacheMethod(bool expectedResult)
        {
            // Arrange
            const string Key = "abc";
            _cache.Contains(Key, REGIONNAME).Returns(expectedResult);

            // Action
            var result = _memoryCacheService.Contains(Key);

            // Assert
            Assert.Multiple(() =>
            {
                Assert.That(result, Is.EqualTo(result));
                _cache.Received(1).Contains(Key, REGIONNAME);
            });
        }

        [Test]
        public void Get_NotContains_ReturnDefaultValue()
        {
            // Arrange
            const string Key = "abcd";
            _cache.Contains(Key, REGIONNAME).Returns(false);

            // Action
            var result = _memoryCacheService.Get<object>(Key);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public void Get_Contains_ReturnData()
        {
            // Arrange
            const string Key = "abcde";
            var expectedData = new { Abc = 123 };
            _cache.Contains(Key, REGIONNAME).Returns(true);
            _cache.Get(Key, REGIONNAME).Returns(expectedData);

            // Action
            var result = _memoryCacheService.Get<object>(Key);

            // Assert
            Assert.That(ObjectHelper.ToJson(result), Is.EqualTo(ObjectHelper.ToJson(expectedData)));
        }

        [Test]
        public void Get_WithActionParam_NotContains_ReturnDataFromAction()
        {
            // Arrange
            const string Key = "abcde";
            var expectedData = new { Abc = 123456 };
            _cache.Contains(Key, REGIONNAME).Returns(false);
            Func<object> action = () => expectedData;

            // Action
            var result = _memoryCacheService.Get<object>(Key, action);

            // Assert
            Assert.Multiple(() =>
            {
                _cache.Received(1).Set(Key, Arg.Any<object>(), Arg.Any<DateTimeOffset>(), REGIONNAME);
                Assert.That(ObjectHelper.ToJson(result), Is.EqualTo(ObjectHelper.ToJson(expectedData)));
            });
        }

        [Test]
        public void Set_KeyIsEmpty_ThrowError()
        {
            // Action
            TestDelegate testDelegate = () => _memoryCacheService.Set(string.Empty, new object());

            // Assert
            Assert.Throws<ArgumentNullException>(testDelegate);
        }

        [Test]
        public void Clear_WhenCall_CallCacheClear()
        {
            // Action
            _memoryCacheService.Clear();

            // Assert
            _cache.Received(1).Clear(REGIONNAME);
        }
    }
}
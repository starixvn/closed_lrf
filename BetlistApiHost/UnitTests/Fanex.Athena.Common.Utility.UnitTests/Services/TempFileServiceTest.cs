namespace Fanex.Athena.Common.Utility.UnitTests.Helpers
{
    using Fanex.Athena.Common.Utility.Services;
    using Fanex.Athena.Common.Utility.Services.Interfaces;
    using Fanex.Athena.Common.Utility.Services.Internal;
    using NSubstitute;
    using NUnit.Framework;

    [TestFixture]
    public class TempFileServiceTest
    {
        private const string TempFilePath = "X:/Temp/";

        private const string FilePath = "BTC/abc.json";

        private IAppSettings _appSettings;

        private IFileSystem _fileSystem;

        private ITempFileService _tempFileService;

        [SetUp]
        public void SetUp()
        {
            _appSettings = Substitute.For<IAppSettings>();
            _fileSystem = Substitute.For<IFileSystem>();

            _appSettings.TempFilePath.Returns(TempFilePath);

            _tempFileService = new TempFileService(_appSettings, _fileSystem);
        }

        [Test]
        public void Delete_WhenCall_CallFileSystemDelete()
        {
            // Action
            _tempFileService.Delete(FilePath);

            // Assert
            _fileSystem.Received(1).Delete(TempFilePath + FilePath);
        }

        [Test]
        public void ReadString_WhenCall_ReturnDataFromFileSystem()
        {
            // Arrange
            const string ExpectedContent = "sdflsdlfksldf";
            _fileSystem.ReadString(TempFilePath + FilePath).Returns(ExpectedContent);

            // Action
            var content = _tempFileService.ReadString(FilePath);

            // Assert
            Assert.That(content, Is.EqualTo(ExpectedContent));
        }

        [Test]
        public void Save_WhenCall_CallFileSystemSave()
        {
            // Arrange
            const string Content = "sdflsdlfksldf";

            // Action
            _tempFileService.Save(FilePath, Content);

            // Assert
            _fileSystem.Received(1).Save(TempFilePath + FilePath, Content);
        }

        [Test]
        public void ReadAllBytes_WhenCall_CallFileSystemReadAllBytes()
        {
            // Arrange
            var expectedContent = new byte[] { 0x20, 0x21 };

            _fileSystem.ReadAllBytes(TempFilePath + FilePath).Returns(expectedContent);

            // Action
            _tempFileService.ReadBytes(FilePath);

            // Assert
            _fileSystem.Received(1).ReadAllBytes(TempFilePath + FilePath);
        }
    }
}
namespace Fanex.Athena.Service.Core.Utility
{
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web;
    using Fanex.Athena.Extension.Utility;
    using Fanex.Athena.Service.Core.Exception;
    using Fanex.Athena.Service.Core.Utility.Interfaces;
    using Fanex.Athena.Session.Interfaces;
    using Newtonsoft.Json;

    public class BetListApiClient : IBetListApiClient
    {
        private const string KEYNAME = "BETLIST_TOKEN_KEY";

        private const string LANGUAGEKEY = "Language";

        private readonly IAppSettings _appSetting;

        public BetListApiClient(IAppSettings appSettings)
        {
            _appSetting = appSettings;
        }

        private async Task<T> Handle<T>(string path, object value, string language, Func<HttpResponseMessage, Task<T>> codeBlock)
        {
            using (var source = new CancellationTokenSource())
            {
                using (var client = new HttpClient())
                {
                    try
                    {
                        client.Timeout = TimeSpan.FromMinutes(_appSetting.BetListApiClientTimeOutMinutes);
                        client.DefaultRequestHeaders.Add(KEYNAME, _appSetting.GetValue("BetListApiTokenValue"));
                        client.DefaultRequestHeaders.Add(LANGUAGEKEY, language);
                        var url = new Uri(_appSetting.BetListApiHostUrl + path);
                        var stringContent = new StringContent(JsonConvert.SerializeObject(value), Encoding.UTF8, "application/json");
                        var response = await client.PostAsync(url, stringContent, source.Token).ConfigureAwait(false);
                        response.EnsureSuccessStatusCode();
                        return await codeBlock(response);
                    }
                    catch (Exception ex)
                    {
                        var message = new StringBuilder($"Error when calling LAP.BETLIST API - Path = { path }");
                        if (ex is TaskCanceledException)
                        {
                            var temp = ex as TaskCanceledException;
                            message.Append($"\n IsCancellationRequested={temp.CancellationToken.IsCancellationRequested}");
                            if (!temp.CancellationToken.IsCancellationRequested)
                            {
                                message.Append("\n Request timed out");
                            }
                        }

                        message.Append($"\n ErrMsg={ex.Message}");
                        message.Append($"\n InnerExceptionMsg={ex.InnerException?.Message}");
                        throw new ServiceException(message.ToString(), "BetListApiClient");
                    }
                }
            }
        }

        public Task<HttpResponseMessage> PostAsync(string path, object value, string language)
        {
            return Handle(path, value, language, x => Task.FromResult(x));
        }

        public Task<T> PostAsync<T>(string path, object value, string language)
        {
            return Handle<T>(
                path,
                value,
                language,
                 async (x) =>
             {
                 var data = await x.Content.ReadAsStringAsync();
                 return JsonConvert.DeserializeObject<T>(data);
             });
        }

        public Task<Stream> PostAsyncStream(string path, object value, string language)
        {
            return Handle(path, value, language, async (x) => await x.Content.ReadAsStreamAsync());
        }

        public Task<string> PostAsyncString(string path, object value, string language)
        {
            return Handle(path, value, language, async (x) => await x.Content.ReadAsStringAsync());
        }
    }
}
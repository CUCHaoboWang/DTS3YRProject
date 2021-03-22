using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace DTS3YRProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private readonly string serverUrl;
        private readonly string serverSecret;

        public SessionController(ILogger<SessionController> logger, IConfiguration config)
        {
            _logger = logger;
            serverUrl = config.GetValue<string>("ServerUrl");
            serverSecret = config.GetValue<string>("ServerSecret");
        }

        [HttpPost]
        public async Task<string> Post(string sessionId)
        {
            var responseSessionId = await CreateSession(sessionId, serverUrl, serverSecret);
            var responseToken =await CreateToken(responseSessionId, serverUrl, serverSecret);

            return responseToken;
        }

        private async Task<string> CreateSession(string sessionId, string serverUrl, string serverSecret)
        {
            var url = serverUrl + "/openvidu/api/sessions";
            var body = JsonConvert.SerializeObject( new { customSessionId = sessionId });
            var data = new StringContent(body, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                var authToken = Encoding.ASCII.GetBytes($"OPENVIDUAPP:{serverSecret}");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                        Convert.ToBase64String(authToken));

                var response = await client.PostAsync(url, data);
                var result = response.Content.ReadAsStringAsync().Result;

                return result;
            }
        }

        private async Task<string> CreateToken(string sessionId, string serverUrl, string serverSecret)
        {
            var url = serverUrl + "/openvidu/api/sessions/" + sessionId + "/connection";
            var body = JsonConvert.SerializeObject(new { customSessionId = sessionId });
            var data = new StringContent(body, Encoding.UTF8, "application/json");
            using (var client = new HttpClient())
            {
                var authToken = Encoding.ASCII.GetBytes($"OPENVIDUAPP:{serverSecret}");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                        Convert.ToBase64String(authToken));

                var response = await client.PostAsync(url, data);
                var result = response.Content.ReadAsStringAsync().Result;

                return result;
            }
        }
    }
}

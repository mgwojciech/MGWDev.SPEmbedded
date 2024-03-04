using MGWDev.SPEmbedded.Model;
using MGWDev.SPEmbedded.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MGWDev.SPEmbedded.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TokenBrokerController : ControllerBase
    {
        protected AccessTokenUtilities TokenHelper { get; set; }

        public TokenBrokerController(AccessTokenUtilities tokenAcquisitionService)
        {
            TokenHelper = tokenAcquisitionService;
        }

        [HttpGet]
        public TokenBrokerResponse GetOBOToken([FromQuery] string resource)
        {
            string bearerToken = "";
            string authorizationHeader = Request.Headers.Authorization.FirstOrDefault();
            if (authorizationHeader is not null)
            {
                bearerToken = authorizationHeader.Replace("Bearer ", "");
            }

            string token = TokenHelper.GetAccessToken(resource, bearerToken);
            return new TokenBrokerResponse()
            {
                AccessToken = token
            };
        }
    }
}

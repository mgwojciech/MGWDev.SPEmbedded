using System.Text.Json.Serialization;

namespace MGWDev.SPEmbedded.Model
{
    public class TokenBrokerResponse
    {
        [JsonPropertyName("accessToken")] public string AccessToken { get; set; }
    }
}

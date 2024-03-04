using System.Security;

namespace MGWDev.SPEmbedded.Utilities
{
    public class StringUtilities
    {
        public static SecureString CovertToSecureString(string value)
        {
            string secret = value;
            SecureString secure = new SecureString();
            foreach (char c in secret)
            {
                secure.AppendChar(c);
            }
            return secure;
        }
    }
}
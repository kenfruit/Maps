// -----------------------------------------------------------------------------
//  <autogeneratedinfo>
//      This code was generated by:
//        SR Resource Generator custom tool for VS.NET, by Brian Scott
//      Runtime version: 2.0.50727.312
// 
//      It contains classes defined from the contents of the resource file:
//        G:\Current\Cropper\src\Cropper.Core\Resources\SR.resx
// 
//      Generated: Saturday, June 30, 2007 11:20 AM
//  </autogeneratedinfo>
// -----------------------------------------------------------------------------
namespace Fusion8.Cropper.Core
{
    using System;
    
    
    internal class SR
    {
        
        public static string ConfigurationPath
        {
            get
            {
                return Keys.GetString(Keys.ConfigurationPath);
            }
        }
        
        public static string ExceptionConfigObjectNull
        {
            get
            {
                return Keys.GetString(Keys.ExceptionConfigObjectNull);
            }
        }
        
        public static string ExceptionConfigPathNull
        {
            get
            {
                return Keys.GetString(Keys.ExceptionConfigPathNull);
            }
        }
        
        public static string ExceptionImageFormatNull
        {
            get
            {
                return Keys.GetString(Keys.ExceptionImageFormatNull);
            }
        }
        
        public static string ExeptionThumbnailSizeOutOfRange
        {
            get
            {
                return Keys.GetString(Keys.ExeptionThumbnailSizeOutOfRange);
            }
        }
        
        public static string MessageInvalidTemplateCharacters
        {
            get
            {
                return Keys.GetString(Keys.MessageInvalidTemplateCharacters);
            }
        }
        
        private class Keys
        {
            
            static System.Resources.ResourceManager resourceManager = new System.Resources.ResourceManager("Fusion8.Cropper.Core.Resources.SR", typeof(SR).Assembly);
            
            public const string ConfigurationPath = "ConfigurationPath";
            
            public const string ExceptionConfigObjectNull = "ExceptionConfigObjectNull";
            
            public const string ExceptionConfigPathNull = "ExceptionConfigPathNull";
            
            public const string ExceptionImageFormatNull = "ExceptionImageFormatNull";
            
            public const string ExeptionThumbnailSizeOutOfRange = "ExeptionThumbnailSizeOutOfRange";
            
            public const string MessageInvalidTemplateCharacters = "MessageInvalidTemplateCharacters";
            
            public static string GetString(string key)
            {
                return resourceManager.GetString(key, Resources.CultureInfo);
            }
            
            public static string GetString(string key, object[] args)
            {
                string msg = resourceManager.GetString(key, Resources.CultureInfo);
                msg = string.Format(msg, args);
                return msg;
            }
        }
    }
}

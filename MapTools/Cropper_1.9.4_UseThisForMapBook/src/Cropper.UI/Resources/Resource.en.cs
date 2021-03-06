using System.Globalization;
using System.Reflection;
using System.Resources;
//------------------------------------------------------------------------------
// <autogenerated>
//     This code was generated by a tool.
//     Runtime Version: 1.1.4322.573
//
//     Changes to this file may cause incorrect behavior and will be lost if 
//     the code is regenerated.
// </autogenerated>
//------------------------------------------------------------------------------

namespace Fusion8.Cropper.Resources
{
	/// <summary>
	/// Provides access to an assembly's string resources
	/// </summary>
	internal class ResourceFormatter
	{
		private static ResourceManager _resourceManager;

		private ResourceFormatter()
		{}

		/// <summary>
		/// ResourceManager property with lazy initialization
		/// </summary>
		/// <value>An instance of the ResourceManager class.</value>
		private static ResourceManager ResourceManager
		{
			get
			{
				if ((_resourceManager == null))
				{
					_resourceManager = new ResourceManager("Fusion8.Cropper.Resources.Resource", Assembly.GetExecutingAssembly());
				}
				return _resourceManager;
			}
		}

		/// <summary>
		/// Loads an unformatted string
		/// </summary>
		/// <param name="resourceId">Identifier of string resource</param>
		/// <returns>string</returns>
		public static string GetString(string resourceId)
		{
			return ResourceManager.GetString(resourceId);
		}

		/// <summary>
		/// Loads a formatted string
		/// </summary>
		/// <param name="resourceId">Identifier of string resource</param>
		/// <param name="args">Array of objects to be passed to string.Format</param>
		/// <returns>string</returns>
		public static string GetString(string resourceId, object[] args)
		{
			string format = ResourceManager.GetString(resourceId);
			return string.Format(CultureInfo.CurrentCulture, format, args);
		}
	}

	/// <summary>
	/// Access to resource identifier ExCenterSizeOutOfRange
	/// </summary>
	internal class ExCenterSizeOutOfRange
	{
		private ExCenterSizeOutOfRange()
		{}

		public static string GetString()
		{
			return ResourceFormatter.GetString("ExCenterSizeOutOfRange");
		}
	}

	/// <summary>
	/// Access to resource identifier MsgAbout
	/// </summary>
	internal class MsgAbout
	{
		private MsgAbout()
		{}

		public static string GetString()
		{
			return ResourceFormatter.GetString("MsgAbout");
		}
	}

	/// <summary>
	/// Access to resource identifier MsgHelp
	/// </summary>
	internal class MsgHelp
	{
		private MsgHelp()
		{}

		public static string GetString()
		{
			return ResourceFormatter.GetString("MsgHelp");
		}
	}

	/// <summary>
	/// Access to resource identifier MsgUnhandled
	/// </summary>
	internal class MsgUnhandled
	{
		private MsgUnhandled()
		{}

		public static string GetString()
		{
			return ResourceFormatter.GetString("MsgUnhandled");
		}
	}

	/// <summary>
	/// Access to resource identifier MsgUnhandledCaption
	/// </summary>
	internal class MsgUnhandledCaption
	{
		private MsgUnhandledCaption()
		{}

		public static string GetString()
		{
			return ResourceFormatter.GetString("MsgUnhandledCaption");
		}
	}
}
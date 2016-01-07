using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using HtmlAgilityPack;



namespace YelpScanner2
{
	public partial class Form1 : Form
	{
		public Form1()
		{
			InitializeComponent();
		}

		private void btnGetHours_Click(object sender, EventArgs e)
		{
			string text = string.Empty;
			string name = tbInput.Text;

			name = name.Replace(" ", "-");

			string url = "http://www.yelp.com/biz/" + name + "-new-york";

			text += url + "\t";
            HtmlAgilityPack.HtmlDocument doc = null;
            try
			{
			    var Webget = new HtmlWeb();
			    doc = Webget.Load(url);
			}
			catch(Exception except)
			{
                text += except.Message;
                tbOutput.Text = text;

                return;
			}			
			string title = doc.DocumentNode.SelectNodes("//title")[0].InnerText;

			if (title.Contains("404") ||
				title.Contains("- CLOSED"))
			{
				text += title + "\r\n";
			}
			else
			{
				try
				{
					bool servesBreakfast = false;
					var hourTable = doc.DocumentNode.SelectNodes("//table[@class='table table-simple hours-table']//tr");
					//fs.Write(new UTF8Encoding(true).GetBytes(text), 0, text.Length);


					if (hourTable == null)
					{
						text += "No hours listed in Yelp";
					}
					else
					{
						//			foreach (HtmlNode node in doc.DocumentNode.SelectNodes("//table[@class='biz-hours']"))
						foreach (HtmlNode node in doc.DocumentNode.SelectNodes("//table[@class='table table-simple hours-table']//tr"))

						{
							foreach (HtmlNode node3 in node.SelectNodes("th"))
							{
								text += node3.InnerText;
								text += " ";
								//								dayCount++;
							}

							bool isFirst = true;
							if (0 < node.InnerText.IndexOf("Closed") &&
								!(0 < node.InnerText.IndexOf("Closed now")))
							{
								text += "Closed" + "&lt;br/&gt;";
								continue;
							}
							
							int segmentCount = 1;
							foreach (HtmlNode node4 in node.SelectNodes(".//span"))
							{
								if (0 == segmentCount % 2)
								{
									text += "- ";
								}
								string innerText = node4.InnerText;
								int testInt;
								bool isNumeric = int.TryParse(innerText.Substring(0, 1), out testInt);
								if (!isNumeric)
								{
									break;
								}
								if (innerText.Contains("am") && isFirst)
								{
									if (int.TryParse(innerText.Substring(0, 1), out testInt) &&
										 1 < testInt)
									{
										servesBreakfast = true;
									}
								}
								text += innerText + " ";
								isFirst = false;
								segmentCount++;
							}

							text += "&lt;br/&gt;";

						}
						if (servesBreakfast)
						{
							text += "\tBREAKFAST";
						}
					}
				}
				catch (Exception ex)
				{
					string s = ex.Message;

				}
			}
			text += "\r\n";
			tbOutput.Text = text;

		}

		private void btnBrooklyn_Click(object sender, EventArgs e)
		{
			string text = string.Empty;
			string name = tbInput.Text;

			name = name.Replace(" ", "-");

			string url = "http://www.yelp.com/biz/" + name + "-brooklyn";

			text += url + "\t";
            HtmlAgilityPack.HtmlDocument doc = null;
            try
			{
			    var Webget = new HtmlWeb();
			    doc = Webget.Load(url);
			}
            catch (Exception except)
            {
                text += except.Message;
                tbOutput.Text = text;

                return;
            }

            string title = doc.DocumentNode.SelectNodes("//title")[0].InnerText;

			if (title.Contains("404") ||
				title.Contains("- CLOSED"))
			{
				text += title + "\r\n";
			}
			else
			{
				try
				{
					bool servesBreakfast = false;
					var hourTable = doc.DocumentNode.SelectNodes("//table[@class='table table-simple hours-table']//tr");
					//fs.Write(new UTF8Encoding(true).GetBytes(text), 0, text.Length);


					if (hourTable == null)
					{
						text += "No hours listed in Yelp";
					}
					else
					{
						//			foreach (HtmlNode node in doc.DocumentNode.SelectNodes("//table[@class='biz-hours']"))
						foreach (HtmlNode node in doc.DocumentNode.SelectNodes("//table[@class='table table-simple hours-table']//tr"))

						{
							foreach (HtmlNode node3 in node.SelectNodes("th"))
							{
								text += node3.InnerText;
								text += " ";
								//								dayCount++;
							}

							bool isFirst = true;
							if (0 < node.InnerText.IndexOf("Closed") &&
								!(0 < node.InnerText.IndexOf("Closed now")))
							{
								text += "Closed" + "&lt;br/&gt;";
								continue;
							}
							
							int segmentCount = 1;
							foreach (HtmlNode node4 in node.SelectNodes(".//span"))
							{
								if (0 == segmentCount % 2)
								{
									text += "- ";
								}
								string innerText = node4.InnerText;
								int testInt;
								bool isNumeric = int.TryParse(innerText.Substring(0, 1), out testInt);
								if (!isNumeric)
								{
									break;
								}
								if (innerText.Contains("am") && isFirst)
								{
									if (int.TryParse(innerText.Substring(0, 1), out testInt) &&
										 1 < testInt)
									{
										servesBreakfast = true;
									}
								}
								text += innerText + " ";
								isFirst = false;
								segmentCount++;
							}

							text += "&lt;br/&gt;";

						}
						if (servesBreakfast)
						{
							text += "\tBREAKFAST";
						}
					}
				}
				catch (Exception ex)
				{
					string s = ex.Message;

				}
			}
			text += "\r\n";
			tbOutput.Text = text;

		}
	}
}

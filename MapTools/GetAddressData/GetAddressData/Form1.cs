using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net;
using Newtonsoft.Json;
using HtmlAgilityPack;

namespace GetAddressData
{
    public partial class Form1 : Form
    {
        static public List<Station> stationList = new List<Station>();
        public Form1()
        {
            InitializeComponent();
            BuildStationList();
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            txtOutput.Clear();
            txtOutput.Multiline = true;


            // Create a request for the URL.   
            string name = txtInput.Text;

            string XMLName = NameToXMLFormat(name);

            string sortName = NameToSortNameFormat(name);


            string name2 = name + " " + listBoxBoroughs.Text;
            name2 = name2.Replace(",", "");
            name2 = name2.Replace(" ", "+");
            string name3 = name.Replace("'", "");

            WebRequest request = WebRequest.Create(
              "http://maps.googleapis.com/maps/api/geocode/json?address=" + name2 + "&sensor=false");

            WebResponse response = request.GetResponse();
            // Display the status.  
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            //txtOutput.Text = responseFromServer;


            // For more details about this step, look at the comments in jsonParser.cs
            RootObject r = JsonConvert.DeserializeObject<RootObject>(responseFromServer);

            foreach (Result rslt in r.results)
            {
                // This code will list out all the pieces of the returned json

                //foreach (AddressComponent ac in rslt.address_components)
                //{
                //    //txtOutput.Text += "Long: " + ac.long_name + "  Short: " + ac.short_name + " Types: ";
                //    txtOutput.AppendText("Long: " + ac.long_name + "  Short: " + ac.short_name + " Types: ");

                //    foreach (string t in ac.types)
                //    {
                //        txtOutput.AppendText(t + " ");
                //    }
                //    txtOutput.AppendText(Environment.NewLine);
                //}

                string lat = rslt.geometry.location.lat.ToString();
                string lon = rslt.geometry.location.lng.ToString();

                //txtOutput.AppendText("Lat/Lon: " + lat + "," + lon);
                //txtOutput.AppendText(Environment.NewLine);
                //txtOutput.AppendText(Environment.NewLine);

                /////////////////////////////////////////////
                string number = string.Empty;
                string street = string.Empty;
                string city = string.Empty;
                string latlon = string.Empty;

                foreach (AddressComponent ac in rslt.address_components)
                {
                    //txtOutput.Text += "Long: " + ac.long_name + "  Short: " + ac.short_name + " Types: ";
                    //txtOutput.AppendText("Long: " + ac.long_name + "  Short: " + ac.short_name + " Types: ");
                    switch(ac.types[0])
                    {
                        case "street_number":
                            number = ac.long_name;
                            break;

                        case "route":
                            street = ac.short_name;
                            break;

                        case "locality":
                            goto case "political";

                        case "political":
                            city = ac.long_name;
                            if (city == "Manhattan")
                            {
                                city = "new york";
                            }
                            break;
                    }

                }


                latlon  = rslt.geometry.location.lat.ToString() + "," + rslt.geometry.location.lng.ToString();

                string tabbedString = name + "\t" + XMLName + "\t" + sortName + "\t" + number + " " + street + " " + "\t" + city + "\t" + latlon;



                string yelpString = GetYelpData(name3, city);

                tabbedString += "\t" + yelpString;

                string subwayString = GetSubwayString(rslt.geometry.location.lat, rslt.geometry.location.lng);

                tabbedString += "\t" + subwayString;


                //txtOutput.AppendText(Environment.NewLine);
                txtOutput.AppendText(tabbedString);
                //txtOutput.AppendText(Environment.NewLine);
                //txtOutput.AppendText(Environment.NewLine);




            }

            // Clean up the streams and the response.  
            reader.Close();
            response.Close();
        }

        private string GetSubwayString(double latitude, double longitude)
        {
            string subwayStationString = string.Empty;

            //dumpString += p.m_name + "\t";
            //subwayStationString += latitude.ToString() + "," + longitude.ToString() + "\t";


            IEnumerable<Station> filteredStations = stationList.Where(s => ((Math.Abs(s.m_Latitude - latitude) < .002) &&
                                                                        (Math.Abs(s.m_Longitude - longitude) < .002)));
            if (filteredStations.Count() < 2)
            {
                filteredStations = stationList.Where(s => ((Math.Abs(s.m_Latitude - latitude) < .003) &&
                                                      (Math.Abs(s.m_Longitude - longitude) < .003)));
            }
            if (filteredStations.Count() < 2)
            {
                filteredStations = stationList.Where(s => ((Math.Abs(s.m_Latitude - latitude) < .004) &&
                                                      (Math.Abs(s.m_Longitude - longitude) < .004)));
            }
            if (0 == filteredStations.Count())
            {
                filteredStations = stationList.Where(s => ((Math.Abs(s.m_Latitude - latitude) < .005) &&
                                                      (Math.Abs(s.m_Longitude - longitude) < .005)));
            }
            if (0 == filteredStations.Count())
            {
                filteredStations = stationList.Where(s => ((Math.Abs(s.m_Latitude - latitude) < .006) &&
                                                      (Math.Abs(s.m_Longitude - longitude) < .006)));
            }


            bool isFirst = true;
            foreach (Station sta in filteredStations)
            {
                if (!isFirst)
                {
                    //txtOutput.Text += "|";
                    subwayStationString += "|";

                }
                isFirst = false;
                for (int i = 0; i < 13; i++)
                {
                    if (0 < sta.m_Line[i].Length)
                    {
                        //txtOutput.Text += sta.m_Line[i];
                        subwayStationString += sta.m_Line[i];
                    }
                }
                //txtOutput.Text += "-" + sta.m_Name;
                subwayStationString += "-" + sta.m_Name;
            }
            //txtOutput.Text += "\r\n";
            //Trace.WriteLine(dumpString);
            //dumpString = string.Empty;

            return subwayStationString;



        }

        private string GetYelpData(string name,  string city)
        {
            string returnString = string.Empty;

            string text = string.Empty;

            name = name.Replace(" ", "-");
            city = city.Replace(" ", "-");

            string url = "http://www.yelp.com/biz/" + name + "-" + city;

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
                returnString = text;

                return returnString;
            }
            string title = doc.DocumentNode.SelectNodes("//title")[0].InnerText;

            if (title.Contains("404") ||
                title.Contains("- CLOSED"))
            {
                text += title + "\t";
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
            //text += "\r\n";
            returnString = text;

            return returnString;
        }

        static void BuildStationList()
        {
            int StationID = 1;
            stationList.Add(new Station(StationID++, "25th St", 40.660397, -73.998091, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "36th St", 40.655144, -74.003549, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "45th St", 40.648939, -74.010006, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "53rd St", 40.645069, -74.014034, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "59th St", 40.641362, -74.017881, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "77th St", 40.629742, -74.02551, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "86th St", 40.622687, -74.028398, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "95th St", 40.616622, -74.030876, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "9th St", 40.670847, -73.988302, "F", "G", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Atlantic Av-Barclays Ctr", 40.683666, -73.97881, "2", "3", "4", "5", "B", "Q", "D", "N", "R", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bay Ridge Av", 40.634967, -74.023377, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "DeKalb Av", 40.690635, -73.981824, "B", "Q", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Pacific St", 40.683666, -73.97881, "2", "3", "4", "5", "B", "Q", "D", "N", "R", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Prospect Av", 40.665414, -73.992872, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Union St", 40.677316, -73.98311, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "30 Av-Grand Av", 40.766779, -73.921479, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "36 Av-Washington Av", 40.756804, -73.929575, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "39 Av-Beebe Av", 40.752882, -73.932755, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Astoria Blvd-Hoyt Av", 40.770258, -73.917843, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway", 40.76182, -73.925508, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Ditmars Blvd", 40.775036, -73.912034, "N", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "7th Av", 40.67705, -73.972367, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Atlantic Av", 40.68446, -73.97689, "B", "Q", "D", "N", "R", "2", "3", "4", "5", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av H", 40.62927, -73.961639, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av J", 40.625039, -73.960803, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av M", 40.617618, -73.959399, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av U", 40.5993, -73.955929, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beverly Rd", 40.644031, -73.964492, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Brighton Beach", 40.577621, -73.961376, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Church Av", 40.650527, -73.962982, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cortelyou Rd", 40.640927, -73.963891, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kings Highway", 40.60867, -73.957734, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Neck Rd", 40.595246, -73.955161, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Newkirk Av", 40.635082, -73.962793, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Ocean Parkway", 40.576312, -73.968501, "Q", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Parkside Av", 40.655292, -73.961495, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Prospect Park", 40.661614, -73.962246, "B", "Q", "FS", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sheepshead Bay", 40.586896, -73.954155, "B", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Stillwell Av", 40.577422, -73.981233, "D", "F", "N", "Q", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "West 8th St", 40.576127, -73.975939, "F", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St", 40.741303, -73.989344, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "28th St", 40.745494, -73.988691, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "34th St", 40.749567, -73.98795, "B", "D", "F", "M", "N", "Q", "R", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "49th St", 40.759901, -73.984139, "N", "Q", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "57th St", 40.764664, -73.980658, "N", "Q", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "5th Av", 40.764811, -73.973347, "N", "Q", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "8th St", 40.730328, -73.992629, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Canal St (UL)", 40.719527, -74.001775, "6", "N", "Q", "R", "J", "Z", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "City Hall", 40.713282, -74.006978, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cortlandt St", 40.710668, -74.011029, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Court St", 40.6941, -73.991777, "R", "2", "3", "4", "5", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lawrence St", 40.69218, -73.985942, "A", "C", "F", "R", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lexington Av", 40.76266, -73.967258, "4", "5", "6", "N", "Q", "R", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Prince St", 40.724329, -73.997702, "N", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rector St", 40.70722, -74.013342, "R", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Whitehall St", 40.703087, -74.012994, "1", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "104th St-102nd St", 40.695178, -73.84433, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "111th St", 40.697418, -73.836345, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "121st St", 40.700492, -73.828294, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Alabama Av", 40.676992, -73.898654, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Chauncey St", 40.682893, -73.910456, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cleveland St", 40.679947, -73.884639, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Crescent St", 40.683194, -73.873785, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cypress Hills", 40.689941, -73.87255, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Elderts Lane-75th St", 40.691324, -73.867139, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Flushing Av", 40.70026, -73.941126, "J", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Forest Parkway-85th St", 40.692435, -73.86001, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Gates Av", 40.68963, -73.92227, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Halsey St", 40.68637, -73.916559, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Hewes St", 40.70687, -73.953431, "J", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kosciusko St", 40.693342, -73.928814, "J", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lorimer St", 40.703869, -73.947408, "J", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Marcy Av", 40.708359, -73.957757, "J", "M", "Z", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Myrtle Av", 40.697207, -73.935657, "J", "M", "Z", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Norwood Av", 40.68141, -73.880039, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Van Siclen Av", 40.678024, -73.891688, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Woodhaven Blvd", 40.693879, -73.851576, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "1st Av", 40.730953, -73.981628, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "3rd Av", 40.732849, -73.986122, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "6th Av", 40.737335, -73.996786, "1", "2", "3", "F", "L", "M", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "8th Av", 40.739777, -74.002578, "A", "C", "E", "L", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Atlantic Av", 40.675345, -73.903097, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bedford Av", 40.717304, -73.956872, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bushwick Av", 40.682829, -73.905249, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Canarsie - Rockaway Parkway", 40.645757, -73.9025, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "DeKalb Av", 40.703811, -73.918425, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East 105th St", 40.650573, -73.899485, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Graham Av", 40.714565, -73.944053, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grand St", 40.711926, -73.94067, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Halsey St", 40.695602, -73.904084, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jefferson St", 40.706607, -73.922913, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Livonia Av", 40.664038, -73.900571, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lorimer St", 40.714063, -73.950275, "G", "L", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Montrose Av", 40.707739, -73.93985, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Morgan Av", 40.706152, -73.933147, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Myrtle Av", 40.699814, -73.911586, "L", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "New Lots Av", 40.658733, -73.899232, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sutter Av", 40.669367, -73.901975, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Wilson Av", 40.688764, -73.904046, "L", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Stillwell Av", 40.577422, -73.981233, "D", "F", "N", "Q", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "West 8th St", 40.576127, -73.975939, "F", "Q", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Botanic Gardens", 40.670343, -73.959245, "2", "3", "4", "5", "FS", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Franklin Av", 40.680596, -73.955827, "A", "FS", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Park Place", 40.674772, -73.957624, "FS", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Central Av", 40.697857, -73.927397, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Forest Av", 40.704423, -73.903077, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fresh Pond Rd", 40.706186, -73.895877, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Knickerbocker Av", 40.698664, -73.919711, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Metropolitan Av", 40.711396, -73.889601, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Seneca Av", 40.702762, -73.90774, "M", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bowery", 40.72028, -73.993915, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broad St", 40.706476, -74.011056, "J", "Z", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Chambers St", 40.713243, -74.003401, "4", "5", "6", "J", "Z", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Essex St", 40.718315, -73.987437, "F", "J", "M", "Z", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fulton St", 40.710374, -74.007582, "2", "3", "4", "5", "A", "C", "J", "Z", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "18th Av", 40.620671, -73.990414, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "20th Av", 40.61741, -73.985026, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "86th St", 40.592721, -73.97823, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "8th Av", 40.635064, -74.011719, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av U", 40.597473, -73.979137, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bay Parkway-22nd Av", 40.611815, -73.981848, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fort Hamilton Parkway", 40.631386, -74.005351, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kings Highway", 40.603923, -73.980353, "N", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "New Utrecht Av", 40.624842, -73.996353, "D", "N", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "18th Av", 40.607954, -74.001736, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "20th Av", 40.604556, -73.998168, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "25th Av", 40.597704, -73.986829, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "50th St", 40.63626, -73.994791, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "55th St", 40.631435, -73.995476, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "62nd St", 40.626472, -73.996895, "D", "N", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "71st St", 40.619589, -73.998864, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "79th St", 40.613501, -74.00061, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "9th Av", 40.646292, -73.994324, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bay 50th St", 40.588841, -73.983765, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bay Parkway", 40.601875, -73.993728, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fort Hamilton Parkway", 40.640914, -73.994304, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "21st St", 40.754203, -73.942836, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lexington Av", 40.764627, -73.96611, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Roosevelt Island", 40.759145, -73.95326, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "14th St", 40.738228, -73.996209, "1", "2", "3", "F", "L", "M", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St", 40.742878, -73.992821, "F", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "2nd Av", 40.723402, -73.989938, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "42nd St", 40.754222, -73.984569, "7", "B", "D", "F", "M", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "47-50th Sts Rockefeller Center", 40.758663, -73.981329, "B", "D", "F", "M", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "4th Av", 40.670272, -73.989779, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "57th St", 40.763972, -73.97745, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "7th Av", 40.666271, -73.980305, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bergen St", 40.686145, -73.990862, "F", "G", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway-Lafayette St", 40.725297, -73.996204, "6", "B", "D", "F", "M", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Carroll St", 40.680303, -73.995048, "F", "G", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Church Av", 40.644041, -73.979678, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Delancey St", 40.718611, -73.988114, "F", "J", "M", "Z", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East Broadway", 40.713715, -73.990173, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fort Hamilton Parkway", 40.650782, -73.975776, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grand St", 40.718267, -73.993753, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Prospect Park-15 St", 40.660365, -73.979493, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Smith-9th St", 40.67358, -73.995959, "F", "G", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "York St", 40.699743, -73.986885, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "103rd St", 40.796092, -73.961454, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "116th St", 40.805085, -73.954882, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "125th St", 40.811109, -73.952343, "A", "B", "C", "D", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "135th St", 40.817894, -73.947649, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "145th St", 40.824783, -73.944216, "A", "B", "C", "D", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "14th St", 40.740893, -74.00169, "A", "C", "E", "L", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "155th St", 40.830518, -73.941514, "C", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "163rd St - Amsterdam Av", 40.836013, -73.939892, "C", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "168th St - Washington Heights", 40.840719, -73.939561, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "175th St", 40.847391, -73.939704, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "181st St", 40.851695, -73.937969, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "190th St", 40.859022, -73.93418, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St", 40.745906, -73.998041, "C", "E", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "34th St", 40.752287, -73.993391, "A", "C", "E", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "50th St", 40.762456, -73.985984, "C", "E", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "72nd St", 40.775594, -73.97641, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "81st St - Museum of Natural History", 40.781433, -73.972143, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "86th St", 40.785868, -73.968916, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "96th St", 40.791646, -73.964699, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway-Nassau", 40.710197, -74.007691, "2", "3", "4", "5", "A", "C", "J", "Z", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Canal St", 40.720824, -74.005229, "A", "C", "E", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cathedral Parkway-110th St", 40.800605, -73.958158, "B", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Chambers St", 40.714111, -74.008585, "2", "3", "A", "C", "E", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Dyckman St-200th St", 40.865491, -73.927271, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "High St", 40.699337, -73.990531, "2", "3", "4", "5", "A", "C", "J", "Z", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Inwood - 207th St", 40.868072, -73.919899, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Spring St", 40.726227, -74.003739, "C", "E", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "West 4th St", 40.732338, -74.000495, "A", "B", "C", "D", "E", "F", "M", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "World Trade Center", 40.712582, -74.009781, "2", "3", "A", "C", "E", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jamaica-Van Wyck", 40.702566, -73.816859, "E", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Parsons Blvd-Archer Av - Jamaica Center", 40.702147, -73.801109, "E", "J", "Z", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sutphin Blvd-Archer Av - JFK", 40.700486, -73.807969, "E", "J", "Z", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "155th St", 40.830135, -73.938209, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "167th St", 40.833769, -73.918432, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "170th St", 40.839306, -73.9134, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "174-175th Sts", 40.8459, -73.910136, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "182nd-183rd Sts", 40.856093, -73.900741, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bedford Park Blvd", 40.873244, -73.887138, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fordham Rd", 40.861296, -73.897749, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kingsbridge Rd", 40.866978, -73.893509, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Norwood-205th St", 40.874811, -73.878855, "D", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Tremont Av", 40.85041, -73.905227, "B", "D", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Yankee Stadium-161st St", 40.827905, -73.925651, "4", "B", "D", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "21st St", 40.744065, -73.949724, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bedford-Nostrand Avs", 40.689627, -73.953522, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway", 40.706092, -73.950308, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Classon Av", 40.688873, -73.96007, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Clinton-Washington Avs", 40.688089, -73.966839, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Flushing Av", 40.700377, -73.950234, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fulton St", 40.687119, -73.975375, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Greenpoint Av", 40.731352, -73.954449, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Long Island City-Court Square", 40.746554, -73.943832, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Metropolitan Av", 40.712792, -73.951418, "G", "L", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Myrtle-Willoughby Avs", 40.694568, -73.949046, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Nassau Av", 40.724635, -73.951277, "G", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "18th Av", 40.629755, -73.976971, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av I", 40.625322, -73.976127, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av N", 40.61514, -73.974197, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av P", 40.608944, -73.973022, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av U", 40.596063, -73.973357, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Av X", 40.58962, -73.97425, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bay Parkway-22nd Av", 40.620769, -73.975264, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Ditmas Av", 40.636119, -73.978172, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kings Highway", 40.603217, -73.972361, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Neptune Av-Van Siclen", 40.581011, -73.974574, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway Junction-East New York", 40.678334, -73.905316, "A", "C", "J", "L", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Clinton &amp; Washington Avs", 40.683263, -73.965838, "C", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Euclid Av", 40.675377, -73.872106, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Franklin Av", 40.68138, -73.956848, "A", "C", "FS", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Hoyt &amp; Schermerhorn", 40.688484, -73.985001, "A", "C", "G", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jay St - Borough Hall", 40.692338, -73.987342, "A", "C", "F", "R", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kingston-Throop", 40.679921, -73.940858, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lafayette Av", 40.686113, -73.973946, "C", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Liberty Av", 40.674542, -73.896548, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Nostrand Av", 40.680438, -73.950426, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Ralph Av", 40.678822, -73.920786, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rockaway Av", 40.67834, -73.911946, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Shepherd Av", 40.67413, -73.88075, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Utica Av", 40.679364, -73.930729, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Van Siclen Av", 40.67271, -73.890358, "A", "C", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "104th St-Oxford Av", 40.681711, -73.837683, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "111th St-Greenwood Av", 40.684331, -73.832163, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "80th St-Hudson St", 40.679371, -73.858992, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "88th St-Boyd Av", 40.679843, -73.85147, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grant Av", 40.677044, -73.86505, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lefferts Blvd", 40.685951, -73.825798, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rockaway Blvd", 40.680429, -73.843853, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "169th St", 40.71047, -73.793604, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St-Ely Av", 40.747846, -73.946, "7", "E", "G", "M", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "36th St", 40.752039, -73.928781, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "46th St", 40.756312, -73.913333, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "5th Av-53rd St", 40.760167, -73.975224, "E", "M", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "63rd Drive-Rego Park", 40.729846, -73.861604, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "65th St", 40.749669, -73.898453, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "67th Av", 40.726523, -73.852719, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "75th Av", 40.718331, -73.837324, "E", "F", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "7th Av", 40.762862, -73.981637, "B", "D", "E", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Briarwood-Van Wyck Blvd", 40.709179, -73.820574, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Elmhurst Av", 40.742454, -73.882017, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Forest Hills-71st Av", 40.721691, -73.844521, "E", "F", "M", "R", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grand Av-Newtown", 40.737015, -73.877223, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jackson Heights-Roosevelt Ave", 40.746644, -73.891338, "7", "E", "F", "M", "R", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jamaica-179th St", 40.712646, -73.783817, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kew Gardens-Union Turnpike", 40.714441, -73.831008, "E", "F", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lexington Av-53rd St", 40.757552, -73.969055, "6", "E", "M", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Northern Blvd", 40.752885, -73.906006, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Parsons Blvd", 40.707564, -73.803326, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Queens Plaza", 40.748973, -73.937243, "E", "M", "R", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Steinway St", 40.756879, -73.92074, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sutphin Blvd", 40.70546, -73.810708, "F", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Woodhaven Blvd", 40.733106, -73.869229, "M", "R", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Aqueduct-North Conduit Av", 40.668234, -73.834058, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Aqueduct Racetrack", 40.672131, -73.835812, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 105th St", 40.583209, -73.827559, "H", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 25th St", 40.600066, -73.761353, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 36th St", 40.595398, -73.768175, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 44th St", 40.592943, -73.776013, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 60th St", 40.592374, -73.788522, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 67th St", 40.590927, -73.796924, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 90th St", 40.588034, -73.813641, "H", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beach 98th St", 40.585307, -73.820558, "H", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broad Channel", 40.608382, -73.815925, "A", "H", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Far Rockaway-Mott Av", 40.603995, -73.755405, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Howard Beach", 40.660476, -73.830301, "A", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rockaway Park-Beach 116th", 40.580903, -73.835592, "H", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Times Square", 40.755983, -73.986229, "1", "2", "3", "7", "A", "C", "E", "N", "Q", "R", "S", "", ""));
            stationList.Add(new Station(StationID++, "103rd St", 40.799446, -73.968379, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "116th St-Columbia University", 40.807722, -73.96411, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "125th St", 40.815581, -73.958372, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "137th St-City College", 40.822008, -73.953676, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "145th St", 40.826551, -73.95036, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "14th St", 40.737826, -74.000201, "1", "2", "3", "F", "L", "M", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "157th St", 40.834041, -73.94489, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "168th St", 40.840556, -73.940133, "1", "A", "C", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "181st St", 40.849505, -73.933596, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "18th St", 40.74104, -73.997871, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "191st St", 40.855225, -73.929412, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "207th St", 40.864614, -73.918819, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "215th St", 40.869444, -73.915279, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "231st St", 40.878856, -73.904834, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "238th St", 40.884667, -73.90087, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St", 40.744081, -73.995657, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "28th St", 40.747215, -73.993365, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "34th St", 40.750373, -73.991057, "1", "2", "3", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "50th St", 40.761728, -73.983849, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "59th St-Columbus Circle", 40.768247, -73.981929, "1", "A", "B", "C", "D", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "66th St-Lincoln Center", 40.77344, -73.982209, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "72nd St", 40.778453, -73.98197, "1", "2", "3", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "79th St", 40.783934, -73.979917, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "86th St", 40.788644, -73.976218, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "96th St", 40.793919, -73.972323, "1", "2", "3", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Canal St", 40.722854, -74.006277, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cathedral Parkway-110th St", 40.803967, -73.966847, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Chambers St", 40.715478, -74.009266, "1", "2", "3", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Christopher St", 40.733422, -74.002906, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Dyckman St", 40.860531, -73.925536, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Franklin St", 40.719318, -74.006886, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Houston St", 40.728251, -74.005367, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Marble Hill-225th St", 40.874561, -73.909831, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rector St", 40.707513, -74.013783, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "South Ferry", 40.702068, -74.013664, "R", "1", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Van Cortlandt Park-242nd St", 40.889248, -73.898583, "1", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Borough Hall", 40.693219, -73.989998, "2", "3", "4", "5", "R", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Clark St", 40.697466, -73.993086, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Park Place", 40.713051, -74.008811, "1", "2", "3", "A", "C", "E", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Wall St", 40.706821, -74.0091, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Baychester Av", 40.878663, -73.838591, "5", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Eastchester-Dyre Av", 40.8883, -73.830834, "5", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Gun Hill Rd", 40.869526, -73.846384, "5", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Morris Park", 40.854364, -73.860495, "5", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Pelham Parkway", 40.858985, -73.855359, "5", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Atlantic Av-Barclays Ctr", 40.684359, -73.977666, "2", "3", "4", "5", "B", "D", "N", "Q", "R", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bergen St", 40.680829, -73.975098, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Eastern Parkway-Brooklyn Museum", 40.671987, -73.964375, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Franklin Av", 40.670682, -73.958131, "FS", "2", "3", "4", "5", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grand Army Plaza", 40.675235, -73.971046, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Hoyt St", 40.690545, -73.985065, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kingston Av", 40.669399, -73.942161, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Nevins St", 40.688246, -73.980492, "2", "3", "4", "5", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Nostrand Av", 40.669847, -73.950466, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Utica Av", 40.668897, -73.932942, "3", "4", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "103rd St", 40.749865, -73.8627, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "111th St", 40.75173, -73.855334, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "34 St Hudson Yards", 40.755882, -74.00191, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "45 Rd-Court House Sq", 40.747023, -73.945264, "E", "G", "M", "7", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "5th Av", 40.753821, -73.981963, "B", "D", "F", "M", "7", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "82nd St-Jackson Heights", 40.747659, -73.883697, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "90th St Elmhurst", 40.748408, -73.876613, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bliss St-46th St", 40.743132, -73.918435, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Broadway-74th St", 40.746848, -73.891394, "E", "F", "M", "R", "7", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fisk Av-69th St", 40.746325, -73.896403, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Flushing-Main St", 40.7596, -73.83003, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Grand Central-42nd St", 40.751431, -73.976041, "4", "5", "6", "7", "S", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Hunters Point", 40.742216, -73.948916, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Junction Blvd", 40.749145, -73.869527, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lincoln Av-52nd St", 40.744149, -73.912549, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Lowery St-40th St", 40.743781, -73.924016, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Mets - Willets Point", 40.754622, -73.845625, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Queensboro Plaza", 40.750582, -73.940202, "N", "Q", "7", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rawson St-33rd St", 40.744587, -73.930997, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Vernon Blvd-Jackson Av", 40.742626, -73.953581, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Woodside Av-61st St", 40.74563, -73.902984, "7", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "138th St", 40.813224, -73.929849, "4", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "149th St-Grand Concourse", 40.818375, -73.927351, "2", "4", "5", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "167th St", 40.835537, -73.9214, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "170th St", 40.840075, -73.917791, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "176th St", 40.84848, -73.911794, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "183rd St", 40.858407, -73.903879, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bedford Park Blvd-Lehman College", 40.873412, -73.890064, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Burnside Av", 40.853453, -73.907684, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Fordham Rd", 40.862803, -73.901034, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Kingsbridge Rd", 40.86776, -73.897174, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Mosholu Parkway", 40.87975, -73.884655, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Mt Eden Av", 40.844434, -73.914685, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Woodlawn", 40.886037, -73.878751, "4", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Yankee Stadium-161st St", 40.827994, -73.925831, "4", "B", "D", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "110th St-Central Park North", 40.799075, -73.951822, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "116th St", 40.802098, -73.949625, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "125th St", 40.807754, -73.945495, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "135th St", 40.814229, -73.94077, "2", "3", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "145th St", 40.820421, -73.936245, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Harlem-148th St", 40.82388, -73.93647, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "103rd St", 40.7906, -73.947478, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "110th St", 40.79502, -73.94425, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "116th St", 40.798629, -73.941617, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "125th St", 40.804138, -73.937594, "4", "5", "6", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "14th St-Union Square", 40.734673, -73.989951, "4", "5", "6", "N", "Q", "R", "L", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "23rd St", 40.739864, -73.986599, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "28th St", 40.74307, -73.984264, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "33rd St", 40.746081, -73.982076, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "51st St", 40.757107, -73.97192, "E", "M", "6", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "59th St", 40.762526, -73.967967, "4", "5", "6", "N", "Q", "R", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "68th St-Hunter College", 40.768141, -73.96387, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "77th St", 40.77362, -73.959874, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "86th St", 40.779492, -73.955589, "4", "5", "6", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "96th St", 40.785672, -73.95107, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Astor Place", 40.730054, -73.99107, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bleecker St", 40.725915, -73.994659, "6", "B", "D", "F", "M", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Borough Hall", 40.692404, -73.990151, "2", "3", "4", "5", "R", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bowling Green", 40.704817, -74.014065, "4", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Brooklyn Bridge-City Hall", 40.712333, -74.004387, "4", "5", "6", "J", "Z", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Spring St", 40.722301, -73.997141, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Wall St", 40.707557, -74.011862, "4", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Junius St", 40.663515, -73.902447, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "New Lots Av", 40.666235, -73.884079, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Pennsylvania Av", 40.664635, -73.894895, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Rockaway Av", 40.662549, -73.908946, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Saratoga Av", 40.661453, -73.916327, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sutter Av", 40.664717, -73.92261, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Van Siclen Av", 40.665449, -73.889395, "3", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Beverly Rd", 40.645098, -73.948959, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Church Av", 40.650843, -73.949575, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Flatbush Av-Brooklyn College", 40.632836, -73.947642, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Newkirk Av", 40.639967, -73.948411, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "President St", 40.667883, -73.950683, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Sterling St", 40.662742, -73.95085, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Winthrop St", 40.656652, -73.9502, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "138th St-3rd Ave", 40.810476, -73.926138, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Brook Av", 40.807566, -73.91924, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Buhre Av", 40.84681, -73.832569, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Castle Hill Av", 40.834255, -73.851222, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Cypress Av", 40.805368, -73.914042, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East 143rd St-St Mary's St", 40.808719, -73.907657, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East 149th St", 40.812118, -73.904098, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Elder Av", 40.828584, -73.879159, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Hunts Point Av", 40.820948, -73.890549, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Longwood Av", 40.816104, -73.896435, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Middletown Rd", 40.843863, -73.836322, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Morrison Av-Soundview Av", 40.829521, -73.874516, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Parkchester-East 177th St", 40.833226, -73.860816, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Pelham Bay Park", 40.852462, -73.828121, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "St Lawrence Av", 40.831509, -73.867618, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Westchester Square-East Tremont Av", 40.839892, -73.842952, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Whitlock Av", 40.826525, -73.886283, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Zerega Av", 40.836488, -73.847036, "6", "", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "149th St-3rd Av", 40.816109, -73.917757, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "174th St", 40.837288, -73.887734, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "219th St", 40.883895, -73.862633, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "225th St", 40.888022, -73.860341, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "233rd St", 40.893193, -73.857473, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "238th St-Nereid Av", 40.898379, -73.854376, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Allerton Av", 40.865462, -73.867352, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Bronx Park East", 40.848828, -73.868457, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Burke Av", 40.871356, -73.867164, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East 180th St", 40.841894, -73.873488, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "East Tremont Av-West Farms Sq", 40.840295, -73.880049, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Freeman St", 40.829993, -73.891865, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Gun Hill Rd", 40.87785, -73.866256, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Intervale Av", 40.822181, -73.896736, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Jackson Av", 40.81649, -73.907807, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Pelham Parkway", 40.857192, -73.867615, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Prospect Av", 40.819585, -73.90177, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Simpson St", 40.824073, -73.893064, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));
            stationList.Add(new Station(StationID++, "Wakefield-241st St", 40.903125, -73.85062, "2", "5", "", "", "", "", "", "", "", "", "", "", ""));


            return;
        }

        private string NameToXMLFormat(string isNotXMLValid)
        {

            string temp1 = isNotXMLValid;
            string temp2 = temp1.Replace(" & ", " &amp; ");
            temp1 = temp2.Replace("<", "&lt;");
            temp2 = temp1.Replace(">", "&gt;");
            temp1 = temp2.Replace("'", "&#39;");
            temp2 = temp1.Replace("’", "&#39;");
            temp1 = temp2;
            temp2 = temp1.Replace("À", "&#192;");
            temp1 = temp2.Replace("Á", "&#193;");
            temp2 = temp1.Replace("Â", "&#194;");
            temp1 = temp2.Replace("Ã", "&#195;");
            temp2 = temp1.Replace("Ä", "&#196;");
            temp1 = temp2.Replace("Å", "&#197;");
            temp2 = temp1.Replace("Æ", "&#198;");
            temp1 = temp2.Replace("Ç", "&#199;");
            temp2 = temp1.Replace("È", "&#200;");
            temp1 = temp2.Replace("É", "&#201;");
            temp2 = temp1.Replace("Ê", "&#202;");
            temp1 = temp2.Replace("Ë", "&#203;");
            temp2 = temp1.Replace("Ì", "&#204;");
            temp1 = temp2.Replace("Í", "&#205;");
            temp2 = temp1.Replace("Î", "&#206;");
            temp1 = temp2.Replace("Ï", "&#207;");
            temp2 = temp1.Replace("Ð", "&#208;");
            temp1 = temp2.Replace("Ñ", "&#209;");
            temp2 = temp1.Replace("Ò", "&#210;");
            temp1 = temp2.Replace("Ó", "&#211;");
            temp2 = temp1.Replace("Ô", "&#212;");
            temp1 = temp2.Replace("Õ", "&#213;");
            temp2 = temp1.Replace("Ö", "&#214;");
            temp1 = temp2.Replace("×", "&#215;");
            temp2 = temp1.Replace("Ø", "&#216;");
            temp1 = temp2.Replace("Ù", "&#217;");
            temp2 = temp1.Replace("Ú", "&#218;");
            temp1 = temp2.Replace("Û", "&#219;");
            temp2 = temp1.Replace("Ü", "&#220;");
            temp1 = temp2.Replace("Ý", "&#221;");
            temp2 = temp1.Replace("Þ", "&#222;");
            temp1 = temp2.Replace("ß", "&#223;");
            temp2 = temp1.Replace("à", "&#224;");
            temp1 = temp2.Replace("á", "&#225;");
            temp2 = temp1.Replace("â", "&#226;");
            temp1 = temp2.Replace("ã", "&#227;");
            temp2 = temp1.Replace("ä", "&#228;");
            temp1 = temp2.Replace("å", "&#229;");
            temp2 = temp1.Replace("æ", "&#230;");
            temp1 = temp2.Replace("ç", "&#231;");
            temp2 = temp1.Replace("è", "&#232;");
            temp1 = temp2.Replace("é", "&#233;");
            temp2 = temp1.Replace("ê", "&#234;");
            temp1 = temp2.Replace("ë", "&#235;");
            temp2 = temp1.Replace("ì", "&#236;");
            temp1 = temp2.Replace("í", "&#237;");
            temp2 = temp1.Replace("î", "&#238;");
            temp1 = temp2.Replace("ï", "&#239;");
            temp2 = temp1.Replace("ð", "&#240;");
            temp1 = temp2.Replace("ñ", "&#241;");
            temp2 = temp1.Replace("ò", "&#242;");
            temp1 = temp2.Replace("ó", "&#243;");
            temp2 = temp1.Replace("ô", "&#244;");
            temp1 = temp2.Replace("õ", "&#245;");
            temp2 = temp1.Replace("ö", "&#246;");
            temp1 = temp2.Replace("ù", "&#249;");
            temp2 = temp1.Replace("ú", "&#250;");
            temp1 = temp2.Replace("û", "&#251;");
            temp2 = temp1.Replace("ü", "&#252;");
            temp1 = temp2.Replace("ý", "&#253;");
            temp2 = temp1.Replace("ÿ", "&#255;");

            string isXMLValid = temp2;

            return isXMLValid;

        }

        private string NameToSortNameFormat(string isNotSortNameFormat)
        {
            string sortName = isNotSortNameFormat;
            if( 4 < sortName.Length &&
                sortName.Substring(0,4) == "The ")
            {
                sortName = sortName.Substring(4);
            }
            return sortName;
        }

    }
}

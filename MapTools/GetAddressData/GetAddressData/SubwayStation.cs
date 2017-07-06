using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GetAddressData
{
    //class SubwayStation
    //{


    //}


    public class Station
    {
        public int m_stationID;
        public string m_Name;
        public double m_Latitude;
        public double m_Longitude;
        public string[] m_Line = new string[13];

        public Station(
        int stationID,
        string name,
        double latitude,
        double longitude,
        string Line1,
        string Line2,
        string Line3,
        string Line4,
        string Line5,
        string Line6,
        string Line7,
        string Line8,
        string Line9,
        string Line10,
        string Line11,
        string Line12,
        string Line13)

        {
            m_stationID = stationID;
            m_Name = name;
            m_Latitude = latitude;
            m_Longitude = longitude;
            m_Line[0] = Line1;
            m_Line[1] = Line2;
            m_Line[2] = Line3;
            m_Line[3] = Line4;
            m_Line[4] = Line5;
            m_Line[5] = Line6;
            m_Line[6] = Line7;
            m_Line[7] = Line8;
            m_Line[8] = Line9;
            m_Line[9] = Line10;
            m_Line[10] = Line11;
            m_Line[11] = Line12;
            m_Line[12] = Line13;

            return;
        }
    }

    public class Pin
    {

        public string m_name;
        public double m_Latitude;
        public double m_Longitude;

        public Pin(
        string name,
        double latitude,
        double longitude)

        {
            m_name = name;
            m_Latitude = latitude;
            m_Longitude = longitude;
            return;
        }
    }

}

using System;
using System.Collections.Generic;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using Word = Microsoft.Office.Interop.Word;
using System.Reflection;
using System.IO;

namespace WordDocFromCSharp
{
    public partial class Form1 : Form
    {

        // Start with a 
        Dictionary<string, string> translationsMap = new Dictionary<string, string>();



        public Form1()
        {
            InitializeComponent();
        }

        private void btnDoIt_Click(object sender, EventArgs e)
        {
            string strDocName = txtDocName.Text;

            object oMissing = System.Reflection.Missing.Value;
            object oEndOfDoc = "\\endofdoc"; /* \endofdoc is a predefined bookmark */
            //object oTemplate = "C://Documents and Settings//kenf//Application Data//Microsoft//Templates//MapBookTemplateTest.dot";
            object oTemplate = "C://Users//kenf//Documents//$WordDocs//MapBookTemplateTest.dot";

            uint countMaps = Convert.ToUInt16(numericUpDownMaps.Value);
            uint countItinerary = Convert.ToUInt16(numericUpDownIninerary.Value);


            //Start Word and create a new document.
            Word._Application oWord;
            oWord = new Word.Application();
            oWord.Visible = true;

            // Open the dummy doc
            // To create this doc:
            // Note make this minimim (.17 on top and .83 on the bottom)

            // New Word Doc, landscape, .5 margins all around, 2 columns 4.63 w/ .73 in the middle
            // Insert a picture with a link to the file
            // Format Set Size at 80%, set the Layout "In line with text"
            // add enough lines of text to fill under the picture and all the right side
            // Copy and paste 100 copys (or enough to hole the number of map pages)
            // Point this at the dummy doc. This program is non-destructive.

            // Word._Document oDoc = oWord.Documents.Open(@"C:/Zunk/DummyMapDocument.doc");
            Word._Document oDoc = oWord.Documents.Add(oTemplate, oMissing, oMissing, oMissing);

            Word.Range rng = oDoc.Range(0, 1);


            ///////////////////////////////////
            for (int itinIx = 0; itinIx < countItinerary; itinIx++)
            {
                int itinIx2 = (itinIx % 4 == 3) ? itinIx - 3 : itinIx + 1;
                //string pathIx = @"C:/TestWebPages/Maps/Paris/Pages/Itinerary[" + itinIx2.ToString() + "].txt";
                string pathIx = @"C:/TestWebPages/Maps/NYC/Pages/Itinerary[" + itinIx2.ToString() + "].txt";

                StreamReader sr = new StreamReader(pathIx);
                string line;
                for (int k = 1; k < 33; k++)
                {
                    line = sr.ReadLine();
                    if (line == null)
                    {
                        line = "\n";
                    }
                    rng.Text += line;
                }
                //oDoc.Words.Last.InsertBreak(Word.WdBreakType.wdPageBreak);
            }
            object ItinNewEndPos = rng.StoryLength - 1;
            rng = oDoc.Range(ref ItinNewEndPos, ref ItinNewEndPos);
            ////////////////////////////////////

            string key = string.Empty;
            string indexConversionFilePath = "C:/TestWebPages/Maps/NYC/Pages/IndexConvert.txt";
            using (StreamWriter outfile = new StreamWriter(indexConversionFilePath))
            {

                for (int i = 1; i < countMaps + 1; i++)
                {
                    //string path = @"C:/TestWebPages/Maps/Paris/Pages/Map[" + i.ToString() + "].jpg";
                    string path = @"C:/TestWebPages/Maps/NYC/Pages/Map[" + i.ToString() + "].jpg";
                    if (!File.Exists(path))
                    {
                        continue;
                    }
                    rng.InlineShapes.AddPicture(path, ref oMissing, ref oMissing, ref oMissing);

                    // Note: We may have to scale the pages at this point.

                    object NewEndPos = rng.StoryLength - 1;
                    rng = oDoc.Range(ref NewEndPos, ref NewEndPos);
                    rng.Select();

                    rng.Text = "Page " + (i * 2).ToString() + "\n";
                    rng.Text += ".\n.\n.\n.\n.\n.\n.\n";
                    rng.Font.Bold = 1;
                    rng.Font.Size = 12;

                    //rng.Text += "Index for Page " + (i * 2 + ((0 == i % 2) ? -4 : 0)).ToString() + "\n\n";
                    NewEndPos = rng.StoryLength - 1;
                    rng = oDoc.Range(ref NewEndPos, ref NewEndPos);
                    rng.Select();

                    rng.Font.Bold = 0;
                    rng.Font.Size = 12;

                    // Note: Obviously this is dummy text. We need to get the real text in some form
                    // We also have to handle the fact that the page order goes 2,3,4,1,6,7,8,5 etc. with page one being blank.
                    // Actually, we go Map1, Map1 Index, Map2, Blank, Map3, Map3 Index, Map4, Map2 Index, etc.
                    // Should either write the index pages out as individual files so they can be loaded in
                    // Or build the index from the .xls file.

                    //This line is for printing the book
                    int j = i + ((0 == i % 2) ? -2 : 0);

                    //This line is to make a pdf
                    //int j = i;

                    //string pathIx = @"C:/TestWebPages/Maps/Paris/Pages/Index[" + j.ToString() + "].txt";
                    string pathIx = @"C:/TestWebPages/Maps/NYC/Pages/Index[" + j.ToString() + "].txt";
                    if (0 != j)
                    {
                        StreamReader sr = new StreamReader(pathIx);
                        string line;
                        for (int k = 1; k < 33; k++)
                        {
                            line = sr.ReadLine();

                            if (line == null)
                            {
                                line = " ";
                            }
                            rng.Text += line + "\n";
                            if (k == 1)
                            {
                                rng.Text += " \n";
                                outfile.Write(line + "\t");
                                key = line;
                            }


                        }
                    }
                    else
                    {
                        for (int kk = 1; kk < 33; kk++)
                        {
                            rng.Text += "     \n";
                        }
                    }


                    string indexString = "Index for Page " + (i * 2 + ((0 == i % 2) ? -4 : 0)).ToString() + "\n";

                    rng.Text += indexString; // "Index for Page " + (i * 2 + ((0 == i % 2) ? -4 : 0)).ToString() + "\n";

                    outfile.Write(indexString);


                    // This is so later we can translate R1C1-> page 4 etc. 
                    if (!translationsMap.ContainsKey(key))
                    {
                        translationsMap.Add(key, (i * 2 + ((0 == i % 2) ? -4 : 0)).ToString());
                    }

                    NewEndPos = rng.StoryLength - 1;
                    rng = oDoc.Range(ref NewEndPos, ref NewEndPos);
                    rng.Select();


                }
            }

        
            // Code for index starts here
            // FullIndex.txt is generated by a web page
            // that dumps everything in the index.

            // Currently, the following manual manipulation is needed to prepare FullIndex.txt
            //Pull down index from web
            //Paste into Notepad++
            //Replace using Regular Expressions -\d*$ with <null>
            //Replace using Regular Expressions  (R\d*C\d*)$ with \t\1  (Inserts tab between address and RowCol
            //Paste into Excel
            //Sort by Col A the Col B.
            //Save as FullIndex.txt




            // This includes pages that are "off the grid"
            // i.e. not in the printed book
            // We will try to sort those out anong other things

            // Fir thing is to pull everything in to a big list


            oDoc.Words.Last.InsertBreak(Word.WdBreakType.wdPageBreak);
            //string pathFullIx = @"C:/TestWebPages/Maps/Paris/Pages/FullIndex.txt";
            string pathFullIx = @"C:/TestWebPages/Maps/NYC/Pages/FullIndex.txt";
            int lineCount = 0;
            string ixLine;
            string ixLine2;
            StreamReader sr1 = new StreamReader(pathFullIx);


            ArrayList indexPageEntries = new ArrayList();

            //indexPages.Add(string.Empty);
            string temp = string.Empty;
            while (null != (ixLine = sr1.ReadLine()))
            {
                string[] ixParts = ixLine.Split('|');
                string item  = ixParts[0];
                string rowCol = ixParts[1];

                item = item.Replace("&amp;", "&");

                //if (item.Substring(0, 5) == "10 Li")
                //{
                //    string x = "x";
                //}

                if(string.IsNullOrEmpty(item) || string.IsNullOrEmpty(rowCol))
                {
                    System.Console.WriteLine(ixLine);
                    continue;
                }

                if(item.Contains("Starbucks") || item.Contains("McDonalds"))
                {
                    continue;
                }

                string pageNumberAsString = TranslatePageIdentification(rowCol);




                // Look for page references that didn't translate (they are off the grid)
                string rowColMatch = @"R\d*C\d*";
                if (System.Text.RegularExpressions.Regex.IsMatch(pageNumberAsString, rowColMatch, System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                {
                    System.Console.WriteLine(ixLine);
                    continue;
                }

                // Convert page number to int
                int page = int.Parse(pageNumberAsString);
                indexPageEntries.Add(new Tuple<string, int>(item, page));
            }
            try
            {
                indexPageEntries.Sort();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Sort Failed " + ex.Message);
            }

            // Combine multiple entries for same item

            string lastItem = string.Empty;
            bool firstItem = true;
            int firstPage = 0;
            int lastPage = 0;

            
            ArrayList combinedIndex = new ArrayList();

            foreach (Tuple<string, int> tuple in indexPageEntries)
            {
                // If repeated item, just record the page
                if (tuple.Item1 == lastItem)
                {
                    lastPage = tuple.Item2;
                    continue;
                }
                // If not the first item, write a line
                if (!firstItem)
                {

                    string formatedIndexItem = lastItem + " -- " + firstPage.ToString();
                    if (firstPage < lastPage)
                    {
                        formatedIndexItem += "-" + lastPage;
                    }
                    combinedIndex.Add(formatedIndexItem);
                }

                // Reset for next
                firstPage = tuple.Item2;
                lastPage = firstPage;
                firstItem = false;
                lastItem = tuple.Item1;
            }

            // Handle last item
            string lastIndexItem = lastItem + " -- " + firstPage.ToString();
            if (firstPage < lastPage)
            {
                lastIndexItem += "-" + lastPage;
            }
            combinedIndex.Add(lastIndexItem);


            ArrayList indexPages = new ArrayList();
            indexPages.Add(string.Empty);
            string tempPage = string.Empty;
            foreach(string indexItem in combinedIndex)
            {
                int currentIndexPage = indexPages.Count - 1;

                lineCount++;
                if (64 < indexItem.Length)
                {
                    lineCount++;
                }
                if (128 < indexItem.Length)
                {
                    lineCount++;
                }

                tempPage += indexItem + "\n";

                if (33 < lineCount)
                {
                    while (lineCount < 47)
                    {
                        lineCount++;
                        tempPage += ".\n";
                    }
                    lineCount = 0;
                    indexPages.Add(tempPage);
                    tempPage = string.Empty;
                }
            }

            int indexPageCount = indexPages.Count;
            indexPages.Add(string.Empty);
            indexPages.Add(string.Empty);
            indexPages.Add(string.Empty);
            indexPages.Add(string.Empty);

            try
            {
                for (int ixIx = 0; ixIx < indexPageCount; ixIx++)
                {
                    int ixIx2 = (ixIx % 4 == 3) ? ixIx - 3 : ixIx + 1;
                    rng.Text += (string)indexPages[ixIx2];
                }
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Adding index to Word document Failed " + ex.Message);

            }


            rng.Text += ".\n";
            ////oDoc.SaveAs(@"C:/TestWebPages/Maps/Paris/Pages/"+ strDocName + ".doc");
            oDoc.SaveAs(@"C:/TestWebPages/Maps/NYC/Pages/" + strDocName + ".doc");
            this.Close();
        }

        // Translate RowCol value into a page number
        public string TranslatePageIdentification(string stringToTranslate)
        {
            foreach (var pair in translationsMap)
	        {
	            string key = pair.Key;
	            string value = pair.Value;
                stringToTranslate = stringToTranslate.Replace(key,value);
            }
            return stringToTranslate;
        }


    }
}

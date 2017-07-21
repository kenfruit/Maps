//	11/17/2003
//	Alexander Kent
//	MSHTML-Automation
//	Version 1.1

using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;
using mshtml;

using System.Diagnostics;

using System.Net;
using System.Net.Sockets;
using System.IO;

namespace mshtml_automation_demo
{
	/// <summary>
	/// Summary description for Form1.
	/// </summary>
	public class MainForm : System.Windows.Forms.Form
	{
		private AxSHDocVw.AxWebBrowser axWebBrowser1;
        private Button btnSave;
        private Button btnTimer;
        private Timer timer1;
        private IContainer components;
        //private int Task = 1; // global

        private Tuple<int, int, int>[] grid = 
        {
            Tuple.Create(1,1,2),
            Tuple.Create(2,1,5),
            Tuple.Create(3,1,5),
            Tuple.Create(4,2,5),
            Tuple.Create(5,2,5),
            Tuple.Create(6,2,7),
            Tuple.Create(7,2,8),
            Tuple.Create(8,3,8),
            Tuple.Create(9,4,9),
            Tuple.Create(10,5,9),
            Tuple.Create(11,5,10),
            Tuple.Create(12,6,10),
            Tuple.Create(13,7,10),
            Tuple.Create(14,7,10),
            Tuple.Create(15,8,10),
            Tuple.Create(16,9,10),
            Tuple.Create(17,9,10),
            Tuple.Create(18,10,11),
            Tuple.Create(19,10,12),
            Tuple.Create(20,11,12)
        };

		public MainForm()
		{
			//
			// Required for Windows Form Designer support
			//
			InitializeComponent();

			//
			// TODO: Add any constructor code after InitializeComponent call
			//
		}

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			if( disposing )
			{
				if (components != null) 
				{
					components.Dispose();
				}
			}
			base.Dispose( disposing );
		}

		#region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.axWebBrowser1 = new AxSHDocVw.AxWebBrowser();
            this.btnSave = new System.Windows.Forms.Button();
            this.btnTimer = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.axWebBrowser1)).BeginInit();
            this.SuspendLayout();
            // 
            // axWebBrowser1
            // 
            this.axWebBrowser1.Dock = System.Windows.Forms.DockStyle.Top;
            this.axWebBrowser1.Enabled = true;
            this.axWebBrowser1.Location = new System.Drawing.Point(0, 0);
            this.axWebBrowser1.OcxState = ((System.Windows.Forms.AxHost.State)(resources.GetObject("axWebBrowser1.OcxState")));
            this.axWebBrowser1.Size = new System.Drawing.Size(616, 950);
            this.axWebBrowser1.TabIndex = 0;
            this.axWebBrowser1.DocumentComplete += new AxSHDocVw.DWebBrowserEvents2_DocumentCompleteEventHandler(this.axWebBrowser1_DocumentComplete);
            // 
            // btnSave
            // 
            this.btnSave.Font = new System.Drawing.Font("Candara", 15.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSave.Location = new System.Drawing.Point(491, 967);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(125, 33);
            this.btnSave.TabIndex = 1;
            this.btnSave.Text = "Save";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // btnTimer
            // 
            this.btnTimer.Font = new System.Drawing.Font("Candara", 15.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnTimer.Location = new System.Drawing.Point(0, 967);
            this.btnTimer.Name = "btnTimer";
            this.btnTimer.Size = new System.Drawing.Size(125, 33);
            this.btnTimer.TabIndex = 2;
            this.btnTimer.Text = "Timer";
            this.btnTimer.UseVisualStyleBackColor = true;
            this.btnTimer.Click += new System.EventHandler(this.btnTimer_Click);
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // MainForm
            // 
            this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
            this.ClientSize = new System.Drawing.Size(616, 1000);
            this.Controls.Add(this.btnTimer);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.axWebBrowser1);
            this.Name = "MainForm";
            this.Text = "Microsoft WebBrowser Automation";
            this.Load += new System.EventHandler(this.FrmMain_Load);
            ((System.ComponentModel.ISupportInitialize)(this.axWebBrowser1)).EndInit();
            this.ResumeLayout(false);

		}
		#endregion

		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main() 
		{
			Application.Run(new MainForm());
		}

		private void FrmMain_Load(object sender, System.EventArgs e)
		{
            // Note: Oct-15-2015, put an index.html copy of the current map in this directory
            //object loc = "http://kenandfranfruit.com/Maps/Paris/ParisMap.html";
            //object loc = "http://kenandfranfruit.com/Maps/NYC/";
            object loc = "http://kenandfranfruit.com/Maps/NYCMapPagesSept2015/NYCBigMap2015.html";
			object null_obj_str = "";
			System.Object null_obj = 0;
			this.axWebBrowser1.Navigate2(ref loc , ref null_obj, ref null_obj, ref null_obj_str, ref null_obj_str);

            // OPEN A MASTER INDEX FILE HERE
		}


		private void axWebBrowser1_DocumentComplete(object sender, AxSHDocVw.DWebBrowserEvents2_DocumentCompleteEvent e)
		{
			//switch(Task)
			//{
				//case 1:

					HTMLDocument myDoc = new HTMLDocumentClass();
					myDoc = (HTMLDocument) axWebBrowser1.Document;

                    IHTMLElementCollection ecol = myDoc.all;

					//btnSearch.click();

					//Task++;
					//break;

				//case 2:

					// continuation of automated tasks...
					//break;
			//}
		}

        int fileIndex = 1;

        private void btnSave_Click(object sender, EventArgs e)
        {
            HTMLDocument myDoc = new HTMLDocumentClass();
            myDoc = (HTMLDocument)axWebBrowser1.Document;

            IHTMLElementCollection ecol = myDoc.all;
            IHTMLElement elem = (IHTMLElement)ecol.item("mapindex");

            IHTMLElement elemPinCount = (IHTMLElement)ecol.item("pincount");
            IHTMLElement elemFirstPinIndex = (IHTMLElement)ecol.item("firstpinindex");


            string theIndex = elem.innerHTML;
            // innerHTML = <B>R1C1</B>...
            string[] stringSeparators = new string[] { "<BR>" };
            string[] splitResult;
            splitResult = theIndex.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);


            int closingTag = theIndex.IndexOf("<",1);

            //string rowCol = theIndex.Substring(3, closingTag - 3);

            //string indexFilePath = "C:/TestWebPages/Maps/Paris/Pages/Index[" + fileIndex.ToString() + "].txt";
            string indexFilePath = "C:/TestWebPages/Maps/NYC/Pages/Index[" + fileIndex.ToString() + "].txt";
            fileIndex++;

            using (StreamWriter outfile = new StreamWriter(indexFilePath))
            {
                bool isRCLine = true;
                foreach (string s in splitResult)
                {
                    string s0 = s;
                    // Walk through and get rid of all the HTML tags.
                    while(-1 != s0.IndexOf("<"))
                    {
                        int start =  s0.IndexOf("<");
                        int end = s0.IndexOf(">");
                        string toReplace = s0.Substring(start, end - start + 1);
                        string s1 = s0.Replace(toReplace, "");
                        string s2 = s1.Replace("&amp;", "&"); 
                        s0 = s2;
                    }

                    outfile.WriteLine(s0);
                    // ADD WRITE TO MASTER INDEX FILE
                    // Compute map page, should be fileIndex * 2

                    if (isRCLine)
                    {
                        outfile.WriteLine("");
                    }
                    isRCLine = false;
                }
            }

    
            using (TcpClient client = new TcpClient("localhost", 8888))
            using (NetworkStream n = client.GetStream())
            {
                BinaryWriter w = new BinaryWriter(n);
                w.Write("Save");
                w.Flush();



            }
            return;
        }

        bool runTimer = true;
        private void btnTimer_Click(object sender, EventArgs e)
        {
            if (runTimer)
            {
                timer1.Interval = 2000;
                timer1.Start();
            }
            else
            {
                timer1.Stop();
            }

            runTimer = !runTimer;
            return;
            // Put Timer Start HERE
            // On Timer firing
            // If there are more map pins, press the More button.
            // If no more pins on this cell, move to next cell. If end of row, go next row. If end of last row, stop.
            // Push save button.


        }

        int row = 1;
        int col = 1;
        private void timer1_Tick(object sender, EventArgs e)
        {
            if (20 < row)
            {
                return;
            } 


            HTMLDocument myDoc = new HTMLDocumentClass();
            myDoc = (HTMLDocument)axWebBrowser1.Document;

            string theHTML = myDoc.documentElement.outerHTML;

            IHTMLElementCollection ecol = myDoc.all;

            /////
            IHTMLInputElement elemPinCount = (IHTMLInputElement)ecol.item("pincount");
            string strPinCount = (string)elemPinCount.value;
            /////

           // IHTMLElement elemPinCount = (IHTMLElement)ecol.item("pincount");
           // string strPinCount = (string)elemPinCount.getAttribute("value");
          //  if(string.IsNullOrEmpty(strPinCount))
          //  {
           //     strPinCount = "0";
           // }
            int pinCount = Int16.Parse(strPinCount);

            IHTMLElement elemFirstPinIndex = (IHTMLElement)ecol.item("firstpinindex");

            string strFirstPinIndex = (string)elemFirstPinIndex.getAttribute("value");
            if(string.IsNullOrEmpty(strFirstPinIndex))
            {
                strFirstPinIndex = "0";
            }
            int firstPinIndex = Int16.Parse(strFirstPinIndex);

            IHTMLElement elemPlusSign = (IHTMLElement)ecol.item("plussign");
            IHTMLElement elemMSHTMLPlus = (IHTMLElement)ecol.item("mshtmlplus");

            Trace.WriteLine("Entering Tick - firstPinIndex: " + firstPinIndex.ToString() + "     pincount: " + pinCount.ToString() +
                "    row/col: " + row.ToString()+"/"+col.ToString());

            if (firstPinIndex+30 < pinCount )
            {
                // Get next block of index
                //firstPinIndex += 30;
                //if (pinCount < firstPinIndex)
                //{
                //    firstPinIndex = 0;
                //}

                //elemFirstPinIndex.setAttribute("value", firstPinIndex.ToString());
                //elemMSHTMLPlus.click(); 
                elemPlusSign.click();
            }
            else
            {
                // Move to next map
                firstPinIndex = 0;

                elemFirstPinIndex.setAttribute("value", firstPinIndex.ToString());
                elemMSHTMLPlus.click(); 

                IHTMLElement elemRight = (IHTMLElement)ecol.item("arrowright");
                IHTMLElement elemLeft = (IHTMLElement)ecol.item("arrowleft");
                IHTMLElement elemUp = (IHTMLElement)ecol.item("arrowup");

                elemRight.click();
                col++;
                Tuple<int, int, int> currentRow = grid[row - 1];


                if (currentRow.Item3 < col)
                {
                    elemUp.click();
                    row++;
                    if (20 < row)
                    {
                        return;
                    }
                    currentRow = grid[row - 1];
                    while (currentRow.Item2 < col)
                    {
                        elemLeft.click();
                        col--;
                    }
                }
            }
            btnSave_Click(sender, e);

            Trace.WriteLine("Leaving Tick - firstPinIndex: " + firstPinIndex.ToString() + "     pincount: " + pinCount.ToString() +
                "    row/col: " + row.ToString() + "/" + col.ToString() + "\r\n");

        } // TimerTick
	}
}

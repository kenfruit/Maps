using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Text.RegularExpressions;

namespace YelpScanner5
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnFormat_Click(object sender, EventArgs e)
        {
            string inputText = txtInput.Text;
            inputText = inputText.Replace("Open now", "");
            inputText = inputText.Replace("Closed now", "");
            inputText = Regex.Replace(inputText, "\t", " ");
            inputText = Regex.Replace(inputText, "\r\n", "&lt;br/&gt;");
            inputText = Regex.Replace(inputText, "Monday", "Mon");
            inputText = Regex.Replace(inputText, "Tuesday", "Tue");
            inputText = Regex.Replace(inputText, "Wednesday", "Wed");
            inputText = Regex.Replace(inputText, "Thursday", "Thu");
            inputText = Regex.Replace(inputText, "Friday", "Fri");
            inputText = Regex.Replace(inputText, "Saturday", "Sat");
            inputText = Regex.Replace(inputText, "Sunday", "Sun");
            inputText = Regex.Replace(inputText, "AM", "am");

            bool servesBreakfast = false;
            servesBreakfast |= System.Text.RegularExpressions.Regex.IsMatch(inputText, "[56789]:\\d\\d am");

            if (servesBreakfast)
            {
                inputText += "\tBREAKFAST";
            }

            txtOutput.Text = inputText;

            return;
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            txtOutput.Text = "";
            txtInput.Text = "";

        }
    }
}

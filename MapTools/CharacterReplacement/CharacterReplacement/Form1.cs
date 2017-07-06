using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace CharacterReplacement
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void btnToXMLFormat_Click(object sender, EventArgs e)
        {
            // If this text has already been partially converted, we can really screwing it up
            // by processing the &'s twice. So we will undo it, then redo it everytime 
            btnFromXMLFormat_Click(sender, e);

            string temp1 = txtToFix.Text;
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
            txtToFix.Text = temp2;

        }

        private void btnFromXMLFormat_Click(object sender, EventArgs e)
        {
            string temp1 = txtToFix.Text;
            string temp2 = temp1;
            temp1 = temp2.Replace("&lt;", "<");
            temp2 = temp1.Replace("&gt;", ">");
            temp1 = temp2.Replace("&#39;", "'");
            temp2 = temp1.Replace("&#192;", "À");
            temp1 = temp2.Replace("&#193;", "Á");
            temp2 = temp1.Replace("&#194;", "Â");
            temp1 = temp2.Replace("&#195;", "Ã");
            temp2 = temp1.Replace("&#196;", "Ä");
            temp1 = temp2.Replace("&#197;", "Å");
            temp2 = temp1.Replace("&#198;", "Æ");
            temp1 = temp2.Replace("&#199;", "Ç");
            temp2 = temp1.Replace("&#200;", "È");
            temp1 = temp2.Replace("&#201;", "É");
            temp2 = temp1.Replace("&#202;", "Ê");
            temp1 = temp2.Replace("&#203;", "Ë");
            temp2 = temp1.Replace("&#204;", "Ì");
            temp1 = temp2.Replace("&#205;", "Í");
            temp2 = temp1.Replace("&#206;", "Î");
            temp1 = temp2.Replace("&#207;", "Ï");
            temp2 = temp1.Replace("&#208;", "Ð");
            temp1 = temp2.Replace("&#209;", "Ñ");
            temp2 = temp1.Replace("&#210;", "Ò");
            temp1 = temp2.Replace("&#211;", "Ó");
            temp2 = temp1.Replace("&#212;", "Ô");
            temp1 = temp2.Replace("&#213;", "Õ");
            temp2 = temp1.Replace("&#214;", "Ö");
            temp1 = temp2.Replace("&#215;", "×");
            temp2 = temp1.Replace("&#216;", "Ø");
            temp1 = temp2.Replace("&#217;", "Ù");
            temp2 = temp1.Replace("&#218;", "Ú");
            temp1 = temp2.Replace("&#219;", "Û");
            temp2 = temp1.Replace("&#220;", "Ü");
            temp1 = temp2.Replace("&#221;", "Ý");
            temp2 = temp1.Replace("&#222;", "Þ");
            temp1 = temp2.Replace("&#223;", "ß");
            temp2 = temp1.Replace("&#224;", "à");
            temp1 = temp2.Replace("&#225;", "á");
            temp2 = temp1.Replace("&#226;", "â");
            temp1 = temp2.Replace("&#227;", "ã");
            temp2 = temp1.Replace("&#228;", "ä");
            temp1 = temp2.Replace("&#229;", "å");
            temp2 = temp1.Replace("&#230;", "æ");
            temp1 = temp2.Replace("&#231;", "ç");
            temp2 = temp1.Replace("&#232;", "è");
            temp1 = temp2.Replace("&#233;", "é");
            temp2 = temp1.Replace("&#234;", "ê");
            temp1 = temp2.Replace("&#235;", "ë");
            temp2 = temp1.Replace("&#236;", "ì");
            temp1 = temp2.Replace("&#237;", "í");
            temp2 = temp1.Replace("&#238;", "î");
            temp1 = temp2.Replace("&#239;", "ï");
            temp2 = temp1.Replace("&#240;", "ð");
            temp1 = temp2.Replace("&#241;", "ñ");
            temp2 = temp1.Replace("&#242;", "ò");
            temp1 = temp2.Replace("&#243;", "ó");
            temp2 = temp1.Replace("&#244;", "ô");
            temp1 = temp2.Replace("&#245;", "õ");
            temp2 = temp1.Replace("&#246;", "ö");
            temp1 = temp2.Replace("&#249;", "ù");
            temp2 = temp1.Replace("&#250;", "ú");
            temp1 = temp2.Replace("&#251;", "û");
            temp2 = temp1.Replace("&#252;", "ü");
            temp1 = temp2.Replace("&#253;", "ý");
            temp2 = temp1.Replace("&#255;", "ÿ");
            temp1 = temp2;
            temp2 = temp1.Replace(" & ", " &amp; ");
            txtToFix.Text = temp2;
        }

        
        
        private void btnToSearchFormat_Click(object sender, EventArgs e)
        {
            // Relplace the accented characters with English versions that can be input from the keyboard.

            // In case this has been converted to XML friendly form, we will undo that to get the original characgters
            // first. Saves time.
            btnFromXMLFormat_Click(sender, e);

            string temp1 = txtToFix.Text;
            string temp2 = temp1.Replace("À", "A");
            temp1 = temp2.Replace("Á", "A");
            temp2 = temp1.Replace("Â", "A");
            temp1 = temp2.Replace("Ã", "A");
            temp2 = temp1.Replace("Ä", "A");
            temp1 = temp2.Replace("Å", "A");
            temp2 = temp1.Replace("Æ", "A");
            temp1 = temp2.Replace("Ç", "C");
            temp2 = temp1.Replace("È", "E");
            temp1 = temp2.Replace("É", "E");
            temp2 = temp1.Replace("Ê", "E");
            temp1 = temp2.Replace("Ë", "E");
            temp2 = temp1.Replace("Ì", "I");
            temp1 = temp2.Replace("Í", "I");
            temp2 = temp1.Replace("Î", "I");
            temp1 = temp2.Replace("Ï", "I");
            temp2 = temp1.Replace("Ð", "D");
            temp1 = temp2.Replace("Ñ", "N");
            temp2 = temp1.Replace("Ò", "O");
            temp1 = temp2.Replace("Ó", "O");
            temp2 = temp1.Replace("Ô", "O");
            temp1 = temp2.Replace("Õ", "O");
            temp2 = temp1.Replace("Ö", "O");
            temp1 = temp2.Replace("×", "x");
            temp2 = temp1.Replace("Ø", "O");
            temp1 = temp2.Replace("Ù", "U");
            temp2 = temp1.Replace("Ú", "U");
            temp1 = temp2.Replace("Û", "U");
            temp2 = temp1.Replace("Ü", "U");
            temp1 = temp2.Replace("Ý", "Y");
            temp2 = temp1.Replace("Þ", "P");
            temp1 = temp2.Replace("ß", "B");
            temp2 = temp1.Replace("à", "a");
            temp1 = temp2.Replace("á", "a");
            temp2 = temp1.Replace("â", "a");
            temp1 = temp2.Replace("ã", "a");
            temp2 = temp1.Replace("ä", "a");
            temp1 = temp2.Replace("å", "a");
            temp2 = temp1.Replace("æ", "a");
            temp1 = temp2.Replace("ç", "c");
            temp2 = temp1.Replace("è", "e");
            temp1 = temp2.Replace("é", "e");
            temp2 = temp1.Replace("ê", "e");
            temp1 = temp2.Replace("ë", "e");
            temp2 = temp1.Replace("ì", "i");
            temp1 = temp2.Replace("í", "i");
            temp2 = temp1.Replace("î", "i");
            temp1 = temp2.Replace("ï", "i");
            temp2 = temp1.Replace("ð", "o");
            temp1 = temp2.Replace("ñ", "n");
            temp2 = temp1.Replace("ò", "o");
            temp1 = temp2.Replace("ó", "o");
            temp2 = temp1.Replace("ô", "o");
            temp1 = temp2.Replace("õ", "o");
            temp2 = temp1.Replace("ö", "o");
            temp1 = temp2.Replace("ù", "u");
            temp2 = temp1.Replace("ú", "u");
            temp1 = temp2.Replace("û", "u");
            temp2 = temp1.Replace("ü", "u");
            temp1 = temp2.Replace("ý", "y");
            temp2 = temp1.Replace("ÿ", "y");
            txtToFix.Text = temp2;
        }
    }
}

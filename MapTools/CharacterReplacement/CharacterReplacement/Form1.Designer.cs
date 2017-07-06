namespace CharacterReplacement
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnToSearchFormat = new System.Windows.Forms.Button();
            this.txtToFix = new System.Windows.Forms.TextBox();
            this.btnToXMLFormat = new System.Windows.Forms.Button();
            this.btnFromXMLFormat = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnToSearchFormat
            // 
            this.btnToSearchFormat.Location = new System.Drawing.Point(519, 769);
            this.btnToSearchFormat.Name = "btnToSearchFormat";
            this.btnToSearchFormat.Size = new System.Drawing.Size(108, 23);
            this.btnToSearchFormat.TabIndex = 0;
            this.btnToSearchFormat.Text = "To Search Format";
            this.btnToSearchFormat.UseVisualStyleBackColor = true;
            this.btnToSearchFormat.Click += new System.EventHandler(this.btnToSearchFormat_Click);
            // 
            // txtToFix
            // 
            this.txtToFix.Location = new System.Drawing.Point(12, 12);
            this.txtToFix.Multiline = true;
            this.txtToFix.Name = "txtToFix";
            this.txtToFix.Size = new System.Drawing.Size(637, 751);
            this.txtToFix.TabIndex = 1;
            // 
            // btnToXMLFormat
            // 
            this.btnToXMLFormat.Location = new System.Drawing.Point(271, 769);
            this.btnToXMLFormat.Name = "btnToXMLFormat";
            this.btnToXMLFormat.Size = new System.Drawing.Size(104, 23);
            this.btnToXMLFormat.TabIndex = 2;
            this.btnToXMLFormat.Text = "To XML Format";
            this.btnToXMLFormat.UseVisualStyleBackColor = true;
            this.btnToXMLFormat.Click += new System.EventHandler(this.btnToXMLFormat_Click);
            // 
            // btnFromXMLFormat
            // 
            this.btnFromXMLFormat.Location = new System.Drawing.Point(421, 769);
            this.btnFromXMLFormat.Name = "btnFromXMLFormat";
            this.btnFromXMLFormat.Size = new System.Drawing.Size(75, 23);
            this.btnFromXMLFormat.TabIndex = 3;
            this.btnFromXMLFormat.Text = "From XML Format";
            this.btnFromXMLFormat.UseVisualStyleBackColor = true;
            this.btnFromXMLFormat.Click += new System.EventHandler(this.btnFromXMLFormat_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(661, 804);
            this.Controls.Add(this.btnFromXMLFormat);
            this.Controls.Add(this.btnToXMLFormat);
            this.Controls.Add(this.txtToFix);
            this.Controls.Add(this.btnToSearchFormat);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnToSearchFormat;
        private System.Windows.Forms.TextBox txtToFix;
        private System.Windows.Forms.Button btnToXMLFormat;
        private System.Windows.Forms.Button btnFromXMLFormat;
    }
}


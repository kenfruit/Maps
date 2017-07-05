namespace WordDocFromCSharp
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
            this.btnDoIt = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.numericUpDownMaps = new System.Windows.Forms.NumericUpDown();
            this.numericUpDownIninerary = new System.Windows.Forms.NumericUpDown();
            this.txtDocName = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownMaps)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownIninerary)).BeginInit();
            this.SuspendLayout();
            // 
            // btnDoIt
            // 
            this.btnDoIt.Font = new System.Drawing.Font("Consolas", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnDoIt.Location = new System.Drawing.Point(12, 344);
            this.btnDoIt.Name = "btnDoIt";
            this.btnDoIt.Size = new System.Drawing.Size(219, 97);
            this.btnDoIt.TabIndex = 0;
            this.btnDoIt.Text = "Build Map Doc";
            this.btnDoIt.UseVisualStyleBackColor = true;
            this.btnDoIt.Click += new System.EventHandler(this.btnDoIt_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(13, 16);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(55, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "# of Maps";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(13, 63);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(105, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "# of Intinerary Pages";
            // 
            // numericUpDownMaps
            // 
            this.numericUpDownMaps.Location = new System.Drawing.Point(12, 32);
            this.numericUpDownMaps.Maximum = new decimal(new int[] {
            200,
            0,
            0,
            0});
            this.numericUpDownMaps.Name = "numericUpDownMaps";
            this.numericUpDownMaps.Size = new System.Drawing.Size(120, 20);
            this.numericUpDownMaps.TabIndex = 6;
            this.numericUpDownMaps.Value = new decimal(new int[] {
            110,
            0,
            0,
            0});
            // 
            // numericUpDownIninerary
            // 
            this.numericUpDownIninerary.Location = new System.Drawing.Point(12, 79);
            this.numericUpDownIninerary.Maximum = new decimal(new int[] {
            30,
            0,
            0,
            0});
            this.numericUpDownIninerary.Name = "numericUpDownIninerary";
            this.numericUpDownIninerary.Size = new System.Drawing.Size(120, 20);
            this.numericUpDownIninerary.TabIndex = 7;
            this.numericUpDownIninerary.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            // 
            // txtDocName
            // 
            this.txtDocName.Location = new System.Drawing.Point(12, 127);
            this.txtDocName.Name = "txtDocName";
            this.txtDocName.Size = new System.Drawing.Size(219, 20);
            this.txtDocName.TabIndex = 8;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(13, 111);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(84, 13);
            this.label3.TabIndex = 9;
            this.label3.Text = "DocumentName";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(243, 453);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.txtDocName);
            this.Controls.Add(this.numericUpDownIninerary);
            this.Controls.Add(this.numericUpDownMaps);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btnDoIt);
            this.Name = "Form1";
            this.Text = "Form1";
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownMaps)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownIninerary)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnDoIt;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown numericUpDownMaps;
        private System.Windows.Forms.NumericUpDown numericUpDownIninerary;
        private System.Windows.Forms.TextBox txtDocName;
        private System.Windows.Forms.Label label3;
    }
}


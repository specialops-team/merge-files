from flask import Flask, render_template, request, send_file
import pandas as pd
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    # We look for the 'files' key which matches the 'name' attribute in HTML
    uploaded_files = request.files.getlist('files')
    
    if not uploaded_files or uploaded_files[0].filename == '':
        return "No files selected or invalid upload", 400

    data_frames = []
    
    try:
        for file in uploaded_files:
            filename = file.filename.lower()
            
            # Use appropriate engine based on file extension
            if filename.endswith('.xlsx') or filename.endswith('.xls'):
                df = pd.read_excel(file)
                data_frames.append(df)
            elif filename.endswith('.csv'):
                df = pd.read_csv(file)
                data_frames.append(df)
        
        if not data_frames:
            return "No valid Excel or CSV data found in uploaded files", 400

        # Stack rows vertically
        combined_df = pd.concat(data_frames, ignore_index=True)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            combined_df.to_excel(writer, sheet_name='Merged_Data', index=False)
        
        output.seek(0)
        
        return send_file(
            output,
            as_attachment=True,
            download_name="merged_catalog_report.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        return f"Error processing files: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)
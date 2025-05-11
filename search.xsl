<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Search Bar</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.5;
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 15px;
                    }
                    .search-container {
                        margin-bottom: 15px;
                    }
                    #searchInput {
                        width: 300px;
                        padding: 8px;
                        margin-right: 10px;
                        font-size: 14px;
                    }
                    button {
                        padding: 8px 12px;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    .result {
                        margin: 15px 0;
                        padding: 10px;
                        border: 1px solid #ccc;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                    }
                    span.highlight {
                        background-color: yellow;
                    }
                    a {
                        text-decoration: none;
                        color: #007acc;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Document Search</h1>  <!-- This is the header that was missing -->
                
                <div class="search-container">
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Enter search term..." 
                        onkeydown="if(event.key === 'Enter') searchXML();"
                    />
                    <button onclick="searchXML()">Search</button>
                </div>
                
                <a href="index.xml">Back to Index</a>
                <div id="results"></div>

                <!-- Load script at the END of the body -->
                <script src="script.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

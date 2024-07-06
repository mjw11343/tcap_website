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
                    }
                    .search-container {
                        margin: 20px;
                    }
                    .result {
                        margin: 10px 0;
                        padding: 10px;
                        border: 1px solid #ccc;
                    }
                    span.highlight {
                        background-color: yellow;
                    }
                </style>
            </head>
            <body>
                <div class="search-container">
                    <input type="text" id="searchInput" placeholder="Search..."/>
                    <button onclick="searchXML()">Search</button>
                </div>
                <div id="results"></div>
                <a href="index.xml">Back to Index</a>

                <script src="script.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

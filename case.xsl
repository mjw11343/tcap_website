<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title><xsl:value-of select="/case/@title"/></title>
                <link rel="stylesheet" type="text/css" href="../style.css"/>
            </head>
            <body>
                <h1><xsl:value-of select="/case/@title"/></h1>
                <div>
                    <xsl:apply-templates select="/case/*"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="*">
        <div class="datapoint">
            <p><strong><xsl:value-of select="heading"/>:</strong></p>
            <p><xsl:value-of select="text"/></p>
        </div>
    </xsl:template>
</xsl:stylesheet>

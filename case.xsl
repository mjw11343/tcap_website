<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title><xsl:value-of select="/case/@title"/></title>
                <link rel="stylesheet" type="text/css" href="../style.css"/>
            </head>
            <body>
                <h1><xsl:value-of select="/case/@title"/></h1>
                <ul>
                    <xsl:for-each select="/case/link">
                        <li><a href="{@href}"><xsl:value-of select="@title"/></a></li>
                    </xsl:for-each>
                </ul>
                <div>
                    <xsl:apply-templates select="/case/*[not(self::link)]"/>
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
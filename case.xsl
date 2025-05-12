<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title><xsl:value-of select="/case/@title"/></title>
                <link rel="stylesheet" type="text/css" href="../../style.css"/>
            </head>
            <body>
                <xsl:variable name="basePath" select="/case/@collection_path" />
                <div style="display: flex; align-items: flex-end;">
                    <img width="200" style="margin-right: 15px;">
                        <xsl:attribute name="src">
                            <xsl:value-of select="concat($basePath, 'img/Untitled_Artwork_6.png')" />
                        </xsl:attribute>
                    </img>
                    <h1 style="margin: 0;"><xsl:value-of select="/case/@title"/></h1>
                </div>
                <ul>
                    <xsl:for-each select="/case/link">
                        <!-- Wrap each case link inside a styled ul and li -->
                        <ul style="list-style-type: none; padding: 0; display: flex; align-items: center;">
                            <li style="display: flex; align-items: center; margin: 5px;">
                                
                                <!-- Anchor Tag for the Link -->
                                <a href="{@href}" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
                                    <!-- Title Display -->
                                    <xsl:value-of select="@title"/>
                                    
                                    <!-- Image with dynamic src -->
                                    <img width="50" style="margin-left: 8px;">
                                        <xsl:attribute name="src">
                                            <xsl:value-of select="concat($basePath, 'img/Untitled_Artwork_2-rotated.png')" />
                                        </xsl:attribute>
                                    </img>
                                </a>
                            </li>
                        </ul>
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
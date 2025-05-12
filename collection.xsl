<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <xsl:variable name="basePath" select="/document/@collection_path" />
                <title><xsl:value-of select="/document/@title"/></title>
                <link rel="stylesheet" type="text/css">
                    <xsl:attribute name="href">
                        <xsl:value-of select="concat($basePath, 'style.css')" />
                    </xsl:attribute>
                </link>
            </head>
            <body>
                <xsl:variable name="basePath" select="/document/@collection_path" />
                <div style="display: flex; align-items: flex-end;">
                    <img width="200" style="margin-right: 15px;">
                        <xsl:attribute name="src">
                            <xsl:value-of select="concat($basePath, 'img/Untitled_Artwork_6.png')" />
                        </xsl:attribute>
                    </img>
                    <h1 style="margin: 0;"><xsl:value-of select="/document/@title"/></h1>
                </div>
                <hr/>
                <p><xsl:value-of select="/document/content/description"/></p>

                <!-- Store the base path value in a variable before the loop -->

                <ul>
                    <xsl:for-each select="/document/collection/link">
                        <ul style="list-style-type: none; padding: 0; display: flex; align-items: center;">
                            <li style="display: flex; align-items: center; margin: 5px;">
                                <a href="{@href}" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
                                    <xsl:value-of select="@title"/>

                                    <!-- Properly Insert the src using the stored variable -->
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
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

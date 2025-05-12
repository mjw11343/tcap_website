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
                <div class="flex-row">
                    <img class="header-img" width="200">
                        <xsl:attribute name="src">
                            <xsl:value-of select="concat($basePath, 'img/Untitled_Artwork_6.png')" />
                        </xsl:attribute>
                    </img>
                    <h1><xsl:value-of select="/document/@title"/></h1>
                </div>
                <hr/>
                <p><xsl:value-of select="/document/content/description"/></p>

                <!-- Store the base path value in a variable before the loop -->

                <ul>
                    <xsl:for-each select="/document/collection/link">
                        <li>
                            <a href="{@href}">
                                <xsl:value-of select="@title"/>
                                <img width="50">
                                    <xsl:attribute name="src">
                                        <xsl:value-of select="concat($basePath, 'img/Untitled_Artwork_2-rotated.png')" />
                                    </xsl:attribute>
                                </img>
                            </a>
                        </li>
                    </xsl:for-each>
                </ul>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

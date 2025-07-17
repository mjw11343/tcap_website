<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html"
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    encoding="UTF-8"
    indent="yes"/>

  <!-- Main page template -->
  <xsl:template match="/case">
    <html>
      <head>
        <title><xsl:value-of select="@title"/></title>
        <link rel="stylesheet" type="text/css" href="../../style.css"/>
      </head>
      <body>
        <div class="flex-row">
          <img class="header-img" width="200" src="../../img/Untitled_Artwork_6.png" />
          <h1><xsl:value-of select="@title"/></h1>
        </div>

        <!-- Link list -->
        <ul>
          <xsl:for-each select="link">
            <li>
              <a href="{@href}">
                <xsl:value-of select="@title"/>
                <img width="50" src="../../img/Untitled_Artwork_2-rotated.png" />
              </a>
            </li>
          </xsl:for-each>
        </ul>

        <!-- Datapoints -->
        <div>
          <xsl:apply-templates select="datapoint"/>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- Render each datapoint -->
  <xsl:template match="datapoint">
    <div class="section-container">
      <p class="section-title">
        <xsl:value-of select="title"/>:
      </p>
      <div class="datapoint-content">
        <xsl:apply-templates select="data/*"/>
      </div>
    </div>
  </xsl:template>

  <!-- Paragraphs -->
  <xsl:template match="p">
    <p><xsl:apply-templates/></p>
  </xsl:template>

  <!-- Preserve bold, italic, underline tags -->
  <xsl:template match="b">
    <b><xsl:apply-templates/></b>
  </xsl:template>
  <xsl:template match="i">
    <i><xsl:apply-templates/></i>
  </xsl:template>
  <xsl:template match="u">
    <u><xsl:apply-templates/></u>
  </xsl:template>

  <!-- Base64-encoded images -->
  <xsl:template match="image">
    <img>
      <xsl:attribute name="src">
        <xsl:text>data:image/png;base64,</xsl:text>
        <xsl:value-of select="."/>
      </xsl:attribute>
    </img>
  </xsl:template>

  <!-- Table rendering -->
  <xsl:template match="table">
    <table border="1">
      <xsl:apply-templates/>
    </table>
  </xsl:template>
  <xsl:template match="tr">
    <tr><xsl:apply-templates/></tr>
  </xsl:template>
  <xsl:template match="td">
    <td><xsl:apply-templates/></td>
  </xsl:template>

  <!-- Fallback: text nodes and anything else -->
  <xsl:template match="text()">
    <xsl:value-of select="."/>
  </xsl:template>

</xsl:stylesheet>
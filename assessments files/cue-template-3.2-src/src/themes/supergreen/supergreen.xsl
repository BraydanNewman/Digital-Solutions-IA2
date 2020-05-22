<?xml version="1.0" encoding="UTF-8"?>
<!--
	
	R: "It was BAD! It had no fire, no energy, no nothing! So tomorrow from 5 to 7 will you PLEASE act like you have more than a two word vocabulary. It must be green."
	K: "Can I talk to you for a second? I didn't come here to play Pumbaa on the radio. So tomorrow from 5 to 7 your gonna give yourself a hand, green?"
    R: "Supergreen"
    
-->
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.1">

	<xsl:import href="../../xslt/identity.xsl"/>

  	<xsl:output
		method="xml"
		version="1.0"
		encoding="UTF-8"
		omit-xml-declaration="yes"
		indent="no"
	/>

	<!-- add theme styles -->
	<xsl:template match="head">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<link rel="stylesheet" type="text/css" href="theme/agency.css" media="all"/>
            <link rel="stylesheet" type="text/css" href="theme/sg-layout-medium.css" media="only all and (min-width: 43em) and (max-width: 65em)"/>
            <link rel="stylesheet" type="text/css" href="theme/sg-layout-large.css" media="only all and (min-width: 65em)"/>
			<xsl:comment>[if lt IE 8]>&lt;link rel="stylesheet" href="theme/agency-ie.css" type="text/css" media="all" />&lt;![endif]</xsl:comment>
		</xsl:copy>
	</xsl:template>
    
    <!-- append columns script before </body> -->
    <xsl:template match="body">
    	<xsl:copy>
            <xsl:apply-templates/>
            
            <script type="text/javascript" src="theme/column-heights.js"></script>
        </xsl:copy>
    </xsl:template>
	
    <!-- add extra #header-wrapper for this theme -->
    <xsl:template match="div[@id='header']">
    	<div id="header-wrapper">
            <div id="header">
                <xsl:apply-templates/>
            </div>
            
            <div id="nav-site">
	            <xsl:apply-templates select="../div[@id='nav-site']/*"/>
            </div>
        </div><xsl:comment> end #header-wrapper </xsl:comment>
        
    </xsl:template>
    <xsl:template match="div[@id='nav-site']"/>
	
    <!-- add search button image -->
	<xsl:template match="form[@id='search-form']//input[@class='submit']">
		<input type="image" class="submit" src="theme/search-button.png" value="Search" />
	</xsl:template>
    
    <!-- add extra inner div to support transparent border -->
    <xsl:template match="div[@class='article']/div[@class='box-sizing']|div[@class='aside']/div[@class='box-sizing']">
    	<div class="box-sizing"><div class="border">
        	<xsl:apply-templates/>
        </div></div>
    </xsl:template>
    
    
    <!-- add extra #meta-wrapper to support transparent border -->
    <xsl:template match="div[@id='document-properties']">
    	<div id="meta-wrapper"><div class="meta-box-sizing"><div class="border">
            <div id="document-properties">
                <xsl:apply-templates/>
            </div>
            
            <div id="page-feedback">
	            <xsl:apply-templates select="../div[@id='page-feedback']/*"/>
            </div>
        </div></div></div><xsl:comment> end #meta-wrapper </xsl:comment>
        
    </xsl:template>
    <xsl:template match="div[@id='page-feedback']"/>
    
</xsl:stylesheet>
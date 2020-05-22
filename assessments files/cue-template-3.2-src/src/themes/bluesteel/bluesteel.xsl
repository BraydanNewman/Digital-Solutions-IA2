<?xml version="1.0" encoding="UTF-8"?>
<!--

	"The man has only one look! Blue Steel? Ferrari? Le Tigra? They're the same face! Doesn't anybody notice this?"

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
			<link rel="stylesheet" type="text/css" href="theme/agency.css" media="all" />
            <link rel="stylesheet" type="text/css" href="theme/bs-layout-large.css" media="only all and (min-width: 65em)" />
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

</xsl:stylesheet>
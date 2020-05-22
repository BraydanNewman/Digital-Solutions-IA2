<?xml version="1.0" encoding="UTF-8"?>
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
		</xsl:copy>
	</xsl:template>


</xsl:stylesheet>
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.1">

	<!-- comment handling -->
	<xsl:template match="comment()">
		<xsl:choose>
			<!-- passthrough conditional comments (and downlevel-revealed conditional comments) -->
			<xsl:when test="starts-with(.,'[') or starts-with(.,'&lt;')">
				<xsl:copy/>
			</xsl:when>
			<!-- passthrough script -->
			<xsl:when test="name(..) = 'script'">
				<xsl:copy/>
			</xsl:when>
			<!-- passthrough SSI -->
			<xsl:when test="starts-with(.,'#')">
				<xsl:copy/>
			</xsl:when>
			<!-- other comments are removed -->
		</xsl:choose>
	</xsl:template>


	<!-- passthrough attributes and text-->
	<xsl:template match="@*|text()">
		<xsl:copy/>
	</xsl:template>


	<!-- create elements (output namespace applies) -->
	<xsl:template match="*" name="identity">
		<xsl:element name="{name()}">
			<xsl:apply-templates select="@*|node()"/>
		</xsl:element>
	</xsl:template>


</xsl:stylesheet>
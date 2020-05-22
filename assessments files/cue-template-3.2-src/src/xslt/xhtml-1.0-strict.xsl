<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml"
	version="1.1">


	<xsl:include href="identity.xsl"/>
	<xsl:include href="html5-to-html4.xsl"/>
	<xsl:include href="cue.xsl"/>


  	<xsl:output
		method="xml"
		version="1.0"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
		encoding="UTF-8"
		omit-xml-declaration="yes"
		indent="no"
	/>


	<!-- html, @xmlns, @xml:lang -->
	<xsl:template match="/*">
		<html>
			<xsl:attribute name="xml:lang">
				<xsl:value-of select="@lang"/>
			</xsl:attribute>
			<xsl:apply-templates select="@*|node()"/>
		</html>
	</xsl:template>
	
	
	<!-- no short tags for script, textarea -->
	<xsl:template match="script[not(node())]|textarea[not(node())]">
		<xsl:element name="{name()}">
			<xsl:apply-templates select="@*|node()"/>
			<xsl:text> </xsl:text>
		</xsl:element>
	</xsl:template>
	

</xsl:stylesheet>
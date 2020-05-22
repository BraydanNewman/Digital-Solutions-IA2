<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.1">


	<xsl:include href="identity.xsl"/>
	<xsl:include href="html5-to-html4.xsl"/>
	<xsl:include href="cue.xsl"/>
	

  	<xsl:output
		method="html"
		version="1.0"
		doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
		doctype-system="http://www.w3.org/TR/html4/loose.dtd"
		encoding="UTF-8"
		omit-xml-declaration="yes"
		indent="no"
	/>


	<!-- suppress: (duplicate) meta charset (output automatically for HTML) -->
	<xsl:template match="meta[@http-equiv='Content-Type']"/>

	<!-- fix XHTML empty tag syntax within IE conditional comments, e.g. <link /> -->
	<xsl:template match="comment()[starts-with(.,'[') and contains(., '/>')]">
		<xsl:comment>
			<xsl:call-template name="empty-tag">
				<xsl:with-param name="string" select="."/>					
			</xsl:call-template>
		</xsl:comment>
	</xsl:template>

	<!-- empty tag syntax within conditional comments -->
	<xsl:template name="empty-tag">
		<xsl:param name="string"/>
		<xsl:choose>
			<!-- replace ' />' with '>' -->
			<xsl:when test="contains($string, ' />')">
				<xsl:value-of select="substring-before($string, ' />')"/>
				<xsl:text>&gt;</xsl:text>
				<xsl:call-template name="empty-tag">
					<xsl:with-param name="string" select="substring-after($string, ' />')"/>
				</xsl:call-template>
			</xsl:when>
			<!-- replace '/>' with '>' -->
			<xsl:when test="contains($string, '/>')">
				<xsl:value-of select="substring-before($string, '/>')"/>
				<xsl:text>&gt;</xsl:text>
				<xsl:call-template name="empty-tag">
					<xsl:with-param name="string" select="substring-after($string, '/>')"/>
				</xsl:call-template>
			</xsl:when>
			<!-- passthrough -->
			<xsl:otherwise>
				<xsl:value-of select="$string"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
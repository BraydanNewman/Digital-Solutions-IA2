<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.1">


	<xsl:template match="article|aside|nav|section" priority="1">
		<div>
			<xsl:attribute name="class">
				<xsl:value-of select="name()"/>
				<xsl:if test="@class">
					<xsl:text> </xsl:text>
					<xsl:value-of select="@class"/>
				</xsl:if>
			</xsl:attribute>
			<xsl:apply-templates select="@*[name()!='class']|node()"/>
		</div>
	</xsl:template>


	<xsl:template match="input[@type='search']/@type">
		<xsl:attribute name="type">text</xsl:attribute>
	</xsl:template>


</xsl:stylesheet>
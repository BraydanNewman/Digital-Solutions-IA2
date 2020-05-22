<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.1">

	<xsl:param name="variant"/>
	<xsl:param name="columns">
		<xsl:choose>
			<xsl:when test="$variant = 'applications'">1</xsl:when>
            <xsl:when test="$variant = 'search-results'">1</xsl:when>
			<xsl:otherwise>3</xsl:otherwise>
		</xsl:choose>
	</xsl:param>
	<xsl:param name="test"/>


	<!-- suppress: nav-site and page-feedback for applications -->
	<xsl:template match="*[@id='nav-site' and $variant = 'applications']"/>
	<xsl:template match="li[a/@href = '#nav-site' and $variant = 'applications']"/>
    
	<!-- suppress: 3rd column -->
	<xsl:template match="*[@class='aside' and 3 > $columns]"/>
	<!-- suppress: section navigation (2nd column) -->
	<xsl:template match="*[@id='nav-section' and 2 > $columns]"/>
	<xsl:template match="li[a/@href = '#nav-section' and 2 > $columns]"/>
	
    <!-- apply class names to body when for 1 columns -->
    <xsl:template match="body[$variant = 'applications']">
        <body>
            <xsl:attribute name="class">
                <xsl:text>application</xsl:text>
                <xsl:if test="@class">
                    <xsl:text> </xsl:text>
                   	<xsl:value-of select="@class"/>
                </xsl:if>
            </xsl:attribute>
            <xsl:apply-templates select="@*[name()!='class']|node()"/>
        </body>
    </xsl:template>
	
    <xsl:template match="div[@id='replace-content-here' and $variant = '']">
		<xsl:apply-templates select="document('../components/welcome/welcome.html')/div[@class='article']/*"/>
    </xsl:template>
    
    <xsl:template match="div[@id='replace-content-here' and $variant = 'text-content']">
		<xsl:apply-templates select="document('../components/text-content/text-content.html')/div[@class='article']/*"/>
    </xsl:template>
    
    <xsl:template match="div[@id='replace-content-here' and $variant = 'accessibility']">
		<xsl:apply-templates select="document('../components/help-content/accessibility.html')/div[@class='article']/*"/>
    </xsl:template>
    
    <xsl:template match="div[@id='replace-content-here' and $variant = 'video']">
		<xsl:apply-templates select="document('../components/video/video.html')/div[@class='article']/*"/>
    </xsl:template>
    
    <xsl:template match="div[@id='replace-content-here' and $variant = 'search-results']">
		<xsl:apply-templates select="document('../components/search-results/search-results.html')/div[@class='article']/*"/>
    </xsl:template>
    <xsl:template match="div[@id='document-properties' and $variant = 'search-results']"/>
    
    <xsl:template match="div[@id='replace-content-here' and $variant = 'applications']">
		<xsl:apply-templates select="document('../components/applications/applications.html')/div[@class='article']/*"/>
    </xsl:template>
    <xsl:template match="div[@id='document-properties' and $variant = 'applications']"/>
	
	<!-- testing? -->
	<xsl:template match="body[$test = 'true']">
		<xsl:element name="{name()}">
			<xsl:apply-templates select="@*|node()"/>
			<script>
				<xsl:attribute name="type">text/javascript</xsl:attribute>
				<xsl:attribute name="src">test-cue.js</xsl:attribute>
				<xsl:text> </xsl:text>
			</script>
		</xsl:element>
	</xsl:template>


</xsl:stylesheet>
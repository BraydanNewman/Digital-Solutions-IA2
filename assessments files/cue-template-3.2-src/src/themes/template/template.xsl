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

	<!-- add section nav script comment -->
	<xsl:template match="body/script[1]">
		<script type="text/javascript">
			<xsl:comment>
			// OPTIONAL: manually specify the current page title (to determine which menus are open onload)  
			//var currentPageTitle = '_INSERT_PAGE_TITLE_HERE_';  
			</xsl:comment>
		</script>  
		<xsl:call-template name="identity"/>
	</xsl:template>


</xsl:stylesheet>
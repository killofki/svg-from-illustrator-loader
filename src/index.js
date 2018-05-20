var { getOptions } = require( 'loader-utils' ) 

module .exports = function ( source ) { 
	var 
		  options = getOptions( this ) 
		, { 
			  name = '[name]-[index]' 
			, illustratorClass = 'cls' 
			, remove = {} 
			, exportStyle = 'default' 
			, defaultName 
			} 
			= options 
		; 
	
	if ( exportStyle === 'name' && ! defaultName ) { 
		throw new Error( 'if exportStyle is a name, defaultName is required' ) 
		} 
	
	if ( exportStyle !== 'name' && defaultName ) { 
		throw new Error( 'if exportStyle is not a name, defaultName is not needed' ) 
		} 
	
	source = JSON .stringify( source ) 
	
	var titlePattern = /<title>(.+)<\/title>/ 
	var [ , iconName ] = source .match( titlePattern ) || [ , defaultName ]; // match 
	
	source = 
		source 
		.replace( 
			  new RegExp( `(\\.)?${ illustratorClass }-(\\d+)`, 'g' ) 
			, ( _, dot, iconIndex ) => 
				[ 
					  `${ dot || '' }${ name }` 
					
					, [ '[name]', iconName ] 
					, [ '[index]', iconIndex ] 
					] 
				.reduce( ( t, [ r, v ] ) => t .replace( r, v )  ) 
			) 
	source = 
		[ 
			  source 
			
			, remove .title && titlePattern // regExp 
			, remove .xmlns && ' xmlns="http://www.w3.org/2000/svg"' 
			, ... ( remove .space ? [ 
				
				  /[\r\n]+/g 
				, /\s{2,}/g 
				, /: /g 
				
				] : [] ) 
			] 
		.reduce( ( t, r ) => r ? t .replace( r, '' ) : t ) 
	
	exportStyle = 
		  ( exportStyle === 'none' ) ? '' 
		: ( exportStyle === 'name' ) ? `.${ iconName }` 
		: ' .default' 
	return `module .exports${ exportStyle } = ${ source }` 
	} 

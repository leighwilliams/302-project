/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function ($, window, document, undefined) {
  'use strict';

  // Used to retrieve Foundation media queries from CSS.
  if($('head').has('.foundation-mq-small').length === 0) {
    $('head').append('<meta class="foundation-mq-small">');
  }

  if($('head').has('.foundation-mq-medium').length === 0) {
    $('head').append('<meta class="foundation-mq-medium">');
  }

  if($('head').has('.foundation-mq-large').length === 0) {
    $('head').append('<meta class="foundation-mq-large">');
  }

  if($('head').has('.foundation-mq-xlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xlarge">');
  }

  if($('head').has('.foundation-mq-xxlarge').length === 0) {
    $('head').append('<meta class="foundation-mq-xxlarge">');
  }

  // Embed FastClick (this should be removed later)
  function FastClick(layer){'use strict';var oldOnClick,self=this;this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=10;this.layer=layer;if(!layer||!layer.nodeType){throw new TypeError('Layer must be a document node');}this.onClick=function(){return FastClick.prototype.onClick.apply(self,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(self,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(self,arguments)};this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(self,arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(self,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(self,arguments)};if(FastClick.notNeeded(layer)){return}if(this.deviceIsAndroid){layer.addEventListener('mouseover',this.onMouse,true);layer.addEventListener('mousedown',this.onMouse,true);layer.addEventListener('mouseup',this.onMouse,true)}layer.addEventListener('click',this.onClick,true);layer.addEventListener('touchstart',this.onTouchStart,false);layer.addEventListener('touchmove',this.onTouchMove,false);layer.addEventListener('touchend',this.onTouchEnd,false);layer.addEventListener('touchcancel',this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;if(type==='click'){rmv.call(layer,type,callback.hijacked||callback,capture)}else{rmv.call(layer,type,callback,capture)}};layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;if(type==='click'){adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){if(!event.propagationStopped){callback(event)}}),capture)}else{adv.call(layer,type,callback,capture)}}}if(typeof layer.onclick==='function'){oldOnClick=layer.onclick;layer.addEventListener('click',function(event){oldOnClick(event)},false);layer.onclick=null}}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf('Android')>0;FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&(/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);FastClick.prototype.needsClick=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'button':case'select':case'textarea':if(target.disabled){return true}break;case'input':if((this.deviceIsIOS&&target.type==='file')||target.disabled){return true}break;case'label':case'video':return true}return(/\bneedsclick\b/).test(target.className)};FastClick.prototype.needsFocus=function(target){'use strict';switch(target.nodeName.toLowerCase()){case'textarea':case'select':return true;case'input':switch(target.type){case'button':case'checkbox':case'file':case'image':case'radio':case'submit':return false}return!target.disabled&&!target.readOnly;default:return(/\bneedsfocus\b/).test(target.className)}};FastClick.prototype.sendClick=function(targetElement,event){'use strict';var clickEvent,touch;if(document.activeElement&&document.activeElement!==targetElement){document.activeElement.blur()}touch=event.changedTouches[0];clickEvent=document.createEvent('MouseEvents');clickEvent.initMouseEvent('click',true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);clickEvent.forwardedTouchEvent=true;targetElement.dispatchEvent(clickEvent)};FastClick.prototype.focus=function(targetElement){'use strict';var length;if(this.deviceIsIOS&&targetElement.setSelectionRange){length=targetElement.value.length;targetElement.setSelectionRange(length,length)}else{targetElement.focus()}};FastClick.prototype.updateScrollParent=function(targetElement){'use strict';var scrollParent,parentElement;scrollParent=targetElement.fastClickScrollParent;if(!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement;targetElement.fastClickScrollParent=parentElement;break}parentElement=parentElement.parentElement}while(parentElement)}if(scrollParent){scrollParent.fastClickLastScrollTop=scrollParent.scrollTop}};FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){'use strict';if(eventTarget.nodeType===Node.TEXT_NODE){return eventTarget.parentNode}return eventTarget};FastClick.prototype.onTouchStart=function(event){'use strict';var targetElement,touch,selection;if(event.targetTouches.length>1){return true}targetElement=this.getTargetElementFromEventTarget(event.target);touch=event.targetTouches[0];if(this.deviceIsIOS){selection=window.getSelection();if(selection.rangeCount&&!selection.isCollapsed){return true}if(!this.deviceIsIOS4){if(touch.identifier===this.lastTouchIdentifier){event.preventDefault();return false}this.lastTouchIdentifier=touch.identifier;this.updateScrollParent(targetElement)}}this.trackingClick=true;this.trackingClickStart=event.timeStamp;this.targetElement=targetElement;this.touchStartX=touch.pageX;this.touchStartY=touch.pageY;if((event.timeStamp-this.lastClickTime)<200){event.preventDefault()}return true};FastClick.prototype.touchHasMoved=function(event){'use strict';var touch=event.changedTouches[0],boundary=this.touchBoundary;if(Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary){return true}return false};FastClick.prototype.onTouchMove=function(event){'use strict';if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event)){this.trackingClick=false;this.targetElement=null}return true};FastClick.prototype.findControl=function(labelElement){'use strict';if(labelElement.control!==undefined){return labelElement.control}if(labelElement.htmlFor){return document.getElementById(labelElement.htmlFor)}return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea')};FastClick.prototype.onTouchEnd=function(event){'use strict';var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick){return true}if((event.timeStamp-this.lastClickTime)<200){this.cancelNextClick=true;return true}this.lastClickTime=event.timeStamp;trackingClickStart=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(this.deviceIsIOSWithBadTarget){touch=event.changedTouches[0];targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement;targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent}targetTagName=targetElement.tagName.toLowerCase();if(targetTagName==='label'){forElement=this.findControl(targetElement);if(forElement){this.focus(targetElement);if(this.deviceIsAndroid){return false}targetElement=forElement}}else if(this.needsFocus(targetElement)){if((event.timeStamp-trackingClickStart)>100||(this.deviceIsIOS&&window.top!==window&&targetTagName==='input')){this.targetElement=null;return false}this.focus(targetElement);if(!this.deviceIsIOS4||targetTagName!=='select'){this.targetElement=null;event.preventDefault()}return false}if(this.deviceIsIOS&&!this.deviceIsIOS4){scrollParent=targetElement.fastClickScrollParent;if(scrollParent&&scrollParent.fastClickLastScrollTop!==scrollParent.scrollTop){return true}}if(!this.needsClick(targetElement)){event.preventDefault();this.sendClick(targetElement,event)}return false};FastClick.prototype.onTouchCancel=function(){'use strict';this.trackingClick=false;this.targetElement=null};FastClick.prototype.onMouse=function(event){'use strict';if(!this.targetElement){return true}if(event.forwardedTouchEvent){return true}if(!event.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(event.stopImmediatePropagation){event.stopImmediatePropagation()}else{event.propagationStopped=true}event.stopPropagation();event.preventDefault();return false}return true};FastClick.prototype.onClick=function(event){'use strict';var permitted;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(event.target.type==='submit'&&event.detail===0){return true}permitted=this.onMouse(event);if(!permitted){this.targetElement=null}return permitted};FastClick.prototype.destroy=function(){'use strict';var layer=this.layer;if(this.deviceIsAndroid){layer.removeEventListener('mouseover',this.onMouse,true);layer.removeEventListener('mousedown',this.onMouse,true);layer.removeEventListener('mouseup',this.onMouse,true)}layer.removeEventListener('click',this.onClick,true);layer.removeEventListener('touchstart',this.onTouchStart,false);layer.removeEventListener('touchmove',this.onTouchMove,false);layer.removeEventListener('touchend',this.onTouchEnd,false);layer.removeEventListener('touchcancel',this.onTouchCancel,false)};FastClick.notNeeded=function(layer){'use strict';var metaViewport;if(typeof window.ontouchstart==='undefined'){return true}if((/Chrome\/[0-9]+/).test(navigator.userAgent)){if(FastClick.prototype.deviceIsAndroid){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport&&metaViewport.content.indexOf('user-scalable=no')!==-1){return true}}else{return true}}if(layer.style.msTouchAction==='none'){return true}return false};FastClick.attach=function(layer){'use strict';return new FastClick(layer)};if(typeof define!=='undefined'&&define.amd){define(function(){'use strict';return FastClick})}else if(typeof module!=='undefined'&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick}else{window.FastClick=FastClick}


  // Enable FastClick
  if(typeof FastClick !== 'undefined') {
    FastClick.attach(document.body);
  }

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        return $(context.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  /*
    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function( $ ) {

  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating


  var animating,
    lastTime = 0,
    vendors = ['webkit', 'moz'],
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame;

  for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
      window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
  }

  function raf() {
    if ( animating ) {
      requestAnimationFrame( raf );
      jQuery.fx.tick();
    }
  }

  if ( requestAnimationFrame ) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
    jQuery.fx.timer = function( timer ) {
      if ( timer() && jQuery.timers.push( timer ) && !animating ) {
        animating = true;
        raf();
      }
    };

    jQuery.fx.stop = function() {
      animating = false;
    };
  } else {
    // polyfill
    window.requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
        id = window.setTimeout( function() {
          callback( currTime + timeToCall );
        }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
      
  }

  }( jQuery ));


  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^[\\/'"]+|(;\s?})+|[\\/'"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.0.0',

    media_queries : {
      small : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    init : function (scope, libraries, method, options, response) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib['data_options'] = this.lib_methods.data_options;
      lib['bindings'] = this.lib_methods.bindings;
      lib['S'] = S;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      throttle : function(fun, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute
      data_options : function (el) {
        var opts = {}, ii, p, opts_arr, opts_len,
            data_options = el.data('options');

        if (typeof data_options === 'object') {
          return data_options;
        }

        opts_arr = (data_options || ':').split(';'),
        opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      },

      register_media : function(media, media_class) {
        if(Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '">');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      addCustomRule : function(rule, media) {
        if(media === undefined) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if(query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + 
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },

      loaded : function (image, callback) {
        function loaded () {
          callback(image[0]);
        }

        function bindLoad () {
          this.one('load', loaded);

          if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var src = this.attr( 'src' ),
                param = src.match( /\?/ ) ? '&' : '?';

            param += 'random=' + (new Date()).getTime();
            this.attr('src', src + param);
          }
        }

        if (!image.attr('src')) {
          loaded();
          return;
        }

        if (image[0].complete || image[0].readyState === 4) {
          loaded();
        } else {
          bindLoad.call(image);
        }
      },

      bindings : function (method, options) {
        var self = this,
            should_bind_events = !S(this).data(this.name + '-init');

        if (typeof method === 'string') {
          return this[method].call(this);
        }

        if (S(this.scope).is('[data-' + this.name +']')) {
          S(this.scope).data(this.name + '-init', $.extend({}, this.settings, (options || method), this.data_options(S(this.scope))));

          if (should_bind_events) {
            this.events(this.scope);
          }

        } else {
          S('[data-' + this.name + ']', this.scope).each(function () {
            var should_bind_events = !S(this).data(self.name + '-init');

            S(this).data(self.name + '-init', $.extend({}, self.settings, (options || method), self.data_options(S(this))));

            if (should_bind_events) {
              self.events(this);
            }
          });
        }
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '5.0.0',

    settings : {
      focus_on_invalid : true,
      timeout : 1000,
      patterns : {
        alpha: /[a-zA-Z]+/,
        alpha_numeric : /[a-zA-Z0-9]+/,
        integer: /-?\d+/,
        number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,

        // generic password: upper-case, lower-case, number/special character, and min 8 characters
        password : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

        url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
        // abc.de
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,

        datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
        // YYYY-MM-DD
        date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
        // HH:MM:SS
        time : /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
        dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
        // MM/DD/YYYY
        month_day_year : /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,

        // #FFF or #FFFFFF
        color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = $(scope).attr('novalidate', 'novalidate'),
          settings = form.data('abide-init');

      form
        .off('.abide')
        .on('submit.fndtn.abide validate.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test($(this).attr('data-abide'));
          return self.validate($(this).find('input, textarea, select').get(), e, is_ajax);
        })
        .find('input, textarea, select')
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            self.validate([this], e);
          })
          .on('keydown.fndtn.abide', function (e) {
            var settings = $(this).closest('form').data('abide-init');
            clearTimeout(self.timer);
            self.timer = setTimeout(function () {
              self.validate([this], e);
            }.bind(this), settings.timeout);
          });
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = $(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      for (var i=0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) els[i].focus();
          form.trigger('invalid');
          $(els[i]).closest('form').attr('data-invalid', '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid');
      }

      form.removeAttr('data-invalid');

      if (is_ajax) return false;

      return true;
    },

    parse_patterns : function (els) {
      var count = els.length,
          el_patterns = [];

      for (var i = count - 1; i >= 0; i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    check_validation_and_apply_styles : function (el_patterns) {
      var count = el_patterns.length,
          validations = [];

      for (var i = count - 1; i >= 0; i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value,
            is_equal = el.getAttribute('data-equalto'),
            is_radio = el.type === "radio",
            valid_length = (required) ? (el.value.length > 0) : true;

        if (is_radio && required) {
          validations.push(this.valid_radio(el, required));
        } else if (is_equal && required) {
          validations.push(this.valid_equal(el, required));
        } else {
          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1) {
            $(el).removeAttr('data-invalid').parent().removeClass('error');
            validations.push(true);
          } else {
            $(el).attr('data-invalid', '').parent().addClass('error');
            validations.push(false);
          }
        }
      }

      return validations;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = document.getElementsByName(name),
          count = group.length,
          valid = false;

      for (var i=0; i < count; i++) {
        if (group[i].checked) valid = true;
      }

      for (var i=0; i < count; i++) {
        if (valid) {
          $(group[i]).removeAttr('data-invalid').parent().removeClass('error');
        } else {
          $(group[i]).attr('data-invalid', '').parent().addClass('error');
        }
      }

      return valid;
    },

    valid_equal: function(el, required) {
      var from  = document.getElementById(el.getAttribute('data-equalto')).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        $(el).removeAttr('data-invalid').parent().removeClass('error');
      } else {
        $(el).attr('data-invalid', '').parent().addClass('error');
      }

      return valid;
    }
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '5.0.1',

    settings : {
      active_class: 'active',
      toggleable: true
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      $(this.scope).off('.accordion').on('click.fndtn.accordion', '[data-accordion] > dd > a', function (e) {
        var accordion = $(this).parent(),
            target = $('#' + this.href.split('#')[1]),
            siblings = $('> dd > .content', target.closest('[data-accordion]')),
            settings = accordion.parent().data('accordion-init'),
            active = $('> dd > .content.' + settings.active_class, accordion.parent());

        e.preventDefault();

        if (active[0] == target[0] && settings.toggleable) {
          return target.toggleClass(settings.active_class);
        }

        siblings.removeClass(settings.active_class);
        target.addClass(settings.active_class);
      });
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.0.0',

    settings : {
      animation: 'fadeOut',
      speed: 300, // fade out speed
      callback: function (){}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      $(this.scope).off('.alert').on('click.fndtn.alert', '[data-alert] a.close', function (e) {
          var alertBox = $(this).closest("[data-alert]"),
              settings = alertBox.data('alert-init');

        e.preventDefault();
        alertBox[settings.animation](settings.speed, function () {
          $(this).trigger('closed').remove();
          settings.callback();
        });
      });
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.clearing = {
    name : 'clearing',

    version: '5.0.0',

    settings : {
      templates : {
        viewing : '<a href="#" class="clearing-close">&times;</a>' +
          '<div class="visible-img" style="display: none"><img src="//:0">' +
          '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' +
          '<a href="#" class="clearing-main-next"><span></span></a></div>'
      },

      // comma delimited list of selectors that, on click, will close clearing,
      // add 'div.clearing-blackout, div.visible-img' to close on background click
      close_selectors : '.clearing-close',

      // event initializers and locks
      init : false,
      locked : false
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle loaded');

      this.bindings(method, options);

      if ($(this.scope).is('[data-clearing]')) {
        this.assemble($('li', this.scope));
      } else {
        $('[data-clearing]', this.scope).each(function () {
          self.assemble($('li', this));
        });
      }
    },

    events : function (scope) {
      var self = this;

      $(this.scope)
        .off('.clearing')
        .on('click.fndtn.clearing', 'ul[data-clearing] li',
          function (e, current, target) {
            var current = current || $(this),
                target = target || current,
                next = current.next('li'),
                settings = current.closest('[data-clearing]').data('clearing-init'),
                image = $(e.target);

            e.preventDefault();

            if (!settings) {
              self.init();
              settings = current.closest('[data-clearing]').data('clearing-init');
            }

            // if clearing is open and the current image is
            // clicked, go to the next image in sequence
            if (target.hasClass('visible') && 
              current[0] === target[0] && 
              next.length > 0 && self.is_open(current)) {
              target = next;
              image = $('img', target);
            }

            // set current and target to the clicked li if not otherwise defined.
            self.open(image, current, target);
            self.update_paddles(target);
          })

        .on('click.fndtn.clearing', '.clearing-main-next',
          function (e) { self.nav(e, 'next') })
        .on('click.fndtn.clearing', '.clearing-main-prev',
          function (e) { self.nav(e, 'prev') })
        .on('click.fndtn.clearing', this.settings.close_selectors,
          function (e) { Foundation.libs.clearing.close(e, this) })
        .on('keydown.fndtn.clearing',
          function (e) { self.keydown(e) });

      $(window).off('.clearing').on('resize.fndtn.clearing',
        function () { self.resize() });

      this.swipe_events(scope);
    },

    swipe_events : function (scope) {
      var self = this;

      $(this.scope)
        .on('touchstart.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
                start_page_x: e.touches[0].pageX,
                start_page_y: e.touches[0].pageY,
                start_time: (new Date()).getTime(),
                delta_x: 0,
                is_scrolling: undefined
              };

          $(this).data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.clearing', '.visible-img', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = $(this).data('swipe-transition');

          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self.nav(e, direction);
          }
        })
        .on('touchend.fndtn.clearing', '.visible-img', function(e) {
          $(this).data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    assemble : function ($li) {
      var $el = $li.parent();

      if ($el.parent().hasClass('carousel')) return;
      $el.after('<div id="foundationClearingHolder"></div>');

      var holder = $('#foundationClearingHolder'),
          settings = $el.data('clearing-init'),
          grid = $el.detach(),
          data = {
            grid: '<div class="carousel">' + grid[0].outerHTML + '</div>',
            viewing: settings.templates.viewing
          },
          wrapper = '<div class="clearing-assembled"><div>' + data.viewing +
            data.grid + '</div></div>';

      return holder.after(wrapper).remove();
    },

    open : function ($image, current, target) {
      var root = target.closest('.clearing-assembled'),
          container = $('div', root).first(),
          visible_image = $('.visible-img', container),
          image = $('img', visible_image).not($image);

      if (!this.locked()) {
        // set the image to the selected thumbnail
        image
          .attr('src', this.load($image))
          .css('visibility', 'hidden');

        this.loaded(image, function () {
          image.css('visibility', 'visible');
          // toggle the gallery
          root.addClass('clearing-blackout');
          container.addClass('clearing-container');
          visible_image.show();
          this.fix_height(target)
            .caption($('.clearing-caption', visible_image), $image)
            .center(image)
            .shift(current, target, function () {
              target.siblings().removeClass('visible');
              target.addClass('visible');
            });
        }.bind(this));
      }
    },

    close : function (e, el) {
      e.preventDefault();

      var root = (function (target) {
            if (/blackout/.test(target.selector)) {
              return target;
            } else {
              return target.closest('.clearing-blackout');
            }
          }($(el))), container, visible_image;

      if (el === e.target && root) {
        container = $('div', root).first();
        visible_image = $('.visible-img', container);
        this.settings.prev_index = 0;
        $('ul[data-clearing]', root)
          .attr('style', '').closest('.clearing-blackout')
          .removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
      }

      return false;
    },

    is_open : function (current) {
      return current.parent().prop('style').length > 0;
    },

    keydown : function (e) {
      var clearing = $('ul[data-clearing]', '.clearing-blackout');

      if (e.which === 39) this.go(clearing, 'next');
      if (e.which === 37) this.go(clearing, 'prev');
      if (e.which === 27) $('a.clearing-close').trigger('click');
    },

    nav : function (e, direction) {
      var clearing = $('ul[data-clearing]', '.clearing-blackout');

      e.preventDefault();
      this.go(clearing, direction);
    },

    resize : function () {
      var image = $('img', '.clearing-blackout .visible-img');

      if (image.length) {
        this.center(image);
      }
    },

    // visual adjustments
    fix_height : function (target) {
      var lis = target.parent().children(),
          self = this;

      lis.each(function () {
          var li = $(this),
              image = li.find('img');

          if (li.height() > image.outerHeight()) {
            li.addClass('fix-height');
          }
        })
        .closest('ul')
        .width(lis.length * 100 + '%');

      return this;
    },

    update_paddles : function (target) {
      var visible_image = target
        .closest('.carousel')
        .siblings('.visible-img');

      if (target.next().length > 0) {
        $('.clearing-main-next', visible_image)
          .removeClass('disabled');
      } else {
        $('.clearing-main-next', visible_image)
          .addClass('disabled');
      }

      if (target.prev().length > 0) {
        $('.clearing-main-prev', visible_image)
          .removeClass('disabled');
      } else {
        $('.clearing-main-prev', visible_image)
          .addClass('disabled');
      }
    },

    center : function (target) {
      if (!this.rtl) {
        target.css({
          marginLeft : -(target.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)
        });
      } else {
        target.css({
          marginRight : -(target.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)
        });
      }
      return this;
    },

    // image loading and preloading

    load : function ($image) {
      if ($image[0].nodeName === "A") {
        var href = $image.attr('href');
      } else {
        var href = $image.parent().attr('href');
      }

      this.preload($image);

      if (href) return href;
      return $image.attr('src');
    },

    preload : function ($image) {
      this
        .img($image.closest('li').next())
        .img($image.closest('li').prev());
    },

    img : function (img) {
      if (img.length) {
        var new_img = new Image(),
            new_a = $('a', img);

        if (new_a.length) {
          new_img.src = new_a.attr('href');
        } else {
          new_img.src = $('img', img).attr('src');
        }
      }
      return this;
    },

    // image caption

    caption : function (container, $image) {
      var caption = $image.data('caption');

      if (caption) {
        container
          .html(caption)
          .show();
      } else {
        container
          .text('')
          .hide();
      }
      return this;
    },

    // directional methods

    go : function ($ul, direction) {
      var current = $('.visible', $ul),
          target = current[direction]();

      if (target.length) {
        $('img', target)
          .trigger('click', [current, target]);
      }
    },

    shift : function (current, target, callback) {
      var clearing = target.parent(),
          old_index = this.settings.prev_index || target.index(),
          direction = this.direction(clearing, current, target),
          left = parseInt(clearing.css('left'), 10),
          width = target.outerWidth(),
          skip_shift;

      // we use jQuery animate instead of CSS transitions because we
      // need a callback to unlock the next animation
      if (target.index() !== old_index && !/skip/.test(direction)){
        if (/left/.test(direction)) {
          this.lock();
          clearing.animate({left : left + width}, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          clearing.animate({left : left - width}, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        // the target image is not adjacent to the current image, so
        // do we scroll right or not
        skip_shift = target.index() - this.settings.up_count;
        this.lock();

        if (skip_shift > 0) {
          clearing.animate({left : -(skip_shift * width)}, 300, this.unlock());
        } else {
          clearing.animate({left : 0}, 300, this.unlock());
        }
      }

      callback();
    },

    direction : function ($el, current, target) {
      var lis = $('li', $el),
          li_width = lis.outerWidth() + (lis.outerWidth() / 4),
          up_count = Math.floor($('.clearing-container').outerWidth() / li_width) - 1,
          target_index = lis.index(target),
          response;

      this.settings.up_count = up_count;

      if (this.adjacent(this.settings.prev_index, target_index)) {
        if ((target_index > up_count)
          && target_index > this.settings.prev_index) {
          response = 'right';
        } else if ((target_index > up_count - 1)
          && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }

      this.settings.prev_index = target_index;

      return response;
    },

    adjacent : function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index) return true;
      }
      return false;
    },

    // lock management

    lock : function () {
      this.settings.locked = true;
    },

    unlock : function () {
      this.settings.locked = false;
    },

    locked : function () {
      return this.settings.locked;
    },

    off : function () {
      $(this.scope).off('.fndtn.clearing');
      $(window).off('.fndtn.clearing');
    },

    reflow : function () {
      this.init();
    }
  };

}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.dropdown = {
    name : 'dropdown',

    version : '5.0.0',

    settings : {
      active_class: 'open',
      is_hover: false,
      opened: function(){},
      closed: function(){}
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');

      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this;

      $(this.scope)
        .off('.dropdown')
        .on('click.fndtn.dropdown', '[data-dropdown]', function (e) {
          var settings = $(this).data('dropdown-init');
          e.preventDefault();

          if (!settings.is_hover || Modernizr.touch) self.toggle($(this));
        })
        .on('mouseenter.fndtn.dropdown', '[data-dropdown], [data-dropdown-content]', function (e) {
          var $this = $(this);
          clearTimeout(self.timeout);

          if ($this.data('dropdown')) {
            var dropdown = $('#' + $this.data('dropdown')),
                target = $this;
          } else {
            var dropdown = $this;
                target = $("[data-dropdown='" + dropdown.attr('id') + "']");
          }

          var settings = target.data('dropdown-init');
          if (settings.is_hover) self.open.apply(self, [dropdown, target]);
        })
        .on('mouseleave.fndtn.dropdown', '[data-dropdown], [data-dropdown-content]', function (e) {
          var $this = $(this);
          self.timeout = setTimeout(function () {
            if ($this.data('dropdown')) {
              var settings = $this.data('dropdown-init');
              if (settings.is_hover) self.close.call(self, $('#' + $this.data('dropdown')));
            } else {
              var target = $('[data-dropdown="' + $(this).attr('id') + '"]'),
                  settings = target.data('dropdown-init');
              if (settings.is_hover) self.close.call(self, $this);
            }
          }.bind(this), 150);
        })
        .on('click.fndtn.dropdown', function (e) {
          var parent = $(e.target).closest('[data-dropdown-content]');

          if ($(e.target).data('dropdown') || $(e.target).parent().data('dropdown')) {
            return;
          }
          if (!($(e.target).data('revealId')) && 
            (parent.length > 0 && ($(e.target).is('[data-dropdown-content]') || 
              $.contains(parent.first()[0], e.target)))) {
            e.stopPropagation();
            return;
          }

          self.close.call(self, $('[data-dropdown-content]'));
        })
        .on('opened.fndtn.dropdown', '[data-dropdown-content]', this.settings.opened)
        .on('closed.fndtn.dropdown', '[data-dropdown-content]', this.settings.closed);

      $(window)
        .off('.dropdown')
        .on('resize.fndtn.dropdown', self.throttle(function () {
          self.resize.call(self);
        }, 50)).trigger('resize');
    },

    close: function (dropdown) {
      var self = this;
      dropdown.each(function () {
        if ($(this).hasClass(self.settings.active_class)) {
          $(this)
            .css(Foundation.rtl ? 'right':'left', '-99999px')
            .removeClass(self.settings.active_class);
          $(this).trigger('closed');
        }
      });
    },

    open: function (dropdown, target) {
        this
          .css(dropdown
            .addClass(this.settings.active_class), target);
        dropdown.trigger('opened');
    },

    toggle : function (target) {
      var dropdown = $('#' + target.data('dropdown'));
      if (dropdown.length === 0) {
        // No dropdown found, not continuing
        return;
      }

      this.close.call(this, $('[data-dropdown-content]').not(dropdown));

      if (dropdown.hasClass(this.settings.active_class)) {
        this.close.call(this, dropdown);
      } else {
        this.close.call(this, $('[data-dropdown-content]'))
        this.open.call(this, dropdown, target);
      }
    },

    resize : function () {
      var dropdown = $('[data-dropdown-content].open'),
          target = $("[data-dropdown='" + dropdown.attr('id') + "']");

      if (dropdown.length && target.length) {
        this.css(dropdown, target);
      }
    },

    css : function (dropdown, target) {
      var offset_parent = dropdown.offsetParent(),
          position = target.offset();

      position.top -= offset_parent.offset().top;
      position.left -= offset_parent.offset().left;

      if (this.small()) {
        dropdown.css({
          position : 'absolute',
          width: '95%',
          'max-width': 'none',
          top: position.top + target.outerHeight()
        });
        dropdown.css(Foundation.rtl ? 'right':'left', '2.5%');
      } else {
        if (!Foundation.rtl && $(window).width() > dropdown.outerWidth() + target.offset().left) {
          var left = position.left;
          if (dropdown.hasClass('right')) {
            dropdown.removeClass('right');
          }
        } else {
          if (!dropdown.hasClass('right')) {
            dropdown.addClass('right');
          }
          var left = position.left - (dropdown.outerWidth() - target.outerWidth());
        }

        dropdown.attr('style', '').css({
          position : 'absolute',
          top: position.top + target.outerHeight(),
          left: left
        });
      }

      return dropdown;
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    off: function () {
      $(this.scope).off('.fndtn.dropdown');
      $('html, body').off('.fndtn.dropdown');
      $(window).off('.fndtn.dropdown');
      $('[data-dropdown-content]').off('.fndtn.dropdown');
      this.settings.init = false;
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.interchange = {
    name : 'interchange',

    version : '5.0.0',

    cache : {},

    images_loaded : false,
    nodes_loaded : false,

    settings : {
      load_attr : 'interchange',

      named_queries : {
        'default' : Foundation.media_queries.small,
        small : Foundation.media_queries.small,
        medium : Foundation.media_queries.medium,
        large : Foundation.media_queries.large,
        xlarge : Foundation.media_queries.xlarge,
        xxlarge: Foundation.media_queries.xxlarge,
        landscape : 'only screen and (orientation: landscape)',
        portrait : 'only screen and (orientation: portrait)',
        retina : 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 
          'only screen and (min--moz-device-pixel-ratio: 2),' + 
          'only screen and (-o-min-device-pixel-ratio: 2/1),' + 
          'only screen and (min-device-pixel-ratio: 2),' + 
          'only screen and (min-resolution: 192dpi),' + 
          'only screen and (min-resolution: 2dppx)'
      },

      directives : {
        replace: function (el, path, trigger) {
          // The trigger argument, if called within the directive, fires
          // an event named after the directive on the element, passing
          // any parameters along to the event that you pass to trigger.
          //
          // ex. trigger(), trigger([a, b, c]), or trigger(a, b, c)
          //
          // This allows you to bind a callback like so:
          // $('#interchangeContainer').on('replace', function (e, a, b, c) {
          //   console.log($(this).html(), a, b, c);
          // });

          if (/IMG/.test(el[0].nodeName)) {
            var orig_path = el[0].src;

            if (new RegExp(path, 'i').test(orig_path)) return;

            el[0].src = path;

            return trigger(el[0].src);
          }
          var last_path = el.data('interchange-last-path');

          if (last_path == path) return;

          return $.get(path, function (response) {
            el.html(response);
            el.data('interchange-last-path', path);
            trigger();
          });

        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');

      this.data_attr = 'data-' + this.settings.load_attr;

      this.bindings(method, options);
      this.load('images');
      this.load('nodes');
    },

    events : function () {
      var self = this;

      $(window)
        .off('.interchange')
        .on('resize.fndtn.interchange', self.throttle(function () {
          self.resize.call(self);
        }, 50));

      return this;
    },

    resize : function () {
      var cache = this.cache;

      if(!this.images_loaded || !this.nodes_loaded) {
        setTimeout($.proxy(this.resize, this), 50);
        return;
      }

      for (var uuid in cache) {
        if (cache.hasOwnProperty(uuid)) {
          var passed = this.results(uuid, cache[uuid]);

          if (passed) {
            this.settings.directives[passed
              .scenario[1]](passed.el, passed.scenario[0], function () {
                if (arguments[0] instanceof Array) { 
                  var args = arguments[0];
                } else { 
                  var args = Array.prototype.slice.call(arguments, 0);
                }

                passed.el.trigger(passed.scenario[1], args);
              });
          }
        }
      }

    },

    results : function (uuid, scenarios) {
      var count = scenarios.length;

      if (count > 0) {
        var el = this.S('[data-uuid="' + uuid + '"]');

        for (var i = count - 1; i >= 0; i--) {
          var mq, rule = scenarios[i][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            mq = matchMedia(rule);
          }
          if (mq.matches) {
            return {el: el, scenario: scenarios[i]};
          }
        }
      }

      return false;
    },

    load : function (type, force_update) {
      if (typeof this['cached_' + type] === 'undefined' || force_update) {
        this['update_' + type]();
      }

      return this['cached_' + type];
    },

    update_images : function () {
      var images = this.S('img[' + this.data_attr + ']'),
          count = images.length,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cache = {};
      this.cached_images = [];
      this.images_loaded = (count === 0);

      for (var i = count - 1; i >= 0; i--) {
        loaded_count++;
        if (images[i]) {
          var str = images[i].getAttribute(data_attr) || '';

          if (str.length > 0) {
            this.cached_images.push(images[i]);
          }
        }

        if(loaded_count === count) {
          this.images_loaded = true;
          this.enhance('images');
        }
      }

      return this;
    },

    update_nodes : function () {
      var nodes = this.S('[' + this.data_attr + ']:not(img)'),
          count = nodes.length,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cached_nodes = [];
      // Set nodes_loaded to true if there are no nodes
      // this.nodes_loaded = false;
      this.nodes_loaded = (count === 0);


      for (var i = count - 1; i >= 0; i--) {
        loaded_count++;
        var str = nodes[i].getAttribute(data_attr) || '';

        if (str.length > 0) {
          this.cached_nodes.push(nodes[i]);
        }

        if(loaded_count === count) {
          this.nodes_loaded = true;
          this.enhance('nodes');
        }
      }

      return this;
    },

    enhance : function (type) {
      var count = this['cached_' + type].length;

      for (var i = count - 1; i >= 0; i--) {
        this.object($(this['cached_' + type][i]));
      }

      return $(window).trigger('resize');
    },

    parse_params : function (path, directive, mq) {
      return [this.trim(path), this.convert_directive(directive), this.trim(mq)];
    },

    convert_directive : function (directive) {
      var trimmed = this.trim(directive);

      if (trimmed.length > 0) {
        return trimmed;
      }

      return 'replace';
    },

    object : function(el) {
      var raw_arr = this.parse_data_attr(el),
          scenarios = [], count = raw_arr.length;

      if (count > 0) {
        for (var i = count - 1; i >= 0; i--) {
          var split = raw_arr[i].split(/\((.*?)(\))$/);

          if (split.length > 1) {
            var cached_split = split[0].split(','),
                params = this.parse_params(cached_split[0],
                  cached_split[1], split[1]);

            scenarios.push(params);
          }
        }
      }

      return this.store(el, scenarios);
    },

    uuid : function (separator) {
      var delim = separator || "-";

      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + delim + S4() + delim + S4()
        + delim + S4() + delim + S4() + S4() + S4());
    },

    store : function (el, scenarios) {
      var uuid = this.uuid(),
          current_uuid = el.data('uuid');

      if (current_uuid) return this.cache[current_uuid];

      el.attr('data-uuid', uuid);

      return this.cache[uuid] = scenarios;
    },

    trim : function(str) {
      if (typeof str === 'string') {
        return $.trim(str);
      }

      return str;
    },

    parse_data_attr : function (el) {
      var raw = el.data(this.settings.load_attr).split(/\[(.*?)\]/),
          count = raw.length, output = [];

      for (var i = count - 1; i >= 0; i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          output.push(raw[i]);
        }
      }

      return output;
    },

    reflow : function () {
      this.load('images', true);
      this.load('nodes', true);
    }

  };

}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  var Modernizr = Modernizr || false;

  Foundation.libs.joyride = {
    name : 'joyride',

    version : '5.0.0',

    defaults : {
      expose               : false,      // turn on or off the expose feature
      modal                : true,      // Whether to cover page with modal during the tour
      tip_location          : 'bottom',  // 'top' or 'bottom' in relation to parent
      nub_position          : 'auto',    // override on a per tooltip bases
      scroll_speed          : 1500,       // Page scrolling speed in milliseconds, 0 = no scroll animation
      scroll_animation     : 'linear',   // supports 'swing' and 'linear', extend with jQuery UI.
      timer                : 0,         // 0 = no timer , all other numbers = timer in milliseconds
      start_timer_on_click    : true,      // true or false - true requires clicking the first button start the timer
      start_offset          : 0,         // the index of the tooltip you want to start on (index of the li)
      next_button           : true,      // true or false to control whether a next button is used
      tip_animation         : 'fade',    // 'pop' or 'fade' in each tip
      pause_after           : [],        // array of indexes where to pause the tour after
      exposed              : [],        // array of expose elements
      tip_animation_fade_speed: 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      cookie_monster        : false,     // true or false to control whether cookies are used
      cookie_name           : 'joyride', // Name the cookie you'll use
      cookie_domain         : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
      cookie_expires        : 365,       // set when you would like the cookie to expire.
      tip_container         : 'body',    // Where will the tip be attached
      tip_location_patterns : {
        top: ['bottom'],
        bottom: [], // bottom should not need to be repositioned
        left: ['right', 'top', 'bottom'],
        right: ['left', 'top', 'bottom']
      },
      post_ride_callback     : function (){},    // A method to call once the tour closes (canceled or complete)
      post_step_callback     : function (){},    // A method to call after each step
      pre_step_callback      : function (){},    // A method to call before each step
      pre_ride_callback      : function (){},    // A method to call before the tour starts (passed index, tip, and cloned exposed element)
      post_expose_callback   : function (){},    // A method to call after an element has been exposed
      template : { // HTML segments for tip layout
        link    : '<a href="#close" class="joyride-close-tip">&times;</a>',
        timer   : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        tip     : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        wrapper : '<div class="joyride-content-wrapper"></div>',
        button  : '<a href="#" class="small button joyride-next-tip"></a>',
        modal   : '<div class="joyride-modal-bg"></div>',
        expose  : '<div class="joyride-expose-wrapper"></div>',
        expose_cover: '<div class="joyride-expose-cover"></div>'
      },
      expose_add_class : '' // One or more space-separated class names to be added to exposed element
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle delay');

      this.settings = this.defaults;

      this.bindings(method, options)
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.joyride')
        .on('click.fndtn.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
          e.preventDefault();

          if (this.settings.$li.next().length < 1) {
            this.end();
          } else if (this.settings.timer > 0) {
            clearTimeout(this.settings.automate);
            this.hide();
            this.show();
            this.startTimer();
          } else {
            this.hide();
            this.show();
          }

        }.bind(this))

        .on('click.fndtn.joyride', '.joyride-close-tip', function (e) {
          e.preventDefault();
          this.end();
        }.bind(this));

      $(window)
        .off('.joyride')
        .on('resize.fndtn.joyride', self.throttle(function () {
          if ($('[data-joyride]').length > 0 && self.settings.$next_tip) {
            if (self.settings.exposed.length > 0) {
              var $els = $(self.settings.exposed);

              $els.each(function () {
                var $this = $(this);
                self.un_expose($this);
                self.expose($this);
              });
            }

            if (self.is_phone()) {
              self.pos_phone();
            } else {
              self.pos_default(false, true);
            }
          }
        }, 100));
    },

    start : function () {
      var self = this,
          $this = $('[data-joyride]', this.scope),
          integer_settings = ['timer', 'scrollSpeed', 'startOffset', 'tipAnimationFadeSpeed', 'cookieExpires'],
          int_settings_count = integer_settings.length;

      if (!$this.length > 0) return;

      if (!this.settings.init) this.events();

      this.settings = $this.data('joyride-init');

      // non configureable settings
      this.settings.$content_el = $this;
      this.settings.$body = $(this.settings.tip_container);
      this.settings.body_offset = $(this.settings.tip_container).position();
      this.settings.$tip_content = this.settings.$content_el.find('> li');
      this.settings.paused = false;
      this.settings.attempts = 0;

      // can we create cookies?
      if (typeof $.cookie !== 'function') {
        this.settings.cookie_monster = false;
      }

      // generate the tips and insert into dom.
      if (!this.settings.cookie_monster || this.settings.cookie_monster && $.cookie(this.settings.cookie_name) === null) {
        this.settings.$tip_content.each(function (index) {
          var $this = $(this);
          this.settings = $.extend({}, self.defaults, self.data_options($this))

          // Make sure that settings parsed from data_options are integers where necessary
          for (var i = int_settings_count - 1; i >= 0; i--) {
            self.settings[integer_settings[i]] = parseInt(self.settings[integer_settings[i]], 10);
          }
          self.create({$li : $this, index : index});
        });

        // show first tip
        if (!this.settings.start_timer_on_click && this.settings.timer > 0) {
          this.show('init');
          this.startTimer();
        } else {
          this.show('init');
        }

      }
    },

    resume : function () {
      this.set_li();
      this.show();
    },

    tip_template : function (opts) {
      var $blank, content;

      opts.tip_class = opts.tip_class || '';

      $blank = $(this.settings.template.tip).addClass(opts.tip_class);
      content = $.trim($(opts.li).html()) +
        this.button_text(opts.button_text) +
        this.settings.template.link +
        this.timer_instance(opts.index);

      $blank.append($(this.settings.template.wrapper));
      $blank.first().attr('data-index', opts.index);
      $('.joyride-content-wrapper', $blank).append(content);

      return $blank[0];
    },

    timer_instance : function (index) {
      var txt;

      if ((index === 0 && this.settings.start_timer_on_click && this.settings.timer > 0) || this.settings.timer === 0) {
        txt = '';
      } else {
        txt = $(this.settings.template.timer)[0].outerHTML;
      }
      return txt;
    },

    button_text : function (txt) {
      if (this.settings.next_button) {
        txt = $.trim(txt) || 'Next';
        txt = $(this.settings.template.button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },

    create : function (opts) {
      var buttonText = opts.$li.attr('data-button') || opts.$li.attr('data-text'),
        tipClass = opts.$li.attr('class'),
        $tip_content = $(this.tip_template({
          tip_class : tipClass,
          index : opts.index,
          button_text : buttonText,
          li : opts.$li
        }));

      $(this.settings.tip_container).append($tip_content);
    },

    show : function (init) {
      var $timer = null;

      // are we paused?
      if (this.settings.$li === undefined
        || ($.inArray(this.settings.$li.index(), this.settings.pause_after) === -1)) {

        // don't go to the next li if the tour was paused
        if (this.settings.paused) {
          this.settings.paused = false;
        } else {
          this.set_li(init);
        }

        this.settings.attempts = 0;

        if (this.settings.$li.length && this.settings.$target.length > 0) {
          if (init) { //run when we first start
            this.settings.pre_ride_callback(this.settings.$li.index(), this.settings.$next_tip);
            if (this.settings.modal) {
              this.show_modal();
            }
          }

          this.settings.pre_step_callback(this.settings.$li.index(), this.settings.$next_tip);

          if (this.settings.modal && this.settings.expose) {
            this.expose();
          }

          this.settings.tip_settings = $.extend({}, this.settings, this.data_options(this.settings.$li));

          this.settings.timer = parseInt(this.settings.timer, 10);

          this.settings.tip_settings.tip_location_pattern = this.settings.tip_location_patterns[this.settings.tip_settings.tip_location];

          // scroll if not modal
          if (!/body/i.test(this.settings.$target.selector)) {
            this.scroll_to();
          }

          if (this.is_phone()) {
            this.pos_phone(true);
          } else {
            this.pos_default(true);
          }

          $timer = this.settings.$next_tip.find('.joyride-timer-indicator');

          if (/pop/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip.show();

              this.delay(function () {
                $timer.animate({
                  width: $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);

            } else {
              this.settings.$next_tip.show();

            }


          } else if (/fade/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip
                .fadeIn(this.settings.tip_animation_fade_speed)
                .show();

              this.delay(function () {
                $timer.animate({
                  width: $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fadeSpeed);

            } else {
              this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed);
            }
          }

          this.settings.$current_tip = this.settings.$next_tip;

        // skip non-existant targets
        } else if (this.settings.$li && this.settings.$target.length < 1) {

          this.show();

        } else {

          this.end();

        }
      } else {

        this.settings.paused = true;

      }

    },

    is_phone : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    hide : function () {
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      if (!this.settings.modal) {
        $('.joyride-modal-bg').hide();
      }

      // Prevent scroll bouncing...wait to remove from layout
      this.settings.$current_tip.css('visibility', 'hidden');
      setTimeout($.proxy(function() {
        this.hide();
        this.css('visibility', 'visible');
      }, this.settings.$current_tip), 0);
      this.settings.post_step_callback(this.settings.$li.index(),
        this.settings.$current_tip);
    },

    set_li : function (init) {
      if (init) {
        this.settings.$li = this.settings.$tip_content.eq(this.settings.start_offset);
        this.set_next_tip();
        this.settings.$current_tip = this.settings.$next_tip;
      } else {
        this.settings.$li = this.settings.$li.next();
        this.set_next_tip();
      }

      this.set_target();
    },

    set_next_tip : function () {
      this.settings.$next_tip = $(".joyride-tip-guide").eq(this.settings.$li.index());
      this.settings.$next_tip.data('closed', '');
    },

    set_target : function () {
      var cl = this.settings.$li.attr('data-class'),
          id = this.settings.$li.attr('data-id'),
          $sel = function () {
            if (id) {
              return $(document.getElementById(id));
            } else if (cl) {
              return $('.' + cl).first();
            } else {
              return $('body');
            }
          };

      this.settings.$target = $sel();
    },

    scroll_to : function () {
      var window_half, tipOffset;

      window_half = $(window).height() / 2;
      tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight());

      if (tipOffset > 0) {
        $('html, body').animate({
          scrollTop: tipOffset
        }, this.settings.scroll_speed, 'swing');
      }
    },

    paused : function () {
      return ($.inArray((this.settings.$li.index() + 1), this.settings.pause_after) === -1);
    },

    restart : function () {
      this.hide();
      this.settings.$li = undefined;
      this.show('init');
    },

    pos_default : function (init, resizing) {
      var half_fold = Math.ceil($(window).height() / 2),
          tip_position = this.settings.$next_tip.offset(),
          $nub = this.settings.$next_tip.find('.joyride-nub'),
          nub_width = Math.ceil($nub.outerWidth() / 2),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      // tip must not be "display: none" to calculate position
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (typeof resizing === 'undefined') {
        resizing = false;
      }

      if (!/body/i.test(this.settings.$target.selector)) {

          if (this.bottom()) {
            var leftOffset = this.settings.$target.offset().left;
            if (Foundation.rtl) {
              leftOffset = this.settings.$target.offset().width - this.settings.$next_tip.width() + leftOffset;
            }
            this.settings.$next_tip.css({
              top: (this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight()),
              left: leftOffset});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'top');

          } else if (this.top()) {
            var leftOffset = this.settings.$target.offset().left;
            if (Foundation.rtl) {
              leftOffset = this.settings.$target.offset().width - this.settings.$next_tip.width() + leftOffset;
            }
            this.settings.$next_tip.css({
              top: (this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height),
              left: leftOffset});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'bottom');

          } else if (this.right()) {

            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top,
              left: (this.outerWidth(this.settings.$target) + this.settings.$target.offset().left + nub_width)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'left');

          } else if (this.left()) {

            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top,
              left: (this.settings.$target.offset().left - this.outerWidth(this.settings.$next_tip) - nub_width)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'right');

          }

          if (!this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tip_settings.tip_location_pattern.length) {

            $nub.removeClass('bottom')
              .removeClass('top')
              .removeClass('right')
              .removeClass('left');

            this.settings.tip_settings.tip_location = this.settings.tip_settings.tip_location_pattern[this.settings.attempts];

            this.settings.attempts++;

            this.pos_default();

          }

      } else if (this.settings.$li.length) {

        this.pos_modal($nub);

      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }

    },

    pos_phone : function (init) {
      var tip_height = this.settings.$next_tip.outerHeight(),
          tip_offset = this.settings.$next_tip.offset(),
          target_height = this.settings.$target.outerHeight(),
          $nub = $('.joyride-nub', this.settings.$next_tip),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      $nub.removeClass('bottom')
        .removeClass('top')
        .removeClass('right')
        .removeClass('left');

      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {

        if (this.top()) {

            this.settings.$next_tip.offset({top: this.settings.$target.offset().top - tip_height - nub_height});
            $nub.addClass('bottom');

        } else {

          this.settings.$next_tip.offset({top: this.settings.$target.offset().top + target_height + nub_height});
          $nub.addClass('top');

        }

      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },

    pos_modal : function ($nub) {
      this.center();
      $nub.hide();

      this.show_modal();
    },

    show_modal : function () {
      if (!this.settings.$next_tip.data('closed')) {
        var joyridemodalbg =  $('.joyride-modal-bg');
        if (joyridemodalbg.length < 1) {
          $('body').append(this.settings.template.modal).show();
        }

        if (/pop/i.test(this.settings.tip_animation)) {
            joyridemodalbg.show();
        } else {
            joyridemodalbg.fadeIn(this.settings.tip_animation_fade_speed);
        }
      }
    },

    expose : function () {
      var expose,
          exposeCover,
          el,
          origCSS,
          origClasses,
          randId = 'expose-'+Math.floor(Math.random()*10000);

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if(this.settings.$target && !/body/i.test(this.settings.$target.selector)){
        el = this.settings.$target;
      }  else {
        return false;
      }

      if(el.length < 1){
        if(window.console){
          console.error('element not valid', el);
        }
        return false;
      }

      expose = $(this.settings.template.expose);
      this.settings.$body.append(expose);
      expose.css({
        top: el.offset().top,
        left: el.offset().left,
        width: el.outerWidth(true),
        height: el.outerHeight(true)
      });

      exposeCover = $(this.settings.template.expose_cover);

      origCSS = {
        zIndex: el.css('z-index'),
        position: el.css('position')
      };

      origClasses = el.attr('class') == null ? '' : el.attr('class');

      el.css('z-index',parseInt(expose.css('z-index'))+1);

      if (origCSS.position == 'static') {
        el.css('position','relative');
      }

      el.data('expose-css',origCSS);
      el.data('orig-class', origClasses);
      el.attr('class', origClasses + ' ' + this.settings.expose_add_class);

      exposeCover.css({
        top: el.offset().top,
        left: el.offset().left,
        width: el.outerWidth(true),
        height: el.outerHeight(true)
      });

      if (this.settings.modal) this.show_modal();

      this.settings.$body.append(exposeCover);
      expose.addClass(randId);
      exposeCover.addClass(randId);
      el.data('expose', randId);
      this.settings.post_expose_callback(this.settings.$li.index(), this.settings.$next_tip, el);
      this.add_exposed(el);
    },

    un_expose : function () {
      var exposeId,
          el,
          expose ,
          origCSS,
          origClasses,
          clearAll = false;

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if(this.settings.$target && !/body/i.test(this.settings.$target.selector)){
        el = this.settings.$target;
      }  else {
        return false;
      }

      if(el.length < 1){
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      exposeId = el.data('expose');
      expose = $('.' + exposeId);

      if (arguments.length > 1) {
        clearAll = arguments[1];
      }

      if (clearAll === true) {
        $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
      } else {
        expose.remove();
      }

      origCSS = el.data('expose-css');

      if (origCSS.zIndex == 'auto') {
        el.css('z-index', '');
      } else {
        el.css('z-index', origCSS.zIndex);
      }

      if (origCSS.position != el.css('position')) {
        if(origCSS.position == 'static') {// this is default, no need to set it.
          el.css('position', '');
        } else {
          el.css('position', origCSS.position);
        }
      }

      origClasses = el.data('orig-class');
      el.attr('class', origClasses);
      el.removeData('orig-classes');

      el.removeData('expose');
      el.removeData('expose-z-index');
      this.remove_exposed(el);
    },

    add_exposed: function(el){
      this.settings.exposed = this.settings.exposed || [];
      if (el instanceof $ || typeof el === 'object') {
        this.settings.exposed.push(el[0]);
      } else if (typeof el == 'string') {
        this.settings.exposed.push(el);
      }
    },

    remove_exposed: function(el){
      var search, count;
      if (el instanceof $) {
        search = el[0]
      } else if (typeof el == 'string'){
        search = el;
      }

      this.settings.exposed = this.settings.exposed || [];
      count = this.settings.exposed.length;

      for (var i=0; i < count; i++) {
        if (this.settings.exposed[i] == search) {
          this.settings.exposed.splice(i, 1);
          return;
        }
      }
    },

    center : function () {
      var $w = $(window);

      this.settings.$next_tip.css({
        top : ((($w.height() - this.settings.$next_tip.outerHeight()) / 2) + $w.scrollTop()),
        left : ((($w.width() - this.settings.$next_tip.outerWidth()) / 2) + $w.scrollLeft())
      });

      return true;
    },

    bottom : function () {
      return /bottom/i.test(this.settings.tip_settings.tip_location);
    },

    top : function () {
      return /top/i.test(this.settings.tip_settings.tip_location);
    },

    right : function () {
      return /right/i.test(this.settings.tip_settings.tip_location);
    },

    left : function () {
      return /left/i.test(this.settings.tip_settings.tip_location);
    },

    corners : function (el) {
      var w = $(window),
          window_half = w.height() / 2,
          //using this to calculate since scroll may not have finished yet.
          tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight()),
          right = w.width() + w.scrollLeft(),
          offsetBottom =  w.height() + tipOffset,
          bottom = w.height() + w.scrollTop(),
          top = w.scrollTop();

      if (tipOffset < top) {
        if (tipOffset < 0) {
          top = 0;
        } else {
          top = tipOffset;
        }
      }

      if (offsetBottom > bottom) {
        bottom = offsetBottom;
      }

      return [
        el.offset().top < top,
        right < el.offset().left + el.outerWidth(),
        bottom < el.offset().top + el.outerHeight(),
        w.scrollLeft() > el.offset().left
      ];
    },

    visible : function (hidden_corners) {
      var i = hidden_corners.length;

      while (i--) {
        if (hidden_corners[i]) return false;
      }

      return true;
    },

    nub_position : function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },

    startTimer : function () {
      if (this.settings.$li.length) {
        this.settings.automate = setTimeout(function () {
          this.hide();
          this.show();
          this.startTimer();
        }.bind(this), this.settings.timer);
      } else {
        clearTimeout(this.settings.automate);
      }
    },

    end : function () {
      if (this.settings.cookie_monster) {
        $.cookie(this.settings.cookie_name, 'ridden', { expires: this.settings.cookie_expires, domain: this.settings.cookie_domain });
      }

      if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
      }

      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      this.settings.$next_tip.data('closed', true);

      $('.joyride-modal-bg').hide();
      this.settings.$current_tip.hide();
      this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip);
      this.settings.post_ride_callback(this.settings.$li.index(), this.settings.$current_tip);
      $('.joyride-tip-guide').remove();
    },

    off : function () {
      $(this.scope).off('.joyride');
      $(window).off('.joyride');
      $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
      $('.joyride-tip-guide, .joyride-modal-bg').remove();
      clearTimeout(this.settings.automate);
      this.settings = {};
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.magellan = {
    name : 'magellan',

    version : '5.0.0',

    settings : {
      active_class: 'active',
      threshold: 0
    },

    init : function (scope, method, options) {
      this.fixed_magellan = $("[data-magellan-expedition]");
      this.set_threshold();
      this.last_destination = $('[data-magellan-destination]').last();
      this.events();
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.magellan')
        .on('arrival.fndtn.magellan', '[data-magellan-arrival]', function (e) {
          var $destination = $(this),
              $expedition = $destination.closest('[data-magellan-expedition]'),
              active_class = $expedition.attr('data-magellan-active-class')
                || self.settings.active_class;

            $destination
              .closest('[data-magellan-expedition]')
              .find('[data-magellan-arrival]')
              .not($destination)
              .removeClass(active_class);
            $destination.addClass(active_class);
        });

      this.fixed_magellan
        .off('.magellan')
        .on('update-position.fndtn.magellan', function() {
          var $el = $(this);
        })
        .trigger('update-position');

      $(window)
        .off('.magellan')
        .on('resize.fndtn.magellan', function() {
          this.fixed_magellan.trigger('update-position');
        }.bind(this))
        .on('scroll.fndtn.magellan', function() {
          var windowScrollTop = $(window).scrollTop();
          self.fixed_magellan.each(function() {
            var $expedition = $(this);
            if (typeof $expedition.data('magellan-top-offset') === 'undefined') {
              $expedition.data('magellan-top-offset', $expedition.offset().top);
            }
            if (typeof $expedition.data('magellan-fixed-position') === 'undefined') {
              $expedition.data('magellan-fixed-position', false);
            }
            var fixed_position = (windowScrollTop + self.settings.threshold) > $expedition.data("magellan-top-offset");
            var attr = $expedition.attr('data-magellan-top-offset');

            if ($expedition.data("magellan-fixed-position") != fixed_position) {
              $expedition.data("magellan-fixed-position", fixed_position);
              if (fixed_position) {
                $expedition.addClass('fixed');
                $expedition.css({position:"fixed", top:0});
              } else {
                $expedition.removeClass('fixed');
                $expedition.css({position:"", top:""});
              }
              if (fixed_position && typeof attr != 'undefined' && attr != false) {
                $expedition.css({position:"fixed", top:attr + "px"});
              }
            }
          });
        });


      if (this.last_destination.length > 0) {
        $(window).on('scroll.fndtn.magellan', function (e) {
          var windowScrollTop = $(window).scrollTop(),
              scrolltopPlusHeight = windowScrollTop + $(window).height(),
              lastDestinationTop = Math.ceil(self.last_destination.offset().top);

          $('[data-magellan-destination]').each(function () {
            var $destination = $(this),
                destination_name = $destination.attr('data-magellan-destination'),
                topOffset = $destination.offset().top - $destination.outerHeight(true) - windowScrollTop;
            if (topOffset <= self.settings.threshold) {
              $("[data-magellan-arrival='" + destination_name + "']").trigger('arrival');
            }
            // In large screens we may hit the bottom of the page and dont reach the top of the last magellan-destination, so lets force it
            if (scrolltopPlusHeight >= $(self.scope).height() && lastDestinationTop > windowScrollTop && lastDestinationTop < scrolltopPlusHeight) {
              $('[data-magellan-arrival]').last().trigger('arrival');
            }
          });
        });
      }
    },

    set_threshold : function () {
      if (typeof this.settings.threshold !== 'number') {
        this.settings.threshold = (this.fixed_magellan.length > 0) ?
          this.fixed_magellan.outerHeight(true) : 0;
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.magellan');
      $(window).off('.fndtn.magellan');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.offcanvas = {
    name : 'offcanvas',

    version : '5.0.0',

    settings : {},

    init : function (scope, method, options) {
      this.events();
    },

    events : function () {
      $(this.scope).off('.offcanvas')
        .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (e) {
          e.preventDefault();
          $(this).closest('.off-canvas-wrap').toggleClass('move-right');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          e.preventDefault();
          $(".off-canvas-wrap").removeClass("move-right");
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function (e) {
          e.preventDefault();
          $(this).closest(".off-canvas-wrap").toggleClass("move-left");
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          e.preventDefault();
          $(".off-canvas-wrap").removeClass("move-left");
        });
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  var noop = function() {};

  var Orbit = function(el, settings) {
    // Don't reinitialize plugin
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }

    var self = this,
        container,
        slides_container = el,
        number_container,
        bullets_container,
        timer_container,
        idx = 0,
        animate,
        timer,
        locked = false,
        adjust_height_after = false;

    slides_container.children().first().addClass(settings.active_slide_class);

    self.update_slide_number = function(index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index)+1);
        number_container.find('span:last').text(slides_container.children().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };

    self.update_active_link = function(index) {
      var link = $('a[data-orbit-link="'+slides_container.children().eq(index).attr('data-orbit-slide')+'"]');
      link.parents('ul').find('[data-orbit-link]').removeClass(settings.bullets_active_class);
      link.addClass(settings.bullets_active_class);
    };

    self.build_markup = function() {
      slides_container.wrap('<div class="'+settings.container_class+'"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);
      
      if (settings.navigation_arrows) {
        container.append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
        container.append($('<a href="#"><span></span></a>').addClass(settings.next_class));
      }

      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }

      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> ' + settings.slide_number_text + ' <span></span>');
        container.append(number_container);
      }

      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        bullets_container.wrap('<div class="orbit-bullets-container"></div>');
        slides_container.children().each(function(idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx);
          bullets_container.append(bullet);
        });
      }

      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }

      self.update_slide_number(0);
      self.update_active_link(0);
    };

    self._goto = function(next_idx, start_timer) {
      // if (locked) {return false;}
      if (next_idx === idx) {return false;}
      if (typeof timer === 'object') {timer.restart();}
      var slides = slides_container.children();

      var dir = 'next';
      locked = true;
      if (next_idx < idx) {dir = 'prev';}
      if (next_idx >= slides.length) {next_idx = 0;}
      else if (next_idx < 0) {next_idx = slides.length - 1;}
      
      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));

      current.css('zIndex', 2);
      current.removeClass(settings.active_slide_class);
      next.css('zIndex', 4).addClass(settings.active_slide_class);

      slides_container.trigger('before-slide-change.fndtn.orbit');
      settings.before_slide_change();
      self.update_active_link(next_idx);
      
      var callback = function() {
        var unlock = function() {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {timer = self.create_timer(); timer.start();}
          self.update_slide_number(idx);
          slides_container.trigger('after-slide-change.fndtn.orbit',[{slide_number: idx, total_slides: slides.length}]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.height() != next.height() && settings.variable_height) {
          slides_container.animate({'height': next.height()}, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };

      if (slides.length === 1) {callback(); return false;}

      var start_animation = function() {
        if (dir === 'next') {animate.next(current, next, callback);}
        if (dir === 'prev') {animate.prev(current, next, callback);}        
      };

      if (next.height() > slides_container.height() && settings.variable_height) {
        slides_container.animate({'height': next.height()}, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };
    
    self.next = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };
    
    self.prev = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };

    self.link_custom = function(e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if ((typeof link === 'string') && (link = $.trim(link)) != "") {
        var slide = container.find('[data-orbit-slide='+link+']');
        if (slide.index() != -1) {self._goto(slide.index());}
      }
    };

    self.link_bullet = function(e) {
      var index = $(this).attr('data-orbit-slide');
      if ((typeof index === 'string') && (index = $.trim(index)) != "") {
        self._goto(parseInt(index));
      }
    }

    self.timer_callback = function() {
      self._goto(idx + 1, true);
    }
    
    self.compute_dimensions = function() {
      var current = $(slides_container.children().get(idx));
      var h = current.height();
      if (!settings.variable_height) {
        slides_container.children().each(function(){
          if ($(this).height() > h) { h = $(this).height(); }
        });
      }
      slides_container.height(h);
    };

    self.create_timer = function() {
      var t = new Timer(
        container.find('.'+settings.timer_container_class), 
        settings, 
        self.timer_callback
      );
      return t;
    };

    self.stop_timer = function() {
      if (typeof timer === 'object') timer.stop();
    };

    self.toggle_timer = function() {
      var t = container.find('.'+settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {timer = self.create_timer();}
        timer.start();     
      }
      else {
        if (typeof timer === 'object') {timer.stop();}
      }
    };

    self.init = function() {
      self.build_markup();
      if (settings.timer) {timer = self.create_timer(); timer.start();}
      animate = new FadeAnimation(settings, slides_container);
      if (settings.animation === 'slide') 
        animate = new SlideAnimation(settings, slides_container);        
      container.on('click', '.'+settings.next_class, self.next);
      container.on('click', '.'+settings.prev_class, self.prev);
      container.on('click', '[data-orbit-slide]', self.link_bullet);
      container.on('click', self.toggle_timer);
      if (settings.swipe) {
        container.on('touchstart.fndtn.orbit', function(e) {
          if (!e.touches) {e = e.originalEvent;}
          var data = {
            start_page_x: e.touches[0].pageX,
            start_page_y: e.touches[0].pageY,
            start_time: (new Date()).getTime(),
            delta_x: 0,
            is_scrolling: undefined
          };
          container.data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.orbit', function(e) {
          if (!e.touches) { e = e.originalEvent; }
          // Ignore pinch/zoom events
          if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

          var data = container.data('swipe-transition');
          if (typeof data === 'undefined') {data = {};}

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
            data.active = true;
            self._goto(direction);
          }
        })
        .on('touchend.fndtn.orbit', function(e) {
          container.data('swipe-transition', {});
          e.stopPropagation();
        })
      }
      container.on('mouseenter.fndtn.orbit', function(e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      })
      .on('mouseleave.fndtn.orbit', function(e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });
      
      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('resize', self.compute_dimensions);
      $(window).on('load', self.compute_dimensions);
      $(window).on('load', function(){
        container.prev('.preloader').css('display', 'none');
      });
      slides_container.trigger('ready.fndtn.orbit');
    };

    self.init();
  };

  var Timer = function(el, settings, callback) {
    var self = this,
        duration = settings.timer_speed,
        progress = el.find('.'+settings.timer_progress_class),
        start, 
        timeout,
        left = -1;

    this.update_progress = function(w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w+'%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };

    this.restart = function() {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };

    this.start = function() {
      if (!el.hasClass(settings.timer_paused_class)) {return true;}
      left = (left === -1) ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({'width': '100%'}, left, 'linear');
      timeout = setTimeout(function() {
        self.restart();
        callback();
      }, left);
      el.trigger('timer-started.fndtn.orbit')
    };

    this.stop = function() {
      if (el.hasClass(settings.timer_paused_class)) {return true;}
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - ((left / duration) * 100);
      self.update_progress(w);
      el.trigger('timer-stopped.fndtn.orbit');
    };
  };
  
  var SlideAnimation = function(settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';
    var animMargin = {};
    animMargin[margin] = '0%';

    this.next = function(current, next, callback) {
      current.animate({marginLeft:'-100%'}, duration);
      next.animate(animMargin, duration, function() {
        current.css(margin, '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      current.animate({marginLeft:'100%'}, duration);
      prev.css(margin, '-100%');
      prev.animate(animMargin, duration, function() {
        current.css(margin, '100%');
        callback();
      });
    };
  };

  var FadeAnimation = function(settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';

    this.next = function(current, next, callback) {
      next.css({'margin':'0%', 'opacity':'0.01'});
      next.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('margin', '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      prev.css({'margin':'0%', 'opacity':'0.01'});
      prev.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('margin', '100%');
        callback();
      });
    };
  };


  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name: 'orbit',

    version: '5.0.0',

    settings: {
      animation: 'slide',
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      animation_speed: 500,
      stack_on_small: false,
      navigation_arrows: true,
      slide_number: true,
      slide_number_text: 'of',
      container_class: 'orbit-container',
      stack_on_small_class: 'orbit-stack-on-small',
      next_class: 'orbit-next',
      prev_class: 'orbit-prev',
      timer_container_class: 'orbit-timer',
      timer_paused_class: 'paused',
      timer_progress_class: 'orbit-progress',
      slides_container_class: 'orbit-slides-container',
      bullets_container_class: 'orbit-bullets',
      bullets_active_class: 'active',
      slide_number_class: 'orbit-slide-number',
      caption_class: 'orbit-caption',
      active_slide_class: 'active',
      orbit_transition_class: 'orbit-transitioning',
      bullets: true,
      timer: true,
      variable_height: false,
      swipe: true,
      before_slide_change: noop,
      after_slide_change: noop
    },

    init: function (scope, method, options) {
      var self = this;

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if ($(scope).is('[data-orbit]')) {
        var $el = $(scope);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      }

      $('[data-orbit]', scope).each(function(idx, el) {
        var $el = $(el);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      });
    }
  };

    
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '5.0.0',

    locked : false,

    settings : {
      animation: 'fadeAndPop',
      animation_speed: 250,
      close_on_background_click: true,
      close_on_esc: true,
      dismiss_modal_class: 'close-reveal-modal',
      bg_class: 'reveal-modal-bg',
      open: function(){},
      opened: function(){},
      close: function(){},
      closed: function(){},
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity': 0,
          'visibility': 'visible',
          'display' : 'block'
        },
        close : {
          'opacity': 1,
          'visibility': 'hidden',
          'display': 'none'
        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'delay');

      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this;

      $('[data-reveal-id]', this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', function (e) {
          e.preventDefault();

          if (!self.locked) {
            var element = $(this),
                ajax = element.data('reveal-ajax');

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;

              self.open.call(self, element, {url: url});
            }
          }
        });

      $(this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', this.close_targets(), function (e) {

          e.preventDefault();

          if (!self.locked) {
            var settings = $('[data-reveal].open').data('reveal-init'),
                bg_clicked = $(e.target)[0] === $('.' + settings.bg_class)[0];

            if (bg_clicked && !settings.close_on_background_click) {
              return;
            }

            self.locked = true;
            self.close.call(self, bg_clicked ? $('[data-reveal].open') : $(this).closest('[data-reveal]'));
          }
        });

      if($('[data-reveal]', this.scope).length > 0) {
        $(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', this.settings.open)
          .on('opened.fndtn.reveal', this.settings.opened)
          .on('opened.fndtn.reveal', this.open_video)
          .on('close.fndtn.reveal', this.settings.close)
          .on('closed.fndtn.reveal', this.settings.closed)
          .on('closed.fndtn.reveal', this.close_video);
      } else {
        $(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', '[data-reveal]', this.settings.open)
          .on('opened.fndtn.reveal', '[data-reveal]', this.settings.opened)
          .on('opened.fndtn.reveal', '[data-reveal]', this.open_video)
          .on('close.fndtn.reveal', '[data-reveal]', this.settings.close)
          .on('closed.fndtn.reveal', '[data-reveal]', this.settings.closed)
          .on('closed.fndtn.reveal', '[data-reveal]', this.close_video);
      }

      $('body').on('keyup.fndtn.reveal', function ( event ) {
        var open_modal = $('[data-reveal].open'),
            settings = open_modal.data('reveal-init');
        if ( event.which === 27  && settings.close_on_esc) { // 27 is the keycode for the Escape key
          open_modal.foundation('reveal', 'close');
        }
      });

      return true;
    },

    open : function (target, ajax_settings) {
      if (target) {
        if (typeof target.selector !== 'undefined') {
          var modal = $('#' + target.data('reveal-id'));
        } else {
          var modal = $(this.scope);

          ajax_settings = target;
        }
      } else {
        var modal = $(this.scope);
      }

      if (!modal.hasClass('open')) {
        var open_modal = $('[data-reveal].open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        modal.trigger('open');

        if (open_modal.length < 1) {
          this.toggle_bg();
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          this.hide(open_modal, this.settings.css.close);
          this.show(modal, this.settings.css.open);
        } else {
          var self = this,
              old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;

          $.extend(ajax_settings, {
            success: function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                old_success(data, textStatus, jqXHR);
              }

              modal.html(data);
              $(modal).foundation('section', 'reflow');

              self.hide(open_modal, self.settings.css.close);
              self.show(modal, self.settings.css.open);
            }
          });

          $.ajax(ajax_settings);
        }
      }
    },

    close : function (modal) {

      var modal = modal && modal.length ? modal : $(this.scope),
          open_modals = $('[data-reveal].open');

      if (open_modals.length > 0) {
        this.locked = true;
        modal.trigger('close');
        this.toggle_bg();
        this.hide(open_modals, this.settings.css.close);
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismiss_modal_class;

      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }

      return base;
    },

    toggle_bg : function () {
      if ($('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bg_class})
          .appendTo('body');
      }

      if (this.settings.bg.filter(':visible').length > 0) {
        this.hide(this.settings.bg);
      } else {
        this.show(this.settings.bg);
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        if (el.parent('body').length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();
          el.on('closed.fndtn.reveal.wrapped', function() {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });

          el.detach().appendTo('body');
        }

        if (/pop/i.test(this.settings.animation)) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return this.delay(function () {
            return el
              .css(css)
              .animate(end_css, this.settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened');
              }.bind(this))
              .addClass('open');
          }.bind(this), this.settings.animation_speed / 2);
        }

        if (/fade/i.test(this.settings.animation)) {
          var end_css = {opacity: 1};

          return this.delay(function () {
            return el
              .css(css)
              .animate(end_css, this.settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.trigger('opened');
              }.bind(this))
              .addClass('open');
          }.bind(this), this.settings.animation_speed / 2);
        }

        return el.css(css).show().css({opacity: 1}).addClass('open').trigger('opened');
      }

      // should we animate the background?
      if (/fade/i.test(this.settings.animation)) {
        return el.fadeIn(this.settings.animation_speed / 2);
      }

      return el.show();
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        if (/pop/i.test(this.settings.animation)) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return this.delay(function () {
            return el
              .animate(end_css, this.settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed');
              }.bind(this))
              .removeClass('open');
          }.bind(this), this.settings.animation_speed / 2);
        }

        if (/fade/i.test(this.settings.animation)) {
          var end_css = {opacity: 0};

          return this.delay(function () {
            return el
              .animate(end_css, this.settings.animation_speed, 'linear', function () {
                this.locked = false;
                el.css(css).trigger('closed');
              }.bind(this))
              .removeClass('open');
          }.bind(this), this.settings.animation_speed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed');
      }

      // should we animate the background?
      if (/fade/i.test(this.settings.animation)) {
        return el.fadeOut(this.settings.animation_speed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $(this).find('.flex-video'),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', 'about:blank');
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $(this).find('.flex-video'),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10);

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
/*jslint unparam: true, browser: true, indent: 2 */

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tab = {
    name : 'tab',

    version : '5.0.1',

    settings : {
      active_class: 'active'
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      $(this.scope).off('.tab').on('click.fndtn.tab', '[data-tab] > dd > a', function (e) {
        e.preventDefault();

        var tab = $(this).parent(),
            target = $('#' + this.href.split('#')[1]),
            siblings = tab.siblings(),
            settings = tab.closest('[data-tab]').data('tab-init');

        tab.addClass(settings.active_class);
        siblings.removeClass(settings.active_class);
        target.siblings().removeClass(settings.active_class).end().addClass(settings.active_class);
      });
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltip = {
    name : 'tooltip',

    version : '5.0.0',

    settings : {
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      append_to: 'body',
      touch_close_text: 'Tap To Close',
      disable_for_touch: false,
      tip_template : function (selector, content) {
        return '<span data-selector="' + selector + '" class="' 
          + Foundation.libs.tooltip.settings.tooltip_class.substring(1) 
          + '">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this;

      if (Modernizr.touch) {
        $(this.scope)
          .off('.tooltip')
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var settings = $.extend({}, self.settings, self.data_options($(this)));
            if (!settings.disable_for_touch) {
              e.preventDefault();
              $(settings.tooltip_class).hide();
              self.showOrCreateTip($(this));
            }
          })
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', 
            this.settings.tooltip_class, function (e) {
            e.preventDefault();
            $(this).fadeOut(150);
          });
      } else {
        $(this.scope)
          .off('.tooltip')
          .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip', 
            '[data-tooltip]', function (e) {
            var $this = $(this);

            if (/enter|over/i.test(e.type)) {
              self.showOrCreateTip($this);
            } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
              self.hide($this);
            }
          });
      }
    },

    showOrCreateTip : function ($target) {
      var $tip = this.getTip($target);

      if ($tip && $tip.length > 0) {
        return this.show($target);
      }

      return this.create($target);
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          tip = null;

      if (selector) {
        tip = $('span[data-selector="' + selector + '"]' + this.settings.tooltip_class);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector : function ($target) {
      var id = $target.attr('id'),
          dataSelector = $target.attr('data-tooltip') || $target.attr('data-selector');

      if ((id && id.length < 1 || !id) && typeof dataSelector != 'string') {
        dataSelector = 'tooltip' + Math.random().toString(36).substring(7);
        $target.attr('data-selector', dataSelector);
      }

      return (id && id.length > 0) ? id : dataSelector;
    },

    create : function ($target) {
      var $tip = $(this.settings.tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(this.settings.append_to);
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">'+this.settings.touch_close_text+'</span>');
      }
      $target.removeAttr('title').attr('title','');
      this.show($target);
    },

    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : (top) ? top : 'auto',
          'bottom' : (bottom) ? bottom : 'auto',
          'left' : (left) ? left : 'auto',
          'right' : (right) ? right : 'auto',
          'width' : (width) ? width : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left, width);

      if (this.small()) {
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          left = target.offset().left + target.offset().width - tip.outerWidth();
        }
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', left, width);
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          objPos(tip, (target.offset().top - tip.outerHeight()), 'auto', 'auto', left, width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left - tip.outerWidth() - nubHeight), width)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight*2.5), 'auto', 'auto', (target.offset().left + target.outerWidth() + nubHeight), width)
            .removeClass('tip-override');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches;
    },

    inheritable_classes : function (target) {
      var inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'noradius'].concat(this.settings.additional_inheritable_classes),
          classes = target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
            if ($.inArray(el, inheritables) !== -1) {
              return el;
            }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      this.reposition($target, $tip, $target.attr('class'));
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);

      $tip.fadeOut(150);
    },

    // deprecate reload
    reload : function () {
      var $self = $(this);

      return ($self.data('fndtn-tooltips')) ? $self.foundationTooltips('destroy').foundationTooltips('init') : $self.foundationTooltips('init');
    },

    off : function () {
      $(this.scope).off('.fndtn.tooltip');
      $(this.settings.tooltip_class).each(function (i) {
        $('[data-tooltip]').get(i).attr('title', $(this).text());
      }).remove();
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version: '5.0.1',

    settings : {
      index : 0,
      sticky_class : 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      is_hover: true,
      mobile_show_parent_link: false,
      scrolltop : true // jump to top when sticky nav menu toggle is clicked
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'addCustomRule register_media throttle');
      var self = this;

      self.register_media('topbar', 'foundation-mq-topbar');

      this.bindings(method, options);

      $('[data-topbar]', this.scope).each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init'),
            section = $('section', this),
            titlebar = $('> ul', this).first();

        topbar.data('index', 0);

        var topbarContainer = topbar.parent();
        if(topbarContainer.hasClass('fixed') || topbarContainer.hasClass(settings.sticky_class)) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.stick_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }

        if (!settings.assembled) self.assemble(topbar);

        if (settings.is_hover) {
          $('.has-dropdown', topbar).addClass('not-click');
        } else {
          $('.has-dropdown', topbar).removeClass('not-click');
        }

        // Pad body when sticky (scrolled) or fixed.
        self.addCustomRule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');

        if (topbarContainer.hasClass('fixed')) {
          $('body').addClass('f-topbar-fixed');
        }
      });

    },

    toggle: function (toggleEl) {
      var self = this;

      if (toggleEl) {
        var topbar = $(toggleEl).closest('[data-topbar]');
      } else {
        var topbar = $('[data-topbar]');
      }

      var settings = topbar.data('topbar-init');

      var section = $('section, .section', topbar);

      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({left: '0%'});
          $('>.name', section).css({left: '100%'});
        } else {
          section.css({right: '0%'});
          $('>.name', section).css({right: '100%'});
        }

        $('li.moved', section).removeClass('moved');
        topbar.data('index', 0);

        topbar
          .toggleClass('expanded')
          .css('height', '');
      }

      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            $('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            $('body').removeClass('f-topbar-fixed');

            window.scrollTo(0,0);
          } else {
              topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if(topbar.parent().hasClass(self.settings.sticky_class)) {
          topbar.parent().addClass('fixed');
        }

        if(topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
          }
        }
      }
    },

    timer : null,

    events : function (bar) {
      var self = this;
      $(this.scope)
        .off('.topbar')
        .on('click.fndtn.topbar', '[data-topbar] .toggle-topbar', function (e) {
          e.preventDefault();
          self.toggle(this);
        })
        .on('click.fndtn.topbar', '[data-topbar] li.has-dropdown', function (e) {
          var li = $(this),
              target = $(e.target),
              topbar = li.closest('[data-topbar]'),
              settings = topbar.data('topbar-init');

          if(target.data('revealId')) {
            self.toggle();
            return;
          }

          if (self.breakpoint()) return;
          if (settings.is_hover && !Modernizr.touch) return;

          e.stopImmediatePropagation();

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');

            li.parents('li.hover')
              .removeClass('hover');
          } else {
            li.addClass('hover');

            if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
              e.preventDefault();
            }
          }
        })
        .on('click.fndtn.topbar', '[data-topbar] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {

            e.preventDefault();

            var $this = $(this),
                topbar = $this.closest('[data-topbar]'),
                section = topbar.find('section, .section'),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
            } else {
              section.css({right: -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
          }
        });
      
      $(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
        self.resize.call(self);
      }, 50)).trigger('resize');

      $('body').off('.topbar').on('click.fndtn.topbar touchstart.fndtn.topbar', function (e) {
        var parent = $(e.target).closest('li').closest('li.hover');

        if (parent.length > 0) {
          return;
        }

        $('[data-topbar] li').removeClass('hover');
      });

      // Go up a level on Click
      $(this.scope).on('click.fndtn.topbar', '[data-topbar] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = $(this),
            topbar = $this.closest('[data-topbar]'),
            section = topbar.find('section, .section'),
            settings = topbar.data('topbar-init'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left: 100 * topbar.data('index') + '%'});
        } else {
          section.css({right: -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right: 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });
    },

    resize : function () {
      var self = this;
      $('[data-topbar]').each(function () {
        var topbar = $(this),
            settings = topbar.data('topbar-init');

        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;

        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');

            if(doToggle) {
              self.toggle(topbar);
            }
        }

        if(stickyContainer.length > 0) {
          if(stickyContainer.hasClass('fixed')) {
            // Remove the fixed to allow for correct calculation of the offset.
            stickyContainer.removeClass('fixed');

            stickyOffset = stickyContainer.offset().top;
            if($(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }

            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }

      });
    },

    breakpoint : function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },

    assemble : function (topbar) {
      var self = this,
          settings = topbar.data('topbar-init'),
          section = $('section', topbar),
          titlebar = $('> ul', topbar).first();

      // Pull element out of the DOM for manipulation
      section.detach();

      $('.has-dropdown>a', section).each(function () {
        var $link = $(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href');

        if (settings.mobile_show_parent_link && url && url.length > 1) {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li><li><a class="parent-link js-generated" href="' + url + '">' + $link.text() +'</a></li>');
        } else {
          var $titleLi = $('<li class="title back js-generated"><h5><a href="#"></a></h5></li>');
        }

        // Copy link to subnav
        if (settings.custom_back_text == true) {
          $('h5>a', $titleLi).html(settings.back_text);
        } else {
          $('h5>a', $titleLi).html('&laquo; ' + $link.html());
        }
        $dropdown.prepend($titleLi);
      });

      // Put element back in the DOM
      section.appendTo(topbar);

      // check for sticky
      this.sticky();

      this.assembled(topbar);
    },

    assembled : function (topbar) {
      topbar.data('topbar-init', $.extend({}, topbar.data('topbar-init'), {assembled: true}));
    },

    height : function (ul) {
      var total = 0,
          self = this;

      $('> li', ul).each(function () { total += $(this).outerHeight(true); });

      return total;
    },

    sticky : function () {
      var $window = $(window),
          self = this;

      $(window).on('scroll', function() {
        self.update_sticky_positioning();
      });
    },

    update_sticky_positioning: function() {
      var klass = '.' + this.settings.sticky_class;
      var $window = $(window);

      if ($(klass).length > 0) {
        var distance = this.settings.sticky_topbar.data('stickyoffset');
        if (!$(klass).hasClass('expanded')) {
          if ($window.scrollTop() > (distance)) {
            if (!$(klass).hasClass('fixed')) {
              $(klass).addClass('fixed');
              $('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if ($(klass).hasClass('fixed')) {
              $(klass).removeClass('fixed');
              $('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },

    off : function () {
      $(this.scope).off('.fndtn.topbar');
      $(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(jQuery, this, this.document));















(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
//
// ChemDoodle Web Components uses the following open source software. None
// of these libraries were modified in any way, and are included without
// modification:
//
// - jQuery:          Software URL: http://jquery.com/
//                    License: MIT License
//                    License URL: http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt
// - jQuery:          Software URL: http://plugins.jquery.com/project/mousewheel
//    _mousewheel     License: MIT License
//                    License URL: http://www.opensource.org/licenses/mit-license.php
// - glMatrix:        Software URL: http://code.google.com/p/glmatrix/
//                    License: BSD License
//                    License URL: http://www.opensource.org/licenses/bsd-license.php
//
// =========================== glMatrix ===============================
// gl-matrix 1.3.7 - https://github.com/toji/gl-matrix/blob/master/LICENSE.md
(function(w,D){"object"===typeof exports?module.exports=D(global):"function"===typeof define&&define.amd?define([],function(){return D(w)}):D(w)})(this,function(w){function D(a){return o=a}function G(){return o="undefined"!==typeof Float32Array?Float32Array:Array}var E={};(function(){if("undefined"!=typeof Float32Array){var a=new Float32Array(1),b=new Int32Array(a.buffer);E.invsqrt=function(c){a[0]=c;b[0]=1597463007-(b[0]>>1);var d=a[0];return d*(1.5-0.5*c*d*d)}}else E.invsqrt=function(a){return 1/
Math.sqrt(a)}})();var o=null;G();var r={create:function(a){var b=new o(3);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2]):b[0]=b[1]=b[2]=0;return b},createFrom:function(a,b,c){var d=new o(3);d[0]=a;d[1]=b;d[2]=c;return d},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])},add:function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];
return c},subtract:function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c},multiply:function(a,b,c){if(!c||a===c)return a[0]*=b[0],a[1]*=b[1],a[2]*=b[2],a;c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];return c},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b},scale:function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c},normalize:function(a,b){b||(b=a);var c=
a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(!g)return b[0]=0,b[1]=0,b[2]=0,b;if(1===g)return b[0]=c,b[1]=d,b[2]=e,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b},cross:function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c},length:function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)},squaredLength:function(a){var b=a[0],c=a[1],a=a[2];return b*b+c*c+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)}},H=null,y=new o(4);r.unproject=function(a,b,c,d,e){e||(e=a);H||(H=x.create());var g=H;y[0]=2*(a[0]-d[0])/d[2]-1;y[1]=2*(a[1]-d[1])/d[3]-1;y[2]=
2*a[2]-1;y[3]=1;x.multiply(c,b,g);if(!x.inverse(g))return null;x.multiplyVec4(g,y);if(0===y[3])return null;e[0]=y[0]/y[3];e[1]=y[1]/y[3];e[2]=y[2]/y[3];return e};var L=r.createFrom(1,0,0),M=r.createFrom(0,1,0),N=r.createFrom(0,0,1),z=r.create();r.rotationTo=function(a,b,c){c||(c=k.create());var d=r.dot(a,b);if(1<=d)k.set(O,c);else if(-0.999999>d)r.cross(L,a,z),1.0E-6>r.length(z)&&r.cross(M,a,z),1.0E-6>r.length(z)&&r.cross(N,a,z),r.normalize(z),k.fromAngleAxis(Math.PI,z,c);else{var d=Math.sqrt(2*(1+
d)),e=1/d;r.cross(a,b,z);c[0]=z[0]*e;c[1]=z[1]*e;c[2]=z[2]*e;c[3]=0.5*d;k.normalize(c)}1<c[3]?c[3]=1:-1>c[3]&&(c[3]=-1);return c};r.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var A={create:function(a){var b=new o(9);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]):b[0]=b[1]=b[2]=b[3]=b[4]=b[5]=b[6]=b[7]=b[8]=0;return b},createFrom:function(a,b,c,d,e,g,f,h,j){var i=new o(9);i[0]=a;i[1]=b;i[2]=c;i[3]=d;i[4]=e;i[5]=g;i[6]=f;i[7]=h;i[8]=j;return i},
determinant:function(a){var b=a[3],c=a[4],d=a[5],e=a[6],g=a[7],f=a[8];return a[0]*(f*c-d*g)+a[1]*(-f*b+d*e)+a[2]*(g*b-c*e)},inverse:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=m*f-h*i,C=-m*g+h*j,q=i*g-f*j,n=c*l+d*C+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=C*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],
f=a[3],h=a[4],j=a[5],i=a[6],m=a[7],a=a[8],l=b[0],C=b[1],q=b[2],n=b[3],k=b[4],p=b[5],o=b[6],s=b[7],b=b[8];c[0]=l*d+C*f+q*i;c[1]=l*e+C*h+q*m;c[2]=l*g+C*j+q*a;c[3]=n*d+k*f+p*i;c[4]=n*e+k*h+p*m;c[5]=n*g+k*j+p*a;c[6]=o*d+s*f+b*i;c[7]=o*e+s*h+b*m;c[8]=o*g+s*j+b*a;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[3]+a[6];c[1]=d*a[1]+b*a[4]+a[7];return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=d*a[0]+e*a[3]+b*a[6];c[1]=d*a[1]+e*a[4]+b*a[7];c[2]=
d*a[2]+e*a[5]+b*a[8];return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])},identity:function(a){a||(a=A.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;
a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b},toMat4:function(a,b){b||(b=x.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b},str:function(a){return"["+a[0]+", "+a[1]+
", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"}},x={create:function(a){var b=new o(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b},createFrom:function(a,b,c,d,e,g,f,h,j,i,m,l,C,q,n,k){var p=new o(16);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=g;p[6]=f;p[7]=h;p[8]=j;p[9]=i;p[10]=m;p[11]=l;p[12]=C;p[13]=q;p[14]=n;p[15]=k;return p},set:function(a,
b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])&&1.0E-6>Math.abs(a[4]-b[4])&&1.0E-6>Math.abs(a[5]-b[5])&&1.0E-6>Math.abs(a[6]-b[6])&&1.0E-6>Math.abs(a[7]-b[7])&&1.0E-6>Math.abs(a[8]-b[8])&&1.0E-6>Math.abs(a[9]-b[9])&&1.0E-6>
Math.abs(a[10]-b[10])&&1.0E-6>Math.abs(a[11]-b[11])&&1.0E-6>Math.abs(a[12]-b[12])&&1.0E-6>Math.abs(a[13]-b[13])&&1.0E-6>Math.abs(a[14]-b[14])&&1.0E-6>Math.abs(a[15]-b[15])},identity:function(a){a||(a=x.create());a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=
a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b},determinant:function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],j=a[7],i=a[8],m=a[9],l=a[10],C=a[11],q=a[12],n=a[13],k=a[14],a=a[15];return q*m*h*e-i*n*h*e-q*f*l*e+g*n*l*e+i*f*k*e-g*m*k*e-q*m*d*j+i*n*d*j+q*c*l*j-b*n*l*j-i*c*k*j+b*m*k*j+q*f*d*C-g*n*d*C-q*c*h*C+b*n*h*C+
g*c*k*C-b*f*k*C-i*f*d*a+g*m*d*a+i*c*h*a-b*m*h*a-g*c*l*a+b*f*l*a},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],j=a[6],i=a[7],m=a[8],l=a[9],k=a[10],q=a[11],n=a[12],o=a[13],p=a[14],r=a[15],s=c*h-d*f,v=c*j-e*f,t=c*i-g*f,u=d*j-e*h,w=d*i-g*h,x=e*i-g*j,y=m*o-l*n,z=m*p-k*n,F=m*r-q*n,A=l*p-k*o,D=l*r-q*o,E=k*r-q*p,B=s*E-v*D+t*A+u*F-w*z+x*y;if(!B)return null;B=1/B;b[0]=(h*E-j*D+i*A)*B;b[1]=(-d*E+e*D-g*A)*B;b[2]=(o*x-p*w+r*u)*B;b[3]=(-l*x+k*w-q*u)*B;b[4]=(-f*E+j*F-i*z)*B;b[5]=
(c*E-e*F+g*z)*B;b[6]=(-n*x+p*t-r*v)*B;b[7]=(m*x-k*t+q*v)*B;b[8]=(f*D-h*F+i*y)*B;b[9]=(-c*D+d*F-g*y)*B;b[10]=(n*w-o*t+r*s)*B;b[11]=(-m*w+l*t-q*s)*B;b[12]=(-f*A+h*z-j*y)*B;b[13]=(c*A-d*z+e*y)*B;b[14]=(-n*u+o*v-p*s)*B;b[15]=(m*u-l*v+k*s)*B;return b},toRotationMat:function(a,b){b||(b=x.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b},toMat3:function(a,b){b||(b=A.create());b[0]=
a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b},toInverseMat3:function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],j=a[8],i=a[9],m=a[10],l=m*f-h*i,k=-m*g+h*j,q=i*g-f*j,n=c*l+d*k+e*q;if(!n)return null;n=1/n;b||(b=A.create());b[0]=l*n;b[1]=(-m*d+e*i)*n;b[2]=(h*d-e*f)*n;b[3]=k*n;b[4]=(m*c-e*j)*n;b[5]=(-h*c+e*g)*n;b[6]=q*n;b[7]=(-i*c+d*j)*n;b[8]=(f*c-d*g)*n;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],j=a[5],
i=a[6],m=a[7],l=a[8],k=a[9],q=a[10],n=a[11],o=a[12],p=a[13],r=a[14],a=a[15],s=b[0],v=b[1],t=b[2],u=b[3];c[0]=s*d+v*h+t*l+u*o;c[1]=s*e+v*j+t*k+u*p;c[2]=s*g+v*i+t*q+u*r;c[3]=s*f+v*m+t*n+u*a;s=b[4];v=b[5];t=b[6];u=b[7];c[4]=s*d+v*h+t*l+u*o;c[5]=s*e+v*j+t*k+u*p;c[6]=s*g+v*i+t*q+u*r;c[7]=s*f+v*m+t*n+u*a;s=b[8];v=b[9];t=b[10];u=b[11];c[8]=s*d+v*h+t*l+u*o;c[9]=s*e+v*j+t*k+u*p;c[10]=s*g+v*i+t*q+u*r;c[11]=s*f+v*m+t*n+u*a;s=b[12];v=b[13];t=b[14];u=b[15];c[12]=s*d+v*h+t*l+u*o;c[13]=s*e+v*j+t*k+u*p;c[14]=s*g+
v*i+t*q+u*r;c[15]=s*f+v*m+t*n+u*a;return c},multiplyVec3:function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c},multiplyVec4:function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c},translate:function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,j,i,m,l,k,q,
n,o,p;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];j=a[3];i=a[4];m=a[5];l=a[6];k=a[7];q=a[8];n=a[9];o=a[10];p=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=j;c[4]=i;c[5]=m;c[6]=l;c[7]=k;c[8]=q;c[9]=n;c[10]=o;c[11]=p;c[12]=g*d+i*e+q*b+a[12];c[13]=f*d+m*e+n*b+a[13];c[14]=h*d+l*e+o*b+a[14];c[15]=j*d+k*e+p*b+a[15];return c},scale:function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=
d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c},rotate:function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,j,i,m,l,k,q,n,o,p,r,s,v,t,u,w,x,y,z,A;if(!f)return null;1!==f&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);j=Math.cos(b);i=1-j;b=a[0];
f=a[1];m=a[2];l=a[3];k=a[4];q=a[5];n=a[6];o=a[7];p=a[8];r=a[9];s=a[10];v=a[11];t=e*e*i+j;u=g*e*i+c*h;w=c*e*i-g*h;x=e*g*i-c*h;y=g*g*i+j;z=c*g*i+e*h;A=e*c*i+g*h;e=g*c*i-e*h;g=c*c*i+j;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+k*u+p*w;d[1]=f*t+q*u+r*w;d[2]=m*t+n*u+s*w;d[3]=l*t+o*u+v*w;d[4]=b*x+k*y+p*z;d[5]=f*x+q*y+r*z;d[6]=m*x+n*y+s*z;d[7]=l*x+o*y+v*z;d[8]=b*A+k*e+p*g;d[9]=f*A+q*e+r*g;d[10]=m*A+n*e+s*g;d[11]=l*A+o*e+v*g;return d},rotateX:function(a,b,c){var d=Math.sin(b),
b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+j*d;c[5]=g*b+i*d;c[6]=f*b+m*d;c[7]=h*b+l*d;c[8]=e*-d+j*b;c[9]=g*-d+i*b;c[10]=f*-d+m*b;c[11]=h*-d+l*b;return c},rotateY:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[8],i=a[9],m=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=
a[15]):c=a;c[0]=e*b+j*-d;c[1]=g*b+i*-d;c[2]=f*b+m*-d;c[3]=h*b+l*-d;c[8]=e*d+j*b;c[9]=g*d+i*b;c[10]=f*d+m*b;c[11]=h*d+l*b;return c},rotateZ:function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],j=a[4],i=a[5],m=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+j*d;c[1]=g*b+i*d;c[2]=f*b+m*d;c[3]=h*b+l*d;c[4]=e*-d+j*b;c[5]=g*-d+i*b;c[6]=f*-d+m*b;c[7]=h*-d+l*b;return c},frustum:function(a,b,c,d,e,g,f){f||
(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2*e/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2*e/j;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/j;f[10]=-(g+e)/i;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(2*g*e)/i;f[15]=0;return f},perspective:function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return x.frustum(-b,b,-a,a,c,d,e)},ortho:function(a,b,c,d,e,g,f){f||(f=x.create());var h=b-a,j=d-c,i=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/j;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/i;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/j;f[14]=
-(g+e)/i;f[15]=1;return f},lookAt:function(a,b,c,d){d||(d=x.create());var e,g,f,h,j,i,m,l,k=a[0],o=a[1],a=a[2];f=c[0];h=c[1];g=c[2];m=b[0];c=b[1];e=b[2];if(k===m&&o===c&&a===e)return x.identity(d);b=k-m;c=o-c;m=a-e;l=1/Math.sqrt(b*b+c*c+m*m);b*=l;c*=l;m*=l;e=h*m-g*c;g=g*b-f*m;f=f*c-h*b;(l=Math.sqrt(e*e+g*g+f*f))?(l=1/l,e*=l,g*=l,f*=l):f=g=e=0;h=c*f-m*g;j=m*e-b*f;i=b*g-c*e;(l=Math.sqrt(h*h+j*j+i*i))?(l=1/l,h*=l,j*=l,i*=l):i=j=h=0;d[0]=e;d[1]=h;d[2]=b;d[3]=0;d[4]=g;d[5]=j;d[6]=c;d[7]=0;d[8]=f;d[9]=
i;d[10]=m;d[11]=0;d[12]=-(e*k+g*o+f*a);d[13]=-(h*k+j*o+i*a);d[14]=-(b*k+c*o+m*a);d[15]=1;return d},fromRotationTranslation:function(a,b,c){c||(c=x.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,j=e+e,i=g+g,a=d*h,m=d*j,d=d*i,k=e*j,e=e*i,g=g*i,h=f*h,j=f*j,f=f*i;c[0]=1-(k+g);c[1]=m+f;c[2]=d-j;c[3]=0;c[4]=m-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+j;c[9]=e-h;c[10]=1-(a+k);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+
a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"}},k={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>
Math.abs(a[3]-b[3])},identity:function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a}},O=k.identity();k.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};k.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]};k.inverse=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[3],c=(c=c*c+d*d+e*e+g*g)?1/c:0;if(!b||a===b)return a[0]*=-c,a[1]*=-c,a[2]*=-c,a[3]*=
c,a;b[0]=-a[0]*c;b[1]=-a[1]*c;b[2]=-a[2]*c;b[3]=a[3]*c;return b};k.conjugate=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};k.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};k.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(0===f)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};k.add=function(a,b,c){if(!c||
a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a[3]+=b[3],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c};k.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],j=b[2],b=b[3];c[0]=d*b+a*f+e*j-g*h;c[1]=e*b+a*h+g*f-d*j;c[2]=g*b+a*j+d*h-e*f;c[3]=a*b-d*f-e*h-g*j;return c};k.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],j=a*d+f*g-h*e,i=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=j*a+d*-b+i*-h-k*-f;c[1]=i*a+
d*-f+k*-b-j*-h;c[2]=k*a+d*-h+j*-f-i*-b;return c};k.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a[3]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c};k.toMat3=function(a,b){b||(b=A.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(i+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(i+l);return b};k.toMat4=function(a,b){b||(b=x.create());var c=a[0],d=a[1],e=a[2],g=
a[3],f=c+c,h=d+d,j=e+e,i=c*f,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,f=g*f,h=g*h,g=g*j;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(i+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(i+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};k.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(1<=Math.abs(e))return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(0.001>Math.abs(f))return d[0]=0.5*a[0]+0.5*b[0],d[1]=0.5*a[1]+0.5*b[1],
d[2]=0.5*a[2]+0.5*b[2],d[3]=0.5*a[3]+0.5*b[3],d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};k.fromRotationMatrix=function(a,b){b||(b=k.create());var c=a[0]+a[4]+a[8],d;if(0<c)d=Math.sqrt(c+1),b[3]=0.5*d,d=0.5/d,b[0]=(a[7]-a[5])*d,b[1]=(a[2]-a[6])*d,b[2]=(a[3]-a[1])*d;else{d=k.fromRotationMatrix.s_iNext=k.fromRotationMatrix.s_iNext||[1,2,0];c=0;a[4]>a[0]&&(c=1);a[8]>a[3*c+c]&&(c=2);var e=d[c],g=d[e];d=Math.sqrt(a[3*c+
c]-a[3*e+e]-a[3*g+g]+1);b[c]=0.5*d;d=0.5/d;b[3]=(a[3*g+e]-a[3*e+g])*d;b[e]=(a[3*e+c]+a[3*c+e])*d;b[g]=(a[3*g+c]+a[3*c+g])*d}return b};A.toQuat4=k.fromRotationMatrix;(function(){var a=A.create();k.fromAxes=function(b,c,d,e){a[0]=c[0];a[3]=c[1];a[6]=c[2];a[1]=d[0];a[4]=d[1];a[7]=d[2];a[2]=b[0];a[5]=b[1];a[8]=b[2];return k.fromRotationMatrix(a,e)}})();k.identity=function(a){a||(a=k.create());a[0]=0;a[1]=0;a[2]=0;a[3]=1;return a};k.fromAngleAxis=function(a,b,c){c||(c=k.create());var a=0.5*a,d=Math.sin(a);
c[3]=Math.cos(a);c[0]=d*b[0];c[1]=d*b[1];c[2]=d*b[2];return c};k.toAngleAxis=function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1]+a[2]*a[2];0<c?(b[3]=2*Math.acos(a[3]),c=E.invsqrt(c),b[0]=a[0]*c,b[1]=a[1]*c,b[2]=a[2]*c):(b[3]=0,b[0]=1,b[1]=0,b[2]=0);return b};k.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};var J={create:function(a){var b=new o(2);a?(b[0]=a[0],b[1]=a[1]):(b[0]=0,b[1]=0);return b},createFrom:function(a,b){var c=new o(2);c[0]=a;c[1]=b;return c},add:function(a,b,c){c||
(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];return c},subtract:function(a,b,c){c||(c=b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;return c},dist:function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},set:function(a,b){b[0]=a[0];b[1]=a[1];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-
b[0])&&1.0E-6>Math.abs(a[1]-b[1])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];return b},normalize:function(a,b){b||(b=a);var c=a[0]*a[0]+a[1]*a[1];0<c?(c=Math.sqrt(c),b[0]=a[0]/c,b[1]=a[1]/c):b[0]=b[1]=0;return b},cross:function(a,b,c){a=a[0]*b[1]-a[1]*b[0];if(!c)return a;c[0]=c[1]=0;c[2]=a;return c},length:function(a){var b=a[0],a=a[1];return Math.sqrt(b*b+a*a)},squaredLength:function(a){var b=a[0],a=a[1];return b*b+a*a},dot:function(a,b){return a[0]*b[0]+a[1]*b[1]},direction:function(a,
b,c){c||(c=a);var d=a[0]-b[0],a=a[1]-b[1],b=d*d+a*a;if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/Math.sqrt(b);c[0]=d*b;c[1]=a*b;return c},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);return d},str:function(a){return"["+a[0]+", "+a[1]+"]"}},I={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):b[0]=b[1]=b[2]=b[3]=0;return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},set:function(a,b){b[0]=a[0];b[1]=a[1];
b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},identity:function(a){a||(a=I.create());a[0]=1;a[1]=0;a[2]=0;a[3]=1;return a},transpose:function(a,b){if(!b||a===b){var c=a[1];a[1]=a[2];a[2]=c;return a}b[0]=a[0];b[1]=a[2];b[2]=a[1];b[3]=a[3];return b},determinant:function(a){return a[0]*a[3]-a[2]*a[1]},inverse:function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=c*g-e*
d;if(!f)return null;f=1/f;b[0]=g*f;b[1]=-d*f;b[2]=-e*f;b[3]=c*f;return b},multiply:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3];c[0]=d*b[0]+e*b[2];c[1]=d*b[1]+e*b[3];c[2]=g*b[0]+a*b[2];c[3]=g*b[1]+a*b[3];return c},rotate:function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=Math.sin(b),b=Math.cos(b);c[0]=d*b+e*f;c[1]=d*-f+e*b;c[2]=g*b+a*f;c[3]=g*-f+a*b;return c},multiplyVec2:function(a,b,c){c||(c=b);var d=b[0],b=b[1];c[0]=d*a[0]+b*a[1];c[1]=d*a[2]+b*a[3];return c},scale:function(a,
b,c){c||(c=a);var d=a[1],e=a[2],g=a[3],f=b[0],b=b[1];c[0]=a[0]*f;c[1]=d*b;c[2]=e*f;c[3]=g*b;return c},str:function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"}},K={create:function(a){var b=new o(4);a?(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]):(b[0]=0,b[1]=0,b[2]=0,b[3]=0);return b},createFrom:function(a,b,c,d){var e=new o(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return e},add:function(a,b,c){c||(c=b);c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];c[3]=a[3]+b[3];return c},subtract:function(a,b,c){c||(c=
b);c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];c[3]=a[3]-b[3];return c},multiply:function(a,b,c){c||(c=b);c[0]=a[0]*b[0];c[1]=a[1]*b[1];c[2]=a[2]*b[2];c[3]=a[3]*b[3];return c},divide:function(a,b,c){c||(c=b);c[0]=a[0]/b[0];c[1]=a[1]/b[1];c[2]=a[2]/b[2];c[3]=a[3]/b[3];return c},scale:function(a,b,c){c||(c=a);c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;c[3]=a[3]*b;return c},set:function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b},equal:function(a,b){return a===b||1.0E-6>Math.abs(a[0]-b[0])&&1.0E-6>
Math.abs(a[1]-b[1])&&1.0E-6>Math.abs(a[2]-b[2])&&1.0E-6>Math.abs(a[3]-b[3])},negate:function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=-a[3];return b},length:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)},squaredLength:function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return b*b+c*c+d*d+a*a},lerp:function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);d[3]=a[3]+c*(b[3]-a[3]);return d},str:function(a){return"["+a[0]+", "+
a[1]+", "+a[2]+", "+a[3]+"]"}};w&&(w.glMatrixArrayType=o,w.MatrixArray=o,w.setMatrixArrayType=D,w.determineMatrixArrayType=G,w.glMath=E,w.vec2=J,w.vec3=r,w.vec4=K,w.mat2=I,w.mat3=A,w.mat4=x,w.quat4=k);return{glMatrixArrayType:o,MatrixArray:o,setMatrixArrayType:D,determineMatrixArrayType:G,glMath:E,vec2:J,vec3:r,vec4:K,mat2:I,mat3:A,mat4:x,quat4:k}});
// =========================== _mousewheel ===============================
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 * Version: 3.1.6
 * Requires: jQuery 1.2.2+
 */
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e}else{e(jQuery)}})(function(e){function u(t){var n=t||window.event,o=r.call(arguments,1),u=0,f=0,l=0,c=0;t=e.event.fix(n);t.type="mousewheel";if("detail"in n){l=n.detail*-1}if("wheelDelta"in n){l=n.wheelDelta}if("wheelDeltaY"in n){l=n.wheelDeltaY}if("wheelDeltaX"in n){f=n.wheelDeltaX*-1}if("axis"in n&&n.axis===n.HORIZONTAL_AXIS){f=l*-1;l=0}u=l===0?f:l;if("deltaY"in n){l=n.deltaY*-1;u=l}if("deltaX"in n){f=n.deltaX;if(l===0){u=f*-1}}if(l===0&&f===0){return}c=Math.max(Math.abs(l),Math.abs(f));if(!s||c<s){s=c}u=Math[u>=1?"floor":"ceil"](u/s);f=Math[f>=1?"floor":"ceil"](f/s);l=Math[l>=1?"floor":"ceil"](l/s);t.deltaX=f;t.deltaY=l;t.deltaFactor=s;o.unshift(t,u,f,l);if(i){clearTimeout(i)}i=setTimeout(a,200);return(e.event.dispatch||e.event.handle).apply(this,o)}function a(){s=null}var t=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],n="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],r=Array.prototype.slice,i,s;if(e.event.fixHooks){for(var o=t.length;o;){e.event.fixHooks[t[--o]]=e.event.mouseHooks}}e.event.special.mousewheel={version:"3.1.6",setup:function(){if(this.addEventListener){for(var e=n.length;e;){this.addEventListener(n[--e],u,false)}}else{this.onmousewheel=u}},teardown:function(){if(this.removeEventListener){for(var e=n.length;e;){this.removeEventListener(n[--e],u,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})})
;
//
// ChemDoodle Web Components 5.2.3
//
// http://web.chemdoodle.com
//
// Copyright 2009-2013 iChemLabs, LLC.  All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// As a special exception to the GPL, any HTML file in a public website
// or any free web service which merely makes function calls to this
// code, and for that purpose includes it by reference, shall be deemed
// a separate work for copyright law purposes. If you modify this code,
// you may extend this exception to your version of the code, but you
// are not obligated to do so. If you do not wish to do so, delete this
// exception statement from your version.
//
// As an additional exception to the GPL, you may distribute this
// packed form of the code without the copy of the GPL license normally
// required, provided you include this license notice and a URL through
// which recipients can access the corresponding unpacked source code.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
var ChemDoodle=function(){var a={structures:{}};a.structures.d2={};a.structures.d3={};a.iChemLabs={};a.informatics={};a.io={};a.getVersion=function(){return"5.2.3"};return a}();
ChemDoodle.extensions=function(a,c,g){return{stringStartsWith:function(a,c){return a.slice(0,c.length)===c},vec3AngleFrom:function(a,f){var d=c.length(a),n=c.length(f),d=c.dot(a,f)/d/n;return g.acos(d)},contextHashTo:function(c,f,d,n,b,m,v){var j=0,h=(new a.Point(f,d)).distance(new a.Point(n,b)),k=!1,p=f,g=d;f=n-f;for(d=b-d;j<h;){if(k)if(j+v>h){c.moveTo(n,b);break}else{var l=v/h,p=p+l*f,g=g+l*d;c.moveTo(p,g);j+=v}else if(j+m>h){c.lineTo(n,b);break}else l=m/h,p+=l*f,g+=l*d,c.lineTo(p,g),j+=m;k=!k}},
contextRoundRect:function(a,c,d,n,b,m){a.beginPath();a.moveTo(c+m,d);a.lineTo(c+n-m,d);a.quadraticCurveTo(c+n,d,c+n,d+m);a.lineTo(c+n,d+b-m);a.quadraticCurveTo(c+n,d+b,c+n-m,d+b);a.lineTo(c+m,d+b);a.quadraticCurveTo(c,d+b,c,d+b-m);a.lineTo(c,d+m);a.quadraticCurveTo(c,d,c+m,d);a.closePath()},contextEllipse:function(a,c,d,n,b){var m=0.5522848*(n/2),v=0.5522848*(b/2),j=c+n,h=d+b;n=c+n/2;b=d+b/2;a.beginPath();a.moveTo(c,b);a.bezierCurveTo(c,b-v,n-m,d,n,d);a.bezierCurveTo(n+m,d,j,b-v,j,b);a.bezierCurveTo(j,
b+v,n+m,h,n,h);a.bezierCurveTo(n-m,h,c,b+v,c,b);a.closePath()},getFontString:function(a,c,d,n){var b=[];d&&b.push("bold ");n&&b.push("italic ");b.push(a+"px ");a=0;for(d=c.length;a<d;a++)n=c[a],-1!==n.indexOf(" ")&&(n='"'+n+'"'),b.push((0!==a?",":"")+n);return b.join("")}}}(ChemDoodle.structures,vec3,Math);
ChemDoodle.math=function(a,c,g){var e={},f={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",
darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",
gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",
lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",
oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",
skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};e.angleBetweenLargest=function(d){if(0===d.length)return{angle:0,largest:2*g.PI};if(1===d.length)return{angle:d[0]+g.PI,largest:2*g.PI};for(var a=0,b=0,m=0,c=d.length-1;m<c;m++){var j=d[m+1]-d[m];
j>a&&(a=j,b=(d[m+1]+d[m])/2)}m=d[0]+2*g.PI-d[d.length-1];m>a&&(b=d[0]-m/2,a=m,0>b&&(b+=2*g.PI));return{angle:b,largest:a}};e.isBetween=function(d,a,b){if(a>b){var m=a;a=b;b=m}return d>=a&&d<=b};e.getRGB=function(d,n){var b=[0,0,0];f[d.toLowerCase()]&&(d=f[d.toLowerCase()]);if("#"===d.charAt(0))return 4===d.length&&(d="#"+d.charAt(1)+d.charAt(1)+d.charAt(2)+d.charAt(2)+d.charAt(3)+d.charAt(3)),[parseInt(d.substring(1,3),16)/255*n,parseInt(d.substring(3,5),16)/255*n,parseInt(d.substring(5,7),16)/255*
n];if(a.stringStartsWith(d,"rgb")){var m=d.replace(/rgb\(|\)/g,"").split(",");return 3!==m.length?b:[parseInt(m[0])/255*n,parseInt(m[1])/255*n,parseInt(m[2])/255*n]}return b};e.idx2color=function(d){d=d.toString(16);for(var a=0,b=6-d.length;a<b;a++)d="0"+d;return"#"+d};e.distanceFromPointToLineInclusive=function(d,a,b){var m=a.distance(b);b=a.angle(b);b=g.PI/2-b;b=a.angle(d)+b;d=a.distance(d);d=new c.Point(d*g.cos(b),-d*g.sin(b));return e.isBetween(-d.y,0,m)?g.abs(d.x):-1};e.calculateDistanceInterior=
function(d,a,b){if(this.isBetween(a.x,b.x,b.x+b.w)&&this.isBetween(a.y,b.y,b.y+b.w))return d.distance(a);var m=[];m.push({x1:b.x,y1:b.y,x2:b.x+b.w,y2:b.y});m.push({x1:b.x,y1:b.y+b.h,x2:b.x+b.w,y2:b.y+b.h});m.push({x1:b.x,y1:b.y,x2:b.x,y2:b.y+b.h});m.push({x1:b.x+b.w,y1:b.y,x2:b.x+b.w,y2:b.y+b.h});b=[];for(var c=0;4>c;c++){var j=m[c];(j=this.intersectLines(a.x,a.y,d.x,d.y,j.x1,j.y1,j.x2,j.y2))&&b.push(j)}if(0===b.length)return 0;c=a=0;for(m=b.length;c<m;c++){var j=b[c],h=d.x-j.x,j=d.y-j.y;a=g.max(a,
g.sqrt(h*h+j*j))}return a};e.intersectLines=function(d,a,b,m,c,j,h,f){b-=d;m-=a;h-=c;f-=j;var e=m*h-b*f;if(0===e)return!1;h=(f*(d-c)-h*(a-j))/e;c=(m*(d-c)-b*(a-j))/e;return 0<=c&&1>=c&&0<=h&&1>=h?{x:d+h*b,y:a+h*m}:!1};e.hsl2rgb=function(d,a,b){var m=function(b,m,d){0>d?d+=1:1<d&&(d-=1);return d<1/6?b+6*(m-b)*d:0.5>d?m:d<2/3?b+6*(m-b)*(2/3-d):b};if(0===a)b=a=d=b;else{var c=0.5>b?b*(1+a):b+a-b*a,j=2*b-c;b=m(j,c,d+1/3);a=m(j,c,d);d=m(j,c,d-1/3)}return[255*b,255*a,255*d]};e.isPointInPoly=function(d,a){for(var b=
!1,m=-1,c=d.length,j=c-1;++m<c;j=m)(d[m].y<=a.y&&a.y<d[j].y||d[j].y<=a.y&&a.y<d[m].y)&&a.x<(d[j].x-d[m].x)*(a.y-d[m].y)/(d[j].y-d[m].y)+d[m].x&&(b=!b);return b};e.clamp=function(d,a,b){return d<a?a:d>b?b:d};return e}(ChemDoodle.extensions,ChemDoodle.structures,Math);
(function(a,c){a.Bounds=function(){};var g=a.Bounds.prototype;g.minX=g.minY=g.minZ=Infinity;g.maxX=g.maxY=g.maxZ=-Infinity;g.expand=function(e,f,d,n){e instanceof a.Bounds?(this.minX=c.min(this.minX,e.minX),this.minY=c.min(this.minY,e.minY),this.maxX=c.max(this.maxX,e.maxX),this.maxY=c.max(this.maxY,e.maxY),Infinity!==e.maxZ&&(this.minZ=c.min(this.minZ,e.minZ),this.maxZ=c.max(this.maxZ,e.maxZ))):(this.minX=c.min(this.minX,e),this.maxX=c.max(this.maxX,e),this.minY=c.min(this.minY,f),this.maxY=c.max(this.maxY,
f),void 0!==d&&void 0!==n&&(this.minX=c.min(this.minX,d),this.maxX=c.max(this.maxX,d),this.minY=c.min(this.minY,n),this.maxY=c.max(this.maxY,n)))};g.expand3D=function(a,f,d,n,b,m){this.minX=c.min(this.minX,a);this.maxX=c.max(this.maxX,a);this.minY=c.min(this.minY,f);this.maxY=c.max(this.maxY,f);this.minZ=c.min(this.minZ,d);this.maxZ=c.max(this.maxZ,d);void 0!==n&&(void 0!==b&&void 0!==m)&&(this.minX=c.min(this.minX,n),this.maxX=c.max(this.maxX,n),this.minY=c.min(this.minY,b),this.maxY=c.max(this.maxY,
b),this.minZ=c.min(this.minZ,m),this.maxZ=c.max(this.maxZ,m))}})(ChemDoodle.math,Math);
(function(){var a={subtract:function(b,m){return{x:b.x-m.x,y:b.y-m.y}},dotProduct:function(b,m){return b.x*m.x+b.y*m.y},square:function(b){return Math.sqrt(b.x*b.x+b.y*b.y)},scale:function(b,m){return{x:b.x*m,y:b.y*m}}},c=Math.pow(2,-65),g=function(b,m){for(var d=[],c=m.length-1,n=2*c-1,v=[],g=[],o=[],r=[],q=[[1,0.6,0.3,0.1],[0.4,0.6,0.6,0.4],[0.1,0.3,0.6,1]],w=0;w<=c;w++)v[w]=a.subtract(m[w],b);for(w=0;w<=c-1;w++)g[w]=a.subtract(m[w+1],m[w]),g[w]=a.scale(g[w],3);for(w=0;w<=c-1;w++)for(var y=0;y<=
c;y++)o[w]||(o[w]=[]),o[w][y]=a.dotProduct(g[w],v[y]);for(w=0;w<=n;w++)r[w]||(r[w]=[]),r[w].y=0,r[w].x=parseFloat(w)/n;n=c-1;for(v=0;v<=c+n;v++){w=Math.max(0,v-n);for(g=Math.min(v,c);w<=g;w++)y=v-w,r[w+y].y+=o[y][w]*q[y][w]}c=m.length-1;r=e(r,2*c-1,d,0);n=a.subtract(b,m[0]);o=a.square(n);for(w=q=0;w<r;w++)n=a.subtract(b,f(m,c,d[w],null,null)),n=a.square(n),n<o&&(o=n,q=d[w]);n=a.subtract(b,m[c]);n=a.square(n);n<o&&(o=n,q=1);return{location:q,distance:o}},e=function(b,m,d,a){var n=[],v=[],g=[],o=[],
r=0,q,w;w=0==b[0].y?0:0<b[0].y?1:-1;for(var y=1;y<=m;y++)q=0==b[y].y?0:0<b[y].y?1:-1,q!=w&&r++,w=q;switch(r){case 0:return 0;case 1:if(64<=a)return d[0]=(b[0].x+b[m].x)/2,1;var z,x,A,r=b[0].y-b[m].y;q=b[m].x-b[0].x;w=b[0].x*b[m].y-b[m].x*b[0].y;y=z=0;for(x=1;x<m;x++)A=r*b[x].x+q*b[x].y+w,A>z?z=A:A<y&&(y=A);A=q;x=0*A-1*r;z=(1*(w-z)-0*A)*(1/x);A=q;x=0*A-1*r;r=(1*(w-y)-0*A)*(1/x);q=Math.min(z,r);if(Math.max(z,r)-q<c)return g=b[m].x-b[0].x,o=b[m].y-b[0].y,d[0]=0+1*(g*(b[0].y-0)-o*(b[0].x-0))*(1/(0*g-
1*o)),1}f(b,m,0.5,n,v);b=e(n,m,g,a+1);m=e(v,m,o,a+1);for(a=0;a<b;a++)d[a]=g[a];for(a=0;a<m;a++)d[a+b]=o[a];return b+m},f=function(b,m,d,a,c){for(var n=[[]],f=0;f<=m;f++)n[0][f]=b[f];for(b=1;b<=m;b++)for(f=0;f<=m-b;f++)n[b]||(n[b]=[]),n[b][f]||(n[b][f]={}),n[b][f].x=(1-d)*n[b-1][f].x+d*n[b-1][f+1].x,n[b][f].y=(1-d)*n[b-1][f].y+d*n[b-1][f+1].y;if(null!=a)for(f=0;f<=m;f++)a[f]=n[f][0];if(null!=c)for(f=0;f<=m;f++)c[f]=n[m-f][f];return n[m][0]},d={},n=function(b,m){var a,c=b.length-1;a=d[c];if(!a){a=[];
var n=function(b){return function(){return b}},f=function(){return function(b){return b}},e=function(){return function(b){return 1-b}},v=function(b){return function(m){for(var d=1,a=0;a<b.length;a++)d*=b[a](m);return d}};a.push(new function(){return function(b){return Math.pow(b,c)}});for(var g=1;g<c;g++){for(var q=[new n(c)],w=0;w<c-g;w++)q.push(new f);for(w=0;w<g;w++)q.push(new e);a.push(new v(q))}a.push(new function(){return function(b){return Math.pow(1-b,c)}});d[c]=a}for(e=f=n=0;e<b.length;e++)n+=
b[e].x*a[e](m),f+=b[e].y*a[e](m);return{x:n,y:f}},b=function(b,m){return Math.sqrt(Math.pow(b.x-m.x,2)+Math.pow(b.y-m.y,2))},m=function(m,d,a){for(var c=n(m,d),f=0,e=0<a?1:-1,v=null;f<Math.abs(a);)d+=0.005*e,v=n(m,d),f+=b(v,c),c=v;return{point:v,location:d}},v=function(b,m){var d=n(b,m),a=n(b.slice(0,b.length-1),m),c=a.y-d.y,d=a.x-d.x;return 0==c?Infinity:Math.atan(c/d)};ChemDoodle.math.jsBezier={distanceFromCurve:g,gradientAtPoint:v,gradientAtPointAlongCurveFrom:function(b,d,a){d=m(b,d,a);1<d.location&&
(d.location=1);0>d.location&&(d.location=0);return v(b,d.location)},nearestPointOnCurve:function(b,m){var d=g(b,m);return{point:f(m,m.length-1,d.location,null,null),location:d.location}},pointOnCurve:n,pointAlongCurveFrom:function(b,d,a){return m(b,d,a).point},perpendicularToCurveAt:function(b,d,a,c){d=m(b,d,null==c?0:c);b=v(b,d.location);c=Math.atan(-1/b);b=a/2*Math.sin(c);a=a/2*Math.cos(c);return[{x:d.point.x+a,y:d.point.y+b},{x:d.point.x-a,y:d.point.y-b}]},locationAlongCurveFrom:function(b,d,a){return m(b,
d,a).location},getLength:function(m){for(var d=n(m,0),a=0,c=0,f=null;1>c;)c+=0.005,f=n(m,c),a+=b(f,d),d=f;return a}}})(ChemDoodle.math);
ChemDoodle.featureDetection=function(a,c,g,e){var f={supports_canvas:function(){return!!g.createElement("canvas").getContext},supports_canvas_text:function(){return!f.supports_canvas()?!1:"function"===typeof g.createElement("canvas").getContext("2d").fillText},supports_webgl:function(){var d=g.createElement("canvas");try{if(d.getContext("webgl")||d.getContext("experimental-webgl"))return!0}catch(a){}return!1},supports_xhr2:function(){return c.support.cors},supports_touch:function(){return"ontouchstart"in
e&&navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|BB10/i)},supports_gesture:function(){return"ongesturestart"in e}};return f}(ChemDoodle.iChemLabs,jQuery,document,window);ChemDoodle.SYMBOLS="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Uut Uuq Uup Uuh Uus Uuo".split(" ");
ChemDoodle.ELEMENT=function(){function a(a,c,f,d,n,b,m,v,j){this.symbol=a;this.name=c;this.atomicNumber=f;this.addH=d;this.jmolColor=this.pymolColor=n;this.covalentRadius=b;this.vdWRadius=m;this.valency=v;this.mass=j}var c=[];c.H=new a("H","Hydrogen",1,!1,"#FFFFFF",0.31,1.2,1,1);c.He=new a("He","Helium",2,!1,"#D9FFFF",0.28,1.4,0,4);c.Li=new a("Li","Lithium",3,!1,"#CC80FF",1.28,1.82,1,7);c.Be=new a("Be","Beryllium",4,!1,"#C2FF00",0.96,0,2,9);c.B=new a("B","Boron",5,!0,"#FFB5B5",0.84,0,3,11);c.C=new a("C",
"Carbon",6,!0,"#909090",0.76,1.7,4,12);c.N=new a("N","Nitrogen",7,!0,"#3050F8",0.71,1.55,3,14);c.O=new a("O","Oxygen",8,!0,"#FF0D0D",0.66,1.52,2,16);c.F=new a("F","Fluorine",9,!0,"#90E050",0.57,1.47,1,19);c.Ne=new a("Ne","Neon",10,!1,"#B3E3F5",0.58,1.54,0,20);c.Na=new a("Na","Sodium",11,!1,"#AB5CF2",1.66,2.27,1,23);c.Mg=new a("Mg","Magnesium",12,!1,"#8AFF00",1.41,1.73,0,24);c.Al=new a("Al","Aluminum",13,!1,"#BFA6A6",1.21,0,0,27);c.Si=new a("Si","Silicon",14,!0,"#F0C8A0",1.11,2.1,4,28);c.P=new a("P",
"Phosphorus",15,!0,"#FF8000",1.07,1.8,3,31);c.S=new a("S","Sulfur",16,!0,"#FFFF30",1.05,1.8,2,32);c.Cl=new a("Cl","Chlorine",17,!0,"#1FF01F",1.02,1.75,1,35);c.Ar=new a("Ar","Argon",18,!1,"#80D1E3",1.06,1.88,0,40);c.K=new a("K","Potassium",19,!1,"#8F40D4",2.03,2.75,0,39);c.Ca=new a("Ca","Calcium",20,!1,"#3DFF00",1.76,0,0,40);c.Sc=new a("Sc","Scandium",21,!1,"#E6E6E6",1.7,0,0,45);c.Ti=new a("Ti","Titanium",22,!1,"#BFC2C7",1.6,0,1,48);c.V=new a("V","Vanadium",23,!1,"#A6A6AB",1.53,0,1,51);c.Cr=new a("Cr",
"Chromium",24,!1,"#8A99C7",1.39,0,2,52);c.Mn=new a("Mn","Manganese",25,!1,"#9C7AC7",1.39,0,3,55);c.Fe=new a("Fe","Iron",26,!1,"#E06633",1.32,0,2,56);c.Co=new a("Co","Cobalt",27,!1,"#F090A0",1.26,0,1,59);c.Ni=new a("Ni","Nickel",28,!1,"#50D050",1.24,1.63,1,58);c.Cu=new a("Cu","Copper",29,!1,"#C88033",1.32,1.4,0,63);c.Zn=new a("Zn","Zinc",30,!1,"#7D80B0",1.22,1.39,0,64);c.Ga=new a("Ga","Gallium",31,!1,"#C28F8F",1.22,1.87,0,69);c.Ge=new a("Ge","Germanium",32,!1,"#668F8F",1.2,0,4,74);c.As=new a("As",
"Arsenic",33,!0,"#BD80E3",1.19,1.85,3,75);c.Se=new a("Se","Selenium",34,!0,"#FFA100",1.2,1.9,2,80);c.Br=new a("Br","Bromine",35,!0,"#A62929",1.2,1.85,1,79);c.Kr=new a("Kr","Krypton",36,!1,"#5CB8D1",1.16,2.02,0,84);c.Rb=new a("Rb","Rubidium",37,!1,"#702EB0",2.2,0,0,85);c.Sr=new a("Sr","Strontium",38,!1,"#00FF00",1.95,0,0,88);c.Y=new a("Y","Yttrium",39,!1,"#94FFFF",1.9,0,0,89);c.Zr=new a("Zr","Zirconium",40,!1,"#94E0E0",1.75,0,0,90);c.Nb=new a("Nb","Niobium",41,!1,"#73C2C9",1.64,0,1,93);c.Mo=new a("Mo",
"Molybdenum",42,!1,"#54B5B5",1.54,0,2,98);c.Tc=new a("Tc","Technetium",43,!1,"#3B9E9E",1.47,0,3,0);c.Ru=new a("Ru","Ruthenium",44,!1,"#248F8F",1.46,0,2,102);c.Rh=new a("Rh","Rhodium",45,!1,"#0A7D8C",1.42,0,1,103);c.Pd=new a("Pd","Palladium",46,!1,"#006985",1.39,1.63,0,106);c.Ag=new a("Ag","Silver",47,!1,"#C0C0C0",1.45,1.72,0,107);c.Cd=new a("Cd","Cadmium",48,!1,"#FFD98F",1.44,1.58,0,114);c.In=new a("In","Indium",49,!1,"#A67573",1.42,1.93,0,115);c.Sn=new a("Sn","Tin",50,!1,"#668080",1.39,2.17,4,120);
c.Sb=new a("Sb","Antimony",51,!1,"#9E63B5",1.39,0,3,121);c.Te=new a("Te","Tellurium",52,!0,"#D47A00",1.38,2.06,2,130);c.I=new a("I","Iodine",53,!0,"#940094",1.39,1.98,1,127);c.Xe=new a("Xe","Xenon",54,!1,"#429EB0",1.4,2.16,0,132);c.Cs=new a("Cs","Cesium",55,!1,"#57178F",2.44,0,0,133);c.Ba=new a("Ba","Barium",56,!1,"#00C900",2.15,0,0,138);c.La=new a("La","Lanthanum",57,!1,"#70D4FF",2.07,0,0,139);c.Ce=new a("Ce","Cerium",58,!1,"#FFFFC7",2.04,0,0,140);c.Pr=new a("Pr","Praseodymium",59,!1,"#D9FFC7",2.03,
0,0,141);c.Nd=new a("Nd","Neodymium",60,!1,"#C7FFC7",2.01,0,0,142);c.Pm=new a("Pm","Promethium",61,!1,"#A3FFC7",1.99,0,0,0);c.Sm=new a("Sm","Samarium",62,!1,"#8FFFC7",1.98,0,0,152);c.Eu=new a("Eu","Europium",63,!1,"#61FFC7",1.98,0,0,153);c.Gd=new a("Gd","Gadolinium",64,!1,"#45FFC7",1.96,0,0,158);c.Tb=new a("Tb","Terbium",65,!1,"#30FFC7",1.94,0,0,159);c.Dy=new a("Dy","Dysprosium",66,!1,"#1FFFC7",1.92,0,0,164);c.Ho=new a("Ho","Holmium",67,!1,"#00FF9C",1.92,0,0,165);c.Er=new a("Er","Erbium",68,!1,"#00E675",
1.89,0,0,166);c.Tm=new a("Tm","Thulium",69,!1,"#00D452",1.9,0,0,169);c.Yb=new a("Yb","Ytterbium",70,!1,"#00BF38",1.87,0,0,174);c.Lu=new a("Lu","Lutetium",71,!1,"#00AB24",1.87,0,0,175);c.Hf=new a("Hf","Hafnium",72,!1,"#4DC2FF",1.75,0,0,180);c.Ta=new a("Ta","Tantalum",73,!1,"#4DA6FF",1.7,0,1,181);c.W=new a("W","Tungsten",74,!1,"#2194D6",1.62,0,2,184);c.Re=new a("Re","Rhenium",75,!1,"#267DAB",1.51,0,3,187);c.Os=new a("Os","Osmium",76,!1,"#266696",1.44,0,2,192);c.Ir=new a("Ir","Iridium",77,!1,"#175487",
1.41,0,3,193);c.Pt=new a("Pt","Platinum",78,!1,"#D0D0E0",1.36,1.75,0,195);c.Au=new a("Au","Gold",79,!1,"#FFD123",1.36,1.66,1,197);c.Hg=new a("Hg","Mercury",80,!1,"#B8B8D0",1.32,1.55,0,202);c.Tl=new a("Tl","Thallium",81,!1,"#A6544D",1.45,1.96,0,205);c.Pb=new a("Pb","Lead",82,!1,"#575961",1.46,2.02,4,208);c.Bi=new a("Bi","Bismuth",83,!1,"#9E4FB5",1.48,0,3,209);c.Po=new a("Po","Polonium",84,!1,"#AB5C00",1.4,0,2,0);c.At=new a("At","Astatine",85,!0,"#754F45",1.5,0,1,0);c.Rn=new a("Rn","Radon",86,!1,"#428296",
1.5,0,0,0);c.Fr=new a("Fr","Francium",87,!1,"#420066",2.6,0,0,0);c.Ra=new a("Ra","Radium",88,!1,"#007D00",2.21,0,0,0);c.Ac=new a("Ac","Actinium",89,!1,"#70ABFA",2.15,0,0,0);c.Th=new a("Th","Thorium",90,!1,"#00BAFF",2.06,0,0,232);c.Pa=new a("Pa","Protactinium",91,!1,"#00A1FF",2,0,0,231);c.U=new a("U","Uranium",92,!1,"#008FFF",1.96,1.86,0,238);c.Np=new a("Np","Neptunium",93,!1,"#0080FF",1.9,0,0,0);c.Pu=new a("Pu","Plutonium",94,!1,"#006BFF",1.87,0,0,0);c.Am=new a("Am","Americium",95,!1,"#545CF2",1.8,
0,0,0);c.Cm=new a("Cm","Curium",96,!1,"#785CE3",1.69,0,0,0);c.Bk=new a("Bk","Berkelium",97,!1,"#8A4FE3",0,0,0,0);c.Cf=new a("Cf","Californium",98,!1,"#A136D4",0,0,0,0);c.Es=new a("Es","Einsteinium",99,!1,"#B31FD4",0,0,0,0);c.Fm=new a("Fm","Fermium",100,!1,"#B31FBA",0,0,0,0);c.Md=new a("Md","Mendelevium",101,!1,"#B30DA6",0,0,0,0);c.No=new a("No","Nobelium",102,!1,"#BD0D87",0,0,0,0);c.Lr=new a("Lr","Lawrencium",103,!1,"#C70066",0,0,0,0);c.Rf=new a("Rf","Rutherfordium",104,!1,"#CC0059",0,0,0,0);c.Db=
new a("Db","Dubnium",105,!1,"#D1004F",0,0,0,0);c.Sg=new a("Sg","Seaborgium",106,!1,"#D90045",0,0,0,0);c.Bh=new a("Bh","Bohrium",107,!1,"#E00038",0,0,0,0);c.Hs=new a("Hs","Hassium",108,!1,"#E6002E",0,0,0,0);c.Mt=new a("Mt","Meitnerium",109,!1,"#EB0026",0,0,0,0);c.Ds=new a("Ds","Darmstadtium",110,!1,"#000000",0,0,0,0);c.Rg=new a("Rg","Roentgenium",111,!1,"#000000",0,0,0,0);c.Cn=new a("Cn","Copernicium",112,!1,"#000000",0,0,0,0);c.Uut=new a("Uut","Ununtrium",113,!1,"#000000",0,0,0,0);c.Uuq=new a("Uuq",
"Ununquadium",114,!1,"#000000",0,0,0,0);c.Uup=new a("Uup","Ununpentium",115,!1,"#000000",0,0,0,0);c.Uuh=new a("Uuh","Ununhexium",116,!1,"#000000",0,0,0,0);c.Uus=new a("Uus","Ununseptium",117,!1,"#000000",0,0,0,0);c.Uuo=new a("Uuo","Ununoctium",118,!1,"#000000",0,0,0,0);c.H.pymolColor="#E6E6E6";c.C.pymolColor="#33FF33";c.N.pymolColor="#3333FF";c.O.pymolColor="#FF4D4D";c.F.pymolColor="#B3FFFF";c.S.pymolColor="#E6C640";return c}(ChemDoodle.SYMBOLS);
ChemDoodle.RESIDUE=function(){function a(a,c,f,d,n){this.symbol=a;this.name=c;this.polar=f;this.aminoColor=d;this.shapelyColor=n}var c=[];c.Ala=new a("Ala","Alanine",!1,"#C8C8C8","#8CFF8C");c.Arg=new a("Arg","Arginine",!0,"#145AFF","#00007C");c.Asn=new a("Asn","Asparagine",!0,"#00DCDC","#FF7C70");c.Asp=new a("Asp","Aspartic Acid",!0,"#E60A0A","#A00042");c.Cys=new a("Cys","Cysteine",!0,"#E6E600","#FFFF70");c.Gln=new a("Gln","Glutamine",!0,"#00DCDC","#FF4C4C");c.Glu=new a("Glu","Glutamic Acid",!0,"#E60A0A",
"#660000");c.Gly=new a("Gly","Glycine",!1,"#EBEBEB","#FFFFFF");c.His=new a("His","Histidine",!0,"#8282D2","#7070FF");c.Ile=new a("Ile","Isoleucine",!1,"#0F820F","#004C00");c.Leu=new a("Leu","Leucine",!1,"#0F820F","#455E45");c.Lys=new a("Lys","Lysine",!0,"#145AFF","#4747B8");c.Met=new a("Met","Methionine",!1,"#E6E600","#B8A042");c.Phe=new a("Phe","Phenylalanine",!1,"#3232AA","#534C52");c.Pro=new a("Pro","Proline",!1,"#DC9682","#525252");c.Ser=new a("Ser","Serine",!0,"#FA9600","#FF7042");c.Thr=new a("Thr",
"Threonine",!0,"#FA9600","#B84C00");c.Trp=new a("Trp","Tryptophan",!0,"#B45AB4","#4F4600");c.Tyr=new a("Tyr","Tyrosine",!0,"#3232AA","#8C704C");c.Val=new a("Val","Valine",!1,"#0F820F","#FF8CFF");c.Asx=new a("Asx","Asparagine/Aspartic Acid",!0,"#FF69B4","#FF00FF");c.Glx=new a("Glx","Glutamine/Glutamic Acid",!0,"#FF69B4","#FF00FF");c["*"]=new a("*","Other",!1,"#BEA06E","#FF00FF");c.A=new a("A","Adenine",!1,"#BEA06E","#A0A0FF");c.G=new a("G","Guanine",!1,"#BEA06E","#FF7070");c.I=new a("I","",!1,"#BEA06E",
"#80FFFF");c.C=new a("C","Cytosine",!1,"#BEA06E","#FF8C4B");c.T=new a("T","Thymine",!1,"#BEA06E","#A0FFA0");c.U=new a("U","Uracil",!1,"#BEA06E","#FF8080");return c}();
(function(a){a.Queue=function(){this.queue=[]};a=a.Queue.prototype;a.queueSpace=0;a.getSize=function(){return this.queue.length-this.queueSpace};a.isEmpty=function(){return 0===this.queue.length};a.enqueue=function(a){this.queue.push(a)};a.dequeue=function(){var a;this.queue.length&&(a=this.queue[this.queueSpace],2*++this.queueSpace>=this.queue.length&&(this.queue=this.queue.slice(this.queueSpace),this.queueSpace=0));return a};a.getOldestElement=function(){var a;this.queue.length&&(a=this.queue[this.queueSpace]);
return a}})(ChemDoodle.structures);
(function(a,c){a.Point=function(a,c){this.x=a?a:0;this.y=c?c:0};var g=a.Point.prototype;g.sub=function(a){this.x-=a.x;this.y-=a.y};g.add=function(a){this.x+=a.x;this.y+=a.y};g.distance=function(a){var f=a.x-this.x;a=a.y-this.y;return c.sqrt(f*f+a*a)};g.angleForStupidCanvasArcs=function(a){var f=a.x-this.x;a=a.y-this.y;for(var d=0,d=0===f?0===a?0:0<a?c.PI/2:3*c.PI/2:0===a?0<f?0:c.PI:0>f?c.atan(a/f)+c.PI:0>a?c.atan(a/f)+2*c.PI:c.atan(a/f);0>d;)d+=2*c.PI;return d%=2*c.PI};g.angle=function(a){var f=a.x-
this.x;a=this.y-a.y;for(var d=0,d=0===f?0===a?0:0<a?c.PI/2:3*c.PI/2:0===a?0<f?0:c.PI:0>f?c.atan(a/f)+c.PI:0>a?c.atan(a/f)+2*c.PI:c.atan(a/f);0>d;)d+=2*c.PI;return d%=2*c.PI}})(ChemDoodle.structures,Math);
(function(a,c,g,e,f,d){e.Atom=function(d,b,m,c){this.label=d?d.replace(/\s/g,""):"C";a[this.label]||(this.label="C");this.x=b?b:0;this.y=m?m:0;this.z=c?c:0};e=e.Atom.prototype=new e.Point(0,0);e.charge=0;e.numLonePair=0;e.numRadical=0;e.mass=-1;e.coordinationNumber=0;e.bondNumber=0;e.angleOfLeastInterference=0;e.isHidden=!1;e.altLabel=void 0;e.any=!1;e.rgroup=-1;e.isLone=!1;e.isHover=!1;e.isSelected=!1;e.add3D=function(a){this.x+=a.x;this.y+=a.y;this.z+=a.z};e.sub3D=function(a){this.x-=a.x;this.y-=
a.y;this.z-=a.z};e.distance3D=function(a){var b=a.x-this.x,m=a.y-this.y;a=a.z-this.z;return f.sqrt(b*b+m*m+a*a)};e.draw=function(a,b){if(this.isLassoed){var m=a.createRadialGradient(this.x-1,this.y-1,0,this.x,this.y,7);m.addColorStop(0,"rgba(212, 99, 0, 0)");m.addColorStop(0.7,"rgba(212, 99, 0, 0.8)");a.fillStyle=m;a.beginPath();a.arc(this.x,this.y,5,0,2*f.PI,!1);a.fill()}this.textBounds=[];this.specs&&(b=this.specs);var d=c.getFontString(b.atoms_font_size_2D,b.atoms_font_families_2D,b.atoms_font_bold_2D,
b.atoms_font_italic_2D);a.font=d;a.fillStyle=this.getElementColor(b.atoms_useJMOLColors,b.atoms_usePYMOLColors,b.atoms_color,2);var j;if(this.isLone&&!b.atoms_displayAllCarbonLabels_2D||b.atoms_circles_2D)a.beginPath(),a.arc(this.x,this.y,b.atoms_circleDiameter_2D/2,0,2*f.PI,!1),a.fill(),0<b.atoms_circleBorderWidth_2D&&(a.lineWidth=b.atoms_circleBorderWidth_2D,a.strokeStyle="black",a.stroke(this.x,this.y,0,2*f.PI,b.atoms_circleDiameter_2D/2));else if(this.isLabelVisible(b))if(a.textAlign="center",
a.textBaseline="middle",void 0!==this.altLabel){a.fillText(this.altLabel,this.x,this.y);var h=a.measureText(this.altLabel).width;this.textBounds.push({x:this.x-h/2,y:this.y-b.atoms_font_size_2D/2+1,w:h,h:b.atoms_font_size_2D-2})}else if(this.any)a.font=c.getFontString(b.atoms_font_size_2D+5,b.atoms_font_families_2D,!0),a.fillText("*",this.x+1,this.y+3),h=a.measureText("*").width,this.textBounds.push({x:this.x-h/2,y:this.y-b.atoms_font_size_2D/2+1,w:h,h:b.atoms_font_size_2D-2});else if(-1!==this.rgroup)m=
"R"+this.rgroup,a.fillText(m,this.x,this.y),h=a.measureText(m).width,this.textBounds.push({x:this.x-h/2,y:this.y-b.atoms_font_size_2D/2+1,w:h,h:b.atoms_font_size_2D-2});else{a.fillText(this.label,this.x,this.y);h=a.measureText(this.label).width;this.textBounds.push({x:this.x-h/2,y:this.y-b.atoms_font_size_2D/2+1,w:h,h:b.atoms_font_size_2D-2});var e=0;if(-1!==this.mass){var p=c.getFontString(0.7*b.atoms_font_size_2D,b.atoms_font_families_2D,b.atoms_font_bold_2D,b.atoms_font_italic_2D),m=a.font;a.font=
c.getFontString(0.7*b.atoms_font_size_2D,b.atoms_font_families_2D,b.atoms_font_bold_2D,b.atoms_font_italic_2D);e=a.measureText(this.mass).width;a.fillText(this.mass,this.x-e-0.5,this.y-b.atoms_font_size_2D/2+1);this.textBounds.push({x:this.x-h/2-e-0.5,y:this.y-1.7*b.atoms_font_size_2D/2+1,w:e,h:b.atoms_font_size_2D/2-1});a.font=m}var m=h/2,u=this.getImplicitHydrogenCount();if(b.atoms_implicitHydrogens_2D&&0<u){j=0;var l=a.measureText("H").width,t=!0;if(1<u){var o=h/2+l/2,r=0,p=c.getFontString(0.8*
b.atoms_font_size_2D,b.atoms_font_families_2D,b.atoms_font_bold_2D,b.atoms_font_italic_2D);a.font=p;var q=a.measureText(u).width;1===this.bondNumber?this.angleOfLeastInterference>f.PI/2&&this.angleOfLeastInterference<3*f.PI/2&&(o=-h/2-q-l/2-e/2,t=!1,j=f.PI):this.angleOfLeastInterference<=f.PI/4||(this.angleOfLeastInterference<3*f.PI/4?(o=0,r=0.9*-b.atoms_font_size_2D,0!==this.charge&&(r-=0.3*b.atoms_font_size_2D),t=!1,j=f.PI/2):this.angleOfLeastInterference<=5*f.PI/4?(o=-h/2-q-l/2-e/2,t=!1,j=f.PI):
this.angleOfLeastInterference<7*f.PI/4&&(o=0,r=0.9*b.atoms_font_size_2D,t=!1,j=3*f.PI/2));a.font=d;a.fillText("H",this.x+o,this.y+r);a.font=p;a.fillText(u,this.x+o+l/2+q/2,this.y+r+0.3*b.atoms_font_size_2D);this.textBounds.push({x:this.x+o-l/2,y:this.y+r-b.atoms_font_size_2D/2+1,w:l,h:b.atoms_font_size_2D-2});this.textBounds.push({x:this.x+o+l/2,y:this.y+r+0.3*b.atoms_font_size_2D-b.atoms_font_size_2D/2+1,w:q,h:0.8*b.atoms_font_size_2D-2})}else o=h/2+l/2,r=0,1===this.bondNumber?this.angleOfLeastInterference>
f.PI/2&&this.angleOfLeastInterference<3*f.PI/2&&(o=-h/2-l/2-e/2,j=f.PI):this.angleOfLeastInterference<=f.PI/4||(this.angleOfLeastInterference<3*f.PI/4?(o=0,r=0.9*-b.atoms_font_size_2D,t=!1,j=f.PI/2):this.angleOfLeastInterference<=5*f.PI/4?(o=-h/2-l/2-e/2,t=!1,j=f.PI):this.angleOfLeastInterference<7*f.PI/4&&(o=0,r=0.9*b.atoms_font_size_2D,t=!1,j=3*f.PI/2)),a.fillText("H",this.x+o,this.y+r),this.textBounds.push({x:this.x+o-l/2,y:this.y+r-b.atoms_font_size_2D/2+1,w:l,h:b.atoms_font_size_2D-2});t&&(m+=
l)}0!==this.charge&&(d=this.charge.toFixed(0),d="1"===d?"+":"-1"===d?"\u2013":c.stringStartsWith(d,"-")?d.substring(1)+"\u2013":d+"+",h=a.measureText(d).width,m+=h/2,a.textAlign="center",a.textBaseline="middle",a.font=c.getFontString(f.floor(0.8*b.atoms_font_size_2D),b.atoms_font_families_2D,b.atoms_font_bold_2D,b.atoms_font_italic_2D),a.fillText(d,this.x+m-1,this.y-b.atoms_font_size_2D/2+1),this.textBounds.push({x:this.x+m-h/2-1,y:this.y-1.8*b.atoms_font_size_2D/2+5,w:h,h:b.atoms_font_size_2D/2-
1}))}if(0<this.numLonePair||0<this.numRadical){a.fillStyle="black";p=this.angles.slice(0);m=this.angleOfLeastInterference;d=this.largestAngle;void 0!==j&&(p.push(j),p.sort(),d=g.angleBetweenLargest(p),m=d.angle%(2*f.PI),d=d.largest);h=[];for(e=0;e<this.numLonePair;e++)h.push({t:2});for(e=0;e<this.numRadical;e++)h.push({t:1});if(void 0===j&&f.abs(d-2*f.PI/p.length)<f.PI/60){p=f.ceil(h.length/p.length);e=0;for(u=h.length;e<u;e+=p,m+=d)this.drawElectrons(a,b,h.slice(e,f.min(h.length,e+p)),m,d,j)}else this.drawElectrons(a,
b,h,m,d,j)}};e.drawElectrons=function(a,b,d,c,j,h){h=j/(d.length+(0===this.bonds.length&&void 0===h?0:1));j=c-j/2+h;for(var e=0;e<d.length;e++){var g=d[e];c=j+e*h;var u=this.x+Math.cos(c)*b.atoms_lonePairDistance_2D,l=this.y-Math.sin(c)*b.atoms_lonePairDistance_2D;2===g.t?(g=c+Math.PI/2,c=Math.cos(g)*b.atoms_lonePairSpread_2D/2,g=-Math.sin(g)*b.atoms_lonePairSpread_2D/2,a.beginPath(),a.arc(u+c,l+g,b.atoms_lonePairDiameter_2D,0,2*f.PI,!1),a.fill(),a.beginPath(),a.arc(u-c,l-g,b.atoms_lonePairDiameter_2D,
0,2*f.PI,!1),a.fill()):1===g.t&&(a.beginPath(),a.arc(u,l,b.atoms_lonePairDiameter_2D,0,2*f.PI,!1),a.fill())}};e.drawDecorations=function(a){if(this.isHover||this.isSelected)a.strokeStyle=this.isHover?"#885110":"#0060B2",a.lineWidth=1.2,a.beginPath(),a.arc(this.x,this.y,this.isHover?7:15,0,2*f.PI,!1),a.stroke();this.isOverlap&&(a.strokeStyle="#C10000",a.lineWidth=1.2,a.beginPath(),a.arc(this.x,this.y,7,0,2*f.PI,!1),a.stroke())};e.render=function(c,b,m){this.specs&&(b=this.specs);var f=d.translate(c.modelViewMatrix,
[this.x,this.y,this.z],[]),j=b.atoms_useVDWDiameters_3D?a[this.label].vdWRadius*b.atoms_vdwMultiplier_3D:b.atoms_sphereDiameter_3D/2;0===j&&(j=1);d.scale(f,[j,j,j]);m||(m=b.atoms_color,b.atoms_useJMOLColors?m=a[this.label].jmolColor:b.atoms_usePYMOLColors&&(m=a[this.label].pymolColor),c.material.setDiffuseColor(m));c.setMatrixUniforms(f);c.drawElements(c.TRIANGLES,(this.renderAsStar?c.starBuffer:c.sphereBuffer).vertexIndexBuffer.numItems,c.UNSIGNED_SHORT,0)};e.isLabelVisible=function(a){return a.atoms_displayAllCarbonLabels_2D||
"C"!==this.label||this.altLabel||(this.any||-1!==this.rgroup)||(-1!==this.mass||0!==this.charge)||a.atoms_showAttributedCarbons_2D&&(0!==this.numRadical||0!==this.numLonePair)||this.isHidden&&a.atoms_showHiddenCarbons_2D||a.atoms_displayTerminalCarbonLabels_2D&&1===this.bondNumber?!0:!1};e.getImplicitHydrogenCount=function(){if("H"===this.label||!a[this.label]||!a[this.label].addH)return 0;var d=a[this.label].valency,b=d-this.coordinationNumber;0<this.numRadical&&(b=f.max(0,b-this.numRadical));0<
this.charge?(d=4-d,b=this.charge<=d?b+this.charge:4-this.coordinationNumber-this.charge+d):b+=this.charge;return 0>b?0:f.floor(b)};e.getBounds=function(){var a=new g.Bounds;a.expand(this.x,this.y);if(this.textBounds)for(var b=0,d=this.textBounds.length;b<d;b++){var c=this.textBounds[b];a.expand(c.x,c.y,c.x+c.w,c.y+c.h)}return a};e.getBounds3D=function(){var a=new g.Bounds;a.expand3D(this.x,this.y,this.z);return a};e.getElementColor=function(d,b,m,c){if(2==c&&this.any||-1!==this.rgroup)return m;d?
m=a[this.label].jmolColor:b&&(m=a[this.label].pymolColor);return m}})(ChemDoodle.ELEMENT,ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,Math,mat4);
(function(a,c,g,e,f,d,n){g.Bond=function(b,a,d){this.a1=b;this.a2=a;this.bondOrder=void 0!==d?d:1};g.Bond.STEREO_NONE="none";g.Bond.STEREO_PROTRUDING="protruding";g.Bond.STEREO_RECESSED="recessed";g.Bond.STEREO_AMBIGUOUS="ambiguous";a=g.Bond.prototype;a.stereo=g.Bond.STEREO_NONE;a.isHover=!1;a.ring=void 0;a.getCenter=function(){return new g.Point((this.a1.x+this.a2.x)/2,(this.a1.y+this.a2.y)/2)};a.getLength=function(){return this.a1.distance(this.a2)};a.getLength3D=function(){return this.a1.distance3D(this.a2)};
a.contains=function(b){return b===this.a1||b===this.a2};a.getNeighbor=function(b){if(b===this.a1)return this.a2;if(b===this.a2)return this.a1};a.draw=function(b,a){if(!(this.a1.x===this.a2.x&&this.a1.y===this.a2.y)){this.specs&&(a=this.specs);var d=this.a1.x,j=this.a2.x,h=this.a1.y,n=this.a2.y,p=this.a1.distance(this.a2),u=j-d,l=n-h;if(this.a1.isLassoed&&this.a2.isLassoed){var t=b.createLinearGradient(d,h,j,n);t.addColorStop(0,"rgba(212, 99, 0, 0)");t.addColorStop(0.5,"rgba(212, 99, 0, 0.8)");t.addColorStop(1,
"rgba(212, 99, 0, 0)");var o=2.5,r=this.a1.angle(this.a2)+f.PI/2,q=f.cos(r),r=f.sin(r),w=d-q*o,y=h+r*o,z=d+q*o,x=h-r*o,A=j+q*o,B=n-r*o,q=j-q*o,r=n+r*o;b.fillStyle=t;b.beginPath();b.moveTo(w,y);b.lineTo(z,x);b.lineTo(A,B);b.lineTo(q,r);b.closePath();b.fill()}if(a.atoms_display&&!a.atoms_circles_2D&&this.a1.isLabelVisible(a)&&this.a1.textBounds){o=q=0;for(w=this.a1.textBounds.length;o<w;o++)q=Math.max(q,e.calculateDistanceInterior(this.a1,this.a2,this.a1.textBounds[o]));q+=a.bonds_atomLabelBuffer_2D;
q/=p;d+=u*q;h+=l*q}if(a.atoms_display&&!a.atoms_circles_2D&&this.a2.isLabelVisible(a)&&this.a2.textBounds){o=q=0;for(w=this.a2.textBounds.length;o<w;o++)q=Math.max(q,e.calculateDistanceInterior(this.a2,this.a1,this.a2.textBounds[o]));q+=a.bonds_atomLabelBuffer_2D;q/=p;j-=u*q;n-=l*q}a.bonds_clearOverlaps_2D&&(q=d+0.15*u,r=h+0.15*l,o=j-0.15*u,p=n-0.15*l,b.strokeStyle=a.backgroundColor,b.lineWidth=a.bonds_width_2D+2*a.bonds_overlapClearWidth_2D,b.lineCap="round",b.beginPath(),b.moveTo(q,r),b.lineTo(o,
p),b.closePath(),b.stroke());b.strokeStyle=a.bonds_color;b.fillStyle=a.bonds_color;b.lineWidth=a.bonds_width_2D;b.lineCap=a.bonds_ends_2D;if(a.bonds_useJMOLColors||a.bonds_usePYMOLColors)q=b.createLinearGradient(d,h,j,n),r=this.a1.getElementColor(a.bonds_useJMOLColors,a.bonds_usePYMOLColors,a.atoms_color,2),o=this.a2.getElementColor(a.bonds_useJMOLColors,a.bonds_usePYMOLColors,a.atoms_color,2),q.addColorStop(0,r),a.bonds_colorGradient||(q.addColorStop(0.5,r),q.addColorStop(0.51,o)),q.addColorStop(1,
o),b.strokeStyle=q,b.fillStyle=q;switch(this.bondOrder){case 0:j-=d;n-=h;j=f.sqrt(j*j+n*n);n=f.floor(j/a.bonds_dotSize_2D);j=(j-(n-1)*a.bonds_dotSize_2D)/2;1===n%2?j+=a.bonds_dotSize_2D/4:(j-=a.bonds_dotSize_2D/4,n+=2);n/=2;l=this.a1.angle(this.a2);q=d+j*Math.cos(l);r=h-j*Math.sin(l);b.beginPath();for(o=0;o<n;o++)b.arc(q,r,a.bonds_dotSize_2D/2,0,2*f.PI,!1),q+=2*a.bonds_dotSize_2D*Math.cos(l),r-=2*a.bonds_dotSize_2D*Math.sin(l);b.fill();break;case 0.5:b.beginPath();b.moveTo(d,h);c.contextHashTo(b,
d,h,j,n,a.bonds_hashSpacing_2D,a.bonds_hashSpacing_2D);b.stroke();break;case 1:if(this.stereo===g.Bond.STEREO_PROTRUDING||this.stereo===g.Bond.STEREO_RECESSED)l=a.bonds_width_2D/2,o=this.a1.distance(this.a2)*a.bonds_wedgeThickness_2D/2,r=this.a1.angle(this.a2)+f.PI/2,q=f.cos(r),r=f.sin(r),w=d-q*l,y=h+r*l,z=d+q*l,x=h-r*l,A=j+q*o,B=n-r*o,q=j-q*o,r=n+r*o,b.beginPath(),b.moveTo(w,y),b.lineTo(z,x),b.lineTo(A,B),b.lineTo(q,r),b.closePath(),this.stereo===g.Bond.STEREO_PROTRUDING?b.fill():(b.save(),b.clip(),
b.lineWidth=2*o,b.lineCap="butt",b.beginPath(),b.moveTo(d,h),c.contextHashTo(b,d,h,j,n,a.bonds_hashWidth_2D,a.bonds_hashSpacing_2D),b.stroke(),b.restore());else if(this.stereo===g.Bond.STEREO_AMBIGUOUS){b.beginPath();b.moveTo(d,h);j=f.floor(f.sqrt(u*u+l*l)/a.bonds_wavyLength_2D);r=this.a1.angle(this.a2)+f.PI/2;q=f.cos(r);r=f.sin(r);n=u/j;l/=j;o=0;for(w=j;o<w;o++)d+=n,h+=l,j=a.bonds_wavyLength_2D*q+d-0.5*n,p=a.bonds_wavyLength_2D*-r+h-0.5*l,u=a.bonds_wavyLength_2D*-q+d-0.5*n,y=a.bonds_wavyLength_2D*
r+h-0.5*l,0===o%2?b.quadraticCurveTo(j,p,d,h):b.quadraticCurveTo(u,y,d,h);b.stroke();break}else b.beginPath(),b.moveTo(d,h),b.lineTo(j,n),b.stroke();break;case 1.5:case 2:this.stereo===g.Bond.STEREO_AMBIGUOUS?(o=this.a1.distance(this.a2)*a.bonds_saturationWidth_2D/2,r=this.a1.angle(this.a2)+f.PI/2,q=f.cos(r),r=f.sin(r),w=d-q*o,y=h+r*o,z=d+q*o,x=h-r*o,A=j+q*o,B=n-r*o,q=j-q*o,r=n+r*o,b.beginPath(),b.moveTo(w,y),b.lineTo(A,B),b.moveTo(z,x),b.lineTo(q,r),b.stroke()):!a.bonds_symmetrical_2D&&(this.ring||
"C"===this.a1.label&&"C"===this.a2.label)?(b.beginPath(),b.moveTo(d,h),b.lineTo(j,n),q=0,p=this.a1.distance(this.a2),l=this.a1.angle(this.a2),r=l+f.PI/2,o=p*a.bonds_saturationWidth_2D,u=a.bonds_saturationAngle_2D,u<f.PI/2&&(q=-(o/f.tan(u))),f.abs(q)<p/2&&(u=d-f.cos(l)*q,d=j+f.cos(l)*q,j=h+f.sin(l)*q,h=n-f.sin(l)*q,q=f.cos(r),r=f.sin(r),w=u-q*o,y=j+r*o,z=u+q*o,x=j-r*o,A=d-q*o,B=h+r*o,q=d+q*o,r=h-r*o,!this.ring||this.ring.center.angle(this.a1)>this.ring.center.angle(this.a2)&&!(this.ring.center.angle(this.a1)-
this.ring.center.angle(this.a2)>f.PI)||this.ring.center.angle(this.a1)-this.ring.center.angle(this.a2)<-f.PI?(b.moveTo(w,y),2===this.bondOrder?b.lineTo(A,B):c.contextHashTo(b,w,y,A,B,a.bonds_hashSpacing_2D,a.bonds_hashSpacing_2D)):(b.moveTo(z,x),2===this.bondOrder?b.lineTo(q,r):c.contextHashTo(b,z,x,q,r,a.bonds_hashSpacing_2D,a.bonds_hashSpacing_2D)),b.stroke())):(o=this.a1.distance(this.a2)*a.bonds_saturationWidth_2D/2,r=this.a1.angle(this.a2)+f.PI/2,q=f.cos(r),r=f.sin(r),w=d-q*o,y=h+r*o,z=d+q*o,
x=h-r*o,A=j+q*o,B=n-r*o,q=j-q*o,r=n+r*o,b.beginPath(),b.moveTo(w,y),b.lineTo(q,r),b.moveTo(z,x),2===this.bondOrder?b.lineTo(A,B):c.contextHashTo(b,z,x,A,B,a.bonds_hashSpacing_2D,a.bonds_hashSpacing_2D),b.stroke());break;case 3:o=this.a1.distance(this.a2)*a.bonds_saturationWidth_2D,r=this.a1.angle(this.a2)+f.PI/2,q=f.cos(r),r=f.sin(r),w=d-q*o,y=h+r*o,z=d+q*o,x=h-r*o,A=j+q*o,B=n-r*o,q=j-q*o,r=n+r*o,b.beginPath(),b.moveTo(w,y),b.lineTo(q,r),b.moveTo(z,x),b.lineTo(A,B),b.moveTo(d,h),b.lineTo(j,n),b.stroke()}}};
a.drawDecorations=function(b){if(this.isHover||this.isSelected){var a=2*f.PI,d=(this.a1.angleForStupidCanvasArcs(this.a2)+f.PI/2)%a;b.strokeStyle=this.isHover?"#885110":"#0060B2";b.lineWidth=1.2;b.beginPath();var c=(d+f.PI)%a,c=c%(2*f.PI);b.arc(this.a1.x,this.a1.y,7,d,c,!1);b.stroke();b.beginPath();d+=f.PI;c=(d+f.PI)%a;b.arc(this.a2.x,this.a2.y,7,d,c,!1);b.stroke()}};a.render=function(b,a,e){this.specs&&(a=this.specs);var j=this.a1.distance3D(this.a2);if(0!==j){var h=a.bonds_cylinderDiameter_3D/2,
k=a.bonds_color,g,u=d.translate(b.modelViewMatrix,[this.a1.x,this.a1.y,this.a1.z],[]),l,t=[this.a2.x-this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],o=[0,1,0],r=0;this.a1.x===this.a2.x&&this.a1.z===this.a2.z?(o=[0,0,1],this.a2.y<this.a1.y&&(r=f.PI)):(r=c.vec3AngleFrom(o,t),o=n.cross(o,t,[]));var q=a.bonds_useJMOLColors,w=a.bonds_usePYMOLColors;if(q||w)k=this.a1.getElementColor(q,w,k),g=this.a2.getElementColor(q,w,a.bonds_color),k!=g&&(l=d.translate(b.modelViewMatrix,[this.a2.x,this.a2.y,this.a2.z],
[]));var q=[0],y;if(e){a.bonds_showBondOrders_3D&&1<this.bondOrder&&(q=[a.bonds_cylinderDiameter_3D],y=[0,0,1],e=d.inverse(b.rotationMatrix,[]),d.multiplyVec3(e,y),y=n.cross(t,y,[]),n.normalize(y));var h=1,z=a.bonds_pillSpacing_3D,t=a.bonds_pillHeight_3D;0==this.bondOrder&&(a.bonds_renderAsLines_3D?t=z:(t=a.bonds_pillDiameter_3D,t<a.bonds_cylinderDiameter_3D&&(t/=2),h=t/2,j/=h,z/=h/2));e=t+z;var w=f.floor(j/e),x=(z+a.bonds_pillDiameter_3D+(j-e*w))/2,A=w;l&&(A=f.floor(w/2));j=0;for(z=q.length;j<z;j++){var B=
d.set(u,[]);0!==q[j]&&d.translate(B,n.scale(y,q[j],[]));0!==r&&d.rotate(B,r,o);1!=h&&d.scale(B,[h,h,h]);k&&b.material.setDiffuseColor(k);d.translate(B,[0,x,0]);for(var F=0;F<A;F++)a.bonds_renderAsLines_3D?0==this.bondOrder?(b.setMatrixUniforms(B),b.drawArrays(b.POINTS,0,1)):(d.scale(B,[1,t,1]),b.setMatrixUniforms(B),b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems),d.scale(B,[1,1/t,1])):(b.setMatrixUniforms(B),0==this.bondOrder?b.drawElements(b.TRIANGLES,b.sphereBuffer.vertexIndexBuffer.numItems,
b.UNSIGNED_SHORT,0):b.drawElements(b.TRIANGLES,b.pillBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0)),d.translate(B,[0,e,0]);if(l){var D,E;a.bonds_renderAsLines_3D?(D=t,D/=2,E=0):(D=2/3,E=(1-D)/2);0!=w%2&&(d.scale(B,[1,D,1]),b.setMatrixUniforms(B),a.bonds_renderAsLines_3D?0==this.bondOrder?b.drawArrays(b.POINTS,0,1):b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems):0==this.bondOrder?b.drawElements(b.TRIANGLES,b.sphereBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0):b.drawElements(b.TRIANGLES,
b.pillBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0),d.translate(B,[0,e*(1+E),0]),d.scale(B,[1,1/D,1]));d.set(l,B);0!==q[j]&&d.translate(B,n.scale(y,q[j],[]));d.rotate(B,r+f.PI,o);1!=h&&d.scale(B,[h,h,h]);g&&b.material.setDiffuseColor(g);d.translate(B,[0,x,0]);for(F=0;F<A;F++)a.bonds_renderAsLines_3D?0==this.bondOrder?(b.setMatrixUniforms(B),b.drawArrays(b.POINTS,0,1)):(d.scale(B,[1,t,1]),b.setMatrixUniforms(B),b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems),d.scale(B,[1,
1/t,1])):(b.setMatrixUniforms(B),0==this.bondOrder?b.drawElements(b.TRIANGLES,b.sphereBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0):b.drawElements(b.TRIANGLES,b.pillBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0)),d.translate(B,[0,e,0]);0!=w%2&&(d.scale(B,[1,D,1]),b.setMatrixUniforms(B),a.bonds_renderAsLines_3D?0==this.bondOrder?b.drawArrays(b.POINTS,0,1):b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems):0==this.bondOrder?b.drawElements(b.TRIANGLES,b.sphereBuffer.vertexIndexBuffer.numItems,
b.UNSIGNED_SHORT,0):b.drawElements(b.TRIANGLES,b.pillBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0),d.translate(B,[0,e*(1+E),0]),d.scale(B,[1,1/D,1]))}}}else{if(a.bonds_showBondOrders_3D){switch(this.bondOrder){case 1.5:q=[-a.bonds_cylinderDiameter_3D];break;case 2:q=[-a.bonds_cylinderDiameter_3D,a.bonds_cylinderDiameter_3D];break;case 3:q=[-1.2*a.bonds_cylinderDiameter_3D,0,1.2*a.bonds_cylinderDiameter_3D]}1<this.bondOrder&&(y=[0,0,1],e=d.inverse(b.rotationMatrix,[]),d.multiplyVec3(e,y),y=
n.cross(t,y,[]),n.normalize(y))}else switch(this.bondOrder){case 0:h*=0.25;break;case 0.5:case 1.5:h*=0.5}l&&(j/=2);h=[h,j,h];j=0;for(z=q.length;j<z;j++)B=d.set(u,[]),0!==q[j]&&d.translate(B,n.scale(y,q[j],[])),0!==r&&d.rotate(B,r,o),d.scale(B,h),k&&b.material.setDiffuseColor(k),b.setMatrixUniforms(B),a.bonds_renderAsLines_3D?b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems):b.drawArrays(b.TRIANGLE_STRIP,0,b.cylinderBuffer.vertexPositionBuffer.numItems),l&&(d.set(l,B),0!==q[j]&&d.translate(B,
n.scale(y,q[j],[])),d.rotate(B,r+f.PI,o),d.scale(B,h),g&&b.material.setDiffuseColor(g),b.setMatrixUniforms(B),a.bonds_renderAsLines_3D?b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems):b.drawArrays(b.TRIANGLE_STRIP,0,b.cylinderBuffer.vertexPositionBuffer.numItems))}}};a.renderPicker=function(b,a){this.specs&&(a=this.specs);var e=this.a1.distance3D(this.a2);if(0!==e){var j=a.bonds_cylinderDiameter_3D/2,h=d.translate(b.modelViewMatrix,[this.a1.x,this.a1.y,this.a1.z],[]),k=[this.a2.x-
this.a1.x,this.a2.y-this.a1.y,this.a2.z-this.a1.z],g=[0,1,0],u=0;this.a1.x===this.a2.x&&this.a1.z===this.a2.z?(g=[0,0,1],this.a2.y<this.a1.y&&(u=f.PI)):(u=c.vec3AngleFrom(g,k),g=n.cross(g,k,[]));var l=[0],t;if(a.bonds_showBondOrders_3D)if(a.bonds_renderAsLines_3D){switch(this.bondOrder){case 1.5:case 2:l=[-a.bonds_cylinderDiameter_3D,a.bonds_cylinderDiameter_3D];break;case 3:l=[-1.2*a.bonds_cylinderDiameter_3D,0,1.2*a.bonds_cylinderDiameter_3D]}if(1<this.bondOrder){t=[0,0,1];var o=d.inverse(b.rotationMatrix,
[]);d.multiplyVec3(o,t);t=n.cross(k,t,[]);n.normalize(t)}}else switch(this.bondOrder){case 1.5:case 2:j*=3;break;case 3:j*=3.4}else switch(this.bondOrder){case 0:j*=0.25;break;case 0.5:case 1.5:j*=0.5}e=[j,e,j];j=0;for(k=l.length;j<k;j++)o=d.set(h,[]),0!==l[j]&&d.translate(o,n.scale(t,l[j],[])),0!==u&&d.rotate(o,u,g),d.scale(o,e),b.setMatrixUniforms(o),a.bonds_renderAsLines_3D?b.drawArrays(b.LINES,0,b.lineBuffer.vertexPositionBuffer.numItems):b.drawArrays(b.TRIANGLE_STRIP,0,b.cylinderBuffer.vertexPositionBuffer.numItems)}}})(ChemDoodle.ELEMENT,
ChemDoodle.extensions,ChemDoodle.structures,ChemDoodle.math,Math,mat4,vec3);
(function(a,c){a.Ring=function(){this.atoms=[];this.bonds=[]};var g=a.Ring.prototype;g.center=void 0;g.setupBonds=function(){for(var a=0,c=this.bonds.length;a<c;a++)this.bonds[a].ring=this;this.center=this.getCenter()};g.getCenter=function(){for(var e=Infinity,f=Infinity,d=-Infinity,n=-Infinity,b=0,m=this.atoms.length;b<m;b++)e=c.min(this.atoms[b].x,e),f=c.min(this.atoms[b].y,f),d=c.max(this.atoms[b].x,d),n=c.max(this.atoms[b].y,n);return new a.Point((d+e)/2,(n+f)/2)}})(ChemDoodle.structures,Math);
(function(a,c,g,e,f){g.Molecule=function(){this.atoms=[];this.bonds=[];this.rings=[]};var d=g.Molecule.prototype;d.findRings=!0;d.draw=function(a,b){this.specs&&(b=this.specs);if(b.atoms_display&&!b.atoms_circles_2D)for(var d=0,c=this.atoms.length;d<c;d++)this.atoms[d].draw(a,b);if(b.bonds_display){d=0;for(c=this.bonds.length;d<c;d++)this.bonds[d].draw(a,b)}if(b.atoms_display&&b.atoms_circles_2D){d=0;for(c=this.atoms.length;d<c;d++)this.atoms[d].draw(a,b)}};d.render=function(a,b){this.specs&&(b=this.specs);
var d=0<this.atoms.length&&void 0!==this.atoms[0].hetatm;if(d){if(b.macro_displayBonds){0<this.bonds.length&&(b.bonds_renderAsLines_3D&&!this.residueSpecs||this.residueSpecs&&this.residueSpecs.bonds_renderAsLines_3D?(a.lineWidth(this.residueSpecs?this.residueSpecs.bonds_width_2D:b.bonds_width_2D),a.lineBuffer.bindBuffers(a)):a.cylinderBuffer.bindBuffers(a),a.material.setTempColors(b.bonds_materialAmbientColor_3D,void 0,b.bonds_materialSpecularColor_3D,b.bonds_materialShininess_3D));for(var c=0,f=
this.bonds.length;c<f;c++){var h=this.bonds[c];if(!h.a1.hetatm&&(-1===b.macro_atomToLigandDistance||void 0!==h.a1.closestDistance&&b.macro_atomToLigandDistance>=h.a1.closestDistance&&b.macro_atomToLigandDistance>=h.a2.closestDistance))h.render(a,this.residueSpecs?this.residueSpecs:b)}}if(b.macro_displayAtoms){0<this.atoms.length&&(a.sphereBuffer.bindBuffers(a),a.material.setTempColors(b.atoms_materialAmbientColor_3D,void 0,b.atoms_materialSpecularColor_3D,b.atoms_materialShininess_3D));c=0;for(f=
this.atoms.length;c<f;c++)if(h=this.atoms[c],!h.hetatm&&(-1===b.macro_atomToLigandDistance||void 0!==h.closestDistance&&b.macro_atomToLigandDistance>=h.closestDistance))h.render(a,this.residueSpecs?this.residueSpecs:b)}}if(b.bonds_display){var k=[],p=[];0<this.bonds.length&&(b.bonds_renderAsLines_3D?(a.lineWidth(b.bonds_width_2D),a.lineBuffer.bindBuffers(a)):a.cylinderBuffer.bindBuffers(a),a.material.setTempColors(b.bonds_materialAmbientColor_3D,void 0,b.bonds_materialSpecularColor_3D,b.bonds_materialShininess_3D));
c=0;for(f=this.bonds.length;c<f;c++)if(h=this.bonds[c],!d||h.a1.hetatm)b.bonds_showBondOrders_3D?0==h.bondOrder?p.push(h):0.5==h.bondOrder?k.push(h):(1.5==h.bondOrder&&k.push(h),h.render(a,b)):h.render(a,b);if(0<k.length){b.bonds_renderAsLines_3D||a.pillBuffer.bindBuffers(a);c=0;for(f=k.length;c<f;c++)k[c].render(a,b,!0)}if(0<p.length){b.bonds_renderAsLines_3D||a.sphereBuffer.bindBuffers(a);c=0;for(f=p.length;c<f;c++)p[c].render(a,b,!0)}}if(b.atoms_display){c=0;for(f=this.atoms.length;c<f;c++)h=this.atoms[c],
h.bondNumber=0,h.renderAsStar=!1;c=0;for(f=this.bonds.length;c<f;c++)h=this.bonds[c],h.a1.bondNumber++,h.a2.bondNumber++;0<this.atoms.length&&(a.sphereBuffer.bindBuffers(a),a.material.setTempColors(b.atoms_materialAmbientColor_3D,void 0,b.atoms_materialSpecularColor_3D,b.atoms_materialShininess_3D));k=[];c=0;for(f=this.atoms.length;c<f;c++)if(h=this.atoms[c],!d||h.hetatm&&(b.macro_showWater||!h.isWater))b.atoms_nonBondedAsStars_3D&&0===h.bondNumber?(h.renderAsStar=!0,k.push(h)):h.render(a,b);if(0<
k.length){a.starBuffer.bindBuffers(a);c=0;for(f=k.length;c<f;c++)k[c].render(a,b)}}if(this.chains){a.setMatrixUniforms(a.modelViewMatrix);if(b.proteins_displayRibbon){a.material.setTempColors(b.proteins_materialAmbientColor_3D,void 0,b.proteins_materialSpecularColor_3D,b.proteins_materialShininess_3D);d=0;for(k=this.ribbons.length;d<k;d++)if(b.proteins_useShapelyColors||b.proteins_useAminoColors||b.proteins_usePolarityColors){h=b.proteins_ribbonCartoonize?this.cartoons[d]:this.ribbons[d];h.front.bindBuffers(a);
c=0;for(f=h.front.segments.length;c<f;c++)h.front.segments[c].render(a,b);h.back.bindBuffers(a);c=0;for(f=h.back.segments.length;c<f;c++)h.back.segments[c].render(a,b)}else if(b.proteins_ribbonCartoonize){h=this.cartoons[d];h.front.bindBuffers(a);c=0;for(f=h.front.cartoonSegments.length;c<f;c++)h.front.cartoonSegments[c].render(a,b);h.back.bindBuffers(a);c=0;for(f=h.back.cartoonSegments.length;c<f;c++)h.back.cartoonSegments[c].render(a,b)}else h=this.ribbons[d],h.front.render(a,b),h.back.render(a,
b)}if(b.proteins_displayBackbone){if(!this.alphaCarbonTrace){this.alphaCarbonTrace={nodes:[],edges:[]};d=0;for(k=this.chains.length;d<k;d++)if(p=this.chains[d],!(2<p.length&&e[p[2].name]&&"#BEA06E"===e[p[2].name].aminoColor)&&0<p.length){c=1;for(f=p.length-2;c<f;c++)h=p[c].cp1,h.chainColor=p.chainColor,this.alphaCarbonTrace.nodes.push(h),h=new g.Bond(p[c].cp1,p[c+1].cp1),h.residueName=p[c].name,h.chainColor=p.chainColor,this.alphaCarbonTrace.edges.push(h),c===p.length-3&&(h=p[c+1].cp1,h.chainColor=
p.chainColor,this.alphaCarbonTrace.nodes.push(h))}}if(0<this.alphaCarbonTrace.nodes.length){d=new g.VisualSpecifications;d.atoms_display=!0;d.bonds_display=!0;d.atoms_sphereDiameter_3D=b.proteins_backboneThickness;d.bonds_cylinderDiameter_3D=b.proteins_backboneThickness;d.bonds_useJMOLColors=!1;d.atoms_color=b.proteins_backboneColor;d.bonds_color=b.proteins_backboneColor;d.atoms_useVDWDiameters_3D=!1;a.material.setTempColors(b.proteins_materialAmbientColor_3D,void 0,b.proteins_materialSpecularColor_3D,
b.proteins_materialShininess_3D);a.material.setDiffuseColor(b.proteins_backboneColor);c=0;for(f=this.alphaCarbonTrace.nodes.length;c<f;c++)h=this.alphaCarbonTrace.nodes[c],b.macro_colorByChain&&(d.atoms_color=h.chainColor),a.sphereBuffer.bindBuffers(a),h.render(a,d);c=0;for(f=this.alphaCarbonTrace.edges.length;c<f;c++){var h=this.alphaCarbonTrace.edges[c],u,k=e[h.residueName]?e[h.residueName]:e["*"];b.macro_colorByChain?u=h.chainColor:b.proteins_useShapelyColors?u=k.shapelyColor:b.proteins_useAminoColors?
u=k.aminoColor:b.proteins_usePolarityColors&&(u=k.polar?"#C10000":"#FFFFFF");u&&(d.bonds_color=u);a.cylinderBuffer.bindBuffers(a);h.render(a,d)}}}if(b.nucleics_display){a.material.setTempColors(b.nucleics_materialAmbientColor_3D,void 0,b.nucleics_materialSpecularColor_3D,b.nucleics_materialShininess_3D);d=0;for(k=this.tubes.length;d<k;d++)a.setMatrixUniforms(a.modelViewMatrix),h=this.tubes[d],h.render(a,b)}}b.crystals_displayUnitCell&&this.unitCell&&(a.setMatrixUniforms(a.modelViewMatrix),this.unitCell.bindBuffers(a),
a.material.setDiffuseColor(b.crystals_unitCellColor),a.lineWidth(b.crystals_unitCellLineWidth),a.drawElements(a.LINES,this.unitCell.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0));this.surface&&b.surfaces_display&&(a.setMatrixUniforms(a.modelViewMatrix),this.surface.bindBuffers(a),a.material.setTempColors(b.surfaces_materialAmbientColor_3D,b.surfaces_color,b.surfaces_materialSpecularColor_3D,b.surfaces_materialShininess_3D),"Dot"===b.surfaces_style?a.drawArrays(a.POINTS,0,this.surface.vertexPositionBuffer.numItems):
a.drawElements(a.TRIANGLES,this.surface.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0))};d.renderPickFrame=function(a,b,d){this.specs&&(b=this.specs);var f=0<this.atoms.length&&void 0!==this.atoms[0].hetatm;if(b.bonds_display){0<this.bonds.length&&(b.bonds_renderAsLines_3D?(a.lineWidth(b.bonds_width_2D),a.lineBuffer.bindBuffers(a)):a.cylinderBuffer.bindBuffers(a));for(var e=0,h=this.bonds.length;e<h;e++){var k=this.bonds[e];if(!f||k.a1.hetatm)a.material.setDiffuseColor(c.idx2color(d.length)),k.renderPicker(a,
b),d.push(k)}}if(b.atoms_display){e=0;for(h=this.atoms.length;e<h;e++)k=this.atoms[e],k.bondNumber=0,k.renderAsStar=!1;e=0;for(h=this.bonds.length;e<h;e++)k=this.bonds[e],k.a1.bondNumber++,k.a2.bondNumber++;0<this.atoms.length&&a.sphereBuffer.bindBuffers(a);for(var g=[],e=0,h=this.atoms.length;e<h;e++)if(k=this.atoms[e],!f||k.hetatm&&(b.macro_showWater||!k.isWater))b.atoms_nonBondedAsStars_3D&&0===k.bondNumber?(k.renderAsStar=!0,g.push(k)):(a.material.setDiffuseColor(c.idx2color(d.length)),k.render(a,
b,!0),d.push(k));if(0<g.length){a.starBuffer.bindBuffers(a);e=0;for(h=g.length;e<h;e++)k=g[e],a.material.setDiffuseColor(c.idx2color(d.length)),k.render(a,b,!0),d.push(k)}}};d.getCenter3D=function(){if(1===this.atoms.length)return new g.Atom("C",this.atoms[0].x,this.atoms[0].y,this.atoms[0].z);var a=Infinity,b=Infinity,d=Infinity,c=-Infinity,e=-Infinity,h=-Infinity;if(this.chains)for(var k=0,p=this.chains.length;k<p;k++)for(var u=this.chains[k],l=0,t=u.length;l<t;l++)var o=u[l],a=f.min(o.cp1.x,o.cp2.x,
a),b=f.min(o.cp1.y,o.cp2.y,b),d=f.min(o.cp1.z,o.cp2.z,d),c=f.max(o.cp1.x,o.cp2.x,c),e=f.max(o.cp1.y,o.cp2.y,e),h=f.max(o.cp1.z,o.cp2.z,h);k=0;for(p=this.atoms.length;k<p;k++)a=f.min(this.atoms[k].x,a),b=f.min(this.atoms[k].y,b),d=f.min(this.atoms[k].z,d),c=f.max(this.atoms[k].x,c),e=f.max(this.atoms[k].y,e),h=f.max(this.atoms[k].z,h);return new g.Atom("C",(c+a)/2,(e+b)/2,(h+d)/2)};d.getCenter=function(){if(1===this.atoms.length)return new g.Point(this.atoms[0].x,this.atoms[0].y);for(var a=Infinity,
b=Infinity,d=-Infinity,c=-Infinity,e=0,h=this.atoms.length;e<h;e++)a=f.min(this.atoms[e].x,a),b=f.min(this.atoms[e].y,b),d=f.max(this.atoms[e].x,d),c=f.max(this.atoms[e].y,c);return new g.Point((d+a)/2,(c+b)/2)};d.getDimension=function(){if(1===this.atoms.length)return new g.Point(0,0);var a=Infinity,b=Infinity,d=-Infinity,c=-Infinity;if(this.chains){for(var e=0,h=this.chains.length;e<h;e++)for(var k=this.chains[e],p=0,u=k.length;p<u;p++)var l=k[p],a=f.min(l.cp1.x,l.cp2.x,a),b=f.min(l.cp1.y,l.cp2.y,
b),d=f.max(l.cp1.x,l.cp2.x,d),c=f.max(l.cp1.y,l.cp2.y,c);a-=30;b-=30;d+=30;c+=30}e=0;for(h=this.atoms.length;e<h;e++)a=f.min(this.atoms[e].x,a),b=f.min(this.atoms[e].y,b),d=f.max(this.atoms[e].x,d),c=f.max(this.atoms[e].y,c);return new g.Point(d-a,c-b)};d.check=function(d){if(d&&this.doChecks){if(this.findRings)if(this.bonds.length-this.atoms.length!==this.fjNumCache){this.rings=(new a.informatics.SSSRFinder(this)).rings;for(var b=0,c=this.bonds.length;b<c;b++)this.bonds[b].ring=void 0;b=0;for(c=
this.rings.length;b<c;b++)this.rings[b].setupBonds()}else{b=0;for(c=this.rings.length;b<c;b++){var f=this.rings[b];f.center=f.getCenter()}}b=0;for(c=this.atoms.length;b<c;b++)if(this.atoms[b].isLone=!1,"C"===this.atoms[b].label){for(var e=f=0,h=this.bonds.length;e<h;e++)(this.bonds[e].a1===this.atoms[b]||this.bonds[e].a2===this.atoms[b])&&f++;0===f&&(this.atoms[b].isLone=!0)}f=!1;b=0;for(c=this.atoms.length;b<c;b++)0!==this.atoms[b].z&&(f=!0);f&&(this.sortAtomsByZ(),this.sortBondsByZ());this.setupMetaData();
this.atomNumCache=this.atoms.length;this.bondNumCache=this.bonds.length;this.fjNumCache=this.bonds.length-this.atoms.length}this.doChecks=!d};d.getAngles=function(a){for(var b=[],d=0,c=this.bonds.length;d<c;d++)this.bonds[d].contains(a)&&b.push(a.angle(this.bonds[d].getNeighbor(a)));b.sort();return b};d.getCoordinationNumber=function(a){for(var b=0,d=0,c=a.length;d<c;d++)b+=a[d].bondOrder;return b};d.getBonds=function(a){for(var b=[],d=0,c=this.bonds.length;d<c;d++)this.bonds[d].contains(a)&&b.push(this.bonds[d]);
return b};d.sortAtomsByZ=function(){for(var a=1,b=this.atoms.length;a<b;a++)for(var d=a;0<d&&this.atoms[d].z<this.atoms[d-1].z;){var c=this.atoms[d];this.atoms[d]=this.atoms[d-1];this.atoms[d-1]=c;d--}};d.sortBondsByZ=function(){for(var a=1,b=this.bonds.length;a<b;a++)for(var d=a;0<d&&this.bonds[d].a1.z+this.bonds[d].a2.z<this.bonds[d-1].a1.z+this.bonds[d-1].a2.z;){var c=this.bonds[d];this.bonds[d]=this.bonds[d-1];this.bonds[d-1]=c;d--}};d.setupMetaData=function(){for(var a=this.getCenter(),b=0,d=
this.atoms.length;b<d;b++){var e=this.atoms[b];e.bonds=this.getBonds(e);e.angles=this.getAngles(e);e.isHidden=2===e.bonds.length&&f.abs(f.abs(e.angles[1]-e.angles[0])-f.PI)<f.PI/30&&e.bonds[0].bondOrder===e.bonds[1].bondOrder;var j=c.angleBetweenLargest(e.angles);e.angleOfLeastInterference=j.angle%(2*f.PI);e.largestAngle=j.largest;e.coordinationNumber=this.getCoordinationNumber(e.bonds);e.bondNumber=e.bonds.length;e.molCenter=a}b=0;for(d=this.bonds.length;b<d;b++)this.bonds[b].molCenter=a};d.scaleToAverageBondLength=
function(a){var b=this.getAverageBondLength();if(0!==b){a/=b;for(var b=0,d=this.atoms.length;b<d;b++)this.atoms[b].x*=a,this.atoms[b].y*=a}};d.getAverageBondLength=function(){if(0===this.bonds.length)return 0;for(var a=0,b=0,d=this.bonds.length;b<d;b++)a+=this.bonds[b].getLength();return a/=this.bonds.length};d.getBounds=function(){for(var a=new c.Bounds,b=0,d=this.atoms.length;b<d;b++)a.expand(this.atoms[b].getBounds());if(this.chains){b=0;for(d=this.chains.length;b<d;b++)for(var f=this.chains[b],
e=0,h=f.length;e<h;e++){var k=f[e];a.expand(k.cp1.x,k.cp1.y);a.expand(k.cp2.x,k.cp2.y)}a.minX-=30;a.minY-=30;a.maxX+=30;a.maxY+=30}return a};d.getBounds3D=function(){for(var a=new c.Bounds,b=0,d=this.atoms.length;b<d;b++)a.expand(this.atoms[b].getBounds3D());if(this.chains){b=0;for(d=this.chains.length;b<d;b++)for(var f=this.chains[b],e=0,h=f.length;e<h;e++){var k=f[e];a.expand3D(k.cp1.x,k.cp1.y,k.cp1.z);a.expand3D(k.cp2.x,k.cp2.y,k.cp2.z)}}return a}})(ChemDoodle,ChemDoodle.math,ChemDoodle.structures,
ChemDoodle.RESIDUE,Math);
(function(a,c,g,e){var f,d=-1;a.Residue=function(b){this.resSeq=b};var n=a.Residue.prototype;n.setup=function(b,d){this.horizontalResolution=d;var c=[b.x-this.cp1.x,b.y-this.cp1.y,b.z-this.cp1.z],f=e.cross(c,[this.cp2.x-this.cp1.x,this.cp2.y-this.cp1.y,this.cp2.z-this.cp1.z],[]);this.D=e.cross(f,c,[]);e.normalize(f);e.normalize(this.D);this.guidePointsSmall=[];this.guidePointsLarge=[];c=[(b.x+this.cp1.x)/2,(b.y+this.cp1.y)/2,(b.z+this.cp1.z)/2];this.helix&&(e.scale(f,1.5),e.add(c,f));this.guidePointsSmall[0]=
new a.Atom("",c[0]-this.D[0]/2,c[1]-this.D[1]/2,c[2]-this.D[2]/2);for(f=1;f<d;f++)this.guidePointsSmall[f]=new a.Atom("",this.guidePointsSmall[0].x+this.D[0]*f/d,this.guidePointsSmall[0].y+this.D[1]*f/d,this.guidePointsSmall[0].z+this.D[2]*f/d);e.scale(this.D,4);this.guidePointsLarge[0]=new a.Atom("",c[0]-this.D[0]/2,c[1]-this.D[1]/2,c[2]-this.D[2]/2);for(f=1;f<d;f++)this.guidePointsLarge[f]=new a.Atom("",this.guidePointsLarge[0].x+this.D[0]*f/d,this.guidePointsLarge[0].y+this.D[1]*f/d,this.guidePointsLarge[0].z+
this.D[2]*f/d)};n.getGuidePointSet=function(b){if(0===b)return this.helix||this.sheet?this.guidePointsLarge:this.guidePointsSmall;if(1===b)return this.guidePointsSmall;if(2===b)return this.guidePointsLarge};n.computeLineSegments=function(b,a,c,e,h){if(h!==d){var n=h*h,p=h*h*h;f=g.multiply([-1/6,0.5,-0.5,1/6,0.5,-1,0.5,0,-0.5,0,0.5,0,1/6,2/3,1/6,0],[6/p,0,0,0,6/p,2/n,0,0,1/p,1/n,1/h,0,0,0,0,1],[]);d=h}this.split=a.helix!==this.helix||a.sheet!==this.sheet;this.lineSegments=this.innerCompute(0,b,a,c,
!1,h);e&&(this.lineSegmentsCartoon=this.innerCompute(a.helix||a.sheet?2:1,b,a,c,!0,h))};n.innerCompute=function(b,d,n,j,h,k){var p=[],u=this.getGuidePointSet(b);d=d.getGuidePointSet(b);n=n.getGuidePointSet(b);for(var l=j.getGuidePointSet(b),t=0,o=this.guidePointsLarge.length;t<o;t++){for(var r=g.multiply([d[t].x,d[t].y,d[t].z,1,u[t].x,u[t].y,u[t].z,1,n[t].x,n[t].y,n[t].z,1,l[t].x,l[t].y,l[t].z,1],f,[]),q=[],w=0;w<k;w++){for(b=3;0<b;b--)for(j=0;4>j;j++)r[4*b+j]+=r[4*(b-1)+j];q[w]=new a.Atom("",r[12]/
r[15],r[13]/r[15],r[14]/r[15])}p[t]=q}if(h&&this.arrow)for(b=0;b<k;b++){h=1.5-1.3*b/k;u=c.floor(this.horizontalResolution/2);d=p[u];j=0;for(n=p.length;j<n;j++)j!==u&&(l=d[b],t=p[j][b],o=[t.x-l.x,t.y-l.y,t.z-l.z],e.scale(o,h),t.x=l.x+o[0],t.y=l.y+o[1],t.z=l.z+o[2])}return p}})(ChemDoodle.structures,Math,mat4,vec3);
(function(a,c,g,e,f){c.Spectrum=function(){this.data=[];this.metadata=[];this.dataDisplay=[];this.memory={offsetTop:0,offsetLeft:0,offsetBottom:0,flipXAxis:!1,scale:1,width:0,height:0}};e=c.Spectrum.prototype;e.title=void 0;e.xUnit=void 0;e.yUnit=void 0;e.continuous=!0;e.integrationSensitivity=0.01;e.draw=function(d,c,b,e){this.specs&&(c=this.specs);var g=5,j=0,h=0;d.fillStyle=c.text_color;d.textAlign="center";d.textBaseline="alphabetic";d.font=a.getFontString(c.text_font_size,c.text_font_families);
this.xUnit&&(h+=c.text_font_size,d.fillText(this.xUnit,b/2,e-2));this.yUnit&&c.plots_showYAxis&&(j+=c.text_font_size,d.save(),d.translate(c.text_font_size,e/2),d.rotate(-f.PI/2),d.fillText(this.yUnit,0,0),d.restore());this.title&&(g+=c.text_font_size,d.fillText(this.title,b/2,c.text_font_size));h+=5+c.text_font_size;c.plots_showYAxis&&(j+=5+d.measureText("1000").width);c.plots_showGrid&&(d.strokeStyle=c.plots_gridColor,d.lineWidth=c.plots_gridLineWidth,d.strokeRect(j,g,b-j,e-h-g));d.textAlign="center";
d.textBaseline="top";for(var k=this.maxX-this.minX,p=k/100,u=0.001;u<p||25<k/u;)u*=10;for(var l=0,t=c.plots_flipXAxis?b:0,k=f.round(this.minX/u)*u;k<=this.maxX;k+=u/2){var o=this.getTransformedX(k,c,b,j);if(o>j)if(d.strokeStyle="black",d.lineWidth=1,0===l%2){d.beginPath();d.moveTo(o,e-h);d.lineTo(o,e-h+2);d.stroke();for(p=k.toFixed(5);"0"===p.charAt(p.length-1);)p=p.substring(0,p.length-1);"."===p.charAt(p.length-1)&&(p=p.substring(0,p.length-1));var r=d.measureText(p).width;c.plots_flipXAxis&&(r*=
-1);var q=o-r/2;if(c.plots_flipXAxis?q<t:q>t)d.fillText(p,o,e-h+2),t=o+r/2;c.plots_showGrid&&(d.strokeStyle=c.plots_gridColor,d.lineWidth=c.plots_gridLineWidth,d.beginPath(),d.moveTo(o,e-h),d.lineTo(o,g),d.stroke())}else d.beginPath(),d.moveTo(o,e-h),d.lineTo(o,e-h+2),d.stroke();l++}if(c.plots_showYAxis||c.plots_showGrid){u=1/c.scale;d.textAlign="right";d.textBaseline="middle";for(k=0;10>=k;k++)if(p=u/10*k,l=g+(e-h-g)*(1-p*c.scale),c.plots_showGrid&&(d.strokeStyle=c.plots_gridColor,d.lineWidth=c.plots_gridLineWidth,
d.beginPath(),d.moveTo(j,l),d.lineTo(b,l),d.stroke()),c.plots_showYAxis){d.strokeStyle="black";d.lineWidth=1;d.beginPath();d.moveTo(j,l);d.lineTo(j-3,l);d.stroke();p*=100;t=f.max(0,3-f.floor(p).toString().length);p=p.toFixed(t);if(0<t)for(;"0"===p.charAt(p.length-1);)p=p.substring(0,p.length-1);"."===p.charAt(p.length-1)&&(p=p.substring(0,p.length-1));d.fillText(p,j-3,l)}}d.strokeStyle="black";d.lineWidth=1;d.beginPath();d.moveTo(b,e-h);d.lineTo(j,e-h);c.plots_showYAxis&&d.lineTo(j,g);d.stroke();
if(0<this.dataDisplay.length){d.textAlign="left";d.textBaseline="top";k=p=0;for(u=this.dataDisplay.length;k<u;k++)if(this.dataDisplay[k].value)d.fillText([this.dataDisplay[k].display,": ",this.dataDisplay[k].value].join(""),j+10,g+10+p*(c.text_font_size+5)),p++;else if(this.dataDisplay[k].tag){l=0;for(t=this.metadata.length;l<t;l++)if(a.stringStartsWith(this.metadata[l],this.dataDisplay[k].tag)){t=this.metadata[l];this.dataDisplay[k].display&&(t=this.metadata[l].indexOf("\x3d"),t=[this.dataDisplay[k].display,
": ",-1<t?this.metadata[l].substring(t+2):this.metadata[l]].join(""));d.fillText(t,j+10,g+10+p*(c.text_font_size+5));p++;break}}}this.drawPlot(d,c,b,e,g,j,h);this.memory.offsetTop=g;this.memory.offsetLeft=j;this.memory.offsetBottom=h;this.memory.flipXAxis=c.plots_flipXAxis;this.memory.scale=c.scale;this.memory.width=b;this.memory.height=e};e.drawPlot=function(a,e,b,m,g,j,h){this.specs&&(e=this.specs);a.strokeStyle=e.plots_color;a.lineWidth=e.plots_width;var k=[];a.beginPath();if(this.continuous)for(var p=
!1,u=0,l=0,t=this.data.length;l<t;l++){var o=this.getTransformedX(this.data[l].x,e,b,j);if(o>=j&&o<b){var r=this.getTransformedY(this.data[l].y,e,m,h,g);e.plots_showIntegration&&f.abs(this.data[l].y)>this.integrationSensitivity&&k.push(new c.Point(this.data[l].x,this.data[l].y));p||(a.moveTo(o,r),p=!0);a.lineTo(o,r);u++;0===u%1E3&&(a.stroke(),a.beginPath(),a.moveTo(o,r))}else if(p)break}else{l=0;for(t=this.data.length;l<t;l++)o=this.getTransformedX(this.data[l].x,e,b,j),o>=j&&o<b&&(a.moveTo(o,m-h),
a.lineTo(o,this.getTransformedY(this.data[l].y,e,m,h,g)))}a.stroke();if(e.plots_showIntegration&&1<k.length){a.strokeStyle=e.plots_integrationColor;a.lineWidth=e.plots_integrationLineWidth;a.beginPath();l=k[1].x>k[0].x;if(this.flipXAxis&&!l||!this.flipXAxis&&l){for(l=k.length-2;0<=l;l--)k[l].y+=k[l+1].y;p=k[0].y}else{l=1;for(t=k.length;l<t;l++)k[l].y+=k[l-1].y;p=k[k.length-1].y}l=0;for(t=k.length;l<t;l++)o=this.getTransformedX(k[l].x,e,b,j),r=this.getTransformedY(k[l].y/e.scale/p,e,m,h,g),0===l?a.moveTo(o,
r):a.lineTo(o,r);a.stroke()}};e.getTransformedY=function(a,c,b,f,e){return e+(b-f-e)*(1-a*c.scale)};e.getInverseTransformedY=function(a){return 100*((1-(a-this.memory.offsetTop)/(this.memory.height-this.memory.offsetBottom-this.memory.offsetTop))/this.memory.scale)};e.getTransformedX=function(a,c,b,f){a=f+(a-this.minX)/(this.maxX-this.minX)*(b-f);c.plots_flipXAxis&&(a=b+f-a);return a};e.getInverseTransformedX=function(a){this.memory.flipXAxis&&(a=this.memory.width+this.memory.offsetLeft-a);return(a-
this.memory.offsetLeft)*(this.maxX-this.minX)/(this.memory.width-this.memory.offsetLeft)+this.minX};e.setup=function(){for(var a=Number.MAX_VALUE,c=Number.MIN_VALUE,b=Number.MIN_VALUE,e=0,g=this.data.length;e<g;e++)a=f.min(a,this.data[e].x),c=f.max(c,this.data[e].x),b=f.max(b,this.data[e].y);this.continuous?(this.minX=a,this.maxX=c):(this.minX=a-1,this.maxX=c+1);e=0;for(g=this.data.length;e<g;e++)this.data[e].y/=b};e.zoom=function(a,c,b,e){a=this.getInverseTransformedX(a);c=this.getInverseTransformedX(c);
this.minX=f.min(a,c);this.maxX=f.max(a,c);if(e){e=Number.MIN_VALUE;c=0;for(a=this.data.length;c<a;c++)g.isBetween(this.data[c].x,this.minX,this.maxX)&&(e=f.max(e,this.data[c].y));return 1/e}};e.translate=function(a,c){var b=a/(c-this.memory.offsetLeft)*(this.maxX-this.minX)*(this.memory.flipXAxis?1:-1);this.minX+=b;this.maxX+=b};e.alertMetadata=function(){alert(this.metadata.join("\n"))};e.getInternalCoordinates=function(a,c){return new ChemDoodle.structures.Point(this.getInverseTransformedX(a),this.getInverseTransformedY(c))};
e.getClosestPlotInternalCoordinates=function(a){var c=this.getInverseTransformedX(a-1);a=this.getInverseTransformedX(a+1);if(c>a){var b=c,c=a;a=b}for(var b=-1,f=-Infinity,e=!1,j=0,h=this.data.length;j<h;j++){var k=this.data[j];if(g.isBetween(k.x,c,a))k.y>f&&(e=!0,f=k.y,b=j);else if(e)break}if(-1!==b)return k=this.data[b],new ChemDoodle.structures.Point(k.x,100*k.y)};e.getClosestPeakInternalCoordinates=function(a){var c=this.getInverseTransformedX(a);a=0;for(var b=Infinity,e=0,g=this.data.length;e<
g;e++){var j=f.abs(this.data[e].x-c);if(j<=b)b=j,a=e;else break}c=highestRight=a;b=maxRight=this.data[a].y;e=a+1;for(g=this.data.length;e<g;e++)if(this.data[e].y+0.05>maxRight)maxRight=this.data[e].y,highestRight=e;else break;for(e=a-1;0<=e;e--)if(this.data[e].y+0.05>b)b=this.data[e].y,c=e;else break;a=this.data[c-a>highestRight-a?highestRight:c];return new ChemDoodle.structures.Point(a.x,100*a.y)}})(ChemDoodle.extensions,ChemDoodle.structures,ChemDoodle.math,jQuery,Math);
(function(a,c,g){c._Shape=function(){};c=c._Shape.prototype;c.drawDecorations=function(a,c){if(this.isHover)for(var d=this.getPoints(),n=0,b=d.length;n<b;n++){var m=d[n];this.drawAnchor(a,c,m,m===this.hoverPoint)}};c.getBounds=function(){for(var c=new a.Bounds,f=this.getPoints(),d=0,n=f.length;d<n;d++){var b=f[d];c.expand(b.x,b.y)}return c};c.drawAnchor=function(a,c,d,n){a.save();a.translate(d.x,d.y);a.rotate(g.PI/4);a.scale(1/c.scale,1/c.scale);a.beginPath();a.moveTo(-4,-4);a.lineTo(4,-4);a.lineTo(4,
4);a.lineTo(-4,4);a.closePath();a.fillStyle=n?"#885110":"white";a.fill();a.beginPath();a.moveTo(-4,-2);a.lineTo(-4,-4);a.lineTo(-2,-4);a.moveTo(2,-4);a.lineTo(4,-4);a.lineTo(4,-2);a.moveTo(4,2);a.lineTo(4,4);a.lineTo(2,4);a.moveTo(-2,4);a.lineTo(-4,4);a.lineTo(-4,2);a.moveTo(-4,-2);a.strokeStyle="rgba(0,0,0,.2)";a.lineWidth=5;a.stroke();a.strokeStyle="blue";a.lineWidth=1;a.stroke();a.restore()}})(ChemDoodle.math,ChemDoodle.structures.d2,Math);
(function(a,c,g,e,f){e.Bracket=function(a,c){this.p1=a?a:new g.Point;this.p2=c?c:new g.Point};e=e.Bracket.prototype=new e._Shape;e.charge=0;e.mult=0;e.repeat=0;e.draw=function(d,c){var b=f.min(this.p1.x,this.p2.x),e=f.max(this.p1.x,this.p2.x),g=f.min(this.p1.y,this.p2.y),j=f.max(this.p1.y,this.p2.y),h=j-g,k=h/10;d.beginPath();d.moveTo(b+k,g);d.lineTo(b,g);d.lineTo(b,j);d.lineTo(b+k,j);d.moveTo(e-k,j);d.lineTo(e,j);d.lineTo(e,g);d.lineTo(e-k,g);this.isLassoed&&(k=d.createLinearGradient(this.p1.x,this.p1.y,
this.p2.x,this.p2.y),k.addColorStop(0,"rgba(212, 99, 0, 0)"),k.addColorStop(0.5,"rgba(212, 99, 0, 0.8)"),k.addColorStop(1,"rgba(212, 99, 0, 0)"),d.lineWidth=c.shapes_lineWidth_2D+5,d.strokeStyle=k,d.lineJoin="miter",d.lineCap="square",d.stroke());d.strokeStyle=c.shapes_color;d.lineWidth=c.shapes_lineWidth_2D;d.lineJoin="miter";d.lineCap="butt";d.stroke();0!==this.charge&&(d.fillStyle=c.text_color,d.textAlign="left",d.textBaseline="alphabetic",d.font=a.getFontString(c.text_font_size,c.text_font_families),
k=this.charge.toFixed(0),k="1"===k?"+":"-1"===k?"\u2013":a.stringStartsWith(k,"-")?k.substring(1)+"\u2013":k+"+",d.fillText(k,e+5,g+5));0!==this.mult&&(d.fillStyle=c.text_color,d.textAlign="right",d.textBaseline="middle",d.font=a.getFontString(c.text_font_size,c.text_font_families),d.fillText(this.mult.toFixed(0),b-5,g+h/2));0!==this.repeat&&(d.fillStyle=c.text_color,d.textAlign="left",d.textBaseline="top",d.font=a.getFontString(c.text_font_size,c.text_font_families),k=this.repeat.toFixed(0),d.fillText(k,
e+5,j-5))};e.getPoints=function(){return[this.p1,this.p2]};e.isOver=function(a){return c.isBetween(a.x,this.p1.x,this.p2.x)&&c.isBetween(a.y,this.p1.y,this.p2.y)}})(ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(a,c,g,e){g.Line=function(a,f){this.p1=a?a:new c.Point;this.p2=f?f:new c.Point};g.Line.ARROW_SYNTHETIC="synthetic";g.Line.ARROW_RETROSYNTHETIC="retrosynthetic";g.Line.ARROW_RESONANCE="resonance";g.Line.ARROW_EQUILIBRIUM="equilibrium";var f=g.Line.prototype=new g._Shape;f.arrowType=void 0;f.topText=void 0;f.bottomText=void 0;f.draw=function(a,c){if(this.isLassoed){var b=a.createLinearGradient(this.p1.x,this.p1.y,this.p2.x,this.p2.y);b.addColorStop(0,"rgba(212, 99, 0, 0)");b.addColorStop(0.5,
"rgba(212, 99, 0, 0.8)");b.addColorStop(1,"rgba(212, 99, 0, 0)");var f=2.5,v=this.p1.angle(this.p2)+e.PI/2,j=e.cos(v),v=e.sin(v),h=this.p1.x-j*f,k=this.p1.y+v*f,p=this.p1.x+j*f,u=this.p1.y-v*f,l=this.p2.x+j*f,t=this.p2.y-v*f,o=this.p2.x-j*f,r=this.p2.y+v*f;a.fillStyle=b;a.beginPath();a.moveTo(h,k);a.lineTo(p,u);a.lineTo(l,t);a.lineTo(o,r);a.closePath();a.fill()}a.strokeStyle=c.shapes_color;a.fillStyle=c.shapes_color;a.lineWidth=c.shapes_lineWidth_2D;a.lineJoin="miter";a.lineCap="butt";if(this.p1.x!==
this.p2.x||this.p1.y!==this.p2.y){if(this.arrowType===g.Line.ARROW_RETROSYNTHETIC){var b=2*e.sqrt(2),f=c.shapes_arrowLength_2D/b,j=this.p1.angle(this.p2),v=j+e.PI/2,b=c.shapes_arrowLength_2D/b,q=e.cos(j),w=e.sin(j),j=e.cos(v),v=e.sin(v),h=this.p1.x-j*f,k=this.p1.y+v*f,p=this.p1.x+j*f,u=this.p1.y-v*f,l=this.p2.x+j*f-q*b,t=this.p2.y-v*f+w*b,o=this.p2.x-j*f-q*b,r=this.p2.y+v*f+w*b,y=this.p2.x+2*j*f-2*q*b,z=this.p2.y-2*v*f+2*w*b,x=this.p2.x-2*j*f-2*q*b,f=this.p2.y+2*v*f+2*w*b;a.beginPath();a.moveTo(p,
u);a.lineTo(l,t);a.moveTo(y,z);a.lineTo(this.p2.x,this.p2.y);a.lineTo(x,f);a.moveTo(o,r);a.lineTo(h,k)}else this.arrowType===g.Line.ARROW_EQUILIBRIUM?(b=2*e.sqrt(2),f=c.shapes_arrowLength_2D/b/2,j=this.p1.angle(this.p2),v=j+e.PI/2,b=2*c.shapes_arrowLength_2D/e.sqrt(3),q=e.cos(j),w=e.sin(j),j=e.cos(v),v=e.sin(v),h=this.p1.x-j*f,k=this.p1.y+v*f,p=this.p1.x+j*f,u=this.p1.y-v*f,l=this.p2.x+j*f,t=this.p2.y-v*f,o=this.p2.x-j*f,r=this.p2.y+v*f,a.beginPath(),a.moveTo(p,u),a.lineTo(l,t),a.moveTo(o,r),a.lineTo(h,
k),a.stroke(),p=l-0.8*q*b,u=t+0.8*w*b,y=l+j*c.shapes_arrowLength_2D/3-q*b,z=t-v*c.shapes_arrowLength_2D/3+w*b,a.beginPath(),a.moveTo(l,t),a.lineTo(y,z),a.lineTo(p,u),a.closePath(),a.fill(),a.stroke(),p=h+0.8*q*b,u=k-0.8*w*b,y=h-j*c.shapes_arrowLength_2D/3+q*b,z=k+v*c.shapes_arrowLength_2D/3-w*b,a.beginPath(),a.moveTo(h,k),a.lineTo(y,z),a.lineTo(p,u),a.closePath(),a.fill()):this.arrowType===g.Line.ARROW_SYNTHETIC?(j=this.p1.angle(this.p2),v=j+e.PI/2,b=2*c.shapes_arrowLength_2D/e.sqrt(3),q=e.cos(j),
w=e.sin(j),j=e.cos(v),v=e.sin(v),a.beginPath(),a.moveTo(this.p1.x,this.p1.y),a.lineTo(this.p2.x-q*b/2,this.p2.y+w*b/2),a.stroke(),p=this.p2.x-0.8*q*b,u=this.p2.y+0.8*w*b,y=this.p2.x+j*c.shapes_arrowLength_2D/3-q*b,z=this.p2.y-v*c.shapes_arrowLength_2D/3+w*b,x=this.p2.x-j*c.shapes_arrowLength_2D/3-q*b,f=this.p2.y+v*c.shapes_arrowLength_2D/3+w*b,a.beginPath(),a.moveTo(this.p2.x,this.p2.y),a.lineTo(x,f),a.lineTo(p,u),a.lineTo(y,z),a.closePath(),a.fill()):this.arrowType===g.Line.ARROW_RESONANCE?(j=this.p1.angle(this.p2),
v=j+e.PI/2,b=2*c.shapes_arrowLength_2D/e.sqrt(3),q=e.cos(j),w=e.sin(j),j=e.cos(v),v=e.sin(v),a.beginPath(),a.moveTo(this.p1.x+q*b/2,this.p1.y-w*b/2),a.lineTo(this.p2.x-q*b/2,this.p2.y+w*b/2),a.stroke(),p=this.p2.x-0.8*q*b,u=this.p2.y+0.8*w*b,y=this.p2.x+j*c.shapes_arrowLength_2D/3-q*b,z=this.p2.y-v*c.shapes_arrowLength_2D/3+w*b,x=this.p2.x-j*c.shapes_arrowLength_2D/3-q*b,f=this.p2.y+v*c.shapes_arrowLength_2D/3+w*b,a.beginPath(),a.moveTo(this.p2.x,this.p2.y),a.lineTo(x,f),a.lineTo(p,u),a.lineTo(y,
z),a.closePath(),a.fill(),a.stroke(),p=this.p1.x+0.8*q*b,u=this.p1.y-0.8*w*b,y=this.p1.x-j*c.shapes_arrowLength_2D/3+q*b,z=this.p1.y+v*c.shapes_arrowLength_2D/3-w*b,x=this.p1.x+j*c.shapes_arrowLength_2D/3+q*b,f=this.p1.y-v*c.shapes_arrowLength_2D/3-w*b,a.beginPath(),a.moveTo(this.p1.x,this.p1.y),a.lineTo(x,f),a.lineTo(p,u),a.lineTo(y,z),a.closePath(),a.fill()):(a.beginPath(),a.moveTo(this.p1.x,this.p1.y),a.lineTo(this.p2.x,this.p2.y));a.stroke();this.topText&&(a.textAlign="center",a.textBaseline=
"bottom",a.fillText(this.topText,(this.p1.x+this.p2.x)/2,this.p1.y-5));this.bottomText&&(a.textAlign="center",a.textBaseline="top",a.fillText(this.bottomText,(this.p1.x+this.p2.x)/2,this.p1.y+5))}};f.getPoints=function(){return[this.p1,this.p2]};f.isOver=function(c,f){var b=a.distanceFromPointToLineInclusive(c,this.p1,this.p2);return-1!==b&&b<f}})(ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(a,c,g,e,f){var d=function(a){var b=[];if(a instanceof g.Atom)if(0===a.bondNumber)b.push(f.PI);else{if(a.angles){if(1===a.angles.length)b.push(a.angles[0]+f.PI);else{for(var c=1,d=a.angles.length;c<d;c++)b.push(a.angles[c-1]+(a.angles[c]-a.angles[c-1])/2);c=a.angles[a.angles.length-1];b.push(c+(a.angles[0]+2*f.PI-c)/2)}a.largestAngle>f.PI&&(b=[a.angleOfLeastInterference]);if(a.bonds){c=0;for(d=a.bonds.length;c<d;c++){var e=a.bonds[c];if(2===e.bondOrder&&(e=e.getNeighbor(a),"O"===e.label)){b=
[e.angle(a)];break}}}}}else a=a.a1.angle(a.a2),b.push(a+f.PI/2),b.push(a+3*f.PI/2);c=0;for(d=b.length;c<d;c++){for(;b[c]>2*f.PI;)b[c]-=2*f.PI;for(;0>b[c];)b[c]+=2*f.PI}return b},n=function(a,b){var c=3;if(a instanceof g.Atom){if(a.isLabelVisible(b)&&(c=8),0!==a.charge||0!==a.numRadical||0!==a.numLonePair)c=13}else a instanceof g.Point?c=0:1<a.bondOrder&&(c=5);return c},b=function(a,b,c,d,e,p,u,l,t,o){var r=p.angle(e),q=u.angle(l),w=r+f.PI/2,y=f.cos(r),r=f.sin(r),w=n(c,b);e.x-=y*w;e.y+=r*w;w=q+f.PI/
2;c=2*b.shapes_arrowLength_2D/f.sqrt(3);var y=f.cos(q),r=f.sin(q),z=f.cos(w),x=f.sin(w);l.x-=5*y;l.y+=5*r;q=new g.Point(l.x,l.y);w=n(d,b)/3;q.x-=y*w;q.y+=r*w;l.x-=y*(0.8*c+w);l.y+=r*(0.8*c+w);d=q.x-0.8*y*c;var w=q.y+0.8*r*c,A=new g.Point(q.x+z*b.shapes_arrowLength_2D/3-y*c,q.y-x*b.shapes_arrowLength_2D/3+r*c);b=new g.Point(q.x-z*b.shapes_arrowLength_2D/3-y*c,q.y+x*b.shapes_arrowLength_2D/3+r*c);r=y=!0;1===t&&(A.distance(p)>b.distance(p)?r=!1:y=!1);a.beginPath();a.moveTo(q.x,q.y);r&&a.lineTo(b.x,b.y);
a.lineTo(d,w);y&&a.lineTo(A.x,A.y);a.closePath();a.fill();a.stroke();a.beginPath();a.moveTo(e.x,e.y);a.bezierCurveTo(p.x,p.y,u.x,u.y,l.x,l.y);a.stroke();o.push([e,p,u,l])};e.Pusher=function(a,b,c){this.o1=a;this.o2=b;this.numElectron=c?c:1};e=e.Pusher.prototype=new e._Shape;e.drawDecorations=function(a,b){if(this.isHover)for(var c=this.o1 instanceof g.Atom?new g.Point(this.o1.x,this.o1.y):this.o1.getCenter(),d=this.o2 instanceof g.Atom?new g.Point(this.o2.x,this.o2.y):this.o2.getCenter(),c=[c,d],
d=0,f=c.length;d<f;d++){var e=c[d];this.drawAnchor(a,b,e,e===this.hoverPoint)}};e.draw=function(c,e){if(this.o1&&this.o2){c.strokeStyle=e.shapes_color;c.fillStyle=e.shapes_color;c.lineWidth=e.shapes_lineWidth_2D;c.lineJoin="miter";c.lineCap="butt";for(var j=this.o1 instanceof g.Atom?new g.Point(this.o1.x,this.o1.y):this.o1.getCenter(),h=this.o2 instanceof g.Atom?new g.Point(this.o2.x,this.o2.y):this.o2.getCenter(),k=d(this.o1),n=d(this.o2),u,l,t=Infinity,o=0,r=k.length;o<r;o++)for(var q=0,w=n.length;q<
w;q++){var y=new g.Point(j.x+35*f.cos(k[o]),j.y-35*f.sin(k[o])),z=new g.Point(h.x+35*f.cos(n[q]),h.y-35*f.sin(n[q])),x=y.distance(z);x<t&&(t=x,u=y,l=z)}this.caches=[];-1===this.numElectron?(o=j.distance(h)/2,n=j.angle(h),k=n+f.PI/2,r=f.cos(n),q=f.sin(n),n=new g.Point(j.x+(o-1)*r,j.y-(o-1)*q),t=new g.Point(n.x+35*f.cos(k+f.PI/6),n.y-35*f.sin(k+f.PI/6)),o=new g.Point(j.x+(o+1)*r,j.y-(o+1)*q),k=new g.Point(o.x+35*f.cos(k-f.PI/6),o.y-35*f.sin(k-f.PI/6)),b(c,e,this.o1,n,j,u,t,n,1,this.caches),b(c,e,this.o2,
o,h,l,k,o,1,this.caches)):(a.intersectLines(j.x,j.y,u.x,u.y,h.x,h.y,l.x,l.y)&&(k=u,u=l,l=k),k=u.angle(j),n=l.angle(h),t=f.max(k,n)-f.min(k,n),0.001>f.abs(t-f.PI)&&this.o1.molCenter===this.o2.molCenter&&(k+=f.PI/2,n-=f.PI/2,u.x=j.x+35*f.cos(k+f.PI),u.y=j.y-35*f.sin(k+f.PI),l.x=h.x+35*f.cos(n+f.PI),l.y=h.y-35*f.sin(n+f.PI)),b(c,e,this.o1,this.o2,j,u,l,h,this.numElectron,this.caches))}};e.getPoints=function(){return[]};e.isOver=function(a,b){for(var d=0,f=this.caches.length;d<f;d++)if(c.distanceFromCurve(a,
this.caches[d]).distance<b)return!0;return!1}})(ChemDoodle.math,ChemDoodle.math.jsBezier,ChemDoodle.structures,ChemDoodle.structures.d2,Math);
(function(a){a._Mesh=function(){};a=a._Mesh.prototype;a.storeData=function(a,g,e){this.positionData=a;this.normalData=g;this.indexData=e};a.setupBuffers=function(a){this.vertexPositionBuffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,this.vertexPositionBuffer);a.bufferData(a.ARRAY_BUFFER,new Float32Array(this.positionData),a.STATIC_DRAW);this.vertexPositionBuffer.itemSize=3;this.vertexPositionBuffer.numItems=this.positionData.length/3;this.vertexNormalBuffer=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,
this.vertexNormalBuffer);a.bufferData(a.ARRAY_BUFFER,new Float32Array(this.normalData),a.STATIC_DRAW);this.vertexNormalBuffer.itemSize=3;this.vertexNormalBuffer.numItems=this.normalData.length/3;this.indexData&&(this.vertexIndexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indexData),a.STATIC_DRAW),this.vertexIndexBuffer.itemSize=1,this.vertexIndexBuffer.numItems=this.indexData.length);if(this.partitions)for(var g=
0,e=this.partitions.length;g<e;g++){var f=this.partitions[g],d=this.generateBuffers(a,f.positionData,f.normalData,f.indexData);f.vertexPositionBuffer=d[0];f.vertexNormalBuffer=d[1];f.vertexIndexBuffer=d[2]}};a.generateBuffers=function(a,g,e,f){var d=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,d);a.bufferData(a.ARRAY_BUFFER,new Float32Array(g),a.STATIC_DRAW);d.itemSize=3;d.numItems=g.length/3;g=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,g);a.bufferData(a.ARRAY_BUFFER,new Float32Array(e),a.STATIC_DRAW);
g.itemSize=3;g.numItems=e.length/3;var n;f&&(n=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,n),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(f),a.STATIC_DRAW),n.itemSize=1,n.numItems=f.length);return[d,g,n]};a.bindBuffers=function(a){this.vertexPositionBuffer||this.setupBuffers(a);a.bindBuffer(a.ARRAY_BUFFER,this.vertexPositionBuffer);a.vertexAttribPointer(a.shader.vertexPositionAttribute,this.vertexPositionBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,this.vertexNormalBuffer);
a.vertexAttribPointer(a.shader.vertexNormalAttribute,this.vertexNormalBuffer.itemSize,a.FLOAT,!1,0,0);this.vertexIndexBuffer&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer)}})(ChemDoodle.structures.d3,Math);
(function(a,c){a.Arrow=function(a,e){for(var f=[],d=[],n=0;n<=e;n++){var b=2*n*c.PI/e,m=c.sin(b),b=c.cos(b);d.push(0,0,-1,0,0,-1,b,m,0,b,m,0,0,0,-1,0,0,-1,b,m,1,b,m,1);f.push(0,0,0,a*b,a*m,0,a*b,a*m,0,a*b,a*m,2,a*b,a*m,2,2*a*b,2*a*m,2,2*a*b,2*a*m,2,0,0,3)}n=[];for(m=0;m<e;m++)for(var b=8*m,v=0;7>v;v++){var j=v+b,h=j+7+2;n.push(j,h,j+1,h,j,h-1)}this.storeData(f,d,n)};(a.Arrow.prototype=new a._Mesh).getLength=function(){return 3}})(ChemDoodle.structures.d3,Math);
(function(a,c,g){a.Compass=function(f,d){this.textImage=new a.TextImage;this.textImage.init(f);this.textImage.updateFont(f,d.text_font_size,d.text_font_families,d.text_font_bold,d.text_font_italic,d.text_font_stroke_3D);this.textMesh=new a.TextMesh;this.textMesh.init(f);var e=d.compass_size_3D/f.canvas.clientHeight,e=f.arrowBuffer.getLength()/e,b=c.tan(d.projectionPerspectiveVerticalFieldOfView_3D/360*c.PI),m=e/b,v=c.max(m-e,0.1),j=f.canvas.clientWidth/f.canvas.clientHeight,h=-(f.canvas.clientWidth-
d.compass_size_3D)/2+this.textImage.charHeight,k=-(f.canvas.clientHeight-d.compass_size_3D)/2+this.textImage.charHeight,p,u;d.projectionPerspective_3D?(u=v,p=g.frustum):(u=m,p=g.ortho);var l=2*(u/f.canvas.clientHeight)*b,h=h*l,k=k*l,b=b*u;u=-b;this.projectionMatrix=p(j*u-h,j*b-h,u-k,b-k,v,m+e);this.translationMatrix=g.translate(g.identity([]),[0,0,-m]);e={position:[],texCoord:[],translation:[],zDepth:[]};this.textImage.pushVertexData("X",[3.5,0,0],0,e);this.textImage.pushVertexData("Y",[0,3.5,0],
0,e);this.textImage.pushVertexData("Z",[0,0,3.5],0,e);this.textMesh.storeData(f,e.position,e.texCoord,e.translation,e.zDepth)};var e=a.Compass.prototype;e.renderArrow=function(a,c,e){a.material.setDiffuseColor(c);a.setMatrixUniforms(e);a.drawElements(a.TRIANGLES,a.arrowBuffer.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)};e.render=function(a,d){a.arrowBuffer.bindBuffers(a);a.material.setTempColors(d.bonds_materialAmbientColor_3D,void 0,d.bonds_materialSpecularColor_3D,d.bonds_materialShininess_3D);
var e=g.multiply(this.translationMatrix,a.rotationMatrix,[]),b=c.PI/2;a.fogging.setMode(0);this.renderArrow(a,d.compass_axisXColor_3D,g.rotateY(e,b,[]));this.renderArrow(a,d.compass_axisYColor_3D,g.rotateX(e,-b,[]));this.renderArrow(a,d.compass_axisZColor_3D,e)};e.renderText=function(a){var c=g.multiply(this.translationMatrix,a.rotationMatrix,[]);a.shaderText.setUniforms(a,c,this.projectionMatrix);this.textImage.useTexture(a);this.textMesh.render(a)}})(ChemDoodle.structures.d3,Math,mat4);
(function(a,c){a.Cylinder=function(a,e,f){for(var d=[],n=[],b=0;b<f;b++){var m=2*b*c.PI/f,v=c.cos(m),m=c.sin(m);n.push(v,0,m);d.push(a*v,0,a*m);n.push(v,0,m);d.push(a*v,e,a*m)}n.push(1,0,0);d.push(a,0,0);n.push(1,0,0);d.push(a,e,0);this.storeData(d,n)};a.Cylinder.prototype=new a._Mesh})(ChemDoodle.structures.d3,Math);
(function(a,c){c.Fog=function(a){this.gl=a;this.mUL=a.getUniformLocation(a.program,"u_fog.mode");this.cUL=a.getUniformLocation(a.program,"u_fog.color");this.sUL=a.getUniformLocation(a.program,"u_fog.start");this.eUL=a.getUniformLocation(a.program,"u_fog.end");this.dUL=a.getUniformLocation(a.program,"u_fog.density")};var g=c.Fog.prototype;g.setTempParameter=function(c,f,d,g){if(!this.cCache||this.cCache!==c)this.cCache=c,c=a.getRGB(c,1),this.gl.uniform3f(this.cUL,c[0],c[1],c[2]);if(!this.sCache||this.sCache!==
f)this.sCache=f,this.gl.uniform1f(this.sUL,f);if(!this.eCache||this.eCache!==d)this.eCache=d,this.gl.uniform1f(this.eUL,d);if(!this.dCache||this.dCache!==g)this.dCache=g,this.gl.uniform1f(this.dUL,g)};g.setMode=function(a){if(!this.mCache||this.mCache!==a)this.mCache=a,this.gl.uniform1i(this.mUL,a)}})(ChemDoodle.math,ChemDoodle.structures.d3,vec3);
(function(a,c){c.Label=function(){this.textImage=new c.TextImage};var g=c.Label.prototype;g.init=function(a,c){this.textImage.init(a);this.textImage.updateFont(a,c.atoms_font_size_2D,c.atoms_font_families_2D,c.atoms_font_bold_2D,c.atoms_font_italic_2D,c.text_font_stroke_3D)};g.updateVerticesBuffer=function(c,f,d){for(var g=0,b=f.length;g<b;g++){for(var m=f[g],v=m.labelMesh,j=m.atoms,h=this.textImage,k={position:[],texCoord:[],translation:[],zDepth:[]},p=0<j.length&&void 0!=j[0].hetatm,u=0,l=j.length;u<
l;u++){var t=j[u],o=t.label,r=0.05;if(d.atoms_useVDWDiameters_3D){var q=a[o].vdWRadius*d.atoms_vdwMultiplier_3D;0===q&&(q=1);r+=q}else d.atoms_sphereDiameter_3D&&(r+=1.5*(d.atoms_sphereDiameter_3D/2));if(p)if(t.hetatm){if(t.isWater&&!d.macro_showWaters)continue}else if(!d.macro_displayAtoms)continue;h.pushVertexData(o,[t.x,t.y,t.z],r,k)}if((m=m.chains)&&(d.proteins_displayRibbon||d.proteins_displayBackbone)){u=0;for(l=m.length;u<l;u++){j=m[u];p=0;for(o=j.length;p<o;p++)r=j[p],r.name&&(t=r.cp1,h.pushVertexData(r.name,
[t.x,t.y,t.z],2,k))}}v.storeData(c,k.position,k.texCoord,k.translation,k.zDepth)}};g.render=function(a,c,d){a.shaderText.setUniforms(a,a.modelViewMatrix,a.projectionMatrix);this.textImage.useTexture(a);c=0;for(var g=d.length;c<g;c++)d[c].labelMesh&&d[c].labelMesh.render(a)}})(ChemDoodle.ELEMENT,ChemDoodle.structures.d3);
(function(a,c){a.Sphere=function(a,e,f){for(var d=[],n=[],b=0;b<=e;b++)for(var m=b*c.PI/e,v=c.sin(m),j=c.cos(m),m=0;m<=f;m++){var h=2*m*c.PI/f,k=c.sin(h),h=c.cos(h)*v,p=j,k=k*v;n.push(h,p,k);d.push(a*h,a*p,a*k)}a=[];f+=1;for(b=0;b<e;b++)for(m=0;m<f;m++)v=b*f+m%f,j=v+f,a.push(v,v+1,j),m<f-1&&a.push(j,v+1,j+1);this.storeData(d,n,a)};a.Sphere.prototype=new a._Mesh})(ChemDoodle.structures.d3,Math);
(function(a,c,g,e){function f(a,c,d,f){this.entire=a;this.name=c;this.indexes=d;this.pi=f}var d=function(a,c){a.bindBuffer(a.ARRAY_BUFFER,c.vertexPositionBuffer);a.vertexAttribPointer(a.shader.vertexPositionAttribute,c.vertexPositionBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,c.vertexNormalBuffer);a.vertexAttribPointer(a.shader.vertexNormalAttribute,c.vertexNormalBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,c.vertexIndexBuffer)},n=f.prototype;n.getColor=function(b){return b.macro_colorByChain?
this.chainColor:this.name?this.getResidueColor(a[this.name]?this.name:"*",b):this.helix?this.entire.front?b.proteins_ribbonCartoonHelixPrimaryColor:b.proteins_ribbonCartoonHelixSecondaryColor:this.sheet?b.proteins_ribbonCartoonSheetColor:this.entire.front?b.proteins_primaryColor:b.proteins_secondaryColor};n.getResidueColor=function(b,c){var d=a[b];return c.proteins_useShapelyColors?d.shapelyColor:c.proteins_useAminoColors?d.aminoColor:c.proteins_usePolarityColors&&d.polar?"#C10000":"#FFFFFF"};n.render=
function(a,c){this.entire.partitions&&this.pi!==this.entire.partitions.lastRender&&(d(a,this.entire.partitions[this.pi]),this.entire.partitions.lastRender=this.pi);this.vertexIndexBuffer||(this.vertexIndexBuffer=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indexes),a.STATIC_DRAW),this.vertexIndexBuffer.itemSize=1,this.vertexIndexBuffer.numItems=this.indexes.length);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.vertexIndexBuffer);
a.material.setDiffuseColor(this.getColor(c));a.drawElements(a.TRIANGLES,this.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)};c.Ribbon=function(a,c,d){var j=a[0].lineSegments.length,h=a[0].lineSegments[0].length;this.partitions=[];this.partitions.lastRender=0;var k;this.front=0<c;for(var n=0,u=a.length-1;n<u;n++){if(!k||65E3<k.positionData.length)0<this.partitions.length&&n--,k={count:0,positionData:[],normalData:[],indexData:[]},this.partitions.push(k);var l=a[n];k.count++;for(var t=0;t<j;t++)for(var o=
d?l.lineSegmentsCartoon[t]:l.lineSegments[t],r=0===t,q=!1,w=0;w<h;w++){var y=o[w],z=n,x=w+1;n===a.length-2&&w===h-1?x--:w===h-1&&(z++,x=0);var x=d?a[z].lineSegmentsCartoon[t][x]:a[z].lineSegments[t][x],z=!1,A=t+1;t===j-1&&(A-=2,z=!0);var A=d?l.lineSegmentsCartoon[A][w]:l.lineSegments[A][w],x=[x.x-y.x,x.y-y.y,x.z-y.z],A=[A.x-y.x,A.y-y.y,A.z-y.z],B=e.cross(x,A,[]);0===w&&(e.normalize(x),e.scale(x,-1),k.normalData.push(x[0],x[1],x[2]),k.positionData.push(y.x,y.y,y.z));r||q?(e.normalize(A),e.scale(A,
-1),k.normalData.push(A[0],A[1],A[2]),k.positionData.push(y.x,y.y,y.z),r&&w===h-1&&(r=!1,w=-1)):(e.normalize(B),(z&&!this.front||!z&&this.front)&&e.scale(B,-1),k.normalData.push(B[0],B[1],B[2]),e.scale(B,g.abs(c)),k.positionData.push(y.x+B[0],y.y+B[1],y.z+B[2]),t===j-1&&w===h-1&&(q=!0,w=-1));if(-1===w||w===h-1)e.normalize(x),k.normalData.push(x[0],x[1],x[2]),k.positionData.push(y.x,y.y,y.z)}}j+=2;h+=2;d&&(this.cartoonSegments=[]);this.segments=[];c=0;for(l=this.partitions.length;c<l;c++){k=this.partitions[c];
var F;d&&(F=[]);n=0;for(u=k.count-1;n<u;n++){o=n;for(t=0;t<c;t++)o+=this.partitions[t].count-1;t=a[o];0<n&&(d&&t.split)&&(w=new f(this,void 0,F,c),t.helix&&(w.helix=!0),t.sheet&&(w.sheet=!0),this.cartoonSegments.push(w),F=[]);r=n*j*h;q=[];t=0;for(y=j-1;t<y;t++){z=r+t*h;for(w=0;w<h;w++)x=1,n===k.count-1?x=0:w===h-1&&(x=j*h-w),x=[z+w,z+h+w,z+h+w+x,z+w,z+w+x,z+h+w+x],w!==h-1&&(this.front?q.push(x[0],x[1],x[2],x[3],x[5],x[4]):q.push(x[0],x[2],x[1],x[3],x[4],x[5])),w===h-2&&n<k.count-1&&(A=j*h-w,x[2]+=
A,x[4]+=A,x[5]+=A),this.front?k.indexData.push(x[0],x[1],x[2],x[3],x[5],x[4]):k.indexData.push(x[0],x[2],x[1],x[3],x[4],x[5]),d&&(this.front?F.push(x[0],x[1],x[2],x[3],x[5],x[4]):F.push(x[0],x[2],x[1],x[3],x[4],x[5]))}this.segments.push(new f(this,a[o+1].name,q,c))}if(d){w=new f(this,void 0,F,c);o=k.count-1;for(t=0;t<c;t++)o+=this.partitions[t].count-1;t=a[o];t.helix&&(w.helix=!0);t.sheet&&(w.sheet=!0);this.cartoonSegments.push(w)}}this.storeData(this.partitions[0].positionData,this.partitions[0].normalData,
this.partitions[0].indexData);1===this.partitions.length&&(this.partitions=void 0)};(c.Ribbon.prototype=new c._Mesh).render=function(a,c){this.bindBuffers(a);var f=c.macro_colorByChain?this.chainColor:void 0;f||(f=this.front?c.proteins_primaryColor:c.proteins_secondaryColor);a.material.setDiffuseColor(f);a.drawElements(a.TRIANGLES,this.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0);if(this.partitions)for(var f=1,e=this.partitions.length;f<e;f++){var h=this.partitions[f];d(a,h);a.drawElements(a.TRIANGLES,
h.vertexIndexBuffer.numItems,a.UNSIGNED_SHORT,0)}}})(ChemDoodle.RESIDUE,ChemDoodle.structures.d3,Math,vec3);
(function(a,c,g){c.Light=function(c,f,d){this.diffuseRGB=a.getRGB(c,1);this.specularRGB=a.getRGB(f,1);this.direction=d};c.Light.prototype.lightScene=function(a){a.uniform3f(a.getUniformLocation(a.program,"u_light.diffuse_color"),this.diffuseRGB[0],this.diffuseRGB[1],this.diffuseRGB[2]);a.uniform3f(a.getUniformLocation(a.program,"u_light.specular_color"),this.specularRGB[0],this.specularRGB[1],this.specularRGB[2]);var c=g.create(this.direction);g.normalize(c);g.negate(c);a.uniform3f(a.getUniformLocation(a.program,
"u_light.direction"),c[0],c[1],c[2]);var d=[0,0,0],c=[d[0]+c[0],d[1]+c[1],d[2]+c[2]],d=g.length(c);0===d?c=[0,0,1]:g.scale(1/d);a.uniform3f(a.getUniformLocation(a.program,"u_light.half_vector"),c[0],c[1],c[2])}})(ChemDoodle.math,ChemDoodle.structures.d3,vec3);(function(a){a.Line=function(){this.storeData([0,0,0,0,1,0],[0,0,0,0,0,0])};a.Line.prototype=new a._Mesh})(ChemDoodle.structures.d3);
(function(a,c){c.Material=function(a){this.gl=a;this.aUL=a.getUniformLocation(a.program,"u_material.ambient_color");this.dUL=a.getUniformLocation(a.program,"u_material.diffuse_color");this.sUL=a.getUniformLocation(a.program,"u_material.specular_color");this.snUL=a.getUniformLocation(a.program,"u_material.shininess");this.alUL=a.getUniformLocation(a.program,"u_material.alpha")};var g=c.Material.prototype;g.setTempColors=function(c,f,d,g){if(!this.aCache||this.aCache!==c)this.aCache=c,c=a.getRGB(c,
1),this.gl.uniform3f(this.aUL,c[0],c[1],c[2]);if(f&&(!this.dCache||this.dCache!==f))this.dCache=f,c=a.getRGB(f,1),this.gl.uniform3f(this.dUL,c[0],c[1],c[2]);if(!this.sCache||this.sCache!==d)this.sCache=d,c=a.getRGB(d,1),this.gl.uniform3f(this.sUL,c[0],c[1],c[2]);if(!this.snCache||this.snCache!==g)this.snCache=g,this.gl.uniform1f(this.snUL,g);this.alCache=1;this.gl.uniform1f(this.alUL,1)};g.setDiffuseColor=function(c){if(!this.dCache||this.dCache!==c)this.dCache=c,c=a.getRGB(c,1),this.gl.uniform3f(this.dUL,
c[0],c[1],c[2])};g.setAlpha=function(a){if(!this.alCache||this.alCache!==a)this.alCache=a,this.gl.uniform1f(this.alUL,a)}})(ChemDoodle.math,ChemDoodle.structures.d3);
(function(a,c,g,e){c.MolecularSurface=function(c,d,n,b,m){function v(a,b,c,d){var f=a.index;if(a.contained)for(var f=-1,e=Infinity,h=0,k=b.length;h<k;h++)for(var j=b[h],m=0,g=j.length;m<g;m++){var n=j[m];if(!n.contained&&n.index!==c&&n.index!==d){var l=n.distance3D(a);l<e&&(f=n.index,e=l)}}return f}for(var j=[],h=[],k=[],p=[],u=0;u<=d;u++)for(var l=u*e.PI/d,t=e.sin(l),o=e.cos(l),l=0;l<=n;l++){var r=2*l*e.PI/n;p.push(e.cos(r)*t,o,e.sin(r)*t)}t=[];u=0;for(l=c.atoms.length;u<l;u++){for(var o=[],q=c.atoms[u],
w=g[q.label][m]+b,y=[],r=0,z=c.atoms.length;r<z;r++)if(r!==u){var x=c.atoms[r];x.index=r;q.distance3D(x)<w+g[x.label][m]+b&&y.push(x)}r=0;for(z=p.length;r<z;r+=3){for(var A=new a.Atom("C",q.x+w*p[r],q.y+w*p[r+1],q.z+w*p[r+2]),B=0,F=y.length;B<F;B++)if(x=y[B],A.distance3D(x)<g[x.label][m]+b){A.contained=!0;break}o.push(A)}t.push(o)}c=[];n++;for(u=0;u<d;u++)for(l=0;l<n;l++)m=u*n+l%n,b=m+n,c.push(m),c.push(b),c.push(m+1),l<n-1&&(c.push(b),c.push(b+1),c.push(m+1));u=B=0;for(l=t.length;u<l;u++){o=t[u];
r=0;for(z=o.length;r<z;r++)A=o[r],A.contained||(A.index=B,B++,j.push(A.x,A.y,A.z),h.push(p[3*r],p[3*r+1],p[3*r+2]));r=0;for(z=c.length;r<z;r+=3)m=o[c[r]],b=o[c[r+1]],A=o[c[r+2]],!m.contained&&(!b.contained&&!A.contained)&&k.push(m.index,b.index,A.index)}p=[];u=0;for(l=t.length;u<l;u++){o=t[u];r=0;for(z=c.length;r<z;r+=3){m=o[c[r]];b=o[c[r+1]];A=o[c[r+2]];y=[];B=0;for(F=t.length;B<F;B++)B!==u&&y.push(t[B]);if((!m.contained||!b.contained||!A.contained)&&(m.contained||b.contained||A.contained))if(d=
v(m,y,-1,-1),n=v(b,y,d,-1),y=v(A,y,d,n),-1!==d&&-1!==n&&-1!==y){b=!1;B=0;for(F=p.length;B<F;B+=3)if(m=p[B],A=p[B+1],q=p[B+2],w=n===m||n===A||n===q,x=y===m||y===A||y===q,(d===m||d===A||d===q)&&w&&x){b=!0;break}b||p.push(d,n,y)}}}k=k.concat(p);this.storeData(j,h,k)};c.MolecularSurface.prototype=new c._Mesh})(ChemDoodle.structures,ChemDoodle.structures.d3,ChemDoodle.ELEMENT,Math);
(function(a){a.Picker=function(){};a=a.Picker.prototype;a.init=function(a){this.framebuffer=a.createFramebuffer();var g=a.createTexture(),e=a.createRenderbuffer();a.bindTexture(a.TEXTURE_2D,g);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);a.bindRenderbuffer(a.RENDERBUFFER,e);a.bindFramebuffer(a.FRAMEBUFFER,
this.framebuffer);a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,g,0);a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,e);a.bindTexture(a.TEXTURE_2D,null);a.bindRenderbuffer(a.RENDERBUFFER,null);a.bindFramebuffer(a.FRAMEBUFFER,null)};a.setDimension=function(a,g,e){a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer);var f=a.getFramebufferAttachmentParameter(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);a.isRenderbuffer(f)&&(a.bindRenderbuffer(a.RENDERBUFFER,
f),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT16,g,e),a.bindRenderbuffer(a.RENDERBUFFER,null));f=a.getFramebufferAttachmentParameter(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);a.isTexture(f)&&(a.bindTexture(a.TEXTURE_2D,f),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,g,e,0,a.RGBA,a.UNSIGNED_BYTE,null),a.bindTexture(a.TEXTURE_2D,null));a.bindFramebuffer(a.FRAMEBUFFER,null)};a.pick=function(a,g,e,f,d){var n=void 0,b=a.getParameter(a.COLOR_CLEAR_VALUE);a.bindFramebuffer(a.FRAMEBUFFER,
this.framebuffer);a.clearColor(1,1,1,0);a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT);a.fogging.setMode(0);a.disableVertexAttribArray(a.shader.vertexNormalAttribute);var m=[];a.material.setAlpha(255);for(var v=0,j=g.length;v<j;v++)g[v].renderPickFrame(a,e,m);a.flush();g=new Uint8Array(4);a.readPixels(f-2,d+2,1,1,a.RGBA,a.UNSIGNED_BYTE,g);0<g[3]&&(n=m[g[2]|g[1]<<8|g[0]<<16]);a.enableVertexAttribArray(a.shader.vertexNormalAttribute);a.fogging.setMode(e.fog_mode_3D);a.bindFramebuffer(a.FRAMEBUFFER,
null);a.clearColor(b[0],b[1],b[2],b[3]);return n}})(ChemDoodle.structures.d3,document);
(function(a,c){a.Pill=function(a,e,f,d){var n=1,b=2*a;e-=b;0>e?(n=0,e+=b):e<b&&(n=e/b,e=b);for(var b=[],m=[],v=0;v<=f;v++)for(var j=v*c.PI/f,h=c.sin(j),k=c.cos(j)*n,j=0;j<=d;j++){var p=2*j*c.PI/d,u=c.sin(p),p=c.cos(p)*h,l=k,u=u*h;m.push(p,l,u);b.push(a*p,a*l+(v<f/2?e:0),a*u)}a=[];d+=1;for(v=0;v<f;v++)for(j=0;j<d;j++)e=v*d+j%d,n=e+d,a.push(e,e+1,n),j<d-1&&a.push(n,e+1,n+1);this.storeData(b,m,a)};a.Pill.prototype=new a._Mesh})(ChemDoodle.structures.d3,Math);
(function(a,c){a.Shader=function(){};var g=a.Shader.prototype;g.init=function(a){var c=this.getShader(a,"vertex-shader");c||(c=this.loadDefaultVertexShader(a));var d=this.getShader(a,"fragment-shader");d||(d=this.loadDefaultFragmentShader(a));a.attachShader(a.program,c);a.attachShader(a.program,d);this.vertexPositionAttribute=0;a.bindAttribLocation(a.program,this.vertexPositionAttribute,"a_vertex_position");a.linkProgram(a.program);a.getProgramParameter(a.program,a.LINK_STATUS)||alert("Could not initialize shaders: "+
a.getProgramInfoLog(a.program));a.useProgram(a.program);a.enableVertexAttribArray(this.vertexPositionAttribute);this.vertexNormalAttribute=a.getAttribLocation(a.program,"a_vertex_normal");a.enableVertexAttribArray(this.vertexNormalAttribute)};g.getShader=function(a,f){var d=c.getElementById(f);if(d){for(var n=[],b=d.firstChild;b;)3===b.nodeType&&n.push(b.textContent),b=b.nextSibling;if("x-shader/x-fragment"===d.type)b=a.createShader(a.FRAGMENT_SHADER);else if("x-shader/x-vertex"===d.type)b=a.createShader(a.VERTEX_SHADER);
else return;a.shaderSource(b,n.join(""));a.compileShader(b);if(a.getShaderParameter(b,a.COMPILE_STATUS))return b;alert(d.type+" "+a.getShaderInfoLog(b))}};g.loadDefaultVertexShader=function(a){var c=a.createShader(a.VERTEX_SHADER);a.shaderSource(c,"precision mediump float;struct Light{vec3 diffuse_color;vec3 specular_color;vec3 direction;vec3 half_vector;};struct Material{vec3 ambient_color;vec3 diffuse_color;vec3 specular_color;float shininess;float alpha;};attribute vec3 a_vertex_position;attribute vec3 a_vertex_normal;uniform Light u_light;uniform Material u_material;uniform mat4 u_model_view_matrix;uniform mat4 u_projection_matrix;uniform mat3 u_normal_matrix;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main(void){v_normal \x3d length(a_vertex_normal)\x3d\x3d0.0 ? a_vertex_normal : normalize(u_normal_matrix * a_vertex_normal);v_ambient \x3d vec4(u_material.ambient_color, 1.0);v_diffuse \x3d u_material.diffuse_color * u_light.diffuse_color;gl_Position \x3d u_projection_matrix * u_model_view_matrix * vec4(a_vertex_position, 1.0);gl_Position /\x3d gl_Position.w;gl_PointSize \x3d 2.0;}");
a.compileShader(c);if(a.getShaderParameter(c,a.COMPILE_STATUS))return c;alert("Vertex shader failed to compile: "+a.getShaderInfoLog(c))};g.loadDefaultFragmentShader=function(a){var c=a.createShader(a.FRAGMENT_SHADER);a.shaderSource(c,"precision mediump float;\nstruct Light{vec3 diffuse_color;vec3 specular_color;vec3 direction;vec3 half_vector;};struct Material{vec3 ambient_color;vec3 diffuse_color;vec3 specular_color;float shininess;float alpha;};struct Fog{int mode;vec3 color;float density;float start;float end;};uniform Light u_light;uniform Material u_material;uniform Fog u_fog;varying vec3 v_diffuse;varying vec4 v_ambient;varying vec3 v_normal;void main(void){if(length(v_normal)\x3d\x3d0.0){gl_FragColor \x3d vec4(vec3(v_diffuse.rgb),u_material.alpha);}else{float nDotL \x3d max(dot(v_normal, u_light.direction), 0.0);vec4 color \x3d vec4(v_diffuse*nDotL, 1.0);float nDotHV \x3d max(dot(v_normal, u_light.half_vector), 0.0);vec3 specular \x3d u_material.specular_color * u_light.specular_color;color+\x3dvec4(specular * pow(nDotHV, u_material.shininess), 1.0);gl_FragColor \x3d color+v_ambient;gl_FragColor.a*\x3du_material.alpha;float fogCoord \x3d gl_FragCoord.z/gl_FragCoord.w;float fogFactor \x3d 1.;if(u_fog.mode \x3d\x3d 1){if(fogCoord \x3c u_fog.start){fogFactor \x3d 1.;}else if(fogCoord \x3e u_fog.end){fogFactor \x3d 0.;}else{fogFactor \x3d clamp((u_fog.end - fogCoord) / (u_fog.end - u_fog.start), 0.0, 1.0);}}else if(u_fog.mode \x3d\x3d 2) {fogFactor \x3d clamp(exp(-u_fog.density*fogCoord), 0.0, 1.0);}else if(u_fog.mode \x3d\x3d 3) {fogFactor \x3d clamp(exp(-pow(u_fog.density*fogCoord, 2.0)), 0.0, 1.0);}gl_FragColor \x3d mix(vec4(vec3(u_fog.color), 1.), gl_FragColor, fogFactor);}}");
a.compileShader(c);if(a.getShaderParameter(c,a.COMPILE_STATUS))return c;alert("Fragment shader failed to compile: "+a.getShaderInfoLog(c))}})(ChemDoodle.structures.d3,document);
(function(a,c,g){c.Shape=function(c,f){for(var d=c.length,n=[],b=[],m=new a.Point,v=0,j=d;v<j;v++){var h=v+1;v===j-1&&(h=0);for(var k=c[v],h=c[h],p=g.cross([0,0,1],[h.x-k.x,h.y-k.y,0]),u=0;2>u;u++)n.push(k.x,k.y,f/2),n.push(k.x,k.y,-f/2),n.push(h.x,h.y,f/2),n.push(h.x,h.y,-f/2);for(u=0;4>u;u++)b.push(p[0],p[1],p[2]);b.push(0,0,1);b.push(0,0,-1);b.push(0,0,1);b.push(0,0,-1);m.add(k)}m.x/=d;m.y/=d;b.push(0,0,1);n.push(m.x,m.y,f/2);b.push(0,0,-1);n.push(m.x,m.y,-f/2);m=[];k=8*d;v=0;for(j=d;v<j;v++)d=
8*v,m.push(d),m.push(d+3),m.push(d+1),m.push(d),m.push(d+2),m.push(d+3),m.push(d+4),m.push(k),m.push(d+6),m.push(d+5),m.push(d+7),m.push(k+1);this.storeData(n,b,m)};c.Shape.prototype=new c._Mesh})(ChemDoodle.structures,ChemDoodle.structures.d3,vec3);
(function(a,c,g){a.Star=function(){for(var a=[0.8944,0.4472,0,0.2764,0.4472,0.8506,0.2764,0.4472,-0.8506,-0.7236,0.4472,0.5257,-0.7236,0.4472,-0.5257,-0.3416,0.4472,0,-0.1056,0.4472,0.3249,-0.1056,0.4472,-0.3249,0.2764,0.4472,0.2008,0.2764,0.4472,-0.2008,-0.8944,-0.4472,0,-0.2764,-0.4472,0.8506,-0.2764,-0.4472,-0.8506,0.7236,-0.4472,0.5257,0.7236,-0.4472,-0.5257,0.3416,-0.4472,0,0.1056,-0.4472,0.3249,0.1056,-0.4472,-0.3249,-0.2764,-0.4472,0.2008,-0.2764,-0.4472,-0.2008,-0.5527,0.1058,0,-0.1708,0.1058,
0.5527,-0.1708,0.1058,-0.5527,0.4471,0.1058,0.3249,0.4471,0.1058,-0.3249,0.5527,-0.1058,0,0.1708,-0.1058,0.5527,0.1708,-0.1058,-0.5527,-0.4471,-0.1058,0.3249,-0.4471,-0.1058,-0.3249,0,1,0,0,-1,0],c=[0,9,8,2,7,9,4,5,7,3,6,5,1,8,6,0,8,23,30,6,8,3,21,6,11,26,21,13,23,26,2,9,24,30,8,9,1,23,8,13,25,23,14,24,25,4,7,22,30,9,7,0,24,9,14,27,24,12,22,27,3,5,20,30,7,5,2,22,7,12,29,22,10,20,29,1,6,21,30,5,6,4,20,5,10,28,20,11,21,28,10,19,18,12,17,19,14,15,17,13,16,15,11,18,16,31,19,17,14,17,27,2,27,22,4,22,29,
10,29,19,31,18,19,12,19,29,4,29,20,3,20,28,11,28,18,31,16,18,10,18,28,3,28,21,1,21,26,13,26,16,31,15,16,11,16,26,1,26,23,0,23,25,14,25,15,31,17,15,13,15,25,0,25,24,2,24,27,12,27,17],d=[],n=[],b=[],m=0,v=c.length;m<v;m+=3){var j=3*c[m],h=3*c[m+1],k=3*c[m+2],j=[a[j],a[j+1],a[j+2]],h=[a[h],a[h+1],a[h+2]],k=[a[k],a[k+1],a[k+2]],p=g.cross([k[0]-h[0],k[1]-h[1],k[2]-h[2]],[j[0]-h[0],j[1]-h[1],j[2]-h[2]],[]);g.normalize(p);d.push(j[0],j[1],j[2],h[0],h[1],h[2],k[0],k[1],k[2]);n.push(p[0],p[1],p[2],p[0],p[1],
p[2],p[0],p[1],p[2]);b.push(m,m+1,m+2)}this.storeData(d,n,b)};a.Star.prototype=new a._Mesh})(ChemDoodle.structures.d3,Math,vec3);
(function(a,c,g){a.TextImage=function(){this.ctx=g.createElement("canvas").getContext("2d");this.data=[];this.text="";this.charHeight=0};a=a.TextImage.prototype;a.init=function(a){this.textureImage=a.createTexture();a.bindTexture(a.TEXTURE_2D,this.textureImage);a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST);a.texParameteri(a.TEXTURE_2D,
a.TEXTURE_MAG_FILTER,a.NEAREST);a.bindTexture(a.TEXTURE_2D,null);this.updateFont(a,12,["Sans-serif"],!1,!1,!1)};a.charData=function(a){a=this.text.indexOf(a);return 0<=a?this.data[a]:null};a.updateFont=function(a,f,d,n,b,m){var g=this.ctx,j=this.ctx.canvas,h=[],k="",p=c.getFontString(f,d,n,b);g.font=p;g.save();b=0;f*=1.5;d=32;for(n=127;d<n;d++){var u=String.fromCharCode(d),l=g.measureText(u).width;h.push({text:u,width:l,height:f});b+=2*l}d=Math.sqrt(b*f);d=Math.ceil(d/f);b=Math.ceil(b/(d-1));j.width=
b;j.height=d*f;g.font=p;g.textAlign="left";g.textBaseline="middle";g.strokeStyle="#000";g.lineWidth=1.4;g.fillStyle="#fff";d=u=p=0;for(n=h.length;d<n;d++){var l=h[d],t=2*l.width;f=l.height;var o=l.text;u+t>b&&(p++,u=0);var r=p*f;m&&g.strokeText(o,u,r+f/2);g.fillText(o,u,r+f/2);l.x=u;l.y=r;k+=o;u+=t}this.text=k;this.data=h;this.charHeight=f;a.bindTexture(a.TEXTURE_2D,this.textureImage);a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,j);a.bindTexture(a.TEXTURE_2D,null)};a.pushVertexData=function(a,
c,d,g){var b=a.toString().split(""),m=this.getHeight(),v=this.getWidth();a=-this.textWidth(a)/2;for(var j=-this.charHeight/2,h=0,k=b.length;h<k;h++){var p=this.charData(b[h]),u=p.width,l=p.x/v,t=l+1.8*p.width/v,o=p.y/m,p=o+p.height/m,r=a+1.8*u,q=this.charHeight/2;g.position.push(c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2]);g.texCoord.push(l,o,t,p,t,o,l,o,l,p,t,p);g.translation.push(a,q,r,j,r,q,a,q,a,j,r,j);g.zDepth.push(d,d,d,d,d,d);a=r+u-1.8*u}};a.getCanvas=
function(){return this.ctx.canvas};a.getHeight=function(){return this.getCanvas().height};a.getWidth=function(){return this.getCanvas().width};a.textWidth=function(a){return this.ctx.measureText(a).width};a.test=function(){g.body.appendChild(this.getCanvas())};a.useTexture=function(a){a.bindTexture(a.TEXTURE_2D,this.textureImage)}})(ChemDoodle.structures.d3,ChemDoodle.extensions,document);
(function(a){a.TextMesh=function(){};a=a.TextMesh.prototype;a.init=function(a){this.vertexPositionBuffer=a.createBuffer();this.vertexTexCoordBuffer=a.createBuffer();this.vertexTranslationBuffer=a.createBuffer();this.vertexZDepthBuffer=a.createBuffer()};a.setVertexData=function(a,g,e,f){a.bindBuffer(a.ARRAY_BUFFER,g);a.bufferData(a.ARRAY_BUFFER,new Float32Array(e),a.STATIC_DRAW);g.itemSize=f;g.numItems=e.length/f};a.storeData=function(a,g,e,f,d){this.setVertexData(a,this.vertexPositionBuffer,g,3);
this.setVertexData(a,this.vertexTexCoordBuffer,e,2);this.setVertexData(a,this.vertexTranslationBuffer,f,2);this.setVertexData(a,this.vertexZDepthBuffer,d,1)};a.bindBuffers=function(a){var g=a.shaderText;a.bindBuffer(a.ARRAY_BUFFER,this.vertexPositionBuffer);a.vertexAttribPointer(g.vertexPositionAttribute,this.vertexPositionBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,this.vertexTexCoordBuffer);a.vertexAttribPointer(g.vertexTexCoordAttribute,this.vertexTexCoordBuffer.itemSize,a.FLOAT,
!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,this.vertexTranslationBuffer);a.vertexAttribPointer(g.vertexTranslationAttribute,this.vertexTranslationBuffer.itemSize,a.FLOAT,!1,0,0);a.bindBuffer(a.ARRAY_BUFFER,this.vertexZDepthBuffer);a.vertexAttribPointer(g.vertexZDepthAttribute,this.vertexZDepthBuffer.itemSize,a.FLOAT,!1,0,0)};a.render=function(a){var g=this.vertexPositionBuffer.numItems;g&&(this.bindBuffers(a),a.drawArrays(a.TRIANGLES,0,g))}})(ChemDoodle.structures.d3,Math);
(function(a){a.TextShader=function(){};a=a.TextShader.prototype=new a.Shader;a.init=function(a){a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);var g=this.loadDefaultVertexShader(a),e=this.loadDefaultFragmentShader(a);a.attachShader(a.programLabel,g);a.attachShader(a.programLabel,e);a.linkProgram(a.programLabel);a.getProgramParameter(a.programLabel,a.LINK_STATUS)||alert("Could not initialize shaders: "+a.getProgramInfoLog(a.programLabel));this.vertexPositionAttribute=
a.getAttribLocation(a.programLabel,"a_vertex_position");this.vertexTexCoordAttribute=a.getAttribLocation(a.programLabel,"a_vertex_texcoord");this.vertexTranslationAttribute=a.getAttribLocation(a.programLabel,"a_translation");this.vertexZDepthAttribute=a.getAttribLocation(a.programLabel,"a_z_depth");this.modelViewMatrixUniform=a.getUniformLocation(a.programLabel,"u_model_view_matrix");this.projectionMatrixUniform=a.getUniformLocation(a.programLabel,"u_projection_matrix");this.dimensionUniform=a.getUniformLocation(a.programLabel,
"u_dimension")};a.loadDefaultVertexShader=function(a){var g=a.createShader(a.VERTEX_SHADER);a.shaderSource(g,"precision mediump float;attribute vec3 a_vertex_position;attribute vec2 a_vertex_texcoord;attribute vec2 a_translation;attribute float a_z_depth;uniform mat4 u_model_view_matrix;uniform mat4 u_projection_matrix;uniform vec2 u_dimension;varying vec2 v_texcoord;void main() {gl_Position \x3d u_model_view_matrix * vec4(a_vertex_position, 1.0);vec4 depth_pos \x3d vec4(gl_Position);depth_pos.z +\x3d a_z_depth;gl_Position \x3d u_projection_matrix * gl_Position;depth_pos \x3d u_projection_matrix * depth_pos;gl_Position /\x3d gl_Position.w;gl_Position.xy +\x3d a_translation / u_dimension * 2.0;gl_Position.z \x3d depth_pos.z / depth_pos.w;v_texcoord \x3d a_vertex_texcoord;}");
a.compileShader(g);if(a.getShaderParameter(g,a.COMPILE_STATUS))return g;alert("Vertex shader failed to compile: "+a.getShaderInfoLog(g))};a.loadDefaultFragmentShader=function(a){var g=a.createShader(a.FRAGMENT_SHADER);a.shaderSource(g,"precision mediump float;uniform sampler2D u_image;varying vec2 v_texcoord;void main() {gl_FragColor \x3d texture2D(u_image, v_texcoord);}");a.compileShader(g);if(a.getShaderParameter(g,a.COMPILE_STATUS))return g;alert("Fragment shader failed to compile: "+a.getShaderInfoLog(g))};
a.setUniforms=function(a,g,e){a.uniformMatrix4fv(this.modelViewMatrixUniform,!1,g);a.uniformMatrix4fv(this.projectionMatrixUniform,!1,e);a.uniform2f(this.dimensionUniform,a.canvas.clientWidth,a.canvas.clientHeight)}})(ChemDoodle.structures.d3);
(function(a,c,g,e,f,d,n){var b=function(a,b,c){var h=f.sqrt(b[1]*b[1]+b[2]*b[2]),e=[1,0,0,0,0,b[2]/h,-b[1]/h,0,0,b[1]/h,b[2]/h,0,0,0,0,1],g=[1,0,0,0,0,b[2]/h,b[1]/h,0,0,-b[1]/h,b[2]/h,0,0,0,0,1],n=[h,0,-b[0],0,0,1,0,0,b[0],0,h,0,0,0,0,1];b=[h,0,b[0],0,0,1,0,0,-b[0],0,h,0,0,0,0,1];c=[f.cos(c),-f.sin(c),0,0,f.sin(c),f.cos(c),0,0,0,0,1,0,0,0,0,1];var l=d.multiply(e,d.multiply(n,d.multiply(c,d.multiply(b,g,[]))));this.rotate=function(){return d.multiplyVec3(l,a)}};e.Tube=function(e,v,j){var h=e[0].lineSegments[0].length;
this.partitions=[];var k;this.ends=[];this.ends.push(e[0].lineSegments[0][0]);this.ends.push(e[e.length-2].lineSegments[0][0]);for(var p=[1,0,0],u=0,l=e.length-1;u<l;u++){if(!k||65E3<k.positionData.length)0<this.partitions.length&&u--,k={count:0,positionData:[],normalData:[],indexData:[]},this.partitions.push(k);var t=e[u];k.count++;for(var o=Infinity,r=new g.Atom("",e[u+1].cp1.x,e[u+1].cp1.y,e[u+1].cp1.z),q=0;q<h;q++){var w=t.lineSegments[0][q],y;y=q===h-1?u===e.length-2?t.lineSegments[0][q-1]:e[u+
1].lineSegments[0][0]:t.lineSegments[0][q+1];y=[y.x-w.x,y.y-w.y,y.z-w.z];n.normalize(y);u===e.length-2&&q===h-1&&n.scale(y,-1);var z=vec3.cross(y,p,[]);n.normalize(z);n.scale(z,v/2);z=new b(z,y,2*Math.PI/j);y=0;for(var x=j;y<x;y++){var A=z.rotate();y===f.floor(j/4)&&(p=[A[0],A[1],A[2]]);k.normalData.push(A[0],A[1],A[2]);k.positionData.push(w.x+A[0],w.y+A[1],w.z+A[2])}r&&(y=w.distance3D(r),y<o&&(o=y,e[u+1].pPoint=w))}}p=0;for(t=this.partitions.length;p<t;p++){k=this.partitions[p];u=0;for(l=k.count-
1;u<l;u++){o=u*h*j;q=0;for(r=h;q<r;q++){w=o+q*j;for(y=0;y<j;y++)z=w+y,k.indexData.push(z),k.indexData.push(z+j),k.indexData.push(z+j+1),k.indexData.push(z),k.indexData.push(z+j+1),k.indexData.push(z+1)}}}this.storeData(this.partitions[0].positionData,this.partitions[0].normalData,this.partitions[0].indexData);j=[new g.Point(2,0)];for(u=0;60>u;u++)h=u/60*f.PI,j.push(new g.Point(2*f.cos(h),-2*f.sin(h)));j.push(new g.Point(-2,0),new g.Point(-2,4),new g.Point(2,4));var B=new g.d3.Shape(j,1);this.render=
function(b,h){this.bindBuffers(b);b.material.setDiffuseColor(h.macro_colorByChain?this.chainColor:h.nucleics_tubeColor);b.drawElements(b.TRIANGLES,this.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0);if(this.partitions)for(var k=1,j=this.partitions.length;k<j;k++){var l=this.partitions[k],p=b,o=l;p.bindBuffer(p.ARRAY_BUFFER,o.vertexPositionBuffer);p.vertexAttribPointer(p.shader.vertexPositionAttribute,o.vertexPositionBuffer.itemSize,p.FLOAT,!1,0,0);p.bindBuffer(p.ARRAY_BUFFER,o.vertexNormalBuffer);
p.vertexAttribPointer(p.shader.vertexNormalAttribute,o.vertexNormalBuffer.itemSize,p.FLOAT,!1,0,0);p.bindBuffer(p.ELEMENT_ARRAY_BUFFER,o.vertexIndexBuffer);b.drawElements(b.TRIANGLES,l.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0)}b.sphereBuffer.bindBuffers(b);for(k=0;2>k;k++)l=this.ends[k],l=d.translate(b.modelViewMatrix,[l.x,l.y,l.z],[]),j=v/2,d.scale(l,[j,j,j]),b.setMatrixUniforms(l),b.drawElements(b.TRIANGLES,b.sphereBuffer.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0);b.cylinderBuffer.bindBuffers(b);
k=1;for(j=e.length-1;k<j;k++){var o=e[k],t=o.pPoint,r=new g.Atom("",o.cp2.x,o.cp2.y,o.cp2.z),l=1.001*t.distance3D(r),o=[v/4,l,v/4],l=d.translate(b.modelViewMatrix,[t.x,t.y,t.z],[]),u=[0,1,0],q=0,p=[r.x-t.x,r.y-t.y,r.z-t.z];t.x===r.x&&t.z===r.z?(u=[0,0,1],t.y<t.y&&(q=f.PI)):(q=a.vec3AngleFrom(u,p),u=n.cross(u,p,[]));0!==q&&d.rotate(l,q,u);d.scale(l,o);b.setMatrixUniforms(l);b.drawArrays(b.TRIANGLE_STRIP,0,b.cylinderBuffer.vertexPositionBuffer.numItems)}B.bindBuffers(b);!h.nucleics_useShapelyColors&&
!h.macro_colorByChain&&b.material.setDiffuseColor(h.nucleics_baseColor);k=1;for(j=e.length-1;k<j;k++)o=e[k],r=o.cp2,l=d.translate(b.modelViewMatrix,[r.x,r.y,r.z],[]),u=[0,1,0],q=0,t=o.cp3,p=[t.x-r.x,t.y-r.y,t.z-r.z],r.x===t.x&&r.z===t.z?(u=[0,0,1],r.y<r.y&&(q=f.PI)):(q=a.vec3AngleFrom(u,p),u=n.cross(u,p,[])),0!==q&&d.rotate(l,q,u),r=[1,0,0],q=d.rotate(d.identity([]),q,u),d.multiplyVec3(q,r),q=o.cp4,t=o.cp5,q.y===t.y&&q.z===t.z||(q=[t.x-q.x,t.y-q.y,t.z-q.z],t=a.vec3AngleFrom(r,q),0>n.dot(p,n.cross(r,
q))&&(t*=-1),d.rotateY(l,t)),h.nucleics_useShapelyColors&&!h.macro_colorByChain&&(c[o.name]?b.material.setDiffuseColor(c[o.name].shapelyColor):b.material.setDiffuseColor(c["*"].shapelyColor)),b.setMatrixUniforms(l),b.drawElements(b.TRIANGLES,B.vertexIndexBuffer.numItems,b.UNSIGNED_SHORT,0)}};e.Tube.prototype=new e._Mesh})(ChemDoodle.extensions,ChemDoodle.RESIDUE,ChemDoodle.structures,ChemDoodle.structures.d3,Math,mat4,vec3);
(function(a){a.UnitCell=function(a){var g=[],e=[],f=function(a,b,c,d){g.push(a[0],a[1],a[2]);g.push(b[0],b[1],b[2]);g.push(c[0],c[1],c[2]);g.push(d[0],d[1],d[2]);for(a=0;4>a;a++)e.push(0,0,0)};f(a.o,a.x,a.xy,a.y);f(a.o,a.y,a.yz,a.z);f(a.o,a.z,a.xz,a.x);f(a.yz,a.y,a.xy,a.xyz);f(a.xyz,a.xz,a.z,a.yz);f(a.xy,a.x,a.xz,a.xyz);a=[];for(f=0;6>f;f++){var d=4*f;a.push(d,d+1,d+1,d+2,d+2,d+3,d+3,d)}this.storeData(g,e,a)};a.UnitCell.prototype=new a._Mesh})(ChemDoodle.structures.d3,vec3);
(function(a,c,g){a.Plate=function(a){this.lanes=Array(a);i=0;for(ii=a;i<ii;i++)this.lanes[i]=[]};var e=a.Plate.prototype;e.sort=function(){i=0;for(ii=this.lanes.length;i<ii;i++)this.lanes[i].sort(function(a,c){return a-c})};e.draw=function(a){var d=a.canvas.width,e=a.canvas.height;this.origin=9*e/10;this.front=e/10;this.laneLength=this.origin-this.front;a.strokeStyle="#000000";a.beginPath();a.moveTo(0,this.front);c.contextHashTo(a,0,this.front,d,this.front,3,3);a.closePath();a.stroke();a.beginPath();
a.moveTo(0,this.origin);a.lineTo(d,this.origin);a.closePath();a.stroke();i=0;for(ii=this.lanes.length;i<ii;i++){e=(i+1)*d/(ii+1);a.beginPath();a.moveTo(e,this.origin);a.lineTo(e,this.origin+3);a.closePath();a.stroke();s=0;for(ss=this.lanes[i].length;s<ss;s++){var b=this.origin-this.laneLength*this.lanes[i][s].rf;switch(this.lanes[i][s].type){case "compact":a.beginPath();a.arc(e,b,3,0,2*g.PI,!1);a.closePath();break;case "expanded":a.beginPath();a.arc(e,b,7,0,2*g.PI,!1);a.closePath();break;case "widened":c.contextOval(a,
e-18,b-10,36,10);break;case "cresent":a.beginPath(),a.arc(e,b,9,0,g.PI,!0),a.closePath()}switch(this.lanes[i][s].style){case "solid":a.fillStyle="#000000";a.fill();break;case "transparent":a.stroke()}}}};a.Plate.Spot=function(a,c,e){this.type=a;this.rf=c;this.style=e?e:"solid"}})(ChemDoodle.structures,ChemDoodle.extensions,Math);
(function(a,c,g){a.default_backgroundColor="#FFFFFF";a.default_scale=1;a.default_rotateAngle=0;a.default_bondLength_2D=20;a.default_angstromsPerBondLength=1.25;a.default_lightDirection_3D=[-0.1,-0.1,-1];a.default_lightDiffuseColor_3D="#FFFFFF";a.default_lightSpecularColor_3D="#FFFFFF";a.default_projectionPerspective_3D=!0;a.default_projectionPerspectiveVerticalFieldOfView_3D=45;a.default_projectionOrthoWidth_3D=40;a.default_projectionWidthHeightRatio_3D=void 0;a.default_projectionFrontCulling_3D=
0.1;a.default_projectionBackCulling_3D=1E4;a.default_cullBackFace_3D=!0;a.default_fog_mode_3D=0;a.default_fog_color_3D="#000000";a.default_fog_start_3D=0;a.default_fog_end_3D=1;a.default_fog_density_3D=1;a.default_atoms_display=!0;a.default_atoms_color="#000000";a.default_atoms_font_size_2D=12;a.default_atoms_font_families_2D=["Helvetica","Arial","Dialog"];a.default_atoms_font_bold_2D=!1;a.default_atoms_font_italic_2D=!1;a.default_atoms_circles_2D=!1;a.default_atoms_circleDiameter_2D=10;a.default_atoms_circleBorderWidth_2D=
1;a.default_atoms_lonePairDistance_2D=8;a.default_atoms_lonePairSpread_2D=4;a.default_atoms_lonePairDiameter_2D=1;a.default_atoms_useJMOLColors=!1;a.default_atoms_usePYMOLColors=!1;a.default_atoms_resolution_3D=60;a.default_atoms_sphereDiameter_3D=0.8;a.default_atoms_useVDWDiameters_3D=!1;a.default_atoms_vdwMultiplier_3D=1;a.default_atoms_materialAmbientColor_3D="#000000";a.default_atoms_materialSpecularColor_3D="#555555";a.default_atoms_materialShininess_3D=32;a.default_atoms_implicitHydrogens_2D=
!0;a.default_atoms_displayTerminalCarbonLabels_2D=!1;a.default_atoms_showHiddenCarbons_2D=!0;a.default_atoms_showAttributedCarbons_2D=!0;a.default_atoms_displayAllCarbonLabels_2D=!1;a.default_atoms_nonBondedAsStars_3D=!1;a.default_atoms_displayLabels_3D=!1;a.default_bonds_display=!0;a.default_bonds_color="#000000";a.default_bonds_width_2D=1;a.default_bonds_saturationWidth_2D=0.2;a.default_bonds_ends_2D="round";a.default_bonds_useJMOLColors=!1;a.default_bonds_usePYMOLColors=!1;a.default_bonds_colorGradient=
!1;a.default_bonds_saturationAngle_2D=g.PI/3;a.default_bonds_symmetrical_2D=!1;a.default_bonds_clearOverlaps_2D=!1;a.default_bonds_overlapClearWidth_2D=0.5;a.default_bonds_atomLabelBuffer_2D=1;a.default_bonds_wedgeThickness_2D=0.22;a.default_bonds_hashWidth_2D=1;a.default_bonds_hashSpacing_2D=2.5;a.default_bonds_dotSize_2D=2;a.default_bonds_showBondOrders_3D=!1;a.default_bonds_resolution_3D=60;a.default_bonds_renderAsLines_3D=!1;a.default_bonds_cylinderDiameter_3D=0.3;a.default_bonds_pillLatitudeResolution_3D=
10;a.default_bonds_pillLongitudeResolution_3D=20;a.default_bonds_pillHeight_3D=0.3;a.default_bonds_pillSpacing_3D=0.1;a.default_bonds_pillDiameter_3D=0.3;a.default_bonds_materialAmbientColor_3D="#222222";a.default_bonds_materialSpecularColor_3D="#555555";a.default_bonds_materialShininess_3D=32;a.default_proteins_displayRibbon=!0;a.default_proteins_displayBackbone=!1;a.default_proteins_backboneThickness=1.5;a.default_proteins_backboneColor="#CCCCCC";a.default_proteins_ribbonCartoonize=!1;a.default_proteins_useShapelyColors=
!1;a.default_proteins_useAminoColors=!1;a.default_proteins_usePolarityColors=!1;a.default_proteins_primaryColor="#FF0D0D";a.default_proteins_secondaryColor="#FFFF30";a.default_proteins_ribbonCartoonHelixPrimaryColor="#00E740";a.default_proteins_ribbonCartoonHelixSecondaryColor="#9905FF";a.default_proteins_ribbonCartoonSheetColor="#E8BB99";a.default_proteins_ribbonThickness=0.2;a.default_proteins_verticalResolution=10;a.default_proteins_horizontalResolution=9;a.default_proteins_materialAmbientColor_3D=
"#222222";a.default_proteins_materialSpecularColor_3D="#555555";a.default_proteins_materialShininess_3D=32;a.default_nucleics_display=!0;a.default_nucleics_tubeColor="#CCCCCC";a.default_nucleics_baseColor="#C10000";a.default_nucleics_useShapelyColors=!0;a.default_nucleics_tubeThickness=1.5;a.default_nucleics_tubeResolution_3D=60;a.default_nucleics_verticalResolution=10;a.default_nucleics_materialAmbientColor_3D="#222222";a.default_nucleics_materialSpecularColor_3D="#555555";a.default_nucleics_materialShininess_3D=
32;a.default_macro_displayAtoms=!1;a.default_macro_displayBonds=!1;a.default_macro_atomToLigandDistance=-1;a.default_macro_showWater=!1;a.default_macro_colorByChain=!1;a.default_surfaces_display=!0;a.default_surfaces_style="Dot";a.default_surfaces_color="#E9B862";a.default_surfaces_materialAmbientColor_3D="#000000";a.default_surfaces_materialSpecularColor_3D="#000000";a.default_surfaces_materialShininess_3D=32;a.default_crystals_displayUnitCell=!0;a.default_crystals_unitCellColor="green";a.default_crystals_unitCellLineWidth=
1;a.default_plots_color="#000000";a.default_plots_width=1;a.default_plots_showIntegration=!1;a.default_plots_integrationColor="#c10000";a.default_plots_integrationLineWidth=1;a.default_plots_showGrid=!1;a.default_plots_gridColor="gray";a.default_plots_gridLineWidth=0.5;a.default_plots_showYAxis=!0;a.default_plots_flipXAxis=!1;a.default_text_font_size=12;a.default_text_font_families=["Helvetica","Arial","Dialog"];a.default_text_font_bold=!0;a.default_text_font_italic=!1;a.default_text_font_stroke_3D=
!0;a.default_text_color="#000000";a.default_shapes_color="#000000";a.default_shapes_lineWidth_2D=1;a.default_shapes_arrowLength_2D=8;a.default_compass_display=!1;a.default_compass_axisXColor_3D="#FF0000";a.default_compass_axisYColor_3D="#00FF00";a.default_compass_axisZColor_3D="#0000FF";a.default_compass_size_3D=50;a.default_compass_resolution_3D=10;a.default_compass_displayText_3D=!0;c.VisualSpecifications=function(){this.backgroundColor=a.default_backgroundColor;this.scale=a.default_scale;this.rotateAngle=
a.default_rotateAngle;this.bondLength=a.default_bondLength_2D;this.angstromsPerBondLength=a.default_angstromsPerBondLength;this.lightDirection_3D=a.default_lightDirection_3D;this.lightDiffuseColor_3D=a.default_lightDiffuseColor_3D;this.lightSpecularColor_3D=a.default_lightSpecularColor_3D;this.projectionPerspective_3D=a.default_projectionPerspective_3D;this.projectionPerspectiveVerticalFieldOfView_3D=a.default_projectionPerspectiveVerticalFieldOfView_3D;this.projectionOrthoWidth_3D=a.default_projectionOrthoWidth_3D;
this.projectionWidthHeightRatio_3D=a.default_projectionWidthHeightRatio_3D;this.projectionFrontCulling_3D=a.default_projectionFrontCulling_3D;this.projectionBackCulling_3D=a.default_projectionBackCulling_3D;this.cullBackFace_3D=a.default_cullBackFace_3D;this.fog_mode_3D=a.default_fog_mode_3D;this.fog_color_3D=a.default_fog_color_3D;this.fog_start_3D=a.default_fog_start_3D;this.fog_end_3D=a.default_fog_end_3D;this.fog_density_3D=a.default_fog_density_3D;this.atoms_display=a.default_atoms_display;this.atoms_color=
a.default_atoms_color;this.atoms_font_size_2D=a.default_atoms_font_size_2D;this.atoms_font_families_2D=[];for(var c=0,f=a.default_atoms_font_families_2D.length;c<f;c++)this.atoms_font_families_2D[c]=a.default_atoms_font_families_2D[c];this.atoms_font_bold_2D=a.default_atoms_font_bold_2D;this.atoms_font_italic_2D=a.default_atoms_font_italic_2D;this.atoms_circles_2D=a.default_atoms_circles_2D;this.atoms_circleDiameter_2D=a.default_atoms_circleDiameter_2D;this.atoms_circleBorderWidth_2D=a.default_atoms_circleBorderWidth_2D;
this.atoms_lonePairDistance_2D=a.default_atoms_lonePairDistance_2D;this.atoms_lonePairSpread_2D=a.default_atoms_lonePairSpread_2D;this.atoms_lonePairDiameter_2D=a.default_atoms_lonePairDiameter_2D;this.atoms_useJMOLColors=a.default_atoms_useJMOLColors;this.atoms_usePYMOLColors=a.default_atoms_usePYMOLColors;this.atoms_resolution_3D=a.default_atoms_resolution_3D;this.atoms_sphereDiameter_3D=a.default_atoms_sphereDiameter_3D;this.atoms_useVDWDiameters_3D=a.default_atoms_useVDWDiameters_3D;this.atoms_vdwMultiplier_3D=
a.default_atoms_vdwMultiplier_3D;this.atoms_materialAmbientColor_3D=a.default_atoms_materialAmbientColor_3D;this.atoms_materialSpecularColor_3D=a.default_atoms_materialSpecularColor_3D;this.atoms_materialShininess_3D=a.default_atoms_materialShininess_3D;this.atoms_implicitHydrogens_2D=a.default_atoms_implicitHydrogens_2D;this.atoms_displayTerminalCarbonLabels_2D=a.default_atoms_displayTerminalCarbonLabels_2D;this.atoms_showHiddenCarbons_2D=a.default_atoms_showHiddenCarbons_2D;this.atoms_showAttributedCarbons_2D=
a.default_atoms_showAttributedCarbons_2D;this.atoms_displayAllCarbonLabels_2D=a.default_atoms_displayAllCarbonLabels_2D;this.atoms_nonBondedAsStars_3D=a.default_atoms_nonBondedAsStars_3D;this.atoms_displayLabels_3D=a.default_atoms_displayLabels_3D;this.bonds_display=a.default_bonds_display;this.bonds_color=a.default_bonds_color;this.bonds_width_2D=a.default_bonds_width_2D;this.bonds_saturationWidth_2D=a.default_bonds_saturationWidth_2D;this.bonds_ends_2D=a.default_bonds_ends_2D;this.bonds_useJMOLColors=
a.default_bonds_useJMOLColors;this.bonds_usePYMOLColors=a.default_bonds_usePYMOLColors;this.bonds_colorGradient=a.default_bonds_colorGradient;this.bonds_saturationAngle_2D=a.default_bonds_saturationAngle_2D;this.bonds_symmetrical_2D=a.default_bonds_symmetrical_2D;this.bonds_clearOverlaps_2D=a.default_bonds_clearOverlaps_2D;this.bonds_overlapClearWidth_2D=a.default_bonds_overlapClearWidth_2D;this.bonds_atomLabelBuffer_2D=a.default_bonds_atomLabelBuffer_2D;this.bonds_wedgeThickness_2D=a.default_bonds_wedgeThickness_2D;
this.bonds_hashWidth_2D=a.default_bonds_hashWidth_2D;this.bonds_hashSpacing_2D=a.default_bonds_hashSpacing_2D;this.bonds_dotSize_2D=a.default_bonds_dotSize_2D;this.bonds_showBondOrders_3D=a.default_bonds_showBondOrders_3D;this.bonds_resolution_3D=a.default_bonds_resolution_3D;this.bonds_renderAsLines_3D=a.default_bonds_renderAsLines_3D;this.bonds_cylinderDiameter_3D=a.default_bonds_cylinderDiameter_3D;this.bonds_pillHeight_3D=a.default_bonds_pillHeight_3D;this.bonds_pillLatitudeResolution_3D=a.default_bonds_pillLatitudeResolution_3D;
this.bonds_pillLongitudeResolution_3D=a.default_bonds_pillLongitudeResolution_3D;this.bonds_pillSpacing_3D=a.default_bonds_pillSpacing_3D;this.bonds_pillDiameter_3D=a.default_bonds_pillDiameter_3D;this.bonds_materialAmbientColor_3D=a.default_bonds_materialAmbientColor_3D;this.bonds_materialSpecularColor_3D=a.default_bonds_materialSpecularColor_3D;this.bonds_materialShininess_3D=a.default_bonds_materialShininess_3D;this.proteins_displayRibbon=a.default_proteins_displayRibbon;this.proteins_displayBackbone=
a.default_proteins_displayBackbone;this.proteins_backboneThickness=a.default_proteins_backboneThickness;this.proteins_backboneColor=a.default_proteins_backboneColor;this.proteins_ribbonCartoonize=a.default_proteins_ribbonCartoonize;this.proteins_useShapelyColors=a.default_proteins_useShapelyColors;this.proteins_useAminoColors=a.default_proteins_useAminoColors;this.proteins_usePolarityColors=a.default_proteins_usePolarityColors;this.proteins_primaryColor=a.default_proteins_primaryColor;this.proteins_secondaryColor=
a.default_proteins_secondaryColor;this.proteins_ribbonCartoonHelixPrimaryColor=a.default_proteins_ribbonCartoonHelixPrimaryColor;this.proteins_ribbonCartoonHelixSecondaryColor=a.default_proteins_ribbonCartoonHelixSecondaryColor;this.proteins_ribbonCartoonSheetColor=a.default_proteins_ribbonCartoonSheetColor;this.proteins_ribbonThickness=a.default_proteins_ribbonThickness;this.proteins_verticalResolution=a.default_proteins_verticalResolution;this.proteins_horizontalResolution=a.default_proteins_horizontalResolution;
this.proteins_materialAmbientColor_3D=a.default_proteins_materialAmbientColor_3D;this.proteins_materialSpecularColor_3D=a.default_proteins_materialSpecularColor_3D;this.proteins_materialShininess_3D=a.default_proteins_materialShininess_3D;this.macro_displayAtoms=a.default_macro_displayAtoms;this.macro_displayBonds=a.default_macro_displayBonds;this.macro_atomToLigandDistance=a.default_macro_atomToLigandDistance;this.nucleics_display=a.default_nucleics_display;this.nucleics_tubeColor=a.default_nucleics_tubeColor;
this.nucleics_baseColor=a.default_nucleics_baseColor;this.nucleics_useShapelyColors=a.default_nucleics_useShapelyColors;this.nucleics_tubeThickness=a.default_nucleics_tubeThickness;this.nucleics_tubeResolution_3D=a.default_nucleics_tubeResolution_3D;this.nucleics_verticalResolution=a.default_nucleics_verticalResolution;this.nucleics_materialAmbientColor_3D=a.default_nucleics_materialAmbientColor_3D;this.nucleics_materialSpecularColor_3D=a.default_nucleics_materialSpecularColor_3D;this.nucleics_materialShininess_3D=
a.default_nucleics_materialShininess_3D;this.macro_showWater=a.default_macro_showWater;this.macro_colorByChain=a.default_macro_colorByChain;this.surfaces_display=a.default_surfaces_display;this.surfaces_style=a.default_surfaces_style;this.surfaces_color=a.default_surfaces_color;this.surfaces_materialAmbientColor_3D=a.default_surfaces_materialAmbientColor_3D;this.surfaces_materialSpecularColor_3D=a.default_surfaces_materialSpecularColor_3D;this.surfaces_materialShininess_3D=a.default_surfaces_materialShininess_3D;
this.crystals_displayUnitCell=a.default_crystals_displayUnitCell;this.crystals_unitCellColor=a.default_crystals_unitCellColor;this.crystals_unitCellLineWidth=a.default_crystals_unitCellLineWidth;this.plots_color=a.default_plots_color;this.plots_width=a.default_plots_width;this.plots_showIntegration=a.default_plots_showIntegration;this.plots_integrationColor=a.default_plots_integrationColor;this.plots_integrationLineWidth=a.default_plots_integrationLineWidth;this.plots_showGrid=a.default_plots_showGrid;
this.plots_gridColor=a.default_plots_gridColor;this.plots_gridLineWidth=a.default_plots_gridLineWidth;this.plots_showYAxis=a.default_plots_showYAxis;this.plots_flipXAxis=a.default_plots_flipXAxis;this.text_font_size=a.default_text_font_size;this.text_font_families=[];c=0;for(f=a.default_text_font_families.length;c<f;c++)this.text_font_families[c]=a.default_text_font_families[c];this.text_font_bold=a.default_text_font_bold;this.text_font_italic=a.default_text_font_italic;this.text_font_stroke_3D=a.default_text_font_stroke_3D;
this.text_color=a.default_text_color;this.shapes_color=a.default_shapes_color;this.shapes_lineWidth_2D=a.default_shapes_lineWidth_2D;this.shapes_arrowLength_2D=a.default_shapes_arrowLength_2D;this.compass_display=a.default_compass_display;this.compass_axisXColor_3D=a.default_compass_axisXColor_3D;this.compass_axisYColor_3D=a.default_compass_axisYColor_3D;this.compass_axisZColor_3D=a.default_compass_axisZColor_3D;this.compass_size_3D=a.default_compass_size_3D;this.compass_resolution_3D=a.default_compass_resolution_3D;
this.compass_displayText_3D=a.default_compass_displayText_3D};c.VisualSpecifications.prototype.set3DRepresentation=function(c){this.bonds_display=this.atoms_display=!0;this.bonds_color="#777777";this.bonds_showBondOrders_3D=this.bonds_useJMOLColors=this.atoms_useJMOLColors=this.atoms_useVDWDiameters_3D=!0;this.bonds_renderAsLines_3D=!1;"Ball and Stick"===c?(this.atoms_vdwMultiplier_3D=0.3,this.bonds_useJMOLColors=!1,this.bonds_cylinderDiameter_3D=0.3,this.bonds_materialAmbientColor_3D=a.default_atoms_materialAmbientColor_3D,
this.bonds_pillDiameter_3D=0.15):"van der Waals Spheres"===c?(this.bonds_display=!1,this.atoms_vdwMultiplier_3D=1):"Stick"===c?(this.bonds_showBondOrders_3D=this.atoms_useVDWDiameters_3D=!1,this.bonds_cylinderDiameter_3D=this.atoms_sphereDiameter_3D=0.8,this.bonds_materialAmbientColor_3D=this.atoms_materialAmbientColor_3D):"Wireframe"===c?(this.atoms_useVDWDiameters_3D=!1,this.bonds_cylinderDiameter_3D=this.bonds_pillDiameter_3D=0.05,this.atoms_sphereDiameter_3D=0.15,this.bonds_materialAmbientColor_3D=
a.default_atoms_materialAmbientColor_3D):"Line"===c?(this.atoms_display=!1,this.bonds_renderAsLines_3D=!0,this.bonds_width_2D=1,this.bonds_cylinderDiameter_3D=0.05):alert('"'+c+'" is not recognized. Use one of the following strings:\n\n1. Ball and Stick\n2. van der Waals Spheres\n3. Stick\n4. Wireframe\n5. Line\n')}})(ChemDoodle,ChemDoodle.structures,Math);
(function(a,c,g,e){g.getPointsPerAngstrom=function(){return a.default_bondLength_2D/a.default_angstromsPerBondLength};g.BondDeducer=function(){};var f=g.BondDeducer.prototype;f.margin=1.1;f.deduceCovalentBonds=function(a,f){var b=g.getPointsPerAngstrom();f&&(b=f);for(var m=0,v=a.atoms.length;m<v;m++)for(var j=m+1;j<v;j++){var h=a.atoms[m],k=a.atoms[j];h.distance3D(k)<(c[h.label].covalentRadius+c[k.label].covalentRadius)*b*this.margin&&a.bonds.push(new e.Bond(h,k,1))}}})(ChemDoodle,ChemDoodle.ELEMENT,
ChemDoodle.informatics,ChemDoodle.structures);(function(a){a.HydrogenDeducer=function(){};a.HydrogenDeducer.prototype.removeHydrogens=function(a){for(var g=[],e=[],f=0,d=a.bonds.length;f<d;f++)"H"!==a.bonds[f].a1.label&&"H"!==a.bonds[f].a2.label&&e.push(a.bonds[f]);f=0;for(d=a.atoms.length;f<d;f++)"H"!==a.atoms[f].label&&g.push(a.atoms[f]);a.atoms=g;a.bonds=e}})(ChemDoodle.informatics);
(function(a,c,g){c.MolecularSurfaceGenerator=function(){};c.MolecularSurfaceGenerator.prototype.generateSurface=function(a,c,d,n,b){return new g.MolecularSurface(a,c,d,n,b)}})(ChemDoodle,ChemDoodle.informatics,ChemDoodle.structures.d3);
(function(a,c){a.Splitter=function(){};a.Splitter.prototype.split=function(a){for(var e=[],f=0,d=a.atoms.length;f<d;f++)a.atoms[f].visited=!1;f=0;for(d=a.bonds.length;f<d;f++)a.bonds[f].visited=!1;f=0;for(d=a.atoms.length;f<d;f++){var n=a.atoms[f];if(!n.visited){var b=new c.Molecule;b.atoms.push(n);n.visited=!0;var m=new c.Queue;for(m.enqueue(n);!m.isEmpty();)for(var n=m.dequeue(),v=0,j=a.bonds.length;v<j;v++){var h=a.bonds[v];h.contains(n)&&!h.visited&&(h.visited=!0,b.bonds.push(h),h=h.getNeighbor(n),
h.visited||(h.visited=!0,b.atoms.push(h),m.enqueue(h)))}e.push(b)}}return e}})(ChemDoodle.informatics,ChemDoodle.structures);(function(a,c){a.StructureBuilder=function(){};a.StructureBuilder.prototype.copy=function(a){var e=new c.JSONInterpreter;return e.molFrom(e.molTo(a))}})(ChemDoodle.informatics,ChemDoodle.io,ChemDoodle.structures);
(function(a){a._Counter=function(){};a=a._Counter.prototype;a.value=0;a.molecule=void 0;a.setMolecule=function(a){this.value=0;this.molecule=a;this.innerCalculate&&this.innerCalculate()}})(ChemDoodle.informatics);(function(a){a.FrerejacqueNumberCounter=function(a){this.setMolecule(a)};(a.FrerejacqueNumberCounter.prototype=new a._Counter).innerCalculate=function(){this.value=this.molecule.bonds.length-this.molecule.atoms.length+(new a.NumberOfMoleculesCounter(this.molecule)).value}})(ChemDoodle.informatics);
(function(a,c){c.NumberOfMoleculesCounter=function(a){this.setMolecule(a)};(c.NumberOfMoleculesCounter.prototype=new c._Counter).innerCalculate=function(){for(var c=0,e=this.molecule.atoms.length;c<e;c++)this.molecule.atoms[c].visited=!1;c=0;for(e=this.molecule.atoms.length;c<e;c++)if(!this.molecule.atoms[c].visited){this.value++;var f=new a.Queue;this.molecule.atoms[c].visited=!0;for(f.enqueue(this.molecule.atoms[c]);!f.isEmpty();)for(var d=f.dequeue(),n=0,b=this.molecule.bonds.length;n<b;n++){var m=
this.molecule.bonds[n];m.contains(d)&&(m=m.getNeighbor(d),m.visited||(m.visited=!0,f.enqueue(m)))}}}})(ChemDoodle.structures,ChemDoodle.informatics);
(function(a){a._RingFinder=function(){};a=a._RingFinder.prototype;a.atoms=void 0;a.bonds=void 0;a.rings=void 0;a.reduce=function(a){for(var g=0,e=a.atoms.length;g<e;g++)a.atoms[g].visited=!1;g=0;for(e=a.bonds.length;g<e;g++)a.bonds[g].visited=!1;for(var f=!0;f;){f=!1;g=0;for(e=a.atoms.length;g<e;g++){for(var d=0,n,b=0,m=a.bonds.length;b<m;b++)if(a.bonds[b].contains(a.atoms[g])&&!a.bonds[b].visited){d++;if(2===d)break;n=a.bonds[b]}1===d&&(f=!0,n.visited=!0,a.atoms[g].visited=!0)}}g=0;for(e=a.atoms.length;g<
e;g++)a.atoms[g].visited||this.atoms.push(a.atoms[g]);g=0;for(e=a.bonds.length;g<e;g++)a.bonds[g].visited||this.bonds.push(a.bonds[g]);0===this.bonds.length&&0!==this.atoms.length&&(this.atoms=[])};a.setMolecule=function(a){this.atoms=[];this.bonds=[];this.rings=[];this.reduce(a);2<this.atoms.length&&this.innerGetRings&&this.innerGetRings()};a.fuse=function(){for(var a=0,g=this.rings.length;a<g;a++)for(var e=0,f=this.bonds.length;e<f;e++)-1!==this.rings[a].atoms.indexOf(this.bonds[e].a1)&&-1!==this.rings[a].atoms.indexOf(this.bonds[e].a2)&&
this.rings[a].bonds.push(this.bonds[e])}})(ChemDoodle.informatics);
(function(a,c){function g(a,c){this.atoms=[];if(c)for(var e=0,b=c.atoms.length;e<b;e++)this.atoms[e]=c.atoms[e];this.atoms.push(a)}var e=g.prototype;e.grow=function(a,c){for(var e=this.atoms[this.atoms.length-1],b=[],m=0,v=a.length;m<v;m++)if(a[m].contains(e)){var j=a[m].getNeighbor(e);-1===c.indexOf(j)&&b.push(j)}e=[];m=0;for(v=b.length;m<v;m++)e.push(new g(b[m],this));return e};e.check=function(a,d,e){for(var b=0,m=d.atoms.length-1;b<m;b++)if(-1!==this.atoms.indexOf(d.atoms[b]))return;var g;if(d.atoms[d.atoms.length-
1]===this.atoms[this.atoms.length-1]){g=new c.Ring;g.atoms[0]=e;b=0;for(m=this.atoms.length;b<m;b++)g.atoms.push(this.atoms[b]);for(b=d.atoms.length-2;0<=b;b--)g.atoms.push(d.atoms[b])}else{for(var j=[],b=0,m=a.length;b<m;b++)a[b].contains(d.atoms[d.atoms.length-1])&&j.push(a[b]);b=0;for(m=j.length;b<m;b++)if((1===d.atoms.length||!j[b].contains(d.atoms[d.atoms.length-2]))&&j[b].contains(this.atoms[this.atoms.length-1])){g=new c.Ring;g.atoms[0]=e;a=0;for(e=this.atoms.length;a<e;a++)g.atoms.push(this.atoms[a]);
for(a=d.atoms.length-1;0<=a;a--)g.atoms.push(d.atoms[a]);break}}return g};a.EulerFacetRingFinder=function(a){this.setMolecule(a)};e=a.EulerFacetRingFinder.prototype=new a._RingFinder;e.fingerBreak=5;e.innerGetRings=function(){for(var a=0,c=this.atoms.length;a<c;a++){for(var e=[],b=0,m=this.bonds.length;b<m;b++)this.bonds[b].contains(this.atoms[a])&&e.push(this.bonds[b].getNeighbor(this.atoms[a]));b=0;for(m=e.length;b<m;b++)for(var v=b+1;v<e.length;v++){var j=[];j[0]=new g(e[b]);j[1]=new g(e[v]);var h=
[];h[0]=this.atoms[a];for(var k=0,p=e.length;k<p;k++)k!==b&&k!==v&&h.push(e[k]);var u=[];for((k=j[0].check(this.bonds,j[1],this.atoms[a]))&&(u[0]=k);0===u.length&&0<j.length&&j[0].atoms.length<this.fingerBreak;){for(var l=[],k=0,p=j.length;k<p;k++)for(var t=j[k].grow(this.bonds,h),o=0,r=t.length;o<r;o++)l.push(t[o]);j=l;k=0;for(p=j.length;k<p;k++)for(o=k+1;o<p;o++)(r=j[k].check(this.bonds,j[o],this.atoms[a]))&&u.push(r);if(0===u.length){l=[];k=0;for(p=h.length;k<p;k++){o=0;for(r=this.bonds.length;o<
r;o++)this.bonds[o].contains(h[k])&&(e=this.bonds[o].getNeighbor(h[k]),-1===h.indexOf(e)&&-1===l.indexOf(e)&&l.push(e))}k=0;for(p=l.length;k<p;k++)h.push(l[k])}}if(0<u.length){j=void 0;k=0;for(p=u.length;k<p;k++)if(!j||j.atoms.length>u[k].atoms.length)j=u[k];u=!1;k=0;for(p=this.rings.length;k<p;k++){h=!0;o=0;for(r=j.atoms.length;o<r;o++)if(-1===this.rings[k].atoms.indexOf(j.atoms[o])){h=!1;break}if(h){u=!0;break}}u||this.rings.push(j)}}}this.fuse()}})(ChemDoodle.informatics,ChemDoodle.structures);
(function(a){a.SSSRFinder=function(c){this.rings=[];if(0<c.atoms.length){var g=(new a.FrerejacqueNumberCounter(c)).value,e=(new a.EulerFacetRingFinder(c)).rings;e.sort(function(a,b){return a.atoms.length-b.atoms.length});for(var f=0,d=c.bonds.length;f<d;f++)c.bonds[f].visited=!1;f=0;for(d=e.length;f<d;f++){c=!1;for(var n=0,b=e[f].bonds.length;n<b;n++)if(!e[f].bonds[n].visited){c=!0;break}if(c){n=0;for(b=e[f].bonds.length;n<b;n++)e[f].bonds[n].visited=!0;this.rings.push(e[f])}if(this.rings.length===
g)break}}}})(ChemDoodle.informatics);(function(a){a._Interpreter=function(){};a._Interpreter.prototype.fit=function(a,g,e){for(var f=a.length,d=[],n=0;n<g-f;n++)d.push(" ");return e?a+d.join(""):d.join("")+a}})(ChemDoodle.io);
(function(a,c,g,e,f,d){var n=/\s+/g,b=/\(|\)|\s+/g,m=/\'|\s+/g,v=/,|\'|\s+/g,j=/^\s+/,h=/[0-9]/g,k=/[0-9]|\+|\-/g,p=function(a){return 0!==a.length},u={P:[],A:[[0,0.5,0.5]],B:[[0.5,0,0.5]],C:[[0.5,0.5,0]],I:[[0.5,0.5,0.5]],R:[[2/3,1/3,1/3],[1/3,2/3,2/3]],S:[[1/3,1/3,2/3],[2/3,2/3,1/3]],T:[[1/3,2/3,1/3],[2/3,1/3,2/3]],F:[[0,0.5,0.5],[0.5,0,0.5],[0.5,0.5,0]]},l=function(a){var b=0,c=0,d=0,f=0,e=a.indexOf("x"),k=a.indexOf("y"),j=a.indexOf("z");-1!==e&&(c++,0<e&&"+"!==a.charAt(e-1)&&(c*=-1));-1!==k&&
(d++,0<k&&"+"!==a.charAt(k-1)&&(d*=-1));-1!==j&&(f++,0<j&&"+"!==a.charAt(j-1)&&(f*=-1));if(2<a.length){e="+";k=0;for(j=a.length;k<j;k++){var m=a.charAt(k);if(("-"===m||"/"===m)&&(k===a.length-1||a.charAt(k+1).match(h)))e=m;m.match(h)&&("+"===e?b+=parseInt(m):"-"===e?b-=parseInt(m):"/"===e&&(b/=parseInt(m)))}}return[b,c,d,f]};g.CIFInterpreter=function(){};(g.CIFInterpreter.prototype=new g._Interpreter).read=function(h,g,t,w){g=g?g:1;t=t?t:1;w=w?w:1;var y=new e.Molecule;if(!h)return y;for(var z=h.split("\n"),
x=0,A=0,B=0,F=h=0,D=0,E="P",I,G,L,C,H=!0;0<z.length;)if(H?C=z.shift():H=!0,0<C.length)if(c.stringStartsWith(C,"_cell_length_a"))x=parseFloat(C.split(b)[1]);else if(c.stringStartsWith(C,"_cell_length_b"))A=parseFloat(C.split(b)[1]);else if(c.stringStartsWith(C,"_cell_length_c"))B=parseFloat(C.split(b)[1]);else if(c.stringStartsWith(C,"_cell_angle_alpha"))h=f.PI*parseFloat(C.split(b)[1])/180;else if(c.stringStartsWith(C,"_cell_angle_beta"))F=f.PI*parseFloat(C.split(b)[1])/180;else if(c.stringStartsWith(C,
"_cell_angle_gamma"))D=f.PI*parseFloat(C.split(b)[1])/180;else if(c.stringStartsWith(C,"_symmetry_space_group_name_H-M"))E=C.split(m)[1];else if(c.stringStartsWith(C,"loop_")){for(var J={fields:[],lines:[]},M=!1;void 0!==(C=z.shift())&&!c.stringStartsWith(C=C.replace(j,""),"loop_")&&0<C.length;)if(c.stringStartsWith(C,"_")){if(M)break;J.fields=J.fields.concat(C.split(n).filter(p))}else M=!0,J.lines.push(C);if(0!==z.length&&(c.stringStartsWith(C,"loop_")||c.stringStartsWith(C,"_")))H=!1;-1!==J.fields.indexOf("_symmetry_equiv_pos_as_xyz")||
-1!==J.fields.indexOf("_space_group_symop_operation_xyz")?I=J:-1!==J.fields.indexOf("_atom_site_label")?G=J:-1!==J.fields.indexOf("_geom_bond_atom_site_label_1")&&(L=J)}C=x;h=(f.cos(h)-f.cos(D)*f.cos(F))/f.sin(D);h=[C,0,0,0,A*f.cos(D),A*f.sin(D),0,0,B*f.cos(F),B*h,B*f.sqrt(1-f.pow(f.cos(F),2)-h*h),0,0,0,0,1];if(G){J=H=x=z=B=-1;D=0;for(F=G.fields.length;D<F;D++)C=G.fields[D],"_atom_site_type_symbol"===C?B=D:"_atom_site_label"===C?z=D:"_atom_site_fract_x"===C?x=D:"_atom_site_fract_y"===C?H=D:"_atom_site_fract_z"===
C&&(J=D);D=0;for(F=G.lines.length;D<F;D++)C=G.lines[D],A=C.split(n).filter(p),C=new e.Atom(A[-1===B?z:B].split(k)[0],parseFloat(A[x]),parseFloat(A[H]),parseFloat(A[J])),y.atoms.push(C),-1!==z&&(C.cifId=A[z],C.cifPart=0)}if(I&&!L){D=A=0;for(F=I.fields.length;D<F;D++)if(C=I.fields[D],"_symmetry_equiv_pos_as_xyz"===C||"_space_group_symop_operation_xyz"===C)A=D;H=u[E];z=[];D=0;for(F=I.lines.length;D<F;D++){C=I.lines[D].split(v).filter(p);for(var J=l(C[A]),M=l(C[A+1]),N=l(C[A+2]),E=0,x=y.atoms.length;E<
x;E++){C=y.atoms[E];var Q=C.x*J[1]+C.y*J[2]+C.z*J[3]+J[0],K=C.x*M[1]+C.y*M[2]+C.z*M[3]+M[0],P=C.x*N[1]+C.y*N[2]+C.z*N[3]+N[0];G=new e.Atom(C.label,Q,K,P);z.push(G);void 0!==C.cifId&&(G.cifId=C.cifId,G.cifPart=D+1);if(H){G=0;for(B=H.length;G<B;G++){var O=H[G],O=new e.Atom(C.label,Q+O[0],K+O[1],P+O[2]);z.push(O);void 0!==C.cifId&&(O.cifId=C.cifId,O.cifPart=D+1)}}}}D=0;for(F=z.length;D<F;D++){for(C=z[D];1<=C.x;)C.x--;for(;0>C.x;)C.x++;for(;1<=C.y;)C.y--;for(;0>C.y;)C.y++;for(;1<=C.z;)C.z--;for(;0>C.z;)C.z++}G=
[];D=0;for(F=z.length;D<F;D++){B=!1;C=z[D];E=0;for(x=y.atoms.length;E<x;E++)if(1E-4>y.atoms[E].distance3D(C)){B=!0;break}if(!B){E=0;for(x=G.length;E<x;E++)if(1E-4>G[E].distance3D(C)){B=!0;break}B||G.push(C)}}y.atoms=y.atoms.concat(G)}F=[];for(D=0;D<g;D++)for(E=0;E<t;E++)for(G=0;G<w;G++)if(!(0===D&&0===E&&0===G)){B=0;for(A=y.atoms.length;B<A;B++)C=y.atoms[B],z=new e.Atom(C.label,C.x+D,C.y+E,C.z+G),F.push(z),void 0!==C.cifId&&(z.cifId=C.cifId,z.cifPart=C.cifPart+(I?I.lines.length:0)+D+10*E+100*G)}y.atoms=
y.atoms.concat(F);D=0;for(F=y.atoms.length;D<F;D++)C=y.atoms[D],I=d.multiplyVec3(h,[C.x,C.y,C.z]),C.x=I[0],C.y=I[1],C.z=I[2];if(L){z=I=-1;D=0;for(F=L.fields.length;D<F;D++)C=L.fields[D],"_geom_bond_atom_site_label_1"===C?I=D:"_geom_bond_atom_site_label_2"===C&&(z=D);G=0;for(B=L.lines.length;G<B;G++){A=L.lines[G].split(n).filter(p);C=A[I];A=A[z];D=0;for(F=y.atoms.length;D<F;D++)for(E=D+1;E<F;E++){x=y.atoms[D];H=y.atoms[E];if(x.cifPart!==H.cifPart)break;(x.cifId===C&&H.cifId===A||x.cifId===A&&H.cifId===
C)&&y.bonds.push(new e.Bond(x,H))}}}else(new a.informatics.BondDeducer).deduceCovalentBonds(y,1);g=[-g/2,-t/2,-w/2];y.unitCellVectors={o:d.multiplyVec3(h,g,[]),x:d.multiplyVec3(h,[g[0]+1,g[1],g[2]]),y:d.multiplyVec3(h,[g[0],g[1]+1,g[2]]),z:d.multiplyVec3(h,[g[0],g[1],g[2]+1]),xy:d.multiplyVec3(h,[g[0]+1,g[1]+1,g[2]]),xz:d.multiplyVec3(h,[g[0]+1,g[1],g[2]+1]),yz:d.multiplyVec3(h,[g[0],g[1]+1,g[2]+1]),xyz:d.multiplyVec3(h,[g[0]+1,g[1]+1,g[2]+1])};return y};var t=new g.CIFInterpreter;a.readCIF=function(a,
b,c,d){return t.read(a,b,c,d)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,Math,mat4,vec3);
(function(a,c,g,e){g.MOLInterpreter=function(){};var f=g.MOLInterpreter.prototype=new g._Interpreter;f.read=function(d,b){b||(b=a.default_bondLength_2D);var f=new e.Molecule;if(!d)return f;for(var g=d.split("\n"),j=g[3],h=parseInt(j.substring(0,3)),j=parseInt(j.substring(3,6)),k=0;k<h;k++){var p=g[4+k];f.atoms[k]=new e.Atom(p.substring(31,34),parseFloat(p.substring(0,10))*b,(1===b?1:-1)*parseFloat(p.substring(10,20))*b,parseFloat(p.substring(20,30))*b);var u=parseInt(p.substring(34,36));0!==u&&c[f.atoms[k].label]&&
(f.atoms[k].mass=c[f.atoms[k].label].mass+u);switch(parseInt(p.substring(36,39))){case 1:f.atoms[k].charge=3;break;case 2:f.atoms[k].charge=2;break;case 3:f.atoms[k].charge=1;break;case 5:f.atoms[k].charge=-1;break;case 6:f.atoms[k].charge=-2;break;case 7:f.atoms[k].charge=-3}}for(k=0;k<j;k++){var p=g[4+h+k],l=parseInt(p.substring(6,9)),u=parseInt(p.substring(9,12));if(3<l)switch(l){case 4:l=1.5;break;default:l=1}p=new e.Bond(f.atoms[parseInt(p.substring(0,3))-1],f.atoms[parseInt(p.substring(3,6))-
1],l);switch(u){case 3:p.stereo=e.Bond.STEREO_AMBIGUOUS;break;case 1:p.stereo=e.Bond.STEREO_PROTRUDING;break;case 6:p.stereo=e.Bond.STEREO_RECESSED}f.bonds[k]=p}return f};f.write=function(d){var b=[];b.push("Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");b.push(this.fit(d.atoms.length.toString(),3));b.push(this.fit(d.bonds.length.toString(),3));b.push("  0  0  0  0            999 V2000\n");for(var f=d.getCenter(),g=0,j=d.atoms.length;g<j;g++){var h=d.atoms[g],k=" 0";if(-1!==
h.mass&&c[h.label]){var p=h.mass-c[h.label].mass;5>p&&-4<p&&(k=(-1<p?" ":"")+p)}p="  0";if(0!==h.charge)switch(h.charge){case 3:p="  1";break;case 2:p="  2";break;case 1:p="  3";break;case -1:p="  5";break;case -2:p="  6";break;case -3:p="  7"}b.push(this.fit(((h.x-f.x)/a.default_bondLength_2D).toFixed(4),10));b.push(this.fit((-(h.y-f.y)/a.default_bondLength_2D).toFixed(4),10));b.push(this.fit((h.z/a.default_bondLength_2D).toFixed(4),10));b.push(" ");b.push(this.fit(h.label,3,!0));b.push(k);b.push(p);
b.push("  0  0  0  0\n")}g=0;for(j=d.bonds.length;g<j;g++){h=d.bonds[g];f=0;h.stereo===e.Bond.STEREO_AMBIGUOUS?f=3:h.stereo===e.Bond.STEREO_PROTRUDING?f=1:h.stereo===e.Bond.STEREO_RECESSED&&(f=6);b.push(this.fit((d.atoms.indexOf(h.a1)+1).toString(),3));b.push(this.fit((d.atoms.indexOf(h.a2)+1).toString(),3));h=h.bondOrder;if(1.5==h)h=4;else if(3<h||0!=h%1)h=1;b.push(this.fit(h,3));b.push("  ");b.push(f);b.push("     0  0\n")}b.push("M  END");return b.join("")};var d=new g.MOLInterpreter;a.readMOL=
function(a,b){return d.read(a,b)};a.writeMOL=function(a){return d.write(a)}})(ChemDoodle,ChemDoodle.ELEMENT,ChemDoodle.io,ChemDoodle.structures);
(function(a,c,g,e,f,d,n){function b(a,b,c,d,f){for(var e=0,g=b.length;e<g;e++){var m=b[e];if(m.id===c&&d>=m.start&&d<=m.end){f?a.helix=!0:a.sheet=!0;d+1===m.end&&(a.arrow=!0);break}}}g.PDBInterpreter=function(){};var m=g.PDBInterpreter.prototype=new g._Interpreter;m.calculateRibbonDistances=!1;m.deduceResidueBonds=!1;m.read=function(j,h){var k=new e.Molecule;k.chains=[];if(!j)return k;var g=j.split("\n");h||(h=1);for(var m=[],l=[],t,o=[],v=[],q=[],w=0,y=g.length;w<y;w++){var z=g[w];if(c.stringStartsWith(z,
"HELIX"))m.push({id:z.substring(19,20),start:parseInt(z.substring(21,25)),end:parseInt(z.substring(33,37))});else if(c.stringStartsWith(z,"SHEET"))l.push({id:z.substring(21,22),start:parseInt(z.substring(22,26)),end:parseInt(z.substring(33,37))});else if(c.stringStartsWith(z,"ATOM")){var x=z.substring(16,17);if(" "===x||"A"===x){x=d(z.substring(76,78));if(0===x.length){var A=d(z.substring(12,14));"HD"===A?x="H":0<A.length&&(x=1<A.length?A.charAt(0)+A.substring(1).toLowerCase():A)}A=new e.Atom(x,parseFloat(z.substring(30,
38))*h,parseFloat(z.substring(38,46))*h,parseFloat(z.substring(46,54))*h);A.hetatm=!1;v.push(A);var B=parseInt(z.substring(22,26));if(0===o.length)for(x=0;2>x;x++){var F=new e.Residue(-1);F.cp1=A;F.cp2=A;o.push(F)}B!==Number.NaN&&o[o.length-1].resSeq!==B&&(x=new e.Residue(B),x.name=d(z.substring(17,20)),3===x.name.length?x.name=x.name.substring(0,1)+x.name.substring(1).toLowerCase():2===x.name.length&&"D"===x.name.charAt(0)&&(x.name=x.name.substring(1)),o.push(x),F=z.substring(21,22),b(x,m,F,B,!0),
b(x,l,F,B,!1));z=d(z.substring(12,16));x=o[o.length-1];if("CA"===z||"P"===z||"O5'"===z)x.cp1||(x.cp1=A);else if("N3"===z&&("C"===x.name||"U"===x.name||"T"===x.name)||"N1"===z&&("A"===x.name||"G"===x.name))x.cp3=A;else if("C2"===z)x.cp4=A;else if("C4"===z&&("C"===x.name||"U"===x.name||"T"===x.name)||"C6"===z&&("A"===x.name||"G"===x.name))x.cp5=A;else if("O"===z||"C6"===z&&("C"===x.name||"U"===x.name||"T"===x.name)||"N9"===z){if(!o[o.length-1].cp2){if("C6"===z||"N9"===z)t=A;x.cp2=A}}else"C"===z&&(t=
A)}}else if(c.stringStartsWith(z,"HETATM"))x=d(z.substring(76,78)),0===x.length&&(x=d(z.substring(12,16))),1<x.length&&(x=x.substring(0,1)+x.substring(1).toLowerCase()),x=new e.Atom(x,parseFloat(z.substring(30,38))*h,parseFloat(z.substring(38,46))*h,parseFloat(z.substring(46,54))*h),x.hetatm=!0,"HOH"===d(z.substring(17,20))&&(x.isWater=!0),k.atoms.push(x),q[parseInt(d(z.substring(6,11)))]=x;else if(c.stringStartsWith(z,"CONECT")){if(x=parseInt(d(z.substring(6,11))),q[x]){A=q[x];for(B=0;4>B;B++)if(x=
d(z.substring(11+5*B,16+5*B)),0!==x.length&&(x=parseInt(x),q[x])){for(var F=q[x],D=!1,x=0,E=k.bonds.length;x<E;x++){var I=k.bonds[x];if(I.a1===A&&I.a2===F||I.a1===F&&I.a2===A){D=!0;break}}D||k.bonds.push(new e.Bond(A,F))}}}else if(c.stringStartsWith(z,"TER"))this.endChain(k,o,t,v),o=[];else if(c.stringStartsWith(z,"ENDMDL"))break}this.endChain(k,o,t,v);0===k.bonds.size&&(new a.informatics.BondDeducer).deduceCovalentBonds(k,h);if(this.deduceResidueBonds){w=0;for(y=v.length;w<y;w++){g=n.min(y,w+20);
for(x=w+1;x<g;x++)m=v[w],l=v[x],m.distance3D(l)<1.1*(f[m.label].covalentRadius+f[l.label].covalentRadius)&&k.bonds.push(new e.Bond(m,l,1))}}k.atoms=k.atoms.concat(v);this.calculateRibbonDistances&&this.calculateDistances(k,v);return k};m.endChain=function(a,b,c,d){if(0<b.length){var f=b[b.length-1];f.cp1||(f.cp1=d[d.length-2]);f.cp2||(f.cp2=d[d.length-1]);for(d=0;4>d;d++)f=new e.Residue(-1),f.cp1=c,f.cp2=b[b.length-1].cp2,b.push(f);a.chains.push(b)}};m.calculateDistances=function(a,b){for(var c=[],
d=0,f=a.atoms.length;d<f;d++){var e=a.atoms[d];e.hetatm&&(e.isWater||c.push(e))}d=0;for(f=b.length;d<f;d++)if(e=b[d],e.closestDistance=Number.POSITIVE_INFINITY,0===c.length)e.closestDistance=0;else for(var g=0,m=c.length;g<m;g++)e.closestDistance=Math.min(e.closestDistance,e.distance3D(c[g]))};var v=new g.PDBInterpreter;a.readPDB=function(a,b){return v.read(a,b)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.ELEMENT,jQuery.trim,Math);
(function(a,c,g,e,f,d){var n={"@":0,A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,a:-1,b:-2,c:-3,d:-4,e:-5,f:-6,g:-7,h:-8,i:-9},b={"%":0,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,j:-1,k:-2,l:-3,m:-4,n:-5,o:-6,p:-7,q:-8,r:-9},m={S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,s:9};g.JCAMPInterpreter=function(){};f=g.JCAMPInterpreter.prototype=new g._Interpreter;f.convertHZ2PPM=!1;f.read=function(a){this.isBreak=function(a){return void 0!==n[a]||void 0!==b[a]||void 0!==m[a]||" "===a||"-"===a||"+"===a};this.getValue=function(a,c){var d=
a.charAt(0),f=a.substring(1);return void 0!==n[d]?parseFloat(n[d]+f):void 0!==b[d]?parseFloat(b[d]+f)+c:parseFloat(f)};var f=new e.Spectrum;if(void 0===a||0===a.length)return f;a=a.split("\n");for(var k=[],g,v,l,t,o=1,r=1,q=1,w=-1,y=-1,z=-1,x=!0,A=!1,B=0,F=a.length;B<F;B++){var D=d(a[B]),E=D.indexOf("$$");-1!==E&&(D=D.substring(0,E));if(0===k.length||!c.stringStartsWith(a[B],"##"))0!==k.length&&k.push("\n"),k.push(d(D));else if(E=k.join(""),x&&100>E.length&&f.metadata.push(E),k=[D],c.stringStartsWith(E,
"##TITLE\x3d"))f.title=d(E.substring(8));else if(c.stringStartsWith(E,"##XUNITS\x3d"))f.xUnit=d(E.substring(9)),this.convertHZ2PPM&&"HZ"===f.xUnit.toUpperCase()&&(f.xUnit="PPM",A=!0);else if(c.stringStartsWith(E,"##YUNITS\x3d"))f.yUnit=d(E.substring(9));else if(!c.stringStartsWith(E,"##XYPAIRS\x3d"))if(c.stringStartsWith(E,"##FIRSTX\x3d"))v=parseFloat(d(E.substring(9)));else if(c.stringStartsWith(E,"##LASTX\x3d"))g=parseFloat(d(E.substring(8)));else if(c.stringStartsWith(E,"##FIRSTY\x3d"))l=parseFloat(d(E.substring(9)));
else if(c.stringStartsWith(E,"##NPOINTS\x3d"))t=parseFloat(d(E.substring(10)));else if(c.stringStartsWith(E,"##XFACTOR\x3d"))o=parseFloat(d(E.substring(10)));else if(c.stringStartsWith(E,"##YFACTOR\x3d"))r=parseFloat(d(E.substring(10)));else if(c.stringStartsWith(E,"##DELTAX\x3d"))w=parseFloat(d(E.substring(9)));else if(c.stringStartsWith(E,"##.OBSERVE FREQUENCY\x3d"))this.convertHZ2PPM&&(q=parseFloat(d(E.substring(21))));else if(c.stringStartsWith(E,"##.SHIFT REFERENCE\x3d"))this.convertHZ2PPM&&
(z=E.substring(19).split(","),y=parseInt(d(z[2])),z=parseFloat(d(z[3])));else if(c.stringStartsWith(E,"##XYDATA\x3d")){A||(q=1);var D=x=!1,E=E.split("\n"),I=(g-v)/(t-1);if(-1!==w)for(var G=1,L=E.length;G<L;G++)if("|"===E[G].charAt(0)){I=w;break}for(var C=v-I,H=l,J=0,M,G=1,L=E.length;G<L;G++){for(var N=[],C=d(E[G]),k=[],Q=!1,K=0,P=C.length;K<P;K++)this.isBreak(C.charAt(K))?(0<k.length&&!(1===k.length&&" "===k[0])&&N.push(k.join("")),k=[C.charAt(K)]):"|"===C.charAt(K)?Q=!0:k.push(C.charAt(K));N.push(k.join(""));
C=parseFloat(N[0])*o-I;K=1;for(P=N.length;K<P;K++)if(H=N[K],void 0!==m[H.charAt(0)])for(var O=parseInt(m[H.charAt(0)]+H.substring(1))-1,S=0;S<O;S++)C+=I,J=this.getValue(M,J),H=J*r,R++,f.data[f.data.length-1]=new e.Point(C/q,H);else void 0!==n[H.charAt(0)]&&D?(H=this.getValue(H,J)*r,Q&&(C+=I,f.data.push(new e.Point(C/q,H)))):(D=void 0!==b[H.charAt(0)],M=H,C+=I,J=this.getValue(H,J),H=J*r,R++,f.data.push(new e.Point(C/q,H)))}if(-1!==y){D=z-f.data[y-1].x;B=0;for(F=f.data.length;B<F;B++)f.data[B].x+=D}}else if(c.stringStartsWith(E,
"##PEAK TABLE\x3d")){x=!1;f.continuous=!1;for(var E=E.split("\n"),R=0,G=1,L=E.length;G<L;G++){D=E[G].split(/[\s,]+/);R+=D.length/2;K=0;for(P=D.length;K+1<P;K+=2)f.data.push(new e.Point(parseFloat(d(D[K])),parseFloat(d(D[K+1]))))}}}f.setup();return f};var v=new g.JCAMPInterpreter;v.convertHZ2PPM=!0;a.readJCAMP=function(a){return v.read(a)}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.io,ChemDoodle.structures,jQuery,jQuery.trim);
(function(a,c,g,e,f){c.JSONInterpreter=function(){};var d=c.JSONInterpreter.prototype;d.contentTo=function(a,c){for(var d=0,f=0,e=0,k=a.length;e<k;e++){for(var g=a[e],n=0,l=g.atoms.length;n<l;n++)g.atoms[n].tmpid="a"+d++;n=0;for(l=g.bonds.length;n<l;n++)g.bonds[n].tmpid="b"+f++}e=d=0;for(k=c.length;e<k;e++)c[e].tmpid="s"+d++;d={};if(a&&0<a.length){d.m=[];e=0;for(k=a.length;e<k;e++)d.m.push(this.molTo(a[e]))}if(c&&0<c.length){d.s=[];e=0;for(k=c.length;e<k;e++)d.s.push(this.shapeTo(c[e]))}e=0;for(k=
a.length;e<k;e++){g=a[e];n=0;for(l=g.atoms.length;n<l;n++)g.atoms[n].tmpid=void 0;n=0;for(l=g.bonds.length;n<l;n++)g.bonds[n].tmpid=void 0}e=0;for(k=c.length;e<k;e++)c[e].tmpid=void 0;return d};d.contentFrom=function(a){var c={molecules:[],shapes:[]};if(a.m)for(var d=0,f=a.m.length;d<f;d++)c.molecules.push(this.molFrom(a.m[d]));if(a.s){d=0;for(f=a.s.length;d<f;d++)c.shapes.push(this.shapeFrom(a.s[d],c.molecules))}d=0;for(f=c.molecules.length;d<f;d++){a=c.molecules[d];for(var e=0,k=a.atoms.length;e<
k;e++)a.atoms[e].tmpid=void 0;e=0;for(k=a.bonds.length;e<k;e++)a.bonds[e].tmpid=void 0}d=0;for(f=c.shapes.length;d<f;d++)c.shapes[d].tmpid=void 0;return c};d.molTo=function(a){for(var c={a:[]},d=0,f=a.atoms.length;d<f;d++){var e=a.atoms[d],k={x:e.x,y:e.y};e.tmpid&&(k.i=e.tmpid);"C"!==e.label&&(k.l=e.label);0!==e.z&&(k.z=e.z);0!==e.charge&&(k.c=e.charge);-1!==e.mass&&(k.m=e.mass);0!==e.numRadical&&(k.r=e.numRadical);0!==e.numLonePair&&(k.p=e.numLonePair);e.any&&(k.q=!0);-1!==e.rgroup&&(k.rg=e.rgroup);
c.a.push(k)}if(0<a.bonds.length){c.b=[];d=0;for(f=a.bonds.length;d<f;d++)e=a.bonds[d],k={b:a.atoms.indexOf(e.a1),e:a.atoms.indexOf(e.a2)},e.tmpid&&(k.i=e.tmpid),1!==e.bondOrder&&(k.o=e.bondOrder),e.stereo!==g.Bond.STEREO_NONE&&(k.s=e.stereo),c.b.push(k)}return c};d.molFrom=function(a){for(var c=new g.Molecule,d=0,f=a.a.length;d<f;d++){var e=a.a[d],k=new g.Atom(e.l?e.l:"C",e.x,e.y);e.i&&(k.tmpid=e.i);e.z&&(k.z=e.z);e.c&&(k.charge=e.c);e.m&&(k.mass=e.m);e.r&&(k.numRadical=e.r);e.p&&(k.numLonePair=e.p);
e.q&&(k.any=!0);e.rg&&(k.rgroup=e.rg);void 0!==e.p_h&&(k.hetatm=e.p_h);void 0!==e.p_w&&(k.isWater=e.p_w);void 0!==e.p_d&&(k.closestDistance=e.p_d);c.atoms.push(k)}if(a.b){d=0;for(f=a.b.length;d<f;d++)e=a.b[d],k=new g.Bond(c.atoms[e.b],c.atoms[e.e],void 0===e.o?1:e.o),e.i&&(k.tmpid=e.i),e.s&&(k.stereo=e.s),c.bonds.push(k)}return c};d.shapeTo=function(a){var c={};a.tmpid&&(c.i=a.tmpid);a instanceof e.Line?(c.t="Line",c.x1=a.p1.x,c.y1=a.p1.y,c.x2=a.p2.x,c.y2=a.p2.y,c.a=a.arrowType):a instanceof e.Pusher?
(c.t="Pusher",c.o1=a.o1.tmpid,c.o2=a.o2.tmpid,1!==a.numElectron&&(c.e=a.numElectron)):a instanceof e.Bracket&&(c.t="Bracket",c.x1=a.p1.x,c.y1=a.p1.y,c.x2=a.p2.x,c.y2=a.p2.y,0!==a.charge&&(c.c=a.charge),0!==a.mult&&(c.m=a.mult),0!==a.repeat&&(c.r=a.repeat));return c};d.shapeFrom=function(a,c){var d;if("Line"===a.t)d=new e.Line(new g.Point(a.x1,a.y1),new g.Point(a.x2,a.y2)),d.arrowType=a.a;else if("Pusher"===a.t){var f,h;d=0;for(var k=c.length;d<k;d++){for(var n=c[d],u=0,l=n.atoms.length;u<l;u++){var t=
n.atoms[u];t.tmpid===a.o1?f=t:t.tmpid===a.o2&&(h=t)}u=0;for(l=n.bonds.length;u<l;u++)t=n.bonds[u],t.tmpid===a.o1?f=t:t.tmpid===a.o2&&(h=t)}d=new e.Pusher(f,h);a.e&&(d.numElectron=a.e)}else"Bracket"===a.t&&(d=new e.Bracket(new g.Point(a.x1,a.y1),new g.Point(a.x2,a.y2)),void 0!==a.c&&(d.charge=a.c),void 0!==a.m&&(d.mult=a.m),void 0!==a.r&&(d.repeat=a.r));return d};d.pdbFrom=function(a){var c=this.molFrom(a.mol);c.findRings=!1;c.fromJSON=!0;c.chains=this.chainsFrom(a.ribbons);return c};d.chainsFrom=
function(a){for(var c=[],d=0,f=a.cs.length;d<f;d++){for(var e=a.cs[d],k=[],n=0,u=e.length;n<u;n++){var l=e[n],t=new g.Residue;t.name=l.n;t.cp1=new g.Atom("",l.x1,l.y1,l.z1);t.cp2=new g.Atom("",l.x2,l.y2,l.z2);l.x3&&(t.cp3=new g.Atom("",l.x3,l.y3,l.z3),t.cp4=new g.Atom("",l.x4,l.y4,l.z4),t.cp5=new g.Atom("",l.x5,l.y5,l.z5));t.helix=l.h;t.sheet=l.s;t.arrow=l.a;k.push(t)}c.push(k)}return c};var n=new c.JSONInterpreter;a.readJSON=function(a){var c;try{c=f.parse(a)}catch(d){return}if(c)return c.m||c.s?
n.contentFrom(c):c.a?{molecules:[n.molFrom(c)],shapes:[]}:{molecules:[],shapes:[]}};a.writeJSON=function(a,c){return f.stringify(n.contentTo(a,c))}})(ChemDoodle,ChemDoodle.io,ChemDoodle.structures,ChemDoodle.structures.d2,JSON);
(function(a,c,g){c.RXNInterpreter=function(){};var e=c.RXNInterpreter.prototype=new c._Interpreter;e.read=function(c,f){f||(f=a.default_bondLength_2D);var b=[],e;if(c){e=c.split("$MOL\n");for(var v=e[0].split("\n")[4],j=parseInt(v.substring(0,3)),v=parseInt(v.substring(3,6)),h=1,k=0,p=0,u=j+v;p<u;p++){b[p]=a.readMOL(e[h],f);var l=b[p].getBounds(),l=l.maxX-l.minX,k=k-(l+40);h++}p=0;for(u=j;p<u;p++){var l=b[p].getBounds(),l=l.maxX-l.minX,h=b[p].getCenter(),t=0;for(e=b[p].atoms.length;t<e;t++){var o=
b[p].atoms[t];o.x+=k+l/2-h.x;o.y-=h.y}k+=l+40}e=new g.d2.Line(new g.Point(k,0),new g.Point(k+40,0));k+=80;p=j;for(u=j+v;p<u;p++){l=b[p].getBounds();l=l.maxX-l.minX;h=b[p].getCenter();for(t=0;t<b[p].atoms.length;t++)o=b[p].atoms[t],o.x+=k+l/2-h.x,o.y-=h.y;k+=l+40}}else b.push(new g.Molecule),e=new g.d2.Line(new g.Point(-20,0),new g.Point(20,0));e.arrowType=g.d2.Line.ARROW_SYNTHETIC;return{molecules:b,shapes:[e]}};e.write=function(c,f){var b=[[],[]],e=void 0;if(c&&f){v=0;for(j=f.length;v<j;v++)if(f[v]instanceof
g.d2.Line){e=f[v].getPoints();break}if(!e)return"";for(var v=0,j=c.length;v<j;v++)c[v].getCenter().x<e[1].x?b[0].push(c[v]):b[1].push(c[v]);e=[];e.push("$RXN\nReaction from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n");e.push(this.fit(b[0].length.toString(),3));e.push(this.fit(b[1].length.toString(),3));e.push("\n");for(v=0;2>v;v++)for(var j=0,h=b[v].length;j<h;j++)e.push("$MOL\n"),e.push(a.writeMOL(b[v][j])),e.push("\n");return e.join("")}};var f=new c.RXNInterpreter;a.readRXN=function(a,
c){return f.read(a,c)};a.writeRXN=function(a,c){return f.write(a,c)}})(ChemDoodle,ChemDoodle.io,ChemDoodle.structures);
(function(a,c,g,e,f,d){e.XYZInterpreter=function(){};c=e.XYZInterpreter.prototype=new e._Interpreter;c.deduceCovalentBonds=!0;c.read=function(b){var c=new f.Molecule;if(!b)return c;b=b.split("\n");for(var e=parseInt(d(b[0])),j=0;j<e;j++){var h=b[j+2].split(/\s+/g);c.atoms[j]=new f.Atom(isNaN(h[0])?h[0]:g[parseInt(h[0])-1],parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3]))}this.deduceCovalentBonds&&(new a.informatics.BondDeducer).deduceCovalentBonds(c,1);return c};var n=new e.XYZInterpreter;a.readXYZ=
function(a){return n.read(a)}})(ChemDoodle,ChemDoodle.ELEMENT,ChemDoodle.SYMBOLS,ChemDoodle.io,ChemDoodle.structures,jQuery.trim);
ChemDoodle.monitor=function(a,c,g){var e={CANVAS_DRAGGING:void 0,CANVAS_OVER:void 0,ALT:!1,SHIFT:!1,META:!1};a.supports_touch()||c(g).ready(function(){c(g).mousemove(function(a){e.CANVAS_DRAGGING&&e.CANVAS_DRAGGING.drag&&(e.CANVAS_DRAGGING.prehandleEvent(a),e.CANVAS_DRAGGING.drag(a))});c(g).mouseup(function(a){e.CANVAS_DRAGGING&&e.CANVAS_DRAGGING!==e.CANVAS_OVER&&e.CANVAS_DRAGGING.mouseup&&(e.CANVAS_DRAGGING.prehandleEvent(a),e.CANVAS_DRAGGING.mouseup(a));e.CANVAS_DRAGGING=void 0});c(g).keydown(function(a){e.SHIFT=
a.shiftKey;e.ALT=a.altKey;e.META=a.metaKey||a.ctrlKey;var c=e.CANVAS_OVER;e.CANVAS_DRAGGING&&(c=e.CANVAS_DRAGGING);c&&c.keydown&&(c.prehandleEvent(a),c.keydown(a))});c(g).keypress(function(a){var c=e.CANVAS_OVER;e.CANVAS_DRAGGING&&(c=e.CANVAS_DRAGGING);c&&c.keypress&&(c.prehandleEvent(a),c.keypress(a))});c(g).keyup(function(a){e.SHIFT=a.shiftKey;e.ALT=a.altKey;e.META=a.metaKey||a.ctrlKey;var c=e.CANVAS_OVER;e.CANVAS_DRAGGING&&(c=e.CANVAS_DRAGGING);c&&c.keyup&&(c.prehandleEvent(a),c.keyup(a))})});
return e}(ChemDoodle.featureDetection,jQuery,document);
(function(a,c,g,e,f,d,n,b,m,v){a._Canvas=function(){};var j=a._Canvas.prototype;j.molecules=void 0;j.shapes=void 0;j.emptyMessage=void 0;j.image=void 0;j.repaint=function(){if(!this.test){var a=m.getElementById(this.id);if(a.getContext){var b=a.getContext("2d");1!==this.pixelRatio&&a.width===this.width&&(a.width=this.width*this.pixelRatio,a.height=this.height*this.pixelRatio,b.scale(this.pixelRatio,this.pixelRatio));this.image?b.drawImage(this.image,0,0):(this.specs.backgroundColor&&this.bgCache!==
a.style.backgroundColor&&(a.style.backgroundColor=this.specs.backgroundColor,this.bgCache=a.style.backgroundColor),b.fillStyle=this.specs.backgroundColor,b.fillRect(0,0,this.width,this.height));if(this.innerRepaint)this.innerRepaint(b);else if(0!==this.molecules.length||0!==this.shapes.length){b.save();b.translate(this.width/2,this.height/2);b.rotate(this.specs.rotateAngle);b.scale(this.specs.scale,this.specs.scale);b.translate(-this.width/2,-this.height/2);for(var a=0,c=this.molecules.length;a<c;a++)this.molecules[a].check(!0),
this.molecules[a].draw(b,this.specs);a=0;for(c=this.shapes.length;a<c;a++)this.shapes[a].draw(b,this.specs);b.restore()}else this.emptyMessage&&(b.fillStyle="#737683",b.textAlign="center",b.textBaseline="middle",b.font="18px Helvetica, Verdana, Arial, Sans-serif",b.fillText(this.emptyMessage,this.width/2,this.height/2));this.drawChildExtras&&this.drawChildExtras(b)}}};j.resize=function(b,c){var e=d("#"+this.id);e.attr({width:b,height:c});e.css("width",b);e.css("height",c);this.width=b;this.height=
c;if(a._Canvas3D&&this instanceof a._Canvas3D)this.gl.viewport(0,0,b,c),this.setupScene();else if(0<this.molecules.length){this.center();for(var e=0,f=this.molecules.length;e<f;e++)this.molecules[e].check()}this.repaint()};j.setBackgroundImage=function(a){this.image=new Image;var b=this;this.image.onload=function(){b.repaint()};this.image.src=a};j.loadMolecule=function(b){this.clear();this.molecules.push(b);this.center();a._Canvas3D&&this instanceof a._Canvas3D||b.check();this.afterLoadContent&&this.afterLoadContent();
this.repaint()};j.loadContent=function(b,c){this.molecules=b?b:[];this.shapes=c?c:[];this.center();if(!(a._Canvas3D&&this instanceof a._Canvas3D))for(var d=0,e=this.molecules.length;d<e;d++)this.molecules[d].check();this.afterLoadContent&&this.afterLoadContent();this.repaint()};j.addMolecule=function(b){this.molecules.push(b);a._Canvas3D&&this instanceof a._Canvas3D||b.check();this.repaint()};j.removeMolecule=function(a){this.molecules=d.grep(this.molecules,function(b){return b!==a});this.repaint()};
j.getMolecule=function(){return 0<this.molecules.length?this.molecules[0]:void 0};j.getMolecules=function(){return this.molecules};j.addShape=function(a){this.shapes.push(a);this.repaint()};j.removeShape=function(a){this.shapes=d.grep(this.shapes,function(b){return b!==a});this.repaint()};j.getShapes=function(){return this.shapes};j.clear=function(){this.molecules=[];this.shapes=[];this.specs.scale=1;this.repaint()};j.center=function(){for(var a=this.getContentBounds(),c=new f.Point((this.width-a.minX-
a.maxX)/2,(this.height-a.minY-a.maxY)/2),d=0,e=this.molecules.length;d<e;d++)for(var g=this.molecules[d],j=0,m=g.atoms.length;j<m;j++)g.atoms[j].add(c);d=0;for(e=this.shapes.length;d<e;d++){g=this.shapes[d].getPoints();j=0;for(m=g.length;j<m;j++)g[j].add(c)}this.specs.scale=1;c=a.maxX-a.minX;a=a.maxY-a.minY;if(c>this.width||a>this.height)this.specs.scale=0.85*b.min(this.width/c,this.height/a)};j.bondExists=function(a,b){for(var c=0,d=this.molecules.length;c<d;c++)for(var e=this.molecules[c],f=0,g=
e.bonds.length;f<g;f++){var j=e.bonds[f];if(j.contains(a)&&j.contains(b))return!0}return!1};j.getBond=function(a,b){for(var c=0,d=this.molecules.length;c<d;c++)for(var e=this.molecules[c],f=0,g=e.bonds.length;f<g;f++){var j=e.bonds[f];if(j.contains(a)&&j.contains(b))return j}};j.getMoleculeByAtom=function(a){for(var b=0,c=this.molecules.length;b<c;b++){var d=this.molecules[b];if(-1!==d.atoms.indexOf(a))return d}};j.getAllAtoms=function(){for(var a=[],b=0,c=this.molecules.length;b<c;b++)a=a.concat(this.molecules[b].atoms);
return a};j.getAllPoints=function(){for(var a=[],b=0,c=this.molecules.length;b<c;b++)a=a.concat(this.molecules[b].atoms);b=0;for(c=this.shapes.length;b<c;b++)a=a.concat(this.shapes[b].getPoints());return a};j.getContentBounds=function(){for(var a=new g.Bounds,b=0,c=this.molecules.length;b<c;b++)a.expand(this.molecules[b].getBounds());b=0;for(c=this.shapes.length;b<c;b++)a.expand(this.shapes[b].getBounds());return a};j.create=function(g,j,p){this.id=g;this.width=j;this.height=p;this.molecules=[];this.shapes=
[];if(m.getElementById(g)){var u=d("#"+g);j?u.attr("width",j):this.width=u.attr("width");p?u.attr("height",p):this.height=u.attr("height");u.attr("class","ChemDoodleWebComponent")}else{if(!a.featureDetection.supports_canvas_text()&&n.msie&&"6"<=n.version){m.writeln('\x3cdiv style\x3d"border: 1px solid black;" width\x3d"'+j+'" height\x3d"'+p+'"\x3ePlease install \x3ca href\x3d"http://code.google.com/chrome/chromeframe/"\x3eGoogle Chrome Frame\x3c/a\x3e, then restart Internet Explorer.\x3c/div\x3e');
return}m.writeln('\x3ccanvas class\x3d"ChemDoodleWebComponent" id\x3d"'+g+'" width\x3d"'+j+'" height\x3d"'+p+'" alt\x3d"ChemDoodle Web Component"\x3eThis browser does not support HTML5/Canvas.\x3c/canvas\x3e')}g=d("#"+g);g.css("width",this.width);g.css("height",this.height);this.pixelRatio=v.devicePixelRatio?v.devicePixelRatio:1;this.specs=new f.VisualSpecifications;var l=this;c.supports_touch()?(g.bind("touchstart",function(a){var b=(new Date).getTime();if(!c.supports_gesture()&&2===a.originalEvent.touches.length){var d=
a.originalEvent.touches,e=new f.Point(d[0].pageX,d[0].pageY),d=new f.Point(d[1].pageX,d[1].pageY);l.implementedGestureDist=e.distance(d);l.implementedGestureAngle=e.angle(d);l.gesturestart&&(l.prehandleEvent(a),l.gesturestart(a))}l.lastTouch&&1===a.originalEvent.touches.length&&500>b-l.lastTouch?l.dbltap?(l.prehandleEvent(a),l.dbltap(a)):l.dblclick?(l.prehandleEvent(a),l.dblclick(a)):l.touchstart?(l.prehandleEvent(a),l.touchstart(a)):l.mousedown&&(l.prehandleEvent(a),l.mousedown(a)):l.touchstart?
(l.prehandleEvent(a),l.touchstart(a),this.hold&&clearTimeout(this.hold),this.touchhold&&(this.hold=setTimeout(function(){l.touchhold(a)},1E3))):l.mousedown&&(l.prehandleEvent(a),l.mousedown(a));l.lastTouch=b}),g.bind("touchmove",function(a){this.hold&&(clearTimeout(this.hold),this.hold=void 0);if(!c.supports_gesture()&&2===a.originalEvent.touches.length&&l.gesturechange){var d=a.originalEvent.touches,e=new f.Point(d[0].pageX,d[0].pageY),g=new f.Point(d[1].pageX,d[1].pageY),d=e.distance(g),e=e.angle(g);
a.originalEvent.scale=d/l.implementedGestureDist;a.originalEvent.rotation=180*(l.implementedGestureAngle-e)/b.PI;l.prehandleEvent(a);l.gesturechange(a)}if(1<a.originalEvent.touches.length&&l.multitouchmove){e=a.originalEvent.touches.length;l.prehandleEvent(a);d=new f.Point(-a.offset.left*e,-a.offset.top*e);for(g=0;g<e;g++)d.x+=a.originalEvent.changedTouches[g].pageX,d.y+=a.originalEvent.changedTouches[g].pageY;d.x/=e;d.y/=e;a.p=d;l.multitouchmove(a,e)}else l.touchmove?(l.prehandleEvent(a),l.touchmove(a)):
l.drag&&(l.prehandleEvent(a),l.drag(a))}),g.bind("touchend",function(a){this.hold&&(clearTimeout(this.hold),this.hold=void 0);!c.supports_gesture()&&l.implementedGestureDist&&(l.implementedGestureDist=void 0,l.implementedGestureAngle=void 0,l.gestureend&&(l.prehandleEvent(a),l.gestureend(a)));l.touchend?(l.prehandleEvent(a),l.touchend(a)):l.mouseup&&(l.prehandleEvent(a),l.mouseup(a));250>(new Date).getTime()-l.lastTouch&&(l.tap?(l.prehandleEvent(a),l.tap(a)):l.click&&(l.prehandleEvent(a),l.click(a)))}),
g.bind("gesturestart",function(a){l.gesturestart&&(l.prehandleEvent(a),l.gesturestart(a))}),g.bind("gesturechange",function(a){l.gesturechange&&(l.prehandleEvent(a),l.gesturechange(a))}),g.bind("gestureend",function(a){l.gestureend&&(l.prehandleEvent(a),l.gestureend(a))})):(g.click(function(a){switch(a.which){case 1:l.click&&(l.prehandleEvent(a),l.click(a));break;case 2:l.middleclick&&(l.prehandleEvent(a),l.middleclick(a));break;case 3:l.rightclick&&(l.prehandleEvent(a),l.rightclick(a))}}),g.dblclick(function(a){l.dblclick&&
(l.prehandleEvent(a),l.dblclick(a))}),g.mousedown(function(a){switch(a.which){case 1:e.CANVAS_DRAGGING=l;l.mousedown&&(l.prehandleEvent(a),l.mousedown(a));break;case 2:l.middlemousedown&&(l.prehandleEvent(a),l.middlemousedown(a));break;case 3:l.rightmousedown&&(l.prehandleEvent(a),l.rightmousedown(a))}}),g.mousemove(function(a){!e.CANVAS_DRAGGING&&l.mousemove&&(l.prehandleEvent(a),l.mousemove(a))}),g.mouseout(function(a){e.CANVAS_OVER=void 0;l.mouseout&&(l.prehandleEvent(a),l.mouseout(a))}),g.mouseover(function(a){e.CANVAS_OVER=
l;l.mouseover&&(l.prehandleEvent(a),l.mouseover(a))}),g.mouseup(function(a){switch(a.which){case 1:l.mouseup&&(l.prehandleEvent(a),l.mouseup(a));break;case 2:l.middlemouseup&&(l.prehandleEvent(a),l.middlemouseup(a));break;case 3:l.rightmouseup&&(l.prehandleEvent(a),l.rightmouseup(a))}}),g.mousewheel(function(a,b){l.mousewheel&&(l.prehandleEvent(a),l.mousewheel(a,b))}));this.subCreate&&this.subCreate()};j.prehandleEvent=function(a){a.originalEvent.changedTouches&&(a.pageX=a.originalEvent.changedTouches[0].pageX,
a.pageY=a.originalEvent.changedTouches[0].pageY);a.preventDefault();a.offset=d("#"+this.id).offset();a.p=new f.Point(a.pageX-a.offset.left,a.pageY-a.offset.top)}})(ChemDoodle,ChemDoodle.featureDetection,ChemDoodle.math,ChemDoodle.monitor,ChemDoodle.structures,jQuery,jQuery.browser,Math,document,window);
(function(a){a._AnimatorCanvas=function(a,g,e){a&&this.create(a,g,e)};a=a._AnimatorCanvas.prototype=new a._Canvas;a.timeout=33;a.startAnimation=function(){this.stopAnimation();this.lastTime=(new Date).getTime();var a=this;this.nextFrame&&(this.handle=setInterval(function(){var g=(new Date).getTime();a.nextFrame(g-a.lastTime);a.repaint();a.lastTime=g},this.timeout))};a.stopAnimation=function(){this.handle&&(clearInterval(this.handle),this.handle=void 0)};a.isRunning=function(){return void 0!==this.handle}})(ChemDoodle);
(function(a,c){a.FileCanvas=function(a,e,f,d){a&&this.create(a,e,f);c.writeln('\x3cbr\x3e\x3cform name\x3d"FileForm" enctype\x3d"multipart/form-data" method\x3d"POST" action\x3d"'+d+'" target\x3d"HiddenFileFrame"\x3e\x3cinput type\x3d"file" name\x3d"f" /\x3e\x3cinput type\x3d"submit" name\x3d"submitbutton" value\x3d"Show File" /\x3e\x3c/form\x3e\x3ciframe id\x3d"HFF-'+a+'" name\x3d"HiddenFileFrame" height\x3d"0" width\x3d"0" style\x3d"display:none;" onLoad\x3d"GetMolFromFrame(\'HFF-'+a+"', "+a+')"\x3e\x3c/iframe\x3e');
this.emptyMessage="Click below to load file";this.repaint()};a.FileCanvas.prototype=new a._Canvas})(ChemDoodle,document);
(function(a){a.HyperlinkCanvas=function(a,g,e,f,d,n){a&&this.create(a,g,e);this.urlOrFunction=f;this.color=d?d:"blue";this.size=n?n:2};a=a.HyperlinkCanvas.prototype=new a._Canvas;a.openInNewWindow=!0;a.hoverImage=void 0;a.drawChildExtras=function(a){this.e&&(this.hoverImage?a.drawImage(this.hoverImage,0,0):(a.strokeStyle=this.color,a.lineWidth=2*this.size,a.strokeRect(0,0,this.width,this.height)))};a.setHoverImage=function(a){this.hoverImage=new Image;this.hoverImage.src=a};a.click=function(){this.e=
void 0;this.repaint();this.urlOrFunction instanceof Function?this.urlOrFunction():this.openInNewWindow?window.open(this.urlOrFunction):location.href=this.urlOrFunction};a.mouseout=function(){this.e=void 0;this.repaint()};a.mouseover=function(a){this.e=a;this.repaint()}})(ChemDoodle);
(function(a,c,g,e){a.MolGrabberCanvas=function(a,c,n){a&&this.create(a,c,n);c=[];c.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');c.push(a);c.push('_query" size\x3d"32" value\x3d"" /\x3e');c.push("\x3cbr\x3e\x3cnobr\x3e");c.push('\x3cselect id\x3d"');c.push(a);c.push('_select"\x3e');c.push('\x3coption value\x3d"chemexper"\x3eChemExper');c.push('\x3coption value\x3d"chemspider"\x3eChemSpider');c.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');c.push("\x3c/select\x3e");c.push('\x3cbutton id\x3d"');
c.push(a);c.push('_submit"\x3eShow Molecule\x3c/button\x3e');c.push("\x3c/nobr\x3e");e.getElementById(a);g("#"+a).after(c.join(""));var b=this;g("#"+a+"_submit").click(function(){b.search()});g("#"+a+"_query").keypress(function(a){13===a.which&&b.search()});this.emptyMessage="Enter search term below";this.repaint()};a=a.MolGrabberCanvas.prototype=new a._Canvas;a.setSearchTerm=function(a){g("#"+this.id+"_query").val(a);this.search()};a.search=function(){this.emptyMessage="Searching...";this.clear();
var a=this;c.getMoleculeFromDatabase(g("#"+this.id+"_query").val(),{database:g("#"+this.id+"_select").val()},function(c){a.loadMolecule(c)})}})(ChemDoodle,ChemDoodle.iChemLabs,jQuery,document);
(function(a,c,g){var e=[],f=[1,0,0],d=[0,1,0],n=[0,0,1];a.RotatorCanvas=function(a,c,d,e){a&&this.create(a,c,d);this.rotate3D=e};a=a.RotatorCanvas.prototype=new a._AnimatorCanvas;c=c.PI/15;a.xIncrement=c;a.yIncrement=c;a.zIncrement=c;a.nextFrame=function(a){if(0===this.molecules.length&&0===this.shapes.length)this.stopAnimation();else if(a/=1E3,this.rotate3D){g.identity(e);g.rotate(e,this.xIncrement*a,f);g.rotate(e,this.yIncrement*a,d);g.rotate(e,this.zIncrement*a,n);a=0;for(var c=this.molecules.length;a<
c;a++){for(var v=this.molecules[a],j=0,h=v.atoms.length;j<h;j++){var k=v.atoms[j],p=[k.x-this.width/2,k.y-this.height/2,k.z];g.multiplyVec3(e,p);k.x=p[0]+this.width/2;k.y=p[1]+this.height/2;k.z=p[2]}j=0;for(h=v.rings.length;j<h;j++)v.rings[j].center=v.rings[j].getCenter();this.specs.atoms_display&&this.specs.atoms_circles_2D&&v.sortAtomsByZ();this.specs.bonds_display&&this.specs.bonds_clearOverlaps_2D&&v.sortBondsByZ()}a=0;for(c=this.shapes.length;a<c;a++){v=this.shapes[a].getPoints();j=0;for(h=v.length;j<
h;j++)k=v[j],p=[k.x-this.width/2,k.y-this.height/2,0],g.multiplyVec3(e,p),k.x=p[0]+this.width/2,k.y=p[1]+this.height/2}}else this.specs.rotateAngle+=this.zIncrement*a};a.dblclick=function(){this.isRunning()?this.stopAnimation():this.startAnimation()}})(ChemDoodle,Math,mat4);
(function(a,c){a.SlideshowCanvas=function(a,c,d){a&&this.create(a,c,d)};var g=a.SlideshowCanvas.prototype=new a._AnimatorCanvas;g.frames=[];g.curIndex=0;g.timeout=5E3;g.alpha=0;g.innerHandle=void 0;g.phase=0;g.drawChildExtras=function(a){var f=c.getRGB(this.specs.backgroundColor,255);a.fillStyle="rgba("+f[0]+", "+f[1]+", "+f[2]+", "+this.alpha+")";a.fillRect(0,0,this.width,this.height)};g.nextFrame=function(){if(0===this.frames.length)this.stopAnimation();else{this.phase=0;var a=this,c=1;this.innerHandle=
setInterval(function(){a.alpha=c/15;a.repaint();15===c&&a.breakInnerHandle();c++},33)}};g.breakInnerHandle=function(){this.innerHandle&&(clearInterval(this.innerHandle),this.innerHandle=void 0);if(0===this.phase){this.curIndex++;this.curIndex>this.frames.length-1&&(this.curIndex=0);this.alpha=1;var a=this.frames[this.curIndex];this.loadContent(a.mols,a.shapes);this.phase=1;var c=this,d=1;this.innerHandle=setInterval(function(){c.alpha=(15-d)/15;c.repaint();15===d&&c.breakInnerHandle();d++},33)}else 1===
this.phase&&(this.alpha=0,this.repaint())};g.addFrame=function(a,c){0===this.frames.length&&this.loadContent(a,c);this.frames.push({mols:a,shapes:c})}})(ChemDoodle,ChemDoodle.math);
(function(a,c,g,e,f){a.TransformCanvas=function(a,c,b,e){a&&this.create(a,c,b);this.rotate3D=e};a=a.TransformCanvas.prototype=new a._Canvas;a.lastPoint=void 0;a.rotationMultMod=1.3;a.lastPinchScale=1;a.lastGestureRotate=0;a.mousedown=function(a){this.lastPoint=a.p};a.dblclick=function(){this.center();this.repaint()};a.drag=function(a){if(!this.lastPoint.multi){if(c.ALT){var n=new g.Point(a.p.x,a.p.y);n.sub(this.lastPoint);for(var b=0,m=this.molecules.length;b<m;b++){for(var v=this.molecules[b],j=
0,h=v.atoms.length;j<h;j++)v.atoms[j].add(n);v.check()}b=0;for(m=this.shapes.length;b<m;b++){v=this.shapes[b].getPoints();j=0;for(h=v.length;j<h;j++)v[j].add(n)}this.lastPoint=a.p}else if(!0===this.rotate3D){h=e.max(this.width/4,this.height/4);j=(a.p.x-this.lastPoint.x)/h*this.rotationMultMod;h=-(a.p.y-this.lastPoint.y)/h*this.rotationMultMod;n=[];f.identity(n);f.rotate(n,h,[1,0,0]);f.rotate(n,j,[0,1,0]);b=0;for(m=this.molecules.length;b<m;b++){v=this.molecules[b];j=0;for(h=v.atoms.length;j<h;j++)b=
v.atoms[j],m=[b.x-this.width/2,b.y-this.height/2,b.z],f.multiplyVec3(n,m),b.x=m[0]+this.width/2,b.y=m[1]+this.height/2,b.z=m[2];b=0;for(m=v.rings.length;b<m;b++)v.rings[b].center=v.rings[b].getCenter();this.lastPoint=a.p;this.specs.atoms_display&&this.specs.atoms_circles_2D&&v.sortAtomsByZ();this.specs.bonds_display&&this.specs.bonds_clearOverlaps_2D&&v.sortBondsByZ()}}else h=new g.Point(this.width/2,this.height/2),j=h.angle(this.lastPoint),h=h.angle(a.p),this.specs.rotateAngle-=h-j,this.lastPoint=
a.p;this.repaint()}};a.mousewheel=function(a,c){this.specs.scale+=c/50;0.01>this.specs.scale&&(this.specs.scale=0.01);this.repaint()};a.multitouchmove=function(a,c){if(2===c)if(this.lastPoint.multi){var b=new g.Point(a.p.x,a.p.y);b.sub(this.lastPoint);for(var e=0,f=this.molecules.length;e<f;e++){for(var j=this.molecules[e],h=0,k=j.atoms.length;h<k;h++)j.atoms[h].add(b);j.check()}e=0;for(f=this.shapes.length;e<f;e++){j=this.shapes[e].getPoints();h=0;for(k=j.length;h<k;h++)j[h].add(b)}this.lastPoint=
a.p;this.lastPoint.multi=!0;this.repaint()}else this.lastPoint=a.p,this.lastPoint.multi=!0};a.gesturechange=function(a){0!==a.originalEvent.scale-this.lastPinchScale&&(this.specs.scale*=a.originalEvent.scale/this.lastPinchScale,0.01>this.specs.scale&&(this.specs.scale=0.01),this.lastPinchScale=a.originalEvent.scale);if(0!==this.lastGestureRotate-a.originalEvent.rotation){for(var c=(this.lastGestureRotate-a.originalEvent.rotation)/180*j.PI,b=new g.Point(this.width/2,this.height/2),e=0,f=this.molecules.length;e<
f;e++){for(var j=this.molecules[e],h=0,k=j.atoms.length;h<k;h++){var p=j.atoms[h],u=b.distance(p),l=b.angle(p)+c;p.x=b.x+u*j.cos(l);p.y=b.y-u*j.sin(l)}j.check()}this.lastGestureRotate=a.originalEvent.rotation}this.repaint()};a.gestureend=function(){this.lastPinchScale=1;this.lastGestureRotate=0}})(ChemDoodle,ChemDoodle.monitor,ChemDoodle.structures,Math,mat4);(function(a){a.ViewerCanvas=function(a,g,e){a&&this.create(a,g,e)};a.ViewerCanvas.prototype=new a._Canvas})(ChemDoodle);
(function(a){a._SpectrumCanvas=function(a,g,e){a&&this.create(a,g,e)};a=a._SpectrumCanvas.prototype=new a._Canvas;a.spectrum=void 0;a.emptyMessage="No Spectrum Loaded or Recognized";a.loadMolecule=void 0;a.getMolecule=void 0;a.innerRepaint=function(a){this.spectrum&&0<this.spectrum.data.length?this.spectrum.draw(a,this.specs,this.width,this.height):this.emptyMessage&&(a.fillStyle="#737683",a.textAlign="center",a.textBaseline="middle",a.font="18px Helvetica, Verdana, Arial, Sans-serif",a.fillText(this.emptyMessage,
this.width/2,this.height/2))};a.loadSpectrum=function(a){this.spectrum=a;this.repaint()};a.getSpectrum=function(){return this.spectrum};a.getSpectrumCoordinates=function(a,g){return spectrum.getInternalCoordinates(a,g,this.width,this.height)}})(ChemDoodle,document);(function(a){a.ObserverCanvas=function(a,g,e){a&&this.create(a,g,e)};a.ObserverCanvas.prototype=new a._SpectrumCanvas})(ChemDoodle);
(function(a){a.OverlayCanvas=function(a,g,e){a&&this.create(a,g,e)};a=a.OverlayCanvas.prototype=new a._SpectrumCanvas;a.overlaySpectra=[];a.superRepaint=a.innerRepaint;a.innerRepaint=function(a){this.superRepaint(a);if(this.spectrum&&0<this.spectrum.data.length)for(var g=0,e=this.overlaySpectra.length;g<e;g++){var f=this.overlaySpectra[g];f&&0<f.data.length&&(f.minX=this.spectrum.minX,f.maxX=this.spectrum.maxX,f.drawPlot(a,this.specs,this.width,this.height,this.spectrum.memory.offsetTop,this.spectrum.memory.offsetLeft,
this.spectrum.memory.offsetBottom))}};a.addSpectrum=function(a){this.spectrum?this.overlaySpectra.push(a):this.spectrum=a}})(ChemDoodle);
(function(a,c,g){a.PerspectiveCanvas=function(a,c,e){a&&this.create(a,c,e)};var e=a.PerspectiveCanvas.prototype=new a._SpectrumCanvas;e.dragRange=void 0;e.rescaleYAxisOnZoom=!0;e.lastPinchScale=1;e.mousedown=function(c){this.dragRange=new a.structures.Point(c.p.x,c.p.x)};e.mouseup=function(a){this.dragRange&&this.dragRange.x!==this.dragRange.y&&(this.dragRange.multi||(a=this.spectrum.zoom(this.dragRange.x,a.p.x,this.width,this.rescaleYAxisOnZoom),this.rescaleYAxisOnZoom&&(this.specs.scale=a)),this.dragRange=
void 0,this.repaint())};e.drag=function(a){this.dragRange&&(this.dragRange.multi?this.dragRange=void 0:(c.SHIFT&&(this.spectrum.translate(a.p.x-this.dragRange.x,this.width),this.dragRange.x=a.p.x),this.dragRange.y=a.p.x),this.repaint())};e.drawChildExtras=function(a){if(this.dragRange){var c=g.min(this.dragRange.x,this.dragRange.y),e=g.max(this.dragRange.x,this.dragRange.y);a.strokeStyle="gray";a.lineStyle=1;a.beginPath();for(a.moveTo(c,this.height/2);c<=e;c++)5>c%10?a.lineTo(c,g.round(this.height/
2)):a.moveTo(c,g.round(this.height/2));a.stroke()}};e.mousewheel=function(a,c){this.specs.scale+=c/10;0.01>this.specs.scale&&(this.specs.scale=0.01);this.repaint()};e.dblclick=function(){this.spectrum.setup();this.specs.scale=1;this.repaint()};e.multitouchmove=function(c,d){2===d&&(!this.dragRange||!this.dragRange.multi?(this.dragRange=new a.structures.Point(c.p.x,c.p.x),this.dragRange.multi=!0):(this.spectrum.translate(c.p.x-this.dragRange.x,this.width),this.dragRange.x=c.p.x,this.dragRange.y=c.p.x,
this.repaint()))};e.gesturechange=function(a){this.specs.scale*=a.originalEvent.scale/this.lastPinchScale;0.01>this.specs.scale&&(this.specs.scale=0.01);this.lastPinchScale=a.originalEvent.scale;this.repaint()};e.gestureend=function(){this.lastPinchScale=1}})(ChemDoodle,ChemDoodle.monitor,Math);
(function(a,c,g){a.SeekerCanvas=function(a,c,e,b){a&&this.create(a,c,e);this.seekType=b};var e=a.SeekerCanvas.prototype=new a._SpectrumCanvas;e.superRepaint=e.innerRepaint;e.innerRepaint=function(e){this.superRepaint(e);if(this.spectrum&&0<this.spectrum.data.length&&this.p){var d,n;if(this.seekType===a.SeekerCanvas.SEEK_POINTER)d=this.p,n=this.spectrum.getInternalCoordinates(d.x,d.y);else if(this.seekType===a.SeekerCanvas.SEEK_PLOT||this.seekType===a.SeekerCanvas.SEEK_PEAK){n=this.seekType===a.SeekerCanvas.SEEK_PLOT?
this.spectrum.getClosestPlotInternalCoordinates(this.p.x):this.spectrum.getClosestPeakInternalCoordinates(this.p.x);if(!n)return;d={x:this.spectrum.getTransformedX(n.x,this.specs,this.width,this.spectrum.memory.offsetLeft),y:this.spectrum.getTransformedY(n.y/100,this.specs,this.height,this.spectrum.memory.offsetBottom,this.spectrum.memory.offsetTop)}}e.fillStyle="white";e.strokeStyle=this.specs.plots_color;e.lineWidth=this.specs.plots_width;e.beginPath();e.arc(d.x,d.y,3,0,2*g.PI,!1);e.fill();e.stroke();
e.font=c.getFontString(this.specs.text_font_size,this.specs.text_font_families);e.textAlign="left";e.textBaseline="bottom";n="x:"+n.x.toFixed(3)+", y:"+n.y.toFixed(3);var b=d.x+3,m=e.measureText(n).width;b+m>this.width-2&&(b-=6+m);d=d.y;0>d-this.specs.text_font_size-2&&(d+=this.specs.text_font_size);e.fillRect(b,d-this.specs.text_font_size,m,this.specs.text_font_size);e.fillStyle="black";e.fillText(n,b,d)}};e.mouseout=function(){this.p=void 0;this.repaint()};e.mousemove=function(a){this.p={x:a.p.x-
2,y:a.p.y-3};this.repaint()};e.touchstart=function(a){this.mousemove(a)};e.touchmove=function(a){this.mousemove(a)};e.touchend=function(a){this.mouseout(a)};a.SeekerCanvas.SEEK_POINTER="pointer";a.SeekerCanvas.SEEK_PLOT="plot";a.SeekerCanvas.SEEK_PEAK="peak"})(ChemDoodle,ChemDoodle.extensions,Math);
(function(a,c,g,e,f,d,n,b,m,v,j){a._Canvas3D=function(a,b,c){a&&this.create(a,b,c)};var h=a._Canvas3D.prototype=new a._Canvas;h.rotationMatrix=void 0;h.translationMatrix=void 0;h.lastPoint=void 0;h.emptyMessage="WebGL is Unavailable!";h.afterLoadContent=function(){for(var a=new g.Bounds,b=0,c=this.molecules.length;b<c;b++)a.expand(this.molecules[b].getBounds3D());var d=j.dist([a.maxX,a.maxY,a.maxZ],[a.minX,a.minY,a.minZ])/2+1.5,b=45,c=Math.tan(b/360*Math.PI)/0.8;this.depth=d/c;var c=n.max(this.depth-
d,0.1),d=this.depth+d,e=this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;1>e&&(b/=e);this.specs.projectionOrthoWidth_3D=2*(Math.tan(b/360*Math.PI)*this.depth)*e;this.specs.projectionPerspectiveVerticalFieldOfView_3D=b;this.specs.projectionFrontCulling_3D=c;this.specs.projectionBackCulling_3D=d;this.specs.projectionWidthHeightRatio_3D=e;this.translationMatrix=m.translate(m.identity([]),[0,0,-this.depth]);this.maxDimension=n.max(a.maxX-a.minX,a.maxY-a.minY);this.setupScene()};h.setViewDistance=
function(a){this.specs.projectionPerspectiveVerticalFieldOfView_3D=g.clamp(this.specs.projectionPerspectiveVerticalFieldOfView_3D/a,0.1,179.9);this.specs.projectionOrthoWidth_3D=2*(n.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*Math.PI)*this.depth)*this.specs.projectionWidthHeightRatio_3D;this.updateScene()};h.repaint=function(){if(this.gl){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);this.gl.modelViewMatrix=m.multiply(this.translationMatrix,this.rotationMatrix,
[]);this.gl.rotationMatrix=this.rotationMatrix;var a=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(a,!1,this.gl.projectionMatrix);this.gl.fogging.setMode(this.specs.fog_mode_3D);for(var b=0,c=this.molecules.length;b<c;b++)this.molecules[b].render(this.gl,this.specs);b=0;for(c=this.shapes.length;b<c;b++)this.shapes[b].render(this.gl,this.specs);this.specs.compass_display&&(this.gl.uniformMatrix4fv(a,!1,this.compass.projectionMatrix),this.compass.render(this.gl,
this.specs));a=this.gl.shaderText;this.gl.useProgram(this.gl.programLabel);this.gl.enable(this.gl.BLEND);this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA);this.gl.depthMask(!1);this.gl.enableVertexAttribArray(a.vertexPositionAttribute);this.gl.enableVertexAttribArray(a.vertexTexCoordAttribute);this.gl.enableVertexAttribArray(a.vertexTranslationAttribute);this.gl.enableVertexAttribArray(a.vertexZDepthAttribute);this.specs.atoms_displayLabels_3D&&
this.label3D.render(this.gl,this.specs,this.getMolecules());this.specs.compass_display&&this.specs.compass_displayText_3D&&this.compass.renderText(this.gl);this.gl.disableVertexAttribArray(a.vertexPositionAttribute);this.gl.disableVertexAttribArray(a.vertexTexCoordAttribute);this.gl.disableVertexAttribArray(a.vertexTranslationAttribute);this.gl.disableVertexAttribArray(a.vertexZDepthAttribute);this.gl.disable(this.gl.BLEND);this.gl.depthMask(!0);this.gl.useProgram(this.gl.program);this.gl.enableVertexAttribArray(this.gl.shader.vertexPositionAttribute);
this.gl.enableVertexAttribArray(this.gl.shader.vertexNormalAttribute);this.gl.flush()}};h.pick=function(a,b){if(this.gl){var c=this.gl;m.multiply(this.translationMatrix,this.rotationMatrix,this.gl.modelViewMatrix);this.gl.rotationMatrix=this.rotationMatrix;var d=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(d,!1,this.gl.projectionMatrix);return this.picker.pick(c,this.molecules,this.specs,a,this.height-b)}};h.center=function(){b.getElementById(this.id);
for(var a=new e.Atom,c=0,d=this.molecules.length;c<d;c++){var f=this.molecules[c];a.add3D(f.getCenter3D())}a.x/=this.molecules.length;a.y/=this.molecules.length;c=0;for(d=this.molecules.length;c<d;c++){for(var f=this.molecules[c],g=0,j=f.atoms.length;g<j;g++)f.atoms[g].sub3D(a);if(f.chains&&f.fromJSON){g=0;for(j=f.chains.length;g<j;g++)for(var h=f.chains[g],m=0,n=h.length;m<n;m++){var v=h[m];v.cp1.sub3D(a);v.cp2.sub3D(a);v.cp3&&(v.cp3.sub3D(a),v.cp4.sub3D(a),v.cp5.sub3D(a))}}}};h.subCreate=function(){try{var a=
b.getElementById(this.id);this.gl=a.getContext("webgl");this.gl||(this.gl=a.getContext("experimental-webgl"))}catch(c){}this.gl?(this.rotationMatrix=m.identity([]),this.translationMatrix=m.identity([]),this.gl.viewport(0,0,this.width,this.height),this.gl.program=this.gl.createProgram(),this.gl.shader=new f.Shader,this.gl.shader.init(this.gl),this.gl.programLabel=this.gl.createProgram(),this.gl.shaderText=new f.TextShader,this.gl.shaderText.init(this.gl),this.setupScene()):this.displayMessage()};a._Canvas.prototype.displayMessage=
function(){var a=b.getElementById(this.id);a.getContext&&(a=a.getContext("2d"),this.specs.backgroundColor&&(a.fillStyle=this.specs.backgroundColor,a.fillRect(0,0,this.width,this.height)),this.emptyMessage&&(a.fillStyle="#737683",a.textAlign="center",a.textBaseline="middle",a.font="18px Helvetica, Verdana, Arial, Sans-serif",a.fillText(this.emptyMessage,this.width/2,this.height/2)))};h.setupScene=function(){if(this.gl){var b=g.getRGB(this.specs.backgroundColor,1);this.gl.clearColor(b[0],b[1],b[2],
1);this.gl.clearDepth(1);this.gl.enable(this.gl.DEPTH_TEST);this.gl.depthFunc(this.gl.LEQUAL);this.specs.cullBackFace_3D&&this.gl.enable(this.gl.CULL_FACE);this.gl.sphereBuffer=new f.Sphere(1,this.specs.atoms_resolution_3D,this.specs.atoms_resolution_3D);this.gl.starBuffer=new f.Star;this.gl.cylinderBuffer=new f.Cylinder(1,1,this.specs.bonds_resolution_3D);this.gl.pillBuffer=new f.Pill(this.specs.bonds_pillDiameter_3D/2,this.specs.bonds_pillHeight_3D,this.specs.bonds_pillLatitudeResolution_3D,this.specs.bonds_pillLongitudeResolution_3D);
this.gl.lineBuffer=new f.Line;this.gl.arrowBuffer=new f.Arrow(0.3,this.specs.compass_resolution_3D);this.label3D=new f.Label;this.label3D.init(this.gl,this.specs);for(var h=0,u=this.molecules.length;h<u;h++)if(b=this.molecules[h],b.labelMesh instanceof f.TextMesh||(b.labelMesh=new f.TextMesh,b.labelMesh.init(this.gl)),b.unitCellVectors&&(b.unitCell=new f.UnitCell(b.unitCellVectors)),b.chains){b.ribbons=[];b.cartoons=[];b.tubes=[];for(var l=0,t=b.chains.length;l<t;l++){var o=b.chains[l],r=2<o.length&&
d[o[2].name]&&"#BEA06E"===d[o[2].name].aminoColor;if(0<o.length&&!o[0].lineSegments){for(var q=0,w=o.length-1;q<w;q++)o[q].setup(o[q+1].cp1,r?1:this.specs.proteins_horizontalResolution);if(!r){q=1;for(w=o.length-1;q<w;q++)c.vec3AngleFrom(o[q-1].D,o[q].D)>n.PI/2&&(o[q].guidePointsSmall.reverse(),o[q].guidePointsLarge.reverse(),j.scale(o[q].D,-1))}q=1;for(w=o.length-3;q<w;q++)o[q].computeLineSegments(o[q-1],o[q+1],o[q+2],!r,r?this.specs.nucleics_verticalResolution:this.specs.proteins_verticalResolution);
o.pop();o.pop();o.pop();o.shift()}var q=g.hsl2rgb(1===t?0.5:l/t,1,0.5),y="rgb("+q[0]+","+q[1]+","+q[2]+")";o.chainColor=y;if(r)q=new f.Tube(o,this.specs.nucleics_tubeThickness,this.specs.nucleics_tubeResolution_3D),q.chainColor=y,b.tubes.push(q);else{r={front:new f.Ribbon(o,this.specs.proteins_ribbonThickness,!1),back:new f.Ribbon(o,-this.specs.proteins_ribbonThickness,!1)};r.front.chainColor=y;r.back.chainColor=y;q=0;for(w=r.front.segments.length;q<w;q++)r.front.segments[q].chainColor=y;q=0;for(w=
r.back.segments.length;q<w;q++)r.back.segments[q].chainColor=y;b.ribbons.push(r);o={front:new f.Ribbon(o,this.specs.proteins_ribbonThickness,!0),back:new f.Ribbon(o,-this.specs.proteins_ribbonThickness,!0)};o.front.chainColor=y;o.back.chainColor=y;q=0;for(w=o.front.segments.length;q<w;q++)o.front.segments[q].chainColor=y;q=0;for(w=o.back.segments.length;q<w;q++)o.back.segments[q].chainColor=y;q=0;for(w=o.front.cartoonSegments.length;q<w;q++)o.front.cartoonSegments[q].chainColor=y;q=0;for(w=o.back.cartoonSegments.length;q<
w;q++)o.back.cartoonSegments[q].chainColor=y;b.cartoons.push(o)}}}this.label3D.updateVerticesBuffer(this.gl,this.getMolecules(),this.specs);if(this instanceof a.MovieCanvas3D&&this.frames){q=0;for(w=this.frames.length;q<w;q++){h=this.frames[q];l=0;for(t=h.mols.length;l<t;l++)b=h.mols[l],b.labelMesh instanceof e.d3.TextMesh||(b.labelMesh=new e.d3.TextMesh,b.labelMesh.init(this.gl));this.label3D.updateVerticesBuffer(this.gl,h.mols,this.specs)}}this.gl.lighting=new f.Light(this.specs.lightDiffuseColor_3D,
this.specs.lightSpecularColor_3D,this.specs.lightDirection_3D);this.gl.lighting.lightScene(this.gl);this.gl.material=new f.Material(this.gl);this.gl.fogging=new f.Fog(this.gl);this.gl.fogging.setTempParameter(this.specs.fog_color_3D||this.specs.backgroundColor,this.specs.fog_start_3D,this.specs.fog_end_3D,this.specs.fog_density_3D);this.compass=new f.Compass(this.gl,this.specs);b=this.width/this.height;this.specs.projectionWidthHeightRatio_3D&&(b=this.specs.projectionWidthHeightRatio_3D);this.gl.projectionMatrix=
this.specs.projectionPerspective_3D?m.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D,b,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D):m.ortho(-this.specs.projectionOrthoWidth_3D/2,this.specs.projectionOrthoWidth_3D/2,-this.specs.projectionOrthoWidth_3D/2/b,this.specs.projectionOrthoWidth_3D/2/b,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D);b=this.gl.getUniformLocation(this.gl.program,"u_projection_matrix");this.gl.uniformMatrix4fv(b,
!1,this.gl.projectionMatrix);var z=this.gl.getUniformLocation(this.gl.program,"u_model_view_matrix"),x=this.gl.getUniformLocation(this.gl.program,"u_normal_matrix");this.gl.setMatrixUniforms=function(a){this.uniformMatrix4fv(z,!1,a);a=v.transpose(m.toInverseMat3(a,[]));this.uniformMatrix3fv(x,!1,a)};this.picker=new f.Picker;this.picker.init(this.gl);this.picker.setDimension(this.gl,this.width,this.height)}};h.mousedown=function(a){this.lastPoint=a.p};h.rightmousedown=function(a){this.lastPoint=a.p};
h.drag=function(b){if(a.monitor.ALT){var c=new e.Point(b.p.x,b.p.y);c.sub(this.lastPoint);var d=n.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*n.PI),d=this.depth/(this.height/2/d);m.translate(this.translationMatrix,[c.x*d,-c.y*d,0])}else d=b.p.x-this.lastPoint.x,c=b.p.y-this.lastPoint.y,d=m.rotate(m.identity([]),d*n.PI/180,[0,1,0]),m.rotate(d,c*n.PI/180,[1,0,0]),this.rotationMatrix=m.multiply(d,this.rotationMatrix);this.lastPoint=b.p;this.repaint()};h.mousewheel=function(a,b){var c=
this.specs.projectionPerspectiveVerticalFieldOfView_3D+b;this.specs.projectionPerspectiveVerticalFieldOfView_3D=0.1>c?0.1:179.9<c?179.9:c;this.specs.projectionOrthoWidth_3D=2*(Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D/360*Math.PI)*this.depth)*this.specs.projectionWidthHeightRatio_3D;this.updateScene()};h.updateScene=function(){this.gl.fogging.setTempParameter(this.specs.fog_color_3D||this.specs.backgroundColor,this.specs.fog_start_3D,this.specs.fog_end_3D,this.specs.fog_density_3D);
var a=this.width/this.height;this.specs.projectionWidthHeightRatio_3D&&(a=this.specs.projectionWidthHeightRatio_3D);this.gl.projectionMatrix=this.specs.projectionPerspective_3D?m.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D,a,this.specs.projectionFrontCulling_3D,this.specs.projectionBackCulling_3D):m.ortho(-this.specs.projectionOrthoWidth_3D/2,this.specs.projectionOrthoWidth_3D/2,-this.specs.projectionOrthoWidth_3D/2/a,this.specs.projectionOrthoWidth_3D/2/a,this.specs.projectionFrontCulling_3D,
this.specs.projectionBackCulling_3D);this.repaint()}})(ChemDoodle,ChemDoodle.extensions,ChemDoodle.math,ChemDoodle.structures,ChemDoodle.structures.d3,ChemDoodle.RESIDUE,Math,document,mat4,mat3,vec3,window);
(function(a,c,g,e){a.MolGrabberCanvas3D=function(a,c,n){a&&this.create(a,c,n);c=[];c.push('\x3cbr\x3e\x3cinput type\x3d"text" id\x3d"');c.push(a);c.push('_query" size\x3d"32" value\x3d"" /\x3e');c.push("\x3cbr\x3e\x3cnobr\x3e");c.push('\x3cselect id\x3d"');c.push(a);c.push('_select"\x3e');c.push('\x3coption value\x3d"pubchem" selected\x3ePubChem');c.push("\x3c/select\x3e");c.push('\x3cbutton id\x3d"');c.push(a);c.push('_submit"\x3eShow Molecule\x3c/button\x3e');c.push("\x3c/nobr\x3e");e.writeln(c.join(""));
var b=this;g("#"+a+"_submit").click(function(){b.search()});g("#"+a+"_query").keypress(function(a){13===a.which&&b.search()})};a=a.MolGrabberCanvas3D.prototype=new a._Canvas3D;a.setSearchTerm=function(a){g("#"+this.id+"_query").val(a);this.search()};a.search=function(){var a=this;c.getMoleculeFromDatabase(g("#"+this.id+"_query").val(),{database:g("#"+this.id+"_select").val(),dimension:3},function(c){a.loadMolecule(c)})}})(ChemDoodle,ChemDoodle.iChemLabs,jQuery,document);
(function(a,c){a.MovieCanvas3D=function(a,c,d){a&&this.create(a,c,d);this.frames=[]};a.MovieCanvas3D.PLAY_ONCE=0;a.MovieCanvas3D.PLAY_LOOP=1;a.MovieCanvas3D.PLAY_SPRING=2;var g=a.MovieCanvas3D.prototype=new a._Canvas3D;g.timeout=50;g.frameNumber=0;g.playMode=2;g.reverse=!1;g.startAnimation=a._AnimatorCanvas.prototype.startAnimation;g.stopAnimation=a._AnimatorCanvas.prototype.stopAnimation;g.isRunning=a._AnimatorCanvas.prototype.isRunning;g.dblclick=a.RotatorCanvas.prototype.dblclick;g.nextFrame=function(){var a=
this.frames[this.frameNumber];this.molecules=a.mols;this.shapes=a.shapes;2===this.playMode&&this.reverse?(this.frameNumber--,0>this.frameNumber&&(this.frameNumber=1,this.reverse=!1)):(this.frameNumber++,this.frameNumber>=this.frames.length&&(2===this.playMode?(this.frameNumber-=2,this.reverse=!0):(this.frameNumber=0,0===this.playMode&&this.stopAnimation())))};g.center=function(){for(var a=new c.Atom,f=this.frames[0],d=0,g=f.mols.length;d<g;d++)a.add3D(f.mols[d].getCenter3D());a.x/=f.mols.length;a.y/=
f.mols.length;f=new c.Atom;f.sub3D(a);for(var a=0,b=this.frames.length;a<b;a++)for(var m=this.frames[a],d=0,g=m.mols.length;d<g;d++)for(var v=m.mols[d],j=0,h=v.atoms.length;j<h;j++)v.atoms[j].add3D(f)};g.addFrame=function(a,c){this.frames.push({mols:a,shapes:c})}})(ChemDoodle,ChemDoodle.structures);
(function(a,c,g){var e=[],f=[1,0,0],d=[0,1,0],n=[0,0,1];a.RotatorCanvas3D=function(a,b,c){a&&this.create(a,b,c)};var b=a.RotatorCanvas3D.prototype=new a._Canvas3D;b.timeout=33;c=c.PI/15;b.xIncrement=c;b.yIncrement=c;b.zIncrement=c;b.startAnimation=a._AnimatorCanvas.prototype.startAnimation;b.stopAnimation=a._AnimatorCanvas.prototype.stopAnimation;b.isRunning=a._AnimatorCanvas.prototype.isRunning;b.dblclick=a.RotatorCanvas.prototype.dblclick;b.mousedown=void 0;b.rightmousedown=void 0;b.drag=void 0;
b.mousewheel=void 0;b.nextFrame=function(a){0===this.molecules.length&&0===this.shapes.length?this.stopAnimation():(g.identity(e),a/=1E3,g.rotate(e,this.xIncrement*a,f),g.rotate(e,this.yIncrement*a,d),g.rotate(e,this.zIncrement*a,n),g.multiply(this.rotationMatrix,e))}})(ChemDoodle,Math,mat4);(function(a){a.TransformCanvas3D=function(a,g,e){a&&this.create(a,g,e)};a.TransformCanvas3D.prototype=new a._Canvas3D})(ChemDoodle);
(function(a){a.ViewerCanvas3D=function(a,g,e){a&&this.create(a,g,e)};a=a.ViewerCanvas3D.prototype=new a._Canvas3D;a.mousedown=void 0;a.rightmousedown=void 0;a.drag=void 0;a.mousewheel=void 0})(ChemDoodle);
(function(a,c,g){function e(a,c,b,e){this.element=a;this.x=c;this.y=b;this.dimension=e}a.PeriodicTableCanvas=function(a,c){this.padding=5;a&&this.create(a,18*c+2*this.padding,10*c+2*this.padding);this.cellDimension=c?c:20;this.setupTable();this.repaint()};var f=a.PeriodicTableCanvas.prototype=new a._Canvas;f.loadMolecule=void 0;f.getMolecule=void 0;f.getHoveredElement=function(){if(this.hovered)return this.hovered.element};f.innerRepaint=function(a){for(var c=0,b=this.cells.length;c<b;c++)this.drawCell(a,
this.specs,this.cells[c]);this.hovered&&this.drawCell(a,this.specs,this.hovered);this.selected&&this.drawCell(a,this.specs,this.selected)};f.setupTable=function(){this.cells=[];for(var c=this.padding,f=this.padding,b=0,g=0,v=a.SYMBOLS.length;g<v;g++){18===b&&(b=0,f+=this.cellDimension,c=this.padding);var j=a.ELEMENT[a.SYMBOLS[g]];if(2===j.atomicNumber)c+=16*this.cellDimension,b+=16;else if(5===j.atomicNumber||13===j.atomicNumber)c+=10*this.cellDimension,b+=10;if((58>j.atomicNumber||71<j.atomicNumber&&
90>j.atomicNumber||103<j.atomicNumber)&&113>j.atomicNumber)this.cells.push(new e(j,c,f,this.cellDimension)),c+=this.cellDimension,b++}f+=2*this.cellDimension;c=3*this.cellDimension+this.padding;for(g=57;104>g;g++)if(j=a.ELEMENT[a.SYMBOLS[g]],90===j.atomicNumber&&(f+=this.cellDimension,c=3*this.cellDimension+this.padding),58<=j.atomicNumber&&71>=j.atomicNumber||90<=j.atomicNumber&&103>=j.atomicNumber)this.cells.push(new e(j,c,f,this.cellDimension)),c+=this.cellDimension};f.drawCell=function(a,e,b){var f=
a.createRadialGradient(b.x+b.dimension/3,b.y+b.dimension/3,1.5*b.dimension,b.x+b.dimension/3,b.y+b.dimension/3,b.dimension/10);f.addColorStop(0,"#000000");f.addColorStop(0.7,b.element.jmolColor);f.addColorStop(1,"#FFFFFF");a.fillStyle=f;c.contextRoundRect(a,b.x,b.y,b.dimension,b.dimension,b.dimension/8);if(b===this.hovered||b===this.selected)a.lineWidth=2,a.strokeStyle="#c10000",a.stroke(),a.fillStyle="white";a.fill();a.font=c.getFontString(e.text_font_size,e.text_font_families);a.fillStyle=e.text_color;
a.textAlign="center";a.textBaseline="middle";a.fillText(b.element.symbol,b.x+b.dimension/2,b.y+b.dimension/2)};f.click=function(){this.hovered&&(this.selected=this.hovered,this.repaint())};f.mousemove=function(a){var c=a.p.x;a=a.p.y;this.hovered=void 0;for(var b=0,e=this.cells.length;b<e;b++){var f=this.cells[b];if(g.isBetween(c,f.x,f.x+f.dimension)&&g.isBetween(a,f.y,f.y+f.dimension)){this.hovered=f;break}}this.repaint()};f.mouseout=function(){this.hovered=void 0;this.repaint()}})(ChemDoodle,ChemDoodle.extensions,
ChemDoodle.math,document);(function(a,c,g){a.png={};a.png.create=function(a){g.open(c.getElementById(a.id).toDataURL("image/png"))}})(ChemDoodle.io,document,window);(function(a,c){a.file={};a.file.content=function(a,e){c.get(a,"",e)}})(ChemDoodle.io,jQuery);
(function(a,c,g,e,f){c.SERVER_URL="http://ichemlabs.cloud.chemdoodle.com/icl_cdc_v050000/WebHQ";c.inRelay=!1;c.asynchronous=!0;c.INFO={userAgent:navigator.userAgent,v_cwc:a.getVersion(),v_jQuery:f.version,v_jQuery_ui:f.ui?f.ui.version:"N/A"};var d=new g.JSONInterpreter;c._contactServer=function(a,b,d,e,g){this.inRelay?alert("Already connecting to the server, please wait for the first request to finish."):(c.inRelay=!0,f.ajax({dataType:"text",type:"POST",data:JSON.stringify({call:a,content:b,options:d,
info:c.INFO}),url:this.SERVER_URL,success:function(a){c.inRelay=!1;a=JSON.parse(a);a.message&&alert(a.message);e&&(a.content&&!a.stop)&&e(a.content);a.stop&&g&&g()},error:function(){c.inRelay=!1;alert("Call failed. Please try again. If you continue to see this message, please contact iChemLabs customer support.");g&&g()},xhrFields:{withCredentials:!0},async:c.asynchronous}))};c.authenticate=function(a,b,c,d){this._contactServer("authenticate",{credential:a},b,function(a){c(a)},d)};c.calculate=function(a,
b,c,e){this._contactServer("calculate",{mol:d.molTo(a)},b,function(a){c(a)},e)};c.generateImage=function(a,b,c,e){this._contactServer("generateImage",{mol:d.molTo(a)},b,function(a){c(a.link)},e)};c.generateIUPACName=function(a,b,c,e){this._contactServer("generateIUPACName",{mol:d.molTo(a)},b,function(a){c(a.iupac)},e)};c.getAd=function(a,b){this._contactServer("getAd",{},{},function(b){a(b.image_url,b.target_url)},b)};c.getMoleculeFromContent=function(a,b,c,e){this._contactServer("getMoleculeFromContent",
{content:a},b,function(a){for(var b=!1,e=0,f=a.mol.a.length;e<f;e++)if(0!==a.mol.a[e].z){b=!0;break}if(b){e=0;for(f=a.mol.a.length;e<f;e++)a.mol.a[e].x/=20,a.mol.a[e].y/=20,a.mol.a[e].z/=20}c(d.molFrom(a.mol))},e)};c.getMoleculeFromDatabase=function(a,b,c,e){this._contactServer("getMoleculeFromDatabase",{query:a},b,function(a){if(3===b.dimension)for(var e=0,f=a.mol.a.length;e<f;e++)a.mol.a[e].x/=20,a.mol.a[e].y/=-20,a.mol.a[e].z/=20;c(d.molFrom(a.mol))},e)};c.getOptimizedPDBStructure=function(a,b,
c,f){this._contactServer("getOptimizedPDBStructure",{id:a},b,function(a){var b;b=a.mol?d.molFrom(a.mol):new e.Molecule;b.chains=d.chainsFrom(a.ribbons);b.fromJSON=!0;c(b)},f)};c.getZeoliteFromIZA=function(a,b,c,d){this._contactServer("getZeoliteFromIZA",{query:a},b,function(a){c(ChemDoodle.readCIF(a.cif,b.xSuper,b.ySuper,b.zSuper))},d)};c.isGraphIsomorphism=function(a,b,c,e,f){this._contactServer("isGraphIsomorphism",{arrow:d.molTo(a),target:d.molTo(b)},c,function(a){e(a.value)},f)};c.isSubgraphIsomorphism=
function(a,b,c,e,f){this._contactServer("isSubgraphIsomorphism",{arrow:d.molTo(a),target:d.molTo(b)},c,function(a){e(a.value)},f)};c.kekulize=function(a,b,c,e){this._contactServer("kekulize",{mol:d.molTo(a)},b,function(a){c(d.molFrom(a.mol))},e)};c.optimize=function(a,b,c,e){this._contactServer("optimize",{mol:d.molTo(a)},b,function(e){e=d.molFrom(e.mol);if(2===b.dimension){for(var f=0,g=e.atoms.length;f<g;f++)a.atoms[f].x=e.atoms[f].x,a.atoms[f].y=e.atoms[f].y;c()}else if(3===b.dimension){f=0;for(g=
e.atoms.length;f<g;f++)e.atoms[f].x/=20,e.atoms[f].y/=-20,e.atoms[f].z/=20;c(e)}},e)};c.readIUPACName=function(a,b,c,e){this._contactServer("readIUPACName",{iupac:a},b,function(a){c(d.molFrom(a.mol))},e)};c.readSMILES=function(a,b,c,e){this._contactServer("readSMILES",{smiles:a},b,function(a){c(d.molFrom(a.mol))},e)};c.saveFile=function(a,b,c,e){this._contactServer("saveFile",{mol:d.molTo(a)},b,function(a){c(a.link)},e)};c.simulate13CNMR=function(c,b,e,f){b.nucleus="C";b.isotope=13;this._contactServer("simulateNMR",
{mol:d.molTo(c)},b,function(b){e(a.readJCAMP(b.jcamp))},f)};c.simulate1HNMR=function(c,b,e,f){b.nucleus="H";b.isotope=1;this._contactServer("simulateNMR",{mol:d.molTo(c)},b,function(b){e(a.readJCAMP(b.jcamp))},f)};c.simulateMassParentPeak=function(c,b,e,f){this._contactServer("simulateMassParentPeak",{mol:d.molTo(c)},b,function(b){e(a.readJCAMP(b.jcamp))},f)};c.writeSMILES=function(a,b,c,e){this._contactServer("writeSMILES",{mol:d.molTo(a)},b,function(a){c(a.smiles)},e)};c.version=function(a,b,c){this._contactServer("version",
{},a,function(a){b(a.value)},c)}})(ChemDoodle,ChemDoodle.iChemLabs,ChemDoodle.io,ChemDoodle.structures,jQuery);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//






$(function(){ $(document).foundation(); });

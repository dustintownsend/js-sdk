(function(Kinvey) {

  /**
   * Net adapter for XMLHttpRequest.
   * 
   * @constructor
   * @param {string} api One of Kinvey.Net api constants.
   * @param {string} [collection] collection name. Required when using the
   *          AppData API.
   * @param {string} [id] Entity id.
   * @throws {Error} On invalid api, invalid operation or undefined collection.
   */
  Kinvey.Net.Xhr = function(api, collection, id) {
    if(null == api) {
      throw new Error('API must not be null');
    }

    // Endpoint constants
    this.BASE_URL = 'https://baas.kinvey.com';
    this.APPDATA_URL = this.BASE_URL + '/appdata';
    this.RESOURCE_URL = this.BASE_URL + '/blob';
    this.USER_URL = this.BASE_URL + '/user';

    // Operation map
    this.METHOD_MAP = {};
    this.METHOD_MAP[Kinvey.Net.CREATE] = 'POST';
    this.METHOD_MAP[Kinvey.Net.READ] = 'GET';
    this.METHOD_MAP[Kinvey.Net.UPDATE] = 'PUT';
    this.METHOD_MAP[Kinvey.Net.DELETE] = 'DELETE';

    // Construct URL.
    var url;
    switch(api) {
      // AppData API
      // https://baas.kinvey.com/appdata/<appKey>/<collection>/<?id>
      case Kinvey.Net.APPDATA_API:
        if(null == collection) {
          throw new Error('Collection must not be null');
        }

        // Build url
        url = this.APPDATA_URL + '/' + Kinvey.appKey + '/' + collection;
        if(null != id) {
          url += '/' + id;
        }

        break;

      // User API
      // https://baas.kinvey.com/user/<appKey>/<?id>
      case Kinvey.Net.USER_API:
        // Build url
        url = this.USER_URL + '/' + Kinvey.appKey + '/';

        // Added trailing slash to ensure operating on collection-level path
        // https://baas.kinvey.com/user/<appKey>?query does not work, while
        // https://baas.kinvey.com/user/<appKey>/?query does.

        // User API does not have collections, only IDs.
        if(null != id) {
          url += id;
        }

        break;

      // Invalid api. Note the resource api is not supported by this adapter.
      default:
        throw new Error('API ' + api + ' not supported');
    }

    // Properties
    /**
     * Request data.
     * 
     * @private
     * @type string
     */
    this.data = null;

    /**
     * Request headers.
     * 
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method
     * @private
     * @type Object
     */
    this.headers = {
      Accept: 'application/json, text/javascript',
      'Content-Type': 'application/json; charset=utf-8'
    };

    /**
     * Query.
     * 
     * @private
     * @type Kinvey.Query.SimpleQuery
     */
    this.query = null;

    /**
     * Request url.
     * 
     * @private
     * @type string
     */
    this.url = url;
  };

  // Methods
  extend(Kinvey.Net.Xhr.prototype, {
    /** @lends Kinvey.Net.Xhr# */

    /**
     * Sends HTTP request.
     * 
     * @param {string} operation One of Kinvey.Net operation constants.
     * @param {function(Object)} success Success callback.
     * @param {function(Object)} failure Failure callback.
     * @throws {Error} On invalid operation or unsupported client.
     */
    send: function(operation, success, failure) {
      if(null == this.METHOD_MAP[operation]) {
        throw new Error('Operation ' + operation + ' not supported');
      }

      // Build url
      var url = this.url;
      if(null != this.query) {
        url += '?query=' + this._encode(JSON.stringify(this.query.get()));
      }
      var xhr = this._createClient(this.METHOD_MAP[operation], url);

      // Define callbacks and fire request
      // https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIXMLHttpRequestEventTarget
      xhr.onabort = xhr.onerror = function(e) {
        failure({
          error: e.type
        });
      };
      xhr.onload = function() {
        // Fail if response yields an error message
        var response = JSON.parse(xhr.responseText || '{}');
        response.error ? failure(response) : success(response);
      };
      xhr.send(this.data);
    },

    /**
     * Sets data
     * 
     * @param {Object} data JSON data
     */
    setData: function(data) {
      this.data = data ? JSON.stringify(data) : null;
    },

    /**
     * Sets query
     * 
     * @param {Kinvey.Query.SimpleQuery} query
     * @throws {Error} on invalid query instance
     */
    setQuery: function(query) {
      if(!(query instanceof Kinvey.Query.SimpleQuery)) {
        throw new Error('Query must be an instance of Kinvey.Query.SimpleQuery');
      }
      this.query = query;
    },

    /**
     * Creates XHR client
     * 
     * @private
     * @param {string} method request method
     * @param {string} url request URL
     * @throws {Error} on unsupported client
     * @return Object
     */
    _createClient: function(method, url) {
      if('undefined' === typeof (XMLHttpRequest)) {
        throw new Error('XHR not supported');
      }

      // Create request object
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);// async
      // Set headers
      for( var header in this.headers) {
        xhr.setRequestHeader(header, this.headers[header]);
      }

      // Set authorization header
      var auth, user = Kinvey.getCurrentUser();
      if(null !== user) {
        auth = user.getUsername() + ':' + user.getPassword();
      }
      else {// no user, fallback to app credentials
        auth = Kinvey.appKey + ':' + Kinvey.appSecret;
      }
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(auth));

      // All set
      return xhr;
    },

    /**
     * Encodes value to be used in URL query string
     * 
     * @private
     * @param {string} value value to encode
     * @return {string} encoded value
     */
    _encode: function(value) {
      return encodeURIComponent(value);
    }
  });

}(Kinvey));
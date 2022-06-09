import http from "http";

let call = new http.IncomingMessage.prototype


/**
 * Return a HTTP Header passed to the method
 * 
 * @param {string} headerName 
 */
call.header = function(headerName) {
    if (typeof headerName !== "string") {
        throw Error("The header must be pass as a string to the function");
    } else if (!headerName) {
        throw Error("Any header must be passed to the function");
    };

    let lc = headerName.toLowerCase();
  
    switch (lc) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer;
      default:
        return this.headers[lc];
    };
};

call.cookies = function() {
  null
}

export default call
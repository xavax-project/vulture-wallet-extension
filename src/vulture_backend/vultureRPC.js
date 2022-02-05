

//Just a wrapper for requests to make things easier.
export class VultureRequest {
    method;
    params;
    constructor(method, params) {
        this.method = method;
        this.params = params;
    }
    
     /** # getJson()
     * Returns the JSONRPC data ready to be sent, with headers and everythign (but doesn't send it...)
     * ____
     */
         getJson() {
            return JSON.stringify({
                method: this.method,
                params: this.params,
                id: 1,
                jsonrpc: '2.0'
            });
            
        }

    /** # postJsonRPC()
     * Returns a promise containing the RPC Response.
     * ____
     * @param {string} rpcURL The URL/URI the method will post the request to.
     */
    postJsonRPC(rpcURL) {
        return fetch(rpcURL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: this.method,
                params: this.params,
                id: 1,
                jsonrpc: '2.0'
            })
        })
    }
}


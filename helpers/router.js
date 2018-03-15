

function Router(){
    this.routemap = {
        'GET': [],
        'POST': []
    }
}


// Routes the request to the appropriate function
Router.prototype.route = function(req, res){

    // Extract resource (path)
    var resource = url.split(req.url).pathname;

    var httpVerb = req.method;
    
    for(var i = 0; i < this.routemap[httpVerb].length; i++){
        var match = this.routemap[httpVerb][i].regexp.exec(resource);
        if(match != null){
            // store any parameters in a key/value map
            var params = {};
            for(var j = 0; j < this.routemap[httpVerb][i].keys.length; j++){
                params[this.routemap[httpVerb][i].keys[j]] = match[j+1];
            }

            // store parameters in the request
            req.params = params;
            return this.routemap[httpVerb][i].callback(req, res);
        }
    }

    res.statusCode = 404;
    res.end("Not Found");
}

// add new routes to the route table
Router.prototype.addRoute = function(httpVerb, route, callback){


    var tokens = route.split('/');
    var exp = [];
    var keys = [];

    //convert roue pattern to a regular expression
    for(var i = 0; i < tokens.length; i++){
        var match = tokens[i].match(/:(\w+)/);
        if(match){
            // found a key - ceate a capture group
            exp.push("([^\/]+)");
            keys.push(match[1]);
        }else{
            // otherwise, push token as-is
            exp.push(tokens[i]);
        }
    }
    // create a regular expression
    var regexp = new RegExp('^' + exp.join('/') + '/?$');

    // Add to our routemap
    this.routemap[httpVerb].push({
        regexp: regexp,
        keys: keys,
        callback: callback
    });
}

module.exports = Router;
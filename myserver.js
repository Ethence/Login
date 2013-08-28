var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require("path");

function randomizeServers(serverList) {
    var l = serverList.length;
    while (l > 0) {
        var i = Math.floor(Math.random()*l);
        var temp = serverList[i];
        serverList[i] = serverList[l-1];
        serverList[l-1] = temp; 
        l--;
    }
}

var cnt = 0;
http.createServer(function (req, res) {;

    var servers = ["'ca.ibm.com'", "'cn.ibm.com'", "'in.ibm.com'", "'uk.ibm.com'", "'us.ibm.com'"];
    var queries = url.parse(req.url, true).query;
    if (queries["callback"]) {
        var cb = queries["callback"];
        randomizeServers(servers);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(cb +  "(["+servers+"]);");
        res.end();
    }

    cnt++;
    console.log(cnt);
    console.log(servers);
    //console.log(url.parse(req.url, true));
    
}).listen(1337, 'localhost');
console.log('Server running at http://127.0.0.1:1337/');
console.log(cnt);
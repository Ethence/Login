var demo = {
        
        text: function (uNameNode, cname) {
            var servers = ["ca.ibm.com", "cn.ibm.com", "in.ibm.com", "uk.ibm.com", "us.ibm.com"];
            var ddm = new DropDownMenu(uNameNode, "ddm", DropDownMenu.strategy.textHints(servers));
            ddm.init();
        },
        
        local: function (uNameNode, cname) {
            var servers = ["ca.ibm.com", "cn.ibm.com", "in.ibm.com", "uk.ibm.com", "us.ibm.com"];
            var ddm = new DropDownMenu(uNameNode, cname, DropDownMenu.strategy.extendMailServersLocally(servers));
            ddm.init();
        },
        
        xhrsync: function (uNameNode, cname) {
            var url = "servers.json";
            var ddm = new DropDownMenu(uNameNode, cname, DropDownMenu.strategy.extendMailServersRemotely(url));
            ddm.init();
        },
        
        xhrasync: function (uNameNode, cname) {
            var url = "servers.json";
            var ddm = new DropDownMenu(uNameNode, cname, DropDownMenu.strategy.extendMailServersAsyncRemotely(url));
            ddm.init();
        },
        
        jsonp: function (uNameNode, cname) {
            var url = "http://127.0.0.1:1337";
            var ddm = new DropDownMenu(uNameNode, cname, DropDownMenu.strategy.extendMailServersCrossDomainJSONP(url));
            ddm.init();
        },
        
        /*
        vote: function (uNameNode, voteNode, cname) {
            var url1 = "servers.json";
            var url2 = "http://127.0.0.1:1337";
            var ddm = new DropDownMenu(uNameNode, cname, DropDownMenu.strategy.extendMailServersAsyncRemotely(url1));
            ddm.init();
            ddm.voteOn(voteNode, url2);
        },
        */
        
        run : function() {
        	var queries = DropDownMenu.utils.getQueryStringArgs();
        	var m = queries[Constants.METHOD];
        	if (!m) m = "jsonp";
            var u = "user-txt";
            var cname = "ddm";
            var uName = document.getElementById(u);
            if (demo[m]) demo[m](uName, cname);
        }
};

demo.run();
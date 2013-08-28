/*
 * Global constants
 */
var Constants = {
		DIV: "div",
		PX: "px",
		HIDDEN: "hidden",
		VISIBLE: "visible",
		ABSOLUTE: "absolute",
		WHITE: "white",
		AT: "@",
		ITEM: "item",
		ACTIVE: "active",
		CBPREFIX: "cb"
};

/*
 * DropDownMenu class
 */
function DropDownMenu(targetObj, menuClassName, updateMethod) {
	this.target = targetObj; //the object where the drop down menu is located
	this.cname = menuClassName;
	this.menuNode = DropDownMenu.utils.createMenu(targetObj, menuClassName); //create the node in the document
	this.method = updateMethod;
}

DropDownMenu.prototype.init = function () {
    this.setPosition();
    this.addCSS();
    //add all event handlers
    var self = this;
    DropDownMenu.utils.registerHandler(window, "resize", function(){self.setPosition();});
    DropDownMenu.utils.registerHandler(this.target, "blur", function () {self.hide();});
    DropDownMenu.utils.registerHandler(this.target, "click", 
        function () {       
            self.update();
            self.show();
        }
    );
    DropDownMenu.utils.registerHandler(this.target, "keyup",
            function(event) {
                if (!event) event=window.event;
                var kc = event.keyCode;
                var activeItemClassName = Constants.ACTIVE+"-"+self.cname+"-"+Constants.ITEM;
                var itemClassName = self.cname+"-"+Constants.ITEM;
                var activeItem = document.querySelector(Constants.DIV+"."+activeItemClassName);
                if (kc == 37 || kc == 38) {
                    activeItem.className = itemClassName;
                    if (activeItem == self.menuNode.firstChild) self.menuNode.lastChild.className = activeItemClassName;
                    else activeItem.previousSibling.className = activeItemClassName;
                }
                else if (kc == 39 || kc == 40) {
                    activeItem.className = itemClassName;
                    if (activeItem == self.menuNode.lastChild) self.menuNode.firstChild.className = activeItemClassName;
                    else activeItem.nextSibling.className = activeItemClassName;
                }
                else if (kc == 13) {
                    self.target.value = activeItem.innerHTML;
                    self.hide();
                }
                else {
                    self.update();
                    self.show();
                }
            }
    );
};
 
DropDownMenu.prototype.addCSS = function () {
	this.menuNode.style.overflow = Constants.HIDDEN;
	var actRuleText =  "color: white; background-color: blue; cursor: pointer;";
	var actSel = Constants.DIV + "." + Constants.ACTIVE + "-" + this.cname+"-"+Constants.ITEM;
	var optRuleText = "cursor: pointer;";
	var optSel = Constants.DIV + "." + this.cname + "-" + Constants.ITEM;
	var cssTxt = optSel + " {" + optRuleText + "}\n" + actSel + " {" + actRuleText + "}";
	var style = document.getElementsByTagName("style")[0];
	if (!style) style = document.createElement("style");
	style.type = "text/css";
	try{
		style.appendChild(document.createTextNode(cssTxt));
	} catch (ex){
		style.styleSheet.cssText += cssTxt;
	}
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);
};

DropDownMenu.prototype.setPosition = function () {
    var pos = DropDownMenu.utils.getPosition(this.target);
    this.menuNode.style.position = Constants.ABSOLUTE;
    this.menuNode.style.left = pos.x+Constants.PX;
    this.menuNode.style.top = (pos.y+this.target.clientHeight)+Constants.PX;
    this.menuNode.style.width = this.target.clientWidth + Constants.PX;    
};
  
DropDownMenu.prototype.show = function () {
    this.menuNode.style.visibility = Constants.VISIBLE;
};

DropDownMenu.prototype.hide = function () {
	this.menuNode.style.visibility = Constants.HIDDEN;
};

DropDownMenu.prototype.update = function () {
    if (typeof this.method != "function") return;
    var itemStrList = this.method(this.target.value);
    if (!itemStrList) return;
	this.fillData(itemStrList);
};

DropDownMenu.prototype.fillData = function (itemStrList) {
    if (this.menuNode.hasChildNodes()) this.menuNode.innerHTML = "";
    var itemClassName = this.cname + "-" + Constants.ITEM;
    var t = this.target;
    var activeItemClassName = Constants.ACTIVE + "-" + this.cname + "-" + Constants.ITEM;
    for (var i = 0 ; i < itemStrList.length; i++) {
        var item = document.createElement(Constants.DIV);
        if (i === 0) item.className = Constants.ACTIVE + "-" + this.cname + "-" + Constants.ITEM;
        else item.className = this.cname+"-"+Constants.ITEM;
        item.innerHTML = itemStrList[i];
        this.menuNode.appendChild(item);
        DropDownMenu.utils.registerHandler(item, "mouseover", function (event) {
            if (!event) event = window.event;
            var target = event.target || event.srcElement;
            var siblings = target.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i].className == activeItemClassName) siblings[i].className = itemClassName;
            }
            target.className = activeItemClassName;
        });
        DropDownMenu.utils.registerHandler(item, "mousedown", function (event) {
            if (!event) event = window.event;
            var target = event.target || event.srcElement;
            t.value = target.innerHTML;
        });
    }
};

/*
DropDownMenu.prototype.voteOn = function (voteNode, url) {
    var self = this;
    DropDownMenu.utils.registerHandler(voteNode, "click", function() {
        var userInput = self.target.value;
        var serverName = DropDownMenu.utils.extractServer(userInput);
        var newUrl = url;
        if (url.indexOf("?") === -1) newUrl += "?server="+serverName;
        else newUrl += "&server="+serverName;
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4){
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                    alert(xhr.responseText);
                } 
            }
        };        
        xhr.open("get", newUrl, false);
        xhr.send(null);
    });
};
*/

/*
 * Predefined Strategies
 */
DropDownMenu.strategy = {
        extendMailServersLocally : function (serverList) {
            return function (userInput) {
                return DropDownMenu.utils.extendEmailServers(serverList, userInput);
            };
        },

        textHints : function(allHints) {
            return function (userInput) {
                var matchHints = [];
                if (userInput) {
                    for (var i = 0; i < allHints.length; i++) {
                        if (allHints[i].indexOf(userInput) === 0 && allHints[i] != userInput) matchHints.push(allHints[i]);
                    }
                }
                return matchHints;
            };
        },
        
        extendMailServersRemotely : function (url) {
            return function (userInput) {
                var xhr = new XMLHttpRequest();
                xhr.open("get", url, false);
                xhr.send(null);
                var servers = [];
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    servers = JSON.parse(xhr.responseText);
                }
                return DropDownMenu.utils.extendEmailServers(servers, userInput);
            };
        },
        
        extendMailServersAsyncRemotely : function (url) {
            return function (userInput) {
                var xhr = new XMLHttpRequest();
                var self = this;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4){
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                            //if (self.menuNode.hasChildNodes()) self.menuNode.innerHTML = "";
                            //need to check whether this userInput is the most current one.
                            if (self.target.value == userInput)
                                self.fillData(DropDownMenu.utils.extendEmailServers(JSON.parse(xhr.responseText), userInput));
                        } 
                    }
                };
                xhr.open("get", url, true);
                xhr.send(null);                
            };
        },
        
        //ideas from Definitive Guide
        extendMailServersCrossDomainJSONP: function (url) {
            return function (userInput) {
                var jp = document.createElement("script");
                jp.type = "text/javascript";
                jp.src = url;
                
                var self = this;
                DropDownMenu.utils.getJsonp.cbcnt++;
                var cbname = Constants.CBPREFIX + DropDownMenu.utils.getJsonp.cbcnt;
                DropDownMenu.utils.getJsonp[cbname] = function (res) {
                    try {
                        self.fillData(DropDownMenu.utils.extendEmailServers(res, userInput));
                    }
                    finally {
                        delete (DropDownMenu.utils.getJsonp)[cbname];
                        jp.parentNode.removeChild(jp);
                    }                    
                };

                if (url.indexOf("?") === -1) jp.src += "?callback=DropDownMenu.utils.getJsonp['"+cbname+"']";
                else jp.src += "&callback=DropDownMenu.utils.getJsonp['"+cbname+"']";
                document.body.appendChild(jp);
            };
        }        
};

/*
 * utility functions
 */
DropDownMenu.utils = {
        
        getJsonp : {
            cbcnt : 0,
        }, // the data object that is used to share call back functions when using JSONP.
        
        createMenu : function (target, menuClassName) {
            var menuNode = document.createElement(Constants.DIV);
            menuNode.className = menuClassName;
            document.body.appendChild(menuNode);
            menuNode.style.backgroundColor = Constants.WHITE;
            return menuNode;
        },

        registerHandler : function (element, type, handler){
            if (element.addEventListener) element.addEventListener(type, handler, false);
            else if (element.attachEvent) element.attachEvent("on" + type, handler);
            else element["on" + type] = handler;
        },
        
        getPosition : function (element) {
            var xPosition = element.offsetLeft;
            var yPosition = element.offsetTop;
            var curr = element.offsetParent;
            while (curr !== null) {
                xPosition += curr.offsetLeft;
                yPosition += curr.offsetTop;
                curr = curr.offsetParent;
            }
            return {x: xPosition, y: yPosition };
        },
        
        deleteAllSpaces : function (txt) {
            if (txt) return txt.replace(/\s+/g, "");
            else return txt;
        },
        
        extractEmailServer : function (userInput) {
            var s = "";
            var p = userInput.indexOf("@");
            if (p !== -1) s = userInput.slice(p+1);
            return s;
        },
        
        extendEmailServers : function(serverList, userInput) {
            var matchServers = [];
            userInput = DropDownMenu.utils.deleteAllSpaces(userInput);
            var u = userInput;
            var p = userInput.indexOf(Constants.AT);
            if (p != -1) {
                u = userInput.slice(0, p);
                var s = userInput.slice(p+1).toLowerCase();
                if (s) {
                    for (var i = 0; i < serverList.length; i++) {
                        if (serverList[i].indexOf(s) === 0) matchServers.push(serverList[i]);
                    }
                }
                else matchServers = serverList;
            }
            else matchServers = serverList;
            if (u) {
                var strs = [];
                for (var i = 0; i < matchServers.length; i++) {
                    var str = u+Constants.AT+matchServers[i];
                    if (str != userInput) strs.push(str);
                }
                return strs;
            }
            else return [];
        }
};
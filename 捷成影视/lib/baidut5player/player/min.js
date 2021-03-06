"undefined" == typeof cyberplayer && (cyberplayer = function(a) {
    return cyberplayer.api ? cyberplayer.api.selectPlayer(a) : void 0;
}, cyberplayer.version = "1.5.0", cyberplayer.vid = document.createElement("video"), 
cyberplayer.audio = document.createElement("audio"), cyberplayer.source = document.createElement("source"), 
function(a) {
    function b(a) {
        if (j.exists(a)) {
            var b = a.indexOf("://"), c = a.indexOf("?");
            return b > 0 && (0 > c || c > b);
        }
    }
    function c(a) {
        return function() {
            return k(a);
        };
    }
    var d = document, e = window, f = navigator, g = "undefined", h = "string", i = "object", j = a.utils = function() {};
    j.exists = function(a) {
        switch (typeof a) {
          case h:
            return a.length > 0;

          case i:
            return null !== a;

          case g:
            return !1;
        }
        return !0;
    }, j.styleDimension = function(a) {
        return a + (a.toString().indexOf("%") > 0 ? "" : "px");
    }, j.getAbsolutePath = function(a, c) {
        if (j.exists(c) || (c = d.location.href), !j.exists(a)) return void 0;
        if (b(a)) return a;
        var e, f = c.substring(0, c.indexOf("://") + 3), g = c.substring(f.length, c.indexOf("/", f.length + 1));
        if (0 === a.indexOf("/")) e = a.split("/"); else {
            var h = c.split("?")[0];
            h = h.substring(f.length + g.length + 1, h.lastIndexOf("/")), e = h.split("/").concat(a.split("/"));
        }
        for (var i = [], k = 0; k < e.length; k++) e[k] && j.exists(e[k]) && "." != e[k] && (".." == e[k] ? i.pop() : i.push(e[k]));
        return f + g + "/" + i.join("/");
    }, j.extend = function() {
        var a = j.extend.arguments;
        if (a.length > 1) {
            for (var b = 1; b < a.length; b++) for (var c in a[b]) try {
                j.exists(a[b][c]) && (a[0][c] = a[b][c]);
            } catch (d) {}
            return a[0];
        }
        return null;
    }, j.log = function(a, b) {
        typeof console != g && typeof console.log != g && (b ? console.log(a, b) : console.log(a));
    };
    var k = j.userAgentMatch = function(a) {
        var b = f.userAgent.toLowerCase();
        return null !== b.match(a);
    };
    j.isIE = c(/msie/i), j.isFF = c(/firefox/i), j.isChrome = c(/chrome/i), j.isIOS = c(/iP(hone|ad|od)/i), 
    j.isIPod = c(/iP(hone|od)/i), j.isIPad = c(/iPad/i), j.isSafari602 = c(/Macintosh.*Mac OS X 10_8.*6\.0\.\d* Safari/i), 
    j.isAndroid = function(a) {
        return k(a ? new RegExp("android.*" + a, "i") : /android/i);
    }, j.isMobile = function() {
        return j.isIOS() || j.isAndroid();
    }, j.saveCookie = function(a, b) {
        d.cookie = "cyberplayer." + a + "=" + b + "; path=/";
    }, j.getCookies = function() {
        for (var a = {}, b = d.cookie.split("; "), c = 0; c < b.length; c++) {
            var e = b[c].split("=");
            0 == e[0].indexOf("cyberplayer.") && (a[e[0].substring(9, e[0].length)] = e[1]);
        }
        return a;
    }, j.typeOf = function(a) {
        var b = typeof a;
        return "object" === b ? a ? a instanceof Array ? "array" : b : "null" : b;
    }, j.translateEventResponse = function(b, c) {
        var d = j.extend({}, c);
        b != a.events.CBPLAYER_FULLSCREEN || d.fullscreen ? typeof d.data == i ? (d = j.extend(d, d.data), 
        delete d.data) : typeof d.metadata == i && j.deepReplaceKeyName(d.metadata, [ "__dot__", "__spc__", "__dsh__", "__default__" ], [ ".", " ", "-", "default" ]) : (d.fullscreen = "true" == d.message ? !0 : !1, 
        delete d.message);
        var e = [ "position", "duration", "offset" ];
        for (var f in e) d[e[f]] && (d[e[f]] = Math.round(1e3 * d[e[f]]) / 1e3);
        return d;
    }, j.flashVersion = function() {
        if (j.isAndroid()) return 0;
        var a, b = f.plugins;
        try {
            if (b !== g && (a = b["Shockwave Flash"])) return parseInt(a.description.replace(/\D+(\d+)\..*/, "$1"));
        } catch (c) {}
        if (typeof e.ActiveXObject != g) try {
            if (a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) return parseInt(a.GetVariable("$version").split(" ")[1].split(",")[0]);
        } catch (d) {}
        return 0;
    }, j.getScriptPath = function(a) {
        for (var b = d.getElementsByTagName("script"), c = 0; c < b.length; c++) {
            var e = b[c].src;
            if (e && e.indexOf(a) >= 0) return e.substr(0, e.indexOf(a));
        }
        return "";
    }, j.deepReplaceKeyName = function(b, c, d) {
        switch (a.utils.typeOf(b)) {
          case "array":
            for (var e = 0; e < b.length; e++) b[e] = a.utils.deepReplaceKeyName(b[e], c, d);
            break;

          case i:
            for (var f in b) {
                var g, h;
                if (c instanceof Array && d instanceof Array) {
                    if (c.length != d.length) continue;
                    g = c, h = d;
                } else g = [ c ], h = [ d ];
                for (var j = f, e = 0; e < g.length; e++) j = j.replace(new RegExp(c[e], "g"), d[e]);
                b[j] = a.utils.deepReplaceKeyName(b[f], c, d), f != j && delete b[f];
            }
        }
        return b;
    };
    var l = j.pluginPathType = {
        ABSOLUTE: 0,
        RELATIVE: 1,
        CDN: 2
    };
    j.getPluginPathType = function(a) {
        if (typeof a == h) {
            a = a.split("?")[0];
            var b = a.indexOf("://");
            if (b > 0) return l.ABSOLUTE;
            var c = a.indexOf("/"), d = j.extension(a);
            return !(0 > b && 0 > c) || d && isNaN(d) ? l.RELATIVE : l.CDN;
        }
    }, j.getPluginName = function(a) {
        return a.replace(/^(.*\/)?([^-]*)-?.*\.(swf|js)$/, "$2");
    }, j.getPluginVersion = function(a) {
        return a.replace(/[^-]*-?([^\.]*).*$/, "$1");
    }, j.isYouTube = function(a) {
        return a.indexOf("youtube.com") > -1 || a.indexOf("youtu.be") > -1;
    }, j.isRtmp = function(a, b) {
        return 0 == a.indexOf("rtmp") || "rtmp" == b;
    }, j.foreach = function(a, b) {
        for (var c in a) a.hasOwnProperty(c) && b(c);
    }, j.isHTTPS = function() {
        return 0 == e.location.href.indexOf("https");
    }, j.repo = function() {
        var b = "http://p.jwpcdn.com/" + a.version.split(/\W/).splice(0, 2).join("/") + "/";
        try {
            j.isHTTPS() && (b = b.replace("http://", "https://ssl."));
        } catch (c) {}
        return b;
    };
}(cyberplayer), function(a) {
    var b = "video/", c = "audio/", d = "mp4", e = "webm", f = "ogg", g = "aac", h = "mp3", i = "vorbis", j = {
        mp4: b + d,
        vorbis: c + f,
        ogg: b + f,
        webm: b + e,
        aac: c + d,
        mp3: c + "mpeg",
        hls: "application/vnd.apple.mpegurl"
    }, k = {
        mp4: j[d],
        f4v: j[d],
        m4v: j[d],
        mov: j[d],
        m4a: j[g],
        f4a: j[g],
        aac: j[g],
        mp3: j[h],
        ogv: j[f],
        ogg: j[i],
        oga: j[i],
        webm: j[e],
        m3u8: j.hls,
        hls: j.hls
    }, b = "video", l = {
        flv: b,
        f4v: b,
        mov: b,
        m4a: b,
        m4v: b,
        mp4: b,
        aac: b,
        f4a: b,
        mp3: "sound",
        smil: "rtmp",
        m3u8: "hls",
        hls: "hls"
    }, m = a.extensionmap = {};
    for (var n in k) m[n] = {
        html5: k[n]
    };
    for (n in l) m[n] || (m[n] = {}), m[n].flash = l[n];
    m.types = j, m.mimeType = function(a) {
        for (var b in j) if (j[b] == a) return b;
    }, m.extType = function(a) {
        return m.mimeType(k[a]);
    };
}(cyberplayer.utils), function(a) {
    var b = a.loaderstatus = {
        NEW: 0,
        LOADING: 1,
        ERROR: 2,
        COMPLETE: 3
    }, c = document;
    a.scriptloader = function(d) {
        function e(a) {
            g = b.ERROR, i.sendEvent(h.ERROR);
        }
        function f(a) {
            g = b.COMPLETE, i.sendEvent(h.COMPLETE);
        }
        var g = b.NEW, h = cyberplayer.events, i = new h.eventdispatcher();
        a.extend(this, i), this.load = function() {
            var i = a.scriptloader.loaders[d];
            if (i && (i.getStatus() == b.NEW || i.getStatus() == b.LOADING)) return i.addEventListener(h.ERROR, e), 
            void i.addEventListener(h.COMPLETE, f);
            if (a.scriptloader.loaders[d] = this, g == b.NEW) {
                g = b.LOADING;
                var j = c.createElement("script");
                j.addEventListener ? (j.onload = f, j.onerror = e) : j.readyState && (j.onreadystatechange = function() {
                    ("loaded" == j.readyState || "complete" == j.readyState) && f();
                }), c.getElementsByTagName("head")[0].appendChild(j), j.src = d;
            }
        }, this.getStatus = function() {
            return g;
        };
    }, a.scriptloader.loaders = {};
}(cyberplayer.utils), function(a) {
    a.trim = function(a) {
        return a.replace(/^\s*/, "").replace(/\s*$/, "");
    }, a.pad = function(a, b, c) {
        for (c || (c = "0"); a.length < b; ) a = c + a;
        return a;
    }, a.xmlAttribute = function(a, b) {
        for (var c = 0; c < a.attributes.length; c++) if (a.attributes[c].name && a.attributes[c].name.toLowerCase() == b.toLowerCase()) return a.attributes[c].value.toString();
        return "";
    }, a.extension = function(a) {
        return a && "rtmp" != a.substr(0, 4) ? (a = a.substring(a.lastIndexOf("/") + 1, a.length).split("?")[0].split("#")[0], 
        a.lastIndexOf(".") > -1 ? a.substr(a.lastIndexOf(".") + 1, a.length).toLowerCase() : void 0) : "";
    }, a.stringToColor = function(a) {
        return a = a.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2"), 3 == a.length && (a = a.charAt(0) + a.charAt(0) + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2)), 
        parseInt(a, 16);
    };
}(cyberplayer.utils), function(a) {
    a.events = {
        COMPLETE: "COMPLETE",
        ERROR: "ERROR",
        API_READY: "cbplayerAPIReady",
        CBPLAYER_READY: "cbplayerReady",
        CBPLAYER_FULLSCREEN: "cbplayerFullscreen",
        CBPLAYER_RESIZE: "cbplayerResize",
        CBPLAYER_ERROR: "cbplayerError",
        CBPLAYER_MEDIA_BEFOREPLAY: "cbplayerMediaBeforePlay",
        CBPLAYER_MEDIA_BEFORECOMPLETE: "cbplayerMediaBeforeComplete",
        CBPLAYER_COMPONENT_SHOW: "cbplayerComponentShow",
        CBPLAYER_COMPONENT_HIDE: "cbplayerComponentHide",
        CBPLAYER_MEDIA_BUFFER: "cbplayerMediaBuffer",
        CBPLAYER_MEDIA_BUFFER_FULL: "cbplayerMediaBufferFull",
        CBPLAYER_MEDIA_ERROR: "cbplayerMediaError",
        CBPLAYER_MEDIA_LOADED: "cbplayerMediaLoaded",
        CBPLAYER_MEDIA_COMPLETE: "cbplayerMediaComplete",
        CBPLAYER_MEDIA_SEEK: "cbplayerMediaSeek",
        CBPLAYER_MEDIA_TIME: "cbplayerMediaTime",
        CBPLAYER_MEDIA_VOLUME: "cbplayerMediaVolume",
        CBPLAYER_MEDIA_META: "cbplayerMediaMeta",
        CBPLAYER_MEDIA_MUTE: "cbplayerMediaMute",
        CBPLAYER_MEDIA_LEVELS: "cbplayerMediaLevels",
        CBPLAYER_MEDIA_LEVEL_CHANGED: "cbplayerMediaLevelChanged",
        CBPLAYER_CAPTIONS_CHANGED: "cbplayerCaptionsChanged",
        CBPLAYER_CAPTIONS_LIST: "cbplayerCaptionsList",
        CBPLAYER_PLAYER_STATE: "cyberPlayerState",
        state: {
            BUFFERING: "BUFFERING",
            IDLE: "IDLE",
            PAUSED: "PAUSED",
            PLAYING: "PLAYING"
        },
        CBPLAYER_PLAYLIST_LOADED: "cbplayerPlaylistLoaded",
        CBPLAYER_PLAYLIST_ITEM: "cbplayerPlaylistItem",
        CBPLAYER_PLAYLIST_COMPLETE: "cbplayerPlaylistComplete",
        CBPLAYER_DISPLAY_CLICK: "cbplayerViewClick",
        CBPLAYER_CONTROLS: "cbplayerViewControls",
        CBPLAYER_INSTREAM_CLICK: "cbplayerInstreamClicked",
        CBPLAYER_INSTREAM_DESTROYED: "cbplayerInstreamDestroyed"
    };
}(cyberplayer), function(a) {
    var b = cyberplayer.utils;
    a.eventdispatcher = function(a, c) {
        var d, e, f = a, g = c;
        this.resetEventListeners = function() {
            d = {}, e = [];
        }, this.resetEventListeners(), this.addEventListener = function(a, c, e) {
            try {
                b.exists(d[a]) || (d[a] = []), "string" == b.typeOf(c) && (c = new Function("return " + c)()), 
                d[a].push({
                    listener: c,
                    count: e
                });
            } catch (f) {
                b.log("error", f);
            }
            return !1;
        }, this.removeEventListener = function(a, c) {
            if (d[a]) {
                try {
                    for (var e = 0; e < d[a].length; e++) if (d[a][e].listener.toString() == c.toString()) {
                        d[a].splice(e, 1);
                        break;
                    }
                } catch (f) {
                    b.log("error", f);
                }
                return !1;
            }
        }, this.addGlobalListener = function(a, c) {
            try {
                "string" == b.typeOf(a) && (a = new Function("return " + a)()), e.push({
                    listener: a,
                    count: c
                });
            } catch (d) {
                b.log("error", d);
            }
            return !1;
        }, this.removeGlobalListener = function(a) {
            if (a) {
                try {
                    for (var c = 0; c < e.length; c++) if (e[c].listener.toString() == a.toString()) {
                        e.splice(c, 1);
                        break;
                    }
                } catch (d) {
                    b.log("error", d);
                }
                return !1;
            }
        }, this.sendEvent = function(a, c) {
            if (b.exists(c) || (c = {}), b.extend(c, {
                id: f,
                version: cyberplayer.version,
                type: a
            }), g && b.log(a, c), "undefined" != b.typeOf(d[a])) for (var h = 0; h < d[a].length; h++) {
                try {
                    d[a][h].listener(c);
                } catch (i) {
                    b.log("There was an error while handling a listener: " + i.toString(), d[a][h].listener);
                }
                d[a][h] && (1 === d[a][h].count ? delete d[a][h] : d[a][h].count > 0 && (d[a][h].count = d[a][h].count - 1));
            }
            var j;
            for (j = 0; j < e.length; j++) {
                try {
                    e[j].listener(c);
                } catch (i) {
                    b.log("There was an error while handling a listener: " + i.toString(), e[j].listener);
                }
                e[j] && (1 === e[j].count ? delete e[j] : e[j].count > 0 && (e[j].count = e[j].count - 1));
            }
        };
    };
}(cyberplayer.events), function(a) {
    var b = {}, c = {};
    a.plugins = function() {}, a.plugins.loadPlugins = function(d, e) {
        return c[d] = new a.plugins.pluginloader(new a.plugins.model(b), e), c[d];
    }, a.plugins.registerPlugin = function(c, d, e, f) {
        var g = a.utils.getPluginName(c);
        b[g] || (b[g] = new a.plugins.plugin(c)), b[g].registerPlugin(c, d, e, f);
    };
}(cyberplayer), function(a) {
    a.plugins.model = function(b) {
        this.addPlugin = function(c) {
            var d = a.utils.getPluginName(c);
            return b[d] || (b[d] = new a.plugins.plugin(c)), b[d];
        }, this.getPlugins = function() {
            return b;
        };
    };
}(cyberplayer), function(a) {
    var b = cyberplayer.utils, c = cyberplayer.events, d = "undefined";
    a.pluginmodes = {
        FLASH: 0,
        JAVASCRIPT: 1,
        HYBRID: 2
    }, a.plugin = function(e) {
        function f() {
            switch (b.getPluginPathType(e)) {
              case b.pluginPathType.ABSOLUTE:
                return e;

              case b.pluginPathType.RELATIVE:
                return b.getAbsolutePath(e, window.location.href);
            }
        }
        function g(a) {
            l = setTimeout(function() {
                m = b.loaderstatus.COMPLETE, n.sendEvent(c.COMPLETE);
            }, 1e3);
        }
        function h(a) {
            m = b.loaderstatus.ERROR, n.sendEvent(c.ERROR);
        }
        var i, j, k, l, m = b.loaderstatus.NEW, n = new c.eventdispatcher();
        b.extend(this, n), this.load = function() {
            if (m == b.loaderstatus.NEW) {
                if (e.lastIndexOf(".swf") > 0) return i = e, m = b.loaderstatus.COMPLETE, void n.sendEvent(c.COMPLETE);
                if (b.getPluginPathType(e) == b.pluginPathType.CDN) return m = b.loaderstatus.COMPLETE, 
                void n.sendEvent(c.COMPLETE);
                m = b.loaderstatus.LOADING;
                var a = new b.scriptloader(f());
                a.addEventListener(c.COMPLETE, g), a.addEventListener(c.ERROR, h), a.load();
            }
        }, this.registerPlugin = function(a, d, e, f) {
            l && (clearTimeout(l), l = void 0), k = d, e && f ? (i = f, j = e) : "string" == typeof e ? i = e : "function" == typeof e ? j = e : e || f || (i = a), 
            m = b.loaderstatus.COMPLETE, n.sendEvent(c.COMPLETE);
        }, this.getStatus = function() {
            return m;
        }, this.getPluginName = function() {
            return b.getPluginName(e);
        }, this.getFlashPath = function() {
            if (i) switch (b.getPluginPathType(i)) {
              case b.pluginPathType.ABSOLUTE:
                return i;

              case b.pluginPathType.RELATIVE:
                return e.lastIndexOf(".swf") > 0 ? b.getAbsolutePath(i, window.location.href) : b.getAbsolutePath(i, f());
            }
            return null;
        }, this.getJS = function() {
            return j;
        }, this.getTarget = function() {
            return k;
        }, this.getPluginmode = function() {
            return typeof i != d && typeof j != d ? a.pluginmodes.HYBRID : typeof i != d ? a.pluginmodes.FLASH : typeof j != d ? a.pluginmodes.JAVASCRIPT : void 0;
        }, this.getNewInstance = function(a, b, c) {
            return new j(a, b, c);
        }, this.getURL = function() {
            return e;
        };
    };
}(cyberplayer.plugins), function(a) {
    var b = a.utils, c = a.events;
    a.plugins.pluginloader = function(d, e) {
        function f() {
            l ? n.sendEvent(c.ERROR, {
                message: h
            }) : k || (k = !0, i = b.loaderstatus.COMPLETE, n.sendEvent(c.COMPLETE));
        }
        function g() {
            if (m || f(), !k && !l) {
                var c = 0, e = d.getPlugins();
                for (var g in m) {
                    var i = b.getPluginName(g), j = e[i], n = j.getJS(), o = j.getTarget(), p = j.getStatus();
                    p == b.loaderstatus.LOADING || p == b.loaderstatus.NEW ? c++ : n && (!o || parseFloat(o) > parseFloat(a.version)) && (l = !0, 
                    h = "Incompatible player version", f());
                }
                0 == c && f();
            }
        }
        var h, i = b.loaderstatus.NEW, j = !1, k = !1, l = !1, m = e, n = new c.eventdispatcher();
        b.extend(this, n), this.setupPlugins = function(a, c, e) {
            var f = {
                length: 0,
                plugins: {}
            }, g = {
                length: 0,
                plugins: {}
            }, h = d.getPlugins();
            for (var i in c.plugins) {
                var j = b.getPluginName(i), k = h[j], l = k.getFlashPath(), m = k.getJS(), n = k.getURL();
                l && (f.plugins[l] = b.extend({}, c.plugins[i]), f.plugins[l].pluginmode = k.getPluginmode(), 
                f.length++);
                try {
                    if (m && c.plugins && c.plugins[n]) {
                        var o = document.createElement("div");
                        o.id = a.id + "_" + j, o.style.position = "absolute", o.style.top = 0, o.style.zIndex = g.length + 10, 
                        g.plugins[j] = k.getNewInstance(a, b.extend({}, c.plugins[n]), o), g.length++, a.onReady(e(g.plugins[j], o, !0)), 
                        a.onResize(e(g.plugins[j], o));
                    }
                } catch (p) {
                    b.log("ERROR: Failed to load " + j + ".");
                }
            }
            return a.plugins = g.plugins, f;
        }, this.load = function() {
            if (b.exists(e) && "object" != b.typeOf(e)) return void g();
            i = b.loaderstatus.LOADING, j = !0;
            for (var a in e) if (b.exists(a)) {
                var f = d.addPlugin(a);
                f.addEventListener(c.COMPLETE, g), f.addEventListener(c.ERROR, o);
            }
            var h = d.getPlugins();
            for (a in h) h[a].load();
            j = !1, g();
        };
        var o = this.pluginFailed = function(a) {
            l || (l = !0, h = "File not found", f());
        };
        this.getStatus = function() {
            return i;
        };
    };
}(cyberplayer), function(a) {
    a.playlist = function(b) {
        var c = [];
        if ("array" == a.utils.typeOf(b)) for (var d = 0; d < b.length; d++) c.push(new a.playlist.item(b[d])); else c.push(new a.playlist.item(b));
        return c;
    };
}(cyberplayer), function(a) {
    var b = a.item = function(c) {
        var d = cyberplayer.utils, e = d.extend({}, b.defaults, c);
        e.tracks = d.exists(c.tracks) ? c.tracks : [], 0 === e.sources.length && (e.sources = [ new a.source(e) ]);
        for (var f = 0; f < e.sources.length; f++) {
            var g = e.sources[f]["default"];
            g ? e.sources[f]["default"] = "true" === g.toString() : e.sources[f]["default"] = !1, 
            e.sources[f] = new a.source(e.sources[f]);
        }
        if (e.captions && !d.exists(c.tracks)) {
            for (var h = 0; h < e.captions.length; h++) e.tracks.push(e.captions[h]);
            delete e.captions;
        }
        for (var i = 0; i < e.tracks.length; i++) e.tracks[f] = new a.track(e.tracks[f]);
        return e;
    };
    b.defaults = {
        description: "",
        image: "",
        mediaid: "",
        title: "",
        sources: [],
        tracks: []
    };
}(cyberplayer.playlist), function(a) {
    var b = void 0, c = cyberplayer.utils, d = {
        file: b,
        label: b,
        type: b,
        "default": b
    };
    a.source = function(a) {
        var b = c.extend({}, d);
        for (var e in d) c.exists(a[e]) && (b[e] = a[e], delete a[e]);
        return b.type && b.type.indexOf("/") > 0 && (b.type = c.extensionmap.mimeType(b.type)), 
        "m3u8" == b.type && (b.type = "hls"), "smil" == b.type && (b.type = "rtmp"), b;
    };
}(cyberplayer.playlist), function(a) {
    var b = void 0, c = cyberplayer.utils, d = {
        file: b,
        label: b,
        kind: "captions",
        "default": !1
    };
    a.track = function(a) {
        var b = c.extend({}, d);
        a || (a = {});
        for (var e in d) c.exists(a[e]) && (b[e] = a[e], delete a[e]);
        return b;
    };
}(cyberplayer.playlist), function(a) {
    var b = a.utils, c = a.events, d = document, e = a.embed = function(f) {
        function g(a, b) {
            for (var c in b) "function" == typeof a[c] && a[c].call(a, b[c]);
        }
        function h() {
            if ("array" == b.typeOf(q.playlist) && q.playlist.length < 2 && (0 == q.playlist.length || !q.playlist[0].sources || 0 == q.playlist[0].sources.length)) return void l();
            if (u.getStatus() == b.loaderstatus.COMPLETE) {
                for (var a = 0; a < q.modes.length; a++) if (q.modes[a].type && e[q.modes[a].type]) {
                    var d = b.extend({}, q), h = new e[q.modes[a].type](n, q.modes[a], d, u, f);
                    if (h.supportsConfig()) return h.addEventListener(c.ERROR, j), h.embed(), g(f, d.events), 
                    f;
                }
                q.fallback ? (b.log("No suitable players found and fallback enabled"), new e.download(n, q, l)) : (b.log("No suitable players found and fallback disabled"), 
                i());
            }
        }
        function i() {
            n.parentNode.replaceChild(p, n);
        }
        function j(a) {
            m(n, t + a.message);
        }
        function k(a) {
            m(n, "Could not load plugins: " + a.message);
        }
        function l() {
            m(n, t + "No playable sources found");
        }
        function m(a, c) {
            if (q.fallback) {
                var d = a.style;
                d.backgroundColor = "#000", d.color = "#FFF", d.width = b.styleDimension(q.width), 
                d.height = b.styleDimension(q.height), d.display = "table", d.opacity = 1;
                var e = document.createElement("p"), f = e.style;
                f.verticalAlign = "middle", f.textAlign = "center", f.display = "table-cell", f.font = "15px/20px Arial, Helvetica, sans-serif", 
                e.innerHTML = c.replace(":", ":<br>"), a.innerHTML = "", a.appendChild(e);
            }
        }
        var n, o, p, q = new e.config(f.config), r = q.width, s = q.height, t = "Error loading player: ", u = a.plugins.loadPlugins(f.id, q.plugins);
        return q.fallbackDiv && (p = q.fallbackDiv, delete q.fallbackDiv), q.id = f.id, 
        o = d.getElementById(f.id), n = d.createElement("div"), n.id = o.id, n.style.width = r.toString().indexOf("%") > 0 ? r : r + "px", 
        n.style.height = s.toString().indexOf("%") > 0 ? s : s + "px", o.parentNode.replaceChild(n, o), 
        a.embed.errorScreen = m, u.addEventListener(c.COMPLETE, h), u.addEventListener(c.ERROR, k), 
        u.load(), f;
    };
}(cyberplayer), function(a) {
    function b(a) {
        if (a.playlist) for (var b = 0; b < a.playlist.length; b++) a.playlist[b] = new f(a.playlist[b]); else {
            var d = {};
            for (var e in f.defaults) c(a, d, e);
            if (!d.sources) if (a.levels) d.sources = a.levels, delete a.levels; else {
                var g = {};
                c(a, g, "file"), c(a, g, "type"), d.sources = g.file ? [ g ] : [];
            }
            a.playlist = [ new f(d) ];
        }
    }
    function c(a, b, c) {
        d.exists(a[c]) && (b[c] = a[c], delete a[c]);
    }
    var d = a.utils, e = a.embed, f = a.playlist.item, g = e.config = function(c) {
        var e = {
            fallback: !0,
            height: 270,
            primary: "html5",
            width: 480,
            base: c.base ? c.base : d.getScriptPath("min.js")
        }, f = d.extend(e, a.defaults, c), g = {
            html5: {
                type: "html5",
                src: f.base + "html5.min.js"
            },
            flash: {
                type: "flash",
                src: f.base + "cyberplayer.flash.swf"
            }
        };
        return f.modes = "flash" == f.primary ? [ g.flash, g.html5 ] : [ g.html5, g.flash ], 
        f.listbar && (f.playlistsize = f.listbar.size, f.playlistposition = f.listbar.position), 
        f.flashplayer && (g.flash.src = f.flashplayer), f.html5player && (g.html5.src = f.html5player), 
        b(f), f;
    };
    g.addConfig = function(a, c) {
        return b(c), d.extend(a, c);
    };
}(cyberplayer), function(a) {
    var b = a.embed, c = a.utils, d = document, e = "none", f = "block", g = "100%", h = "relative", i = "absolute";
    b.download = function(a, b, j) {
        function k() {
            var a, b, d, e, f, g, e, h = t.playlist, i = [ "mp4", "aac", "mp3" ];
            if (h && h.length) {
                for (f = h[0], g = f.sources, e = 0; e < g.length; e++) {
                    var k = g[e], m = k.type ? k.type : c.extensionmap.extType(c.extension(k.file));
                    if (k.file) {
                        for (e in i) m == i[e] ? (a = k.file, b = f.image) : c.isYouTube(k.file) && (d = k.file);
                        if (a || d) continue;
                    }
                }
                a ? (r = a, s = b, l(), n()) : d ? p(d) : j();
            }
        }
        function l() {
            a && (q = o("a", "display", a), o("div", "icon", q), o("div", "logo", q), r && q.setAttribute("href", c.getAbsolutePath(r)));
        }
        function m(a, b) {
            for (var c = d.querySelectorAll(a), e = 0; e < c.length; e++) for (var f in b) c[e].style[f] = b[f];
        }
        function n() {
            var b = "#" + a.id + " .cbdownload";
            a.style.width = "", a.style.height = "", m(b + "display", {
                width: c.styleDimension(Math.max(320, u)),
                height: c.styleDimension(Math.max(180, v)),
                background: "black center no-repeat " + (s ? "url(" + s + ")" : ""),
                backgroundSize: "contain",
                position: h,
                border: e,
                display: f
            }), m(b + "display div", {
                position: i,
                width: g,
                height: g
            }), m(b + "logo", {
                top: w.margin + "px",
                right: w.margin + "px",
                background: "top right no-repeat url(" + w.prefix + w.file + ")"
            }), m(b + "icon", {
                background: "center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgNJREFUeNrs28lqwkAYB/CZqNVDDj2r6FN41QeIy8Fe+gj6BL275Q08u9FbT8ZdwVfotSBYEPUkxFOoks4EKiJdaDuTjMn3wWBO0V/+sySR8SNSqVRKIR8qaXHkzlqS9jCfzzWcTCYp9hF5o+59sVjsiRzcegSckFzcjT+ruN80TeSlAjCAAXzdJSGPFXRpAAMYwACGZQkSdhG4WCzehMNhqV6vG6vVSrirKVEw66YoSqDb7cqlUilE8JjHd/y1MQefVzqdDmiaJpfLZWHgXMHn8F6vJ1cqlVAkEsGuAn83J4gAd2RZymQygX6/L1erVQt+9ZPWb+CDwcCC2zXGJaewl/DhcHhK3DVj+KfKZrMWvFarcYNLomAv4aPRSFZVlTlcSPA5fDweW/BoNIqFnKV53JvncjkLns/n/cLdS+92O7RYLLgsKfv9/t8XlDn4eDyiw+HA9Jyz2eyt0+kY2+3WFC5hluej0Ha7zQQq9PPwdDq1Et1sNsx/nFBgCqWJ8oAK1aUptNVqcYWewE4nahfU0YQnk4ntUEfGMIU2m01HoLaCKbTRaDgKtaVLk9tBYaBcE/6Artdr4RZ5TB6/dC+9iIe/WgAMYADDpAUJAxjAAAYwgGFZgoS/AtNNTF7Z2bL0BYPBV3Jw5xFwwWcYxgtBP5OkE8i9G7aWGOOCruvauwADALMLMEbKf4SdAAAAAElFTkSuQmCC)"
            });
        }
        function o(a, b, c) {
            var e = d.createElement(a);
            return b && (e.className = "cbdownload" + b), c && c.appendChild(e), e;
        }
        function p(b) {
            var c = o("embed", "", a);
            c.src = "http://www.youtube.com/v/" + /v[=\/](\w*)|\/(\w+)$|^(\w+)$/i.exec(b).slice(1).join(""), 
            c.type = "application/x-shockwave-flash", c.width = u, c.height = v;
        }
        var q, r, s, t = c.extend({}, b), u = t.width ? t.width : 480, v = t.height ? t.height : 320, w = b.logo ? b.logo : {
            prefix: c.repo(),
            file: "logo.png",
            margin: 10
        };
        k();
    };
}(cyberplayer), function(a) {
    var b = a.utils, c = a.events, d = {}, e = a.embed.flash = function(e, f, g, h, i) {
        function j(a, b, c) {
            var d = document.createElement("param");
            d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d);
        }
        function k(a, b, c) {
            return function(d) {
                try {
                    c && document.getElementById(i.id + "_wrapper").appendChild(b);
                    var e = document.getElementById(i.id).getPluginConfig("display");
                    "function" == typeof a.resize && a.resize(e.width, e.height), b.style.left = e.x, 
                    b.style.top = e.h;
                } catch (f) {}
            };
        }
        function l(a) {
            if (!a) return {};
            var c = {}, d = [];
            for (var e in a) {
                var f = b.getPluginName(e), g = a[e];
                d.push(e);
                for (var h in g) c[f + "." + h] = g[h];
            }
            return c.plugins = d.join(","), c;
        }
        function m(a, c) {
            if (b.isYouTube(a)) return !0;
            if (b.isRtmp(a, c)) return !0;
            if ("hls" == c) return !0;
            var d = b.extensionmap[c ? c : b.extension(a)];
            return d ? !!d.flash : !1;
        }
        var n = new a.events.eventdispatcher(), o = b.flashVersion();
        b.extend(this, n), this.embed = function() {
            if (g.id = i.id, 10 > o) return n.sendEvent(c.ERROR, {
                message: "Flash version must be 10.0 or greater"
            }), !1;
            var a, m = b.extend({}, g);
            e.id + "_wrapper" == e.parentNode.id ? a = document.getElementById(e.id + "_wrapper") : (a = document.createElement("div"), 
            a.id = e.id + "_wrapper", a.style.position = "relative", a.style.width = b.styleDimension(m.width), 
            a.style.height = b.styleDimension(m.height), e.parentNode.replaceChild(a, e), a.appendChild(e));
            var p = h.setupPlugins(i, m, k);
            p.length > 0 ? b.extend(m, l(p.plugins)) : delete m.plugins, "undefined" != typeof m["dock.position"] && "false" == m["dock.position"].toString().toLowerCase() && (m.dock = m["dock.position"], 
            delete m["dock.position"]);
            for (var q, r = "#000000", s = m.wmode ? m.wmode : m.height && m.height <= 40 ? "transparent" : "opaque", t = [ "height", "width", "modes", "events", "primary", "base", "fallback" ], u = 0; u < t.length; u++) delete m[t[u]];
            var v = b.getCookies();
            for (var w in v) "undefined" == typeof m[w] && (m[w] = v[w]);
            var x = window.location.pathname.split("/");
            if (x.splice(x.length - 1, 1), x = x.join("/"), m.base = x + "/", d[e.id] = m, b.isIE()) {
                var y = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" " width="100%" height="100%" id="' + e.id + '" name="' + e.id + '" tabindex=0"">';
                y += '<param name="movie" value="' + f.src + '">', y += '<param name="allowfullscreen" value="true">', 
                y += '<param name="allowscriptaccess" value="always">', y += '<param name="seamlesstabbing" value="true">', 
                y += '<param name="wmode" value="' + s + '">', y += '<param name="bgcolor" value="' + r + '">', 
                y += "</object>", e.outerHTML = y, q = document.getElementById(e.id);
            } else {
                var z = document.createElement("object");
                z.setAttribute("type", "application/x-shockwave-flash"), z.setAttribute("data", f.src), 
                z.setAttribute("width", "100%"), z.setAttribute("height", "100%"), z.setAttribute("bgcolor", r), 
                z.setAttribute("id", e.id), z.setAttribute("name", e.id), z.setAttribute("tabindex", 0), 
                j(z, "allowfullscreen", "true"), j(z, "allowscriptaccess", "always"), j(z, "seamlesstabbing", "true"), 
                j(z, "wmode", s), e.parentNode.replaceChild(z, e), q = z;
            }
            i.container = q, i.setPlayer(q, "flash");
        }, this.supportsConfig = function() {
            if (o) {
                if (!g) return !0;
                if ("string" == b.typeOf(g.playlist)) return !0;
                try {
                    var a = g.playlist[0], c = a.sources;
                    if ("undefined" == typeof c) return !0;
                    for (var d = 0; d < c.length; d++) if (c[d].file && m(c[d].file, c[d].type)) return !0;
                } catch (e) {
                    return !1;
                }
            }
            return !1;
        };
    };
    e.getVars = function(a) {
        return d[a];
    };
}(cyberplayer), function(a) {
    var b = a.utils, c = b.extensionmap, d = a.events;
    a.embed.html5 = function(e, f, g, h, i) {
        function j(a, b, c) {
            return function(d) {
                try {
                    var f = document.querySelector("#" + e.id + " .cbmain");
                    c && f.appendChild(b), "function" == typeof a.resize && (a.resize(f.clientWidth, f.clientHeight), 
                    setTimeout(function() {
                        a.resize(f.clientWidth, f.clientHeight);
                    }, 400)), b.left = f.style.left, b.top = f.style.top;
                } catch (g) {}
            };
        }
        function k(a) {
            n.sendEvent(a.type, {
                message: "HTML5 player not found"
            });
        }
        function l(a, d) {
            if (null !== navigator.userAgent.match(/BlackBerry/i)) return !1;
            if ("m3u" === b.extension(a) || "m3u8" === b.extension(a)) return !1;
            if (b.isAndroid() && ("m3u" === b.extension(a) || "m3u8" === b.extension(a))) return !1;
            if (b.isRtmp(a, d)) return !1;
            var e = c[d ? d : b.extension(a)];
            return e ? e.flash && !e.html5 ? !1 : m(e.html5) : !1;
        }
        function m(b) {
            var c = a.vid;
            if (!b) return !0;
            try {
                return c.canPlayType(b) ? !0 : !1;
            } catch (d) {
                return !1;
            }
        }
        var n = this, o = new d.eventdispatcher();
        b.extend(n, o), n.embed = function() {
            if (a.html5) {
                h.setupPlugins(i, g, j), e.innerHTML = "";
                var c = a.utils.extend({}, g), l = new a.html5.player(c);
                i.container = document.getElementById(i.id), i.setPlayer(l, "html5");
            } else {
                var m = new b.scriptloader(f.src);
                m.addEventListener(d.ERROR, k), m.addEventListener(d.COMPLETE, n.embed), m.load();
            }
        }, n.supportsConfig = function() {
            if (a.vid.canPlayType) try {
                if ("string" == b.typeOf(g.playlist)) return !0;
                for (var c = g.playlist[0].sources, d = 0; d < c.length; d++) {
                    var e = c[d].file, f = c[d].type;
                    if (l(e, f)) return !0;
                }
            } catch (h) {
                return !1;
            }
            return !1;
        };
    };
}(cyberplayer), function(a) {
    var b = [], c = a.utils, d = a.events, e = d.state, f = document, g = a.api = function(b) {
        function h(a, b) {
            return function(c) {
                return b(a, c);
            };
        }
        function i(a) {
            t = [], g.destroyPlayer(a.id);
        }
        function j(a, b) {
            return q[a] || (q[a] = [], m(d.CBPLAYER_PLAYER_STATE, k(a))), q[a].push(b), o;
        }
        function k(a) {
            return function(b) {
                var c = b.newstate, d = b.oldstate;
                if (c == a) {
                    var e = q[c];
                    if (e) for (var f = 0; f < e.length; f++) "function" == typeof e[f] && e[f].call(this, {
                        oldstate: d,
                        newstate: c
                    });
                }
            };
        }
        function l(a, b) {
            try {
                a.cbAddEventListener(b, 'function(dat) { cyberplayer("' + o.id + '").dispatchEvent("' + b + '", dat); }');
            } catch (d) {
                c.log("Could not add internal listener");
            }
        }
        function m(a, b) {
            return p[a] || (p[a] = [], r && s && l(r, a)), p[a].push(b), o;
        }
        function n() {
            if (s) {
                for (var a = arguments[0], b = [], c = 1; c < arguments.length; c++) b.push(arguments[c]);
                if ("undefined" != typeof r && "function" == typeof r[a]) switch (b.length) {
                  case 4:
                    return r[a](b[0], b[1], b[2], b[3]);

                  case 3:
                    return r[a](b[0], b[1], b[2]);

                  case 2:
                    return r[a](b[0], b[1]);

                  case 1:
                    return r[a](b[0]);

                  default:
                    return r[a]();
                }
                return null;
            }
            t.push(arguments);
        }
        var o = this, p = {}, q = {}, r = void 0, s = !1, t = [], u = void 0, v = {}, w = {};
        o.container = b, o.id = b.id, o.getBuffer = function() {
            return n("cbGetBuffer");
        }, o.getContainer = function() {
            return o.container;
        }, o.addButton = function(a, b, d, e) {
            try {
                w[e] = d;
                var f = "cyberplayer('" + o.id + "').callback('" + e + "')";
                n("cbDockAddButton", a, b, f, e);
            } catch (g) {
                c.log("Could not add dock button" + g.message);
            }
        }, o.removeButton = function(a) {
            n("cbDockRemoveButton", a);
        }, o.callback = function(a) {
            w[a] && w[a]();
        }, o.forceState = function(a) {
            return n("cbForceState", a), o;
        }, o.releaseState = function() {
            return n("cbReleaseState");
        }, o.getDuration = function() {
            return n("cbGetDuration");
        }, o.getFullscreen = function() {
            return n("cbGetFullscreen");
        }, o.getStretching = function() {
            return n("cbGetStretching");
        }, o.getHeight = function() {
            return n("cbGetHeight");
        }, o.getLockState = function() {
            return n("cbGetLockState");
        }, o.getMeta = function() {
            return o.getItemMeta();
        }, o.getMute = function() {
            return n("cbGetMute");
        }, o.getPlaylist = function() {
            var a = n("cbGetPlaylist");
            return "flash" == o.renderingMode && c.deepReplaceKeyName(a, [ "__dot__", "__spc__", "__dsh__", "__default__" ], [ ".", " ", "-", "default" ]), 
            a;
        }, o.getPlaylistItem = function(a) {
            return c.exists(a) || (a = o.getCurrentItem()), o.getPlaylist()[a];
        }, o.getPosition = function() {
            return n("cbGetPosition");
        }, o.getRenderingMode = function() {
            return o.renderingMode;
        }, o.getState = function() {
            return n("cbGetState");
        }, o.getVolume = function() {
            return n("cbGetVolume");
        }, o.getWidth = function() {
            return n("cbGetWidth");
        }, o.setFullscreen = function(a) {
            return c.exists(a) ? n("cbSetFullscreen", a) : n("cbSetFullscreen", !n("cbGetFullscreen")), 
            o;
        }, o.setStretching = function(a) {
            return n("cbSetStretching", a), o;
        }, o.setMute = function(a) {
            return c.exists(a) ? n("cbSetMute", a) : n("cbSetMute", !n("cbGetMute")), o;
        }, o.lock = function() {
            return o;
        }, o.unlock = function() {
            return o;
        }, o.load = function(a) {
            return n("cbLoad", a), o;
        }, o.playlistItem = function(a) {
            return n("cbPlaylistItem", parseInt(a)), o;
        }, o.playlistPrev = function() {
            return n("cbPlaylistPrev"), o;
        }, o.playlistNext = function() {
            return n("cbPlaylistNext"), o;
        }, o.resize = function(a, b) {
            if ("flash" != o.renderingMode) n("cbResize", a, b); else {
                var d = f.getElementById(o.id + "_wrapper");
                d && (d.style.width = c.styleDimension(a), d.style.height = c.styleDimension(b));
            }
            return o;
        }, o.play = function(a) {
            return "undefined" == typeof a ? (a = o.getState(), n(a == e.PLAYING || a == e.BUFFERING ? "cbPause" : "cbPlay")) : n("cbPlay", a), 
            o;
        }, o.pause = function(a) {
            return "undefined" == typeof a ? (a = o.getState(), n(a == e.PLAYING || a == e.BUFFERING ? "cbPause" : "cbPlay")) : n("cbPause", a), 
            o;
        }, o.stop = function() {
            return n("cbStop"), o;
        }, o.seek = function(a) {
            return n("cbSeek", a), o;
        }, o.setVolume = function(a) {
            return n("cbSetVolume", a), o;
        }, o.loadInstream = function(a, b) {
            return u = new g.instream(this, r, a, b);
        }, o.getQualityLevels = function() {
            return n("cbGetQualityLevels");
        }, o.getCurrentQuality = function() {
            return n("cbGetCurrentQuality");
        }, o.setCurrentQuality = function(a) {
            n("cbSetCurrentQuality", a);
        }, o.getCaptionsList = function() {
            return n("cbGetCaptionsList");
        }, o.getCurrentCaptions = function() {
            return n("cbGetCurrentCaptions");
        }, o.setCurrentCaptions = function(a) {
            n("cbSetCurrentCaptions", a);
        }, o.getControls = function() {
            return n("cbGetControls");
        }, o.getSafeRegion = function() {
            return n("cbGetSafeRegion");
        }, o.setControls = function(a) {
            n("cbSetControls", a);
        }, o.destroyPlayer = function() {
            n("cyberplayerDestroy");
        };
        var x = {
            onBufferChange: d.CBPLAYER_MEDIA_BUFFER,
            onBufferFull: d.CBPLAYER_MEDIA_BUFFER_FULL,
            onError: d.CBPLAYER_ERROR,
            onFullscreen: d.CBPLAYER_FULLSCREEN,
            onMeta: d.CBPLAYER_MEDIA_META,
            onMute: d.CBPLAYER_MEDIA_MUTE,
            onPlaylist: d.CBPLAYER_PLAYLIST_LOADED,
            onPlaylistItem: d.CBPLAYER_PLAYLIST_ITEM,
            onPlaylistComplete: d.CBPLAYER_PLAYLIST_COMPLETE,
            onReady: d.API_READY,
            onResize: d.CBPLAYER_RESIZE,
            onComplete: d.CBPLAYER_MEDIA_COMPLETE,
            onSeek: d.CBPLAYER_MEDIA_SEEK,
            onTime: d.CBPLAYER_MEDIA_TIME,
            onVolume: d.CBPLAYER_MEDIA_VOLUME,
            onBeforePlay: d.CBPLAYER_MEDIA_BEFOREPLAY,
            onBeforeComplete: d.CBPLAYER_MEDIA_BEFORECOMPLETE,
            onDisplayClick: d.CBPLAYER_DISPLAY_CLICK,
            onControls: d.CBPLAYER_CONTROLS,
            onQualityLevels: d.CBPLAYER_MEDIA_LEVELS,
            onQualityChange: d.CBPLAYER_MEDIA_LEVEL_CHANGED,
            onCaptionsList: d.CBPLAYER_CAPTIONS_LIST,
            onCaptionsChange: d.CBPLAYER_CAPTIONS_CHANGED
        };
        c.foreach(x, function(a) {
            o[a] = h(x[a], m);
        });
        var y = {
            onBuffer: e.BUFFERING,
            onPause: e.PAUSED,
            onPlay: e.PLAYING,
            onIdle: e.IDLE
        };
        return c.foreach(y, function(a) {
            o[a] = h(y[a], j);
        }), o.remove = function() {
            if (!s) throw "Cannot call remove() before player is ready";
            i(this);
        }, o.setup = function(b) {
            if (a.embed) {
                var c = f.getElementById(o.id);
                c && (b.fallbackDiv = c), i(o);
                var d = a(o.id);
                return d.config = b, new a.embed(d);
            }
            return o;
        }, o.registerPlugin = function(b, c, d, e) {
            a.plugins.registerPlugin(b, c, d, e);
        }, o.setPlayer = function(a, b) {
            r = a, o.renderingMode = b;
        }, o.detachMedia = function() {
            return "html5" == o.renderingMode ? n("cbDetachMedia") : void 0;
        }, o.attachMedia = function(a) {
            return "html5" == o.renderingMode ? n("cbAttachMedia", a) : void 0;
        }, o.dispatchEvent = function(a) {
            if (p[a]) for (var b = c.translateEventResponse(a, arguments[1]), d = 0; d < p[a].length; d++) if ("function" == typeof p[a][d]) try {
                p[a][d].call(this, b);
            } catch (e) {
                c.log("There was an error calling back an event handler");
            }
        }, o.dispatchInstreamEvent = function(a) {
            u && u.dispatchEvent(a, arguments);
        }, o.callInternal = n, o.playerReady = function(a) {
            for (s = !0, r || o.setPlayer(f.getElementById(a.id)), o.container = f.getElementById(o.id), 
            c.foreach(p, function(a) {
                l(r, a);
            }), m(d.CBPLAYER_PLAYLIST_ITEM, function(a) {
                v = {};
            }), m(d.CBPLAYER_MEDIA_META, function(a) {
                c.extend(v, a.metadata);
            }), o.dispatchEvent(d.API_READY); t.length > 0; ) n.apply(this, t.shift());
        }, o.getItemMeta = function() {
            return v;
        }, o.getCurrentItem = function() {
            return n("cbGetPlaylistIndex");
        }, o;
    };
    g.selectPlayer = function(a) {
        var d;
        if (c.exists(a) || (a = 0), a.nodeType ? d = a : "string" == typeof a && (d = f.getElementById(a)), 
        d) {
            var e = g.playerById(d.id);
            return e ? e : g.addPlayer(new g(d));
        }
        return "number" == typeof a ? b[a] : null;
    }, g.playerById = function(a) {
        for (var c = 0; c < b.length; c++) if (b[c].id == a) return b[c];
        return null;
    }, g.addPlayer = function(a) {
        for (var c = 0; c < b.length; c++) if (b[c] == a) return a;
        return b.push(a), a;
    }, g.destroyPlayer = function(a) {
        for (var d, e = -1, g = 0; g < b.length; g++) b[g].id != a || (e = g, d = b[g]);
        if (e >= 0) {
            var h = d.id, i = f.getElementById(h + ("flash" == d.renderingMode ? "_wrapper" : ""));
            if (c.clearCss && c.clearCss("#" + h), i) {
                "html5" == d.renderingMode && d.destroyPlayer();
                var j = f.createElement("div");
                j.id = h, i.parentNode.replaceChild(j, i);
            }
            b.splice(e, 1);
        }
        return null;
    }, a.playerReady = function(b) {
        var c = a.api.playerById(b.id);
        c ? c.playerReady(b) : a.api.selectPlayer(b.id).playerReady(b);
    };
}(cyberplayer), function(a) {
    var b = a.events;
    a.utils, b.state;
    a.api.instream = function(a, b, c, d) {
        function e() {
            f.callInternal("cbLoadInstream", c, d ? d : {});
        }
        var f = a, g = b, h = this;
        h.play = function(a) {
            g.cbInstreamPlay(a);
        }, h.pause = function(a) {
            g.cbInstreamPause(a);
        }, h.destroy = function() {
            g.cbInstreamDestroy();
        }, e();
    };
}(cyberplayer));
if (navigator.userAgent.indexOf('AppleWebKit') != -1) {
    var counter = 0;
    setInterval(function() {
        jQuery("p,h1").css("z-index", counter);
        counter++;
    },100)
}

Number.prototype.toRadians = function () {
    return this*(Math.PI/180)
}

function latLongDistance (lat1,lon1,lat2,lon2) {
    //Credit to http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function success(position) {
    window.gbdata = window.gb["data"].map(function (item) {
        console.log([item],item[10]);
        item[15]=latLongDistance(position.coords.latitude,position.coords.longitude,parseFloat(item[10][1]),parseFloat(item[10][2]));
        return item
    });
    window.gbdata.sort(function(a,b) {
        return a[15]-b[15];
    });
    console.log(window.gbdata[0]);
    if (window.gbdata[0][15] <= 0.050) {
        document.getElementById("answer").innerHTML = "YES";
        document.getElementById("answer").className = "y";
        document.getElementById("moreinfo").innerHTML = window.gbdata[0][8]+" is a green business";
    } else {
        document.getElementById("answer").innerHTML = "NO";
        document.getElementById("answer").className = "n";
        document.getElementById("moreinfo").innerHTML = "The nearest green business, "+window.gbdata[0][8]+", is " + Math.round(window.gbdata[0][15]*0.6214*10)/10 + " miles away.";
    }
}

function error(msg) {
    document.getElementById("answer").innerHTML = "I DON'T KNOW";
    document.getElementById("moreinfo").innerHTML = "There was an error determining your location."
}

function gotFile() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error('not supported');
    }
}

loadScript("https://data.acgov.org/api/views/5qhz-jsrv/rows.json?$jsonp=window.gb=",function() {gotFile()});

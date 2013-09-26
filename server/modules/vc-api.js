
function addScriptTag(id, url, callback) {
	var scriptTag = document.createElement("script");
	var noCacheIE = '&noCacheIE=' + (new Date()).getTime();

   // Add script object attributes
   scriptTag.setAttribute("type", "text/javascript");
   scriptTag.setAttribute("charset", "utf-8");
   scriptTag.setAttribute("src", url + "&callback=" + callback + noCacheIE);
   scriptTag.setAttribute("id", id);

	var head = document.getElementsByTagName("head").item(0);
	head.appendChild(scriptTag);
}

function getTopVideos() {
	addScriptTag(
		"topVideos",
		"http://api.brightcove.com/services/library?command=find_all_videos&sort_by=plays_total&sort_order=DESC&fields=name,playsTotal&token=0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.",
		"response");
}

function response(jsonData) {

	//output the query
	var q = document.getElementById("qDiv");
	var s = document.getElementById("topVideos");
	q.innerHTML = s.src;

	// display the results
	var resp = document.getElementById("resp");
	for (var i=0; i<jsonData["items"].length; i++) {
		var title = jsonData["items"][i];
		var str = "";
		str += title.name;
		str += "; Plays:" + title.playsTotal + '<br/>';
		resp.innerHTML += str;
	}
}


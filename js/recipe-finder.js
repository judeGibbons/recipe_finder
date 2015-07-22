document.addEventListener("DOMContentLoaded", function(event) { 

	var recipeFinder = document.getElementById("recipeFinder");

	function addListenerToRecipeFinder() { //try listener on form, event = 'submit'
		if (document.getElementById("submitButton").addEventListener) {
			(document.getElementById("submitButton")).addEventListener('click', setParameters, false);
		} else {
		if (document.getElementById("submitButton").attachEvent) {
			(document.getElementById("submitButton")).attachEvent('onclick', setParameters);
			};
		};
	};
	addListenerToRecipeFinder();
});

function setParameters() {

	var apiKey = "ytwwwrbzgm48mn794m62tert";
	var queryString = "";
	var includeString = (document.getElementById("include").value).replace(' ', "%20AND%20");//what if someone's typed in 2 spaces?
	//need to take account of double spaces, other chars?

	if (includeString == "") {
		includeString = "recipe";
	} else {
		includeString = "recipe%20AND%20".concat(includeString);
	};

	var excludeString = (document.getElementById("exclude").value).replace(' ', "%20AND%20NOT%20");

	//do I need to use encodeURIComponent AFTER spaces removed? or does api take care of it?
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

	if (excludeString) {
		queryString = includeString + "%20AND%20NOT%20" + excludeString;
	} else {
		queryString = includeString;
	};

	var urlWithParameters = "http://content.guardianapis.com/search?show-fields=all&q=" + queryString + "&api-key=" + apiKey;
	
	submitParameters(event,urlWithParameters);

};

function submitParameters(event,urlWithParameters) {

	(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
	var xmlhttp= window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var searchResults;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	searchResults = xmlhttp.responseText; //NB i get a flash of 'undefined' - need to pause?
        	displayResults(searchResults,urlWithParameters);
    	};
    };
    xmlhttp.open("GET", urlWithParameters, true);
    xmlhttp.send();
};

function displayResults(searchResults,urlWithParameters) {
	var resultsDiv = document.getElementById("results");
	var resultsDisplay = "";
	var jsonParse = JSON.parse(searchResults);

	for (i=0, maxi=jsonParse.response.pageSize; i<maxi; i++) {
		var thumbnail = jsonParse.response.results[i].fields.thumbnail;
		var webUrl = jsonParse.response.results[i].webUrl;
		var headline = jsonParse.response.results[i].fields.headline;
		var trailText = jsonParse.response.results[i].fields.trailText;
		var itemResult = "<li><span class='thumbnail'><img src='" + thumbnail + "' alt=' '></span><a href='" + webUrl + "'>" + headline + "</a><span class='trailText'>" + trailText + "</span></li>"
		resultsDisplay = resultsDisplay + itemResult;
	};

	resultsDiv.innerHTML = "<ul>" + resultsDisplay + "</ul>";
};

//pagination: should display total no of results, 1-10, current page; webtitle <weburl>, date, 

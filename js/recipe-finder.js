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
	var includeArray = ["recipe"]; //needs to work with quotes (phrases), and OR etc
	var excludeArray = [];
	var queryString = "";

	var inputVars =[];

	if (document.getElementById("include").value) {
		inputVars = ((document.getElementById("include").value).split(" "));
	};
	includeArray = includeArray.concat(inputVars);
	var includeString = includeArray.join("%20AND%20");

	if (document.getElementById("exclude").value) {
		var inputVars = ((document.getElementById("exclude").value).split(" "));
		excludeArray = excludeArray.concat(inputVars);
		var excludeString = excludeArray.join("%20AND%20NOT%20");
	};


	//do I need to use encodeURIComponent AFTER spaces removed? or does api take care of it?
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent


	if (excludeString) {
		queryString = includeString + "%20AND%20NOT%20" + excludeString;
	} else {
		queryString = includeString;
	};

	var urlWithParameters = "http://content.guardianapis.com/search?q=" + queryString + "&api-key=" + apiKey;
	
	submitParameters(event,urlWithParameters);

};

function submitParameters(event,urlWithParameters) {

	(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
	var xmlhttp= window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var searchResults;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        	searchResults = xmlhttp.responseText;
        	displayResults(searchResults,urlWithParameters);
    	};
    xmlhttp.open("GET", urlWithParameters, true);
    xmlhttp.send();
}

function displayResults(searchResults,urlWithParameters) {
	var resultsDiv = document.getElementById("results");
	resultsDiv.innerHTML = "<p>url: " + urlWithParameters + "</p><p>" + searchResults + "</p>";
}

//display total no of results, 1-10, current page; webtitle <weburl>, date, 

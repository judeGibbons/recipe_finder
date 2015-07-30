var recipeFinderModule = recipeFinderModule || {}; 

recipeFinderModule.loadRecipes = function () {

	var recipeFinder = document.getElementById("recipeFinder");
	var apiKey = "ytwwwrbzgm48mn794m62tert";
	var currentPageNumber;
	var queryString = "";

	document.addEventListener("DOMContentLoaded", function(event) { 

		if (document.getElementById("submitButton").addEventListener) {
			(document.getElementById("submitButton")).addEventListener('click', setParameters, false);
		} else {
		if (document.getElementById("submitButton").attachEvent) {
			(document.getElementById("submitButton")).attachEvent('onclick', setParameters);
			};
		};
	});

	function setParameters(event) {

		currentPageNumber = 1;

		var regex = / /g;

		var includeString = (document.getElementById("include").value).replace(/ /g, "%20AND%20");

		if (includeString == "") {
			includeString = "recipe";
		} else {
			includeString = "recipe%20AND%20".concat(includeString);
		};

		var excludeString = (document.getElementById("exclude").value).replace(/ /g, "%20AND%20NOT%20");

		if (excludeString) {
			queryString = includeString + "%20AND%20NOT%20" + excludeString;
		} else {
			queryString = includeString;
		};

        (event.preventDefault) ? event.preventDefault() : event.returnValue = false;

		submitParameters(queryString);

	};



	function submitParameters(queryString) {

		var urlWithParameters = "http://content.guardianapis.com/search?section=lifeandstyle" 
		+ "&order-by=newest&show-fields=headline%2Cthumbnail%2CtrailText%2CfirstPublicationDate&page=" 
		+ currentPageNumber + "&page-size=20&q=" + queryString + "&api-key=" + apiKey;

		var xmlhttp = window.XMLHttpRequest ?
	        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	    var searchResults;

	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        	searchResults = xmlhttp.responseText;
	            var jsonParse = JSON.parse(searchResults);
	        	displayResults(jsonParse);
	        	displayPagination(jsonParse);
	    	};
	    };
	    xmlhttp.open("GET", urlWithParameters, true);
	    xmlhttp.send();

	};


	function displayResults(jsonParse) {
		var resultsDiv = document.getElementById("results");
		var resultsDisplay = "";

		var pageSize = jsonParse.response.pageSize;
		var totalResults = jsonParse.response.total;
		var currentPageNumber = jsonParse.response.currentPage;
		var numberOfPages = jsonParse.response.pages;
		var displayedDate;
		var maxi;

		if (currentPageNumber == numberOfPages) {
			maxi = Math.min(pageSize, totalResults%pageSize);			
		} else {
			maxi = pageSize;
		};

		for (i=0; i<maxi; i++) {
			var webUrl = jsonParse.response.results[i].webUrl;
			var thumbnail = jsonParse.response.results[i].fields.thumbnail || "./images/tempthumb.png";
			var firstPublicationDate = jsonParse.response.results[i].fields.firstPublicationDate || "";
			
			if (firstPublicationDate != "") {
				var dateArray = firstPublicationDate.split("T")[0].split("-") || "";
				var monthString = dateArray[1];
				var mapMonthString = {
					"01":" January ", "02":" February ", "03":" March ", "04":" April ", "05":" May ", "06":" June ", "07":" July ", "08":" August ", "09":" September ", "10":" October ", "11":" November ", "12":" December "
				};
				monthString = monthString.replace(/01|02|03|04|05|06|07|08|09|10|11|12/g, function(matched) {
					return mapMonthString[matched];
				});

				if (dateArray[2][0] == 0) {
					dateArray[2] = dateArray[2].substr(1);
				};

				displayedDate = dateArray[2] + monthString + dateArray[0];

			} else {
				displayedDate = "";
			};

			var headline = jsonParse.response.results[i].fields.headline;
			var trailText = jsonParse.response.results[i].fields.trailText;
			var itemResult = "<li><span class='thumbnail'><img src='" + thumbnail + "' alt=' '></span>"
			+ "<h2><a href='" + webUrl + "' target='_blank'>" + headline + "</a></h2>" 
			+ "<p class='trailText'>" + trailText + "</p>"
			+ "<p class='date'>" + displayedDate + "</p></li>"
			resultsDisplay = resultsDisplay + itemResult;
		};

		resultsDiv.innerHTML = "<ul>" + resultsDisplay + "</ul>";

	};

	function displayPagination(jsonParse) {

		var paginationDiv = document.getElementById("pagination");
		var paginationDisplay = "";
		paginationDiv.innerHTML = "<p class='resultsNumber'>Your search found " + jsonParse.response.total + " results</p>"
								+ "<p class='pageCount'><span id='previousArrow'><a href='#test1'><span class='a11y-hide'>previous page</span><<</a></span>Page " + jsonParse.response.currentPage 
								+ " of " + jsonParse.response.pages + "<span id='nextArrow'><a href='#test2'><span class='a11y-hide'>next page</span>>></a></span></p>";

   		var nextLink = document.getElementById('nextArrow').firstElementChild;
    	var previousLink = document.getElementById('previousArrow').firstElementChild;

		function addListenerToPagination() {
			if (paginationDiv.addEventListener) {
				paginationDiv.addEventListener('click', loadNewPage, false);
			} else {
			if (paginationDiv.attachEvent) {
				paginationDiv.attachEvent('onclick', loadNewPage);
				};
			};

			removeClickableLinkOnPagination();
		};

        function removeClickableLinkOnPagination() {

        	if (currentPageNumber == 1) {
        		document.getElementById('previousArrow').className = "disabled";
        		previousLink.firstElementChild.className = "a11y-disabled";
        	}

        	if (currentPageNumber == jsonParse.response.pages) {
        		document.getElementById('nextArrow').className = "disabled";
        		nextLink.firstElementChild.className = "a11y-disabled";
        	}
        };

        addListenerToPagination();

    };

	function loadNewPage(e) {

   		var nextLink = document.getElementById('nextArrow').firstElementChild;
    	var previousLink = document.getElementById('previousArrow').firstElementChild;

	    if (e.target == nextLink) {
            currentPageNumber++;
	    } else if (e.target == previousLink) {
            currentPageNumber--;
	    };
	    
	    e.preventDefault();

	    submitParameters(queryString);

    };
	
};
recipeFinderModule.loadRecipes();
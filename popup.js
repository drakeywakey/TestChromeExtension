/* Once the page has loaded, this will
	1. Get the url of the page (using chrome.tabs)
	2. Do an image search on that url
	3. Display the image in the extension popup
*/
document.addEventListener('DOMContentLoaded', function () {
	var image = document.querySelector('img');
	var status = document.getElementById('status');

	getCurrentTabUrl(function(url) {
		status.textContent = 'Performing image search for ' + url;

		getImageUrl(url, function (imgUrl, width, height) {
			status.textContent = 'Searched for: ' + url + '\n' + 'Google Image Search result: ' + imgUrl;

			image.width = width;
			image.height = height;
			image.src = imgUrl;
			image.hidden = false;

		}, function (error) {
			status.textContent = 'Could not display the image: ' + error;
		});
	});
});

// Gets the url of the current active tab
function getCurrentTabUrl(callback) {
	// lots of queryInfo options -- this is how we restrict what tabs get returned
	// in the query callback. Select only the active tabs that are in the currentWindow.
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	var tab;
	var url;

	// to access tab.url, you'll need either 'tab' or 'activeTab' permission set in your manifest file
	chrome.tabs.query(queryInfo, function (tabs) {
		tab = tabs[0];
		url = tab.url;
		callback(url);
	});
}

// Uses google's image search api
function getImageUrl(url, callback, errorFunc) {
	var apiKey = 'AIzaSyDnwV_UKKkmQMZZv6zPVVqMl-oaB-UbHeQ';
	var cx = '002819554353851248804:lugf3xsvkpy';
	var encodedUrl = encodeURIComponent(url);
	var firstResult;
	var request = new XMLHttpRequest();
	var response;
	var searchUrl = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&searchType=image&q=' + encodedUrl;

	request.open('GET', searchUrl);
	request.responseType = 'json';

	request.onload = function () {
		response = request.response;
		if (!(response && response.items && response.items.length)) {
			errorFunc('The image search returned no results.');
			return;
		}

		firstResult = response.items[0].image;

		imageUrl = firstResult.thumbnailLink;
		width = firstResult.thumbnailWidth;
		height = firstResult.thumbnailHeight;

		//find out what console.assert does -- tutorial uses it here to assert the imageUrl, height and width all make sense.

		callback(imageUrl, width, height);
	};

	request.onerror = function () {
		errorFunc('Something went wrong :/');
	};

	request.send();
}

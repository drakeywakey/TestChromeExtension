document.addEventListener('DOMContentLoaded', function () {
	getCurrentTabUrl(function(url) {

	});
});

function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};
	var tab;
	var url;

	chrome.tabs.query(queryInfo, function (tabs) {
		tab = tabs[0];
		url = tab.url;
		callback(url);
	});
}

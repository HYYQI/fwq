var intervalId;

function Reboot() {
	intervalId = setInterval(function() {
		location.reload();
	}, 3000);
}

function stopRefreshing() {
	clearInterval(intervalId);
}

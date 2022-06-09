function wait() {
	var waitingSection = document.getElementById("waiting-section");
	var pageContentSection = document.getElementById("page-content");
	waitingSection.style.display = "block";
	pageContentSection.style.display = "none";
}

function redirectToRoot() {
	window.location.href = "../";
}
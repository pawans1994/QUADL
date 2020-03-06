$(document).on('click', '#rulesLearned tr', function() {
	event.preventDefault();
	var href = $(this).find("a").attr("href");
	if (href)
		window.open(href, '_blank');
	else
		alert(" No href could be found");
});

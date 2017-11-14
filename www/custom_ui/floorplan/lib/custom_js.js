/**
  Pages start at 0 and go to 9
  Objects named 'show.pageN' where N is a number from 0-9 will show page N when clicked
  Objects named 'show.toggle' will cycle through all pages
  Layers in the SVG should be named page0-page9
  page0 is the default starting page 
*/ 
$( document ).on( "floorplan:loaded", function( event, arg, svg ) {
	var currentPage = 0;
	var pages = [];

	for (var x=0;x<10;x++){
		let page = $(svg).find(`[id="page${x}"]`)
		if (page.length === 1) pages.push(page);
	}

	function showPage(pageToShow=0){
		$.each(pages, function(n, pg){
			if (n === pageToShow){
				$(pg).show();
				currentPage = pageToShow;
			}else{
				$(pg).hide();
			}	
		});
	}

	showPage(currentPage);
	$.each($(svg).find("[id^='show.']"), function(i, e){
                $(e).css('cursor', 'pointer');
		$(e).click(function() {
			var pageName = $(e).attr('id').split('.')[1];
			if (pageName === "toggle"){
				currentPage++;
				if (currentPage >= pages.length) currentPage = 0;
				showPage(currentPage);
			}else{
				let pageNumber = pageName.replace('page','');
				showPage(parseInt(pageNumber));
			}
		});
	});
});


var url = document.URL.split('/');

$('ul li a').each(function(){
  var menu_href = $(this).attr('href').split('/');

  if (menu_href[1] == url[3]) {
  	$(this.parentNode).addClass("active");
  }
});

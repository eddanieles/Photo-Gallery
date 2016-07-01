var userName ='';

renderHome(userName);
// renderAlbum(1);
// renderImage();


function renderHome(userID) {
  var $albumsGrid = $('.albums-grid');
  data.forEach(function(album, i) {
    var liHTML = '<li class="album"><a href="#"><div class="album-meta"><div><i class="fa fa-heart" aria-hidden="true"></i><i class="fa fa-heart-o" aria-hidden="true"></i><p class="likes">0</p></div><h5 class="Album title">Album Title</h5></div><div class="image-container"></div></a></li>';
    var $li = $(liHTML);
    // Set the BG image
    $li.children('a').children('.image-container').css('background-image', 'url(' + album.images[0] + ')');
    // Set the title
    $li.children('a').children('.album-meta').children('h5').text(album.title);
    $li.children('a').children('.album-meta').children('div').children('p').text(album.likes);
    // Set the user
    // $li.children('a').children('.album-footer').children('p').text(album.user);
    // Set the data:
    $li.children('a').children('.image-container').attr('data-index', i);
    // console.log($li.data()); // To call the data.

    $albumsGrid.prepend($li);

    // event Listener
    $li.children('a').children('.image-container').on('click', function(e){
      renderAlbum($(this).data().index);
    });

    $li.children('a').children('.album-meta').children('div').on('click', function(){
      // var $likedDiv = $li.children('a').children('.album-meta').children('div');
      var albumIndex = $(this).closest('.album-meta').siblings('.image-container').data().index;
      if ($(this).hasClass('liked')) {
        $(this).removeClass('liked');
        data[albumIndex].likes--;
      } else {
        $(this).addClass('liked');
        data[albumIndex].likes++;
      }
      $(this).children('p').text(data[albumIndex].likes);
    });
  });
}









function renderAlbum(albumIndex) { // albumIndex is an object with index as a key
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes the page before it.
  $imagePage.css('display', 'none'); // Removes the page after it.
  $albumPage.css('display', 'flex'); // Display this page

  var $sideUl = $('.side-bar').children('ul');

  var $grid = $('.grid').masonry({
    // options
    itemSelector: '.grid-item',
    columnWidth: ($('.grid').width()/4)-10 // I need this to be the same as calc(100%/4)
    // gutter: 10
  });

  // console.log($grid.width());

  var gridItems = $grid.masonry('getItemElements');

  gridItems.forEach(function(item){
    $grid.masonry( 'remove', item );
  });

  // $grid.empty();
  $sideUl.empty();


  data.forEach(function(album, i){
    var sideLiHTML = '<li class="album-link"><a href="#">' + album.title + '</a></li>';
    var $sideLi = $(sideLiHTML);
    $sideLi.attr('data-index', i);

    $sideUl.append($sideLi);

    $sideLi.on('click', function(e){
      renderAlbum($(this).data().index);

    });
  });
  // console.log(albumIndex);
  // console.log(data[0]);
  data[albumIndex].images.forEach(function(image, i){
    var imageHTML = '<div class="grid-item"><img src="' + image + '" alt="" <img/></div>';
    var $image = $(imageHTML);
    $image.attr('data-index', i);
    $image.css('width', ($('.grid').width()/4)-10 + 'px');
    $grid.masonry().append($image).masonry( 'appended', $image ).masonry();

    $image.on('click', function(e){
      renderImage(albumIndex, $(this).data().index);
    });
  });

  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout'); // Layout images after they have been loaded
  });
}


















function renderImage(albumIndex, imageIndex) {
  var $myAlbums = $('.myAlbumsPage');
  var $albumPage = $('.album-page');
  var $imagePage = $('.image-page');
  $myAlbums.css('display', 'none'); // Removes page
  $albumPage.css('display', 'none'); // Remove page
  $imagePage.css('display', 'flex'); // Display page

  var $slider = $('.slider');

  var prevImageIndex = imageIndex-1;
  var nextImageIndex = imageIndex+1;

  if (imageIndex === 0) { // If first image:
    prevImageIndex = data[albumIndex].images.length-1;
  } else if (imageIndex === data[albumIndex].images.length-1) { // If last image
    nextImageIndex = 0;
  }

  var currentIndex = imageIndex;
  // Add previous image
  var prevImageHTML = '<li><img src="' + data[albumIndex].images[prevImageIndex] + '" alt="" /></li>';
  $prevImage = $(prevImageHTML);
  $prevImage.addClass('single_slide');
  $prevImage.addClass('prev');
  $prevImage.attr('data-index', prevImageIndex);
  $slider.append($prevImage);
  // Add current image
  var currImageHTML = '<li><img src="' + data[albumIndex].images[imageIndex] + '" alt="" /></li>';
  $currImage = $(currImageHTML);
  $currImage.addClass('single_slide');
  $currImage.addClass('curr');
  $currImage.attr('data-index', imageIndex);
  $slider.append($currImage);

  // Add all other images
  data[albumIndex].images.forEach(function(image, i){
    if (i !== imageIndex && i !== prevImageIndex) {
      var imageHTML = '<li><img src="' + data[albumIndex].images[i] + '" alt="" /></li>';
      $image = $(imageHTML);
      $image.addClass('single_slide');
      if (i === imageIndex+1) {
        $image.addClass('next');
      }
      $image.attr('data-index', i);
      $slider.append($image);
    }
  });

  $('.next').one('click', nextClickHandler);
  $('.prev').one('click', prevClickHandler);

  function nextClickHandler() {
    var $prev = $('.single_slide[data-index="' + (currentIndex-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (currentIndex+1) + '"]');
    var $newNext = $('.single_slide[data-index="' + (currentIndex+2) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();

    if (currentIndex === -1) {
      console.log('JUST BEFORE CURR === 0');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').removeClass('prev');
    } else if (currentIndex === 0) {
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').removeClass('prev');
    } else {
      $prev.removeClass('prev');
      $curr.removeClass('curr');
      $curr.addClass('prev');
      $curr.one('click', prevClickHandler);
    }

    $next.removeClass('next').addClass('curr');

    if (currentIndex+1 === data[albumIndex].images.length-1) {
      console.log('LAST ONE');
      $newNext = $('.single_slide[data-index="' + '0' + '"]');
      currentIndex = -1;
    } else {
      currentIndex++;
    }

    $newNext.addClass('next').one('click', nextClickHandler);
  }






  function prevClickHandler() {
    var $newPrev = $('.single_slide[data-index="' + (currentIndex-2) + '"]');
    var $prev = $('.single_slide[data-index="' + (currentIndex-1) + '"]');
    var $curr = $('.single_slide[data-index="' + currentIndex + '"]');
    var $next = $('.single_slide[data-index="' + (currentIndex+1) + '"]');

    // Removes all event handlers from other images.
    $slider.children().off();
    $slider.children().removeClass('prev');
    $slider.children().removeClass('next');
    $slider.children().removeClass('curr');

    if (currentIndex === 6) {
      console.log('LAST ONE');
      $('.single_slide[data-index="' + '0' + '"]').removeClass('curr').addClass('next').one('click', nextClickHandler);
      $('.single_slide[data-index="' + '1' + '"]').removeClass('next');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]').addClass('curr').removeClass('prev');
      $('.single_slide[data-index="' + (data[albumIndex].images.length-2) + '"]').addClass('prev').one('click', prevClickHandler);
      $('.single_slide[data-index="' + (data[albumIndex].images.length-3) + '"]').removeClass('prev');
    } else {
      $prev.removeClass('prev').addClass('curr');
      $curr.removeClass('curr').addClass('next').one('click', nextClickHandler);
      $next.removeClass('next');
      $newPrev.addClass('prev').one('click', prevClickHandler);
    }



    if (currentIndex-1 ===  0) { // If the next image is 0
      console.log('BEFORE FIRST ONE');
      $newPrev = $('.single_slide[data-index="' + (data[albumIndex].images.length-1) + '"]');
      currentIndex = data[albumIndex].images.length-1;
      $newPrev.addClass('prev').one('click', prevClickHandler);
    } else {
      currentIndex--;
    }

  }


  // Slider functionality
	// $slider.each(function() {
  //   var autoplay = false;
	// 	var easing = 'linear';
	// 	var duration = 1000;
	// 	var single_slide = $slider.find('.single_slide');
	// 	var offset = ($(window).width()-1260)/2-1260; // HOW TO MAKE THIS RESPONSIVE?
  //
  //   $.each(single_slide, function(index) {
	// 		if (index === 0) $(this).addClass('img' + single_slide.length);
	// 		else $(this).addClass('img' + index);
	// 	});
  //
  //   $slider.css({'width': single_slide.length*1260, 'left': offset});
	// 	single_slide
	// 	.eq(0).addClass('prev').end()
	// 	.eq(1).addClass('active').end()
	// 	.eq(2).addClass('next');
  //
  //   function moveLeft() {
	// 		$('.active').removeClass('active').prev().addClass('active');
  //     // DOESN'T WORK
  //     $('.single_slide.active').children('img').animate({
  //       'right': '50%',
  //       'margin-right': -$('.single_slide.active img').width()/2
  //     }, duration);
  //
	// 		$slider.animate({
	// 			left: $slider.position().left+single_slide.outerWidth(true),
	// 			easing: easing,
	// 			step: 1
	// 		}, duration, function() {
	// 			$('.single_slide:last').detach().prependTo($slider);
	// 			$slider.css('left', offset);
	// 			newNav();
	// 		});
	// 	}
  //
  //   function moveRight() {
	// 		$('.active').removeClass('active').next().addClass('active');
  //     // WORKS FOR A LITTLE WHILE, but breaks after going through all images.
  //     $('.single_slide.active').children('img').animate({
  //       'left': '50%',
  //       'margin-left': -$('.single_slide.active img').width()/2
  //     }, duration);
  //
  //
	// 		$slider.animate({
	// 			left: $slider.position().left-single_slide.outerWidth(true),
	// 			easing: easing,
	// 			step: 1
	// 		}, duration, function() {
	// 			$('.single_slide:first').detach().appendTo($slider);
	// 			$slider.css('left', offset);
	// 			newNav();
	// 		});
	// 	}
  //
  //   function newNav() {
  //
	// 		$('.prev').removeClass('prev');
	// 		$('.next').removeClass('next');
	// 		$('.single_slide')
	// 		.eq(0).addClass('prev').end()
	// 		.eq(2).addClass('next');
	// 	}
  //
  //   $(document).on('click', '.prev', function() {
  //     moveLeft();
  //   });
  //
	// 	$(document).on('click', '.next', function() { moveRight(); });
  //
	// 	if (autoplay === true) {
	// 		setInterval(function() {
	// 			moveRight();
	// 		}, duration*2);
	// 	}
  //
  // });
}









//

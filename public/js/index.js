// When the user scrolls down 20px from the top of the document, show the button
var scrollToTopBtn = document.getElementById("scrollToTopBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
  var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;

  if (currentPosition > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, currentPosition - currentPosition / 8);
  }
}
//timeout for message Error popup
function hidePopupContainer() {
    var popupContainer = document.getElementById('popupContainer');
    
    if (popupContainer) {
        setTimeout(function() {
            popupContainer.style.display = 'none';
        }, 5000);
    }
}
//timeout for message success popup
function hidePopupContainer(popupId) {
  var popupContainer = document.getElementById(popupId);
  
  if (popupContainer) {
      setTimeout(function() {
          popupContainer.style.display = 'none';
      }, 5000);
  }
}

hidePopupContainer('popupContainer');
hidePopupContainer('successPopupContainer');
/*image enlarger*//*
document.querySelector('.room-image').addEventListener('click', function() {
  this.classList.toggle('enlarged');
});
*/




/*validate contact num*/
  
document.addEventListener('DOMContentLoaded', function() {
    const image = document.querySelector('.room-image-details');
    
    image.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalImage = document.createElement('img');
        modalImage.classList.add('modal-image');
        modalImage.src = image.src;

        modal.appendChild(modalImage);

        document.body.appendChild(modal);

        modal.addEventListener('click', function() {
            modal.remove();
        });

        modalImage.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const roomImages = document.querySelectorAll('.room-image');
    
    roomImages.forEach(function(image) {
        image.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.classList.add('modal');

            const modalImage = document.createElement('img');
            modalImage.classList.add('modal-image');
            modalImage.src = image.src;

            modal.appendChild(modalImage);

            document.body.appendChild(modal);

            modal.addEventListener('click', function() {
                modal.remove();
            });

            modalImage.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        });
    });
});

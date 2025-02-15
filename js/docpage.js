document.getElementById("read-more").addEventListener("click", function() {
    const moreText = document.getElementById("more-text");
    const readMoreLink = document.getElementById("read-more");

    if (moreText.style.display === "none" || moreText.style.display === "") {
        moreText.style.display = "inline";
        readMoreLink.textContent = "Read Less";
    } else {
        moreText.style.display = "none";
        readMoreLink.textContent = "Read More";
    }
});



// Select elements
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const datesContainer = document.querySelector('.dates');

// Scroll amount in pixels
const scrollAmount = 150;

// Scroll left
scrollLeftBtn.addEventListener('click', () => {
    datesContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

// Scroll right
scrollRightBtn.addEventListener('click', () => {
    datesContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});
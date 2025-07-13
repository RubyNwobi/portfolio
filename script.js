document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Testimonial slider
    const testimonialSlides = document.querySelector('.testimonial-slides');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;
    
    function updateSlider() {
        testimonialSlides.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });
    
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            updateSlider();
        });
    });
    
    // Auto-rotate testimonials
    let slideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }, 5000);
    
    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonials-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }, 5000);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    // Formspree Submission Handler
    document.getElementById('form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success message
                form.reset();
                alert('Thank you! Your message has been sent.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            alert('Oops! Something went wrong. Please try again later.');
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});


// Work Section Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        // Filter work cards
        workCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Image Modal for Zoom
const workImages = document.querySelectorAll('.work-image');
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <span class="close-modal">&times;</span>
    <div class="modal-content">
        <img class="modal-img" src="" alt="">
    </div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector('.modal-img');
const closeModal = modal.querySelector('.close-modal');

workImages.forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalImg.alt = img.alt;
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});



// Universal Slider Initialization for ALL work sliders
function initAllSliders() {
    document.querySelectorAll('.work-slider').forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const dots = slider.querySelectorAll('.slider-dots .dot');
        
        // Create modal for this slider
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <div class="modal-content">
                <img class="modal-img" src="" alt="">
            </div>
            <button class="modal-nav prev-modal"><i class="fas fa-chevron-left"></i></button>
            <button class="modal-nav next-modal"><i class="fas fa-chevron-right"></i></button>
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector('.modal-img');
        const closeModal = modal.querySelector('.close-modal');
        const prevModal = modal.querySelector('.prev-modal');
        const nextModal = modal.querySelector('.next-modal');
        
        let currentIndex = 0;

        function showImage(index) {
            // Validate index
            index = (index + images.length) % images.length;
            
            // Update slider
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            images[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentIndex = index;
        }

        // Navigation functions
        const nextImage = () => showImage(currentIndex + 1);
        const prevImage = () => showImage(currentIndex - 1);

        // Slider controls
        nextBtn?.addEventListener('click', nextImage);
        prevBtn?.addEventListener('click', prevImage);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showImage(index));
        });

        // Image zoom
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                currentIndex = index;
            });
        });

        // Modal navigation
        nextModal.addEventListener('click', () => {
            nextImage();
            modalImg.src = images[currentIndex].src;
            modalImg.alt = images[currentIndex].alt;
        });

        prevModal.addEventListener('click', () => {
            prevImage();
            modalImg.src = images[currentIndex].src;
            modalImg.alt = images[currentIndex].alt;
        });

        // Close modal
        closeModal.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'Escape') modal.style.display = 'none';
                else if (e.key === 'ArrowRight') nextModal.click();
                else if (e.key === 'ArrowLeft') prevModal.click();
            }
        });

        // Initialize first image
        showImage(0);
    });
}

// Initialize all sliders when DOM loads
document.addEventListener('DOMContentLoaded', initAllSliders);



function initDataCleaningZoom() {
    const beforeAfterImages = document.querySelectorAll('.zoomable-image');
    if (!beforeAfterImages.length) return;
    
    // Create modal for individual images
    const dataModal = document.createElement('div');
    dataModal.className = 'modal data-modal';
    dataModal.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <span class="modal-label"></span>
            <img class="modal-img" src="" alt="">
        </div>
        <button class="modal-nav switch-image">
            <i class="fas fa-exchange-alt"></i> View Comparison
        </button>
    `;
    document.body.appendChild(dataModal);
    
    const modalImg = dataModal.querySelector('.modal-img');
    const modalLabel = dataModal.querySelector('.modal-label');
    const closeModal = dataModal.querySelector('.close-modal');
    const switchBtn = dataModal.querySelector('.switch-image');
    let currentType = '';
    let currentImage = null;

    beforeAfterImages.forEach(img => {
        img.addEventListener('click', function() {
            currentType = this.dataset.type;
            currentImage = this;
            dataModal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalLabel.textContent = this.dataset.type === 'before' ? 'Before' : 'After';
            modalLabel.className = `modal-label ${this.dataset.type}-label`;
        });
    });
    
    // Switch between before/after
    switchBtn.addEventListener('click', () => {
        const newType = currentType === 'before' ? 'after' : 'before';
        const otherImage = document.querySelector(`.zoomable-image[data-type="${newType}"]`);
        
        if (otherImage) {
            currentType = newType;
            currentImage = otherImage;
            modalImg.src = otherImage.src;
            modalImg.alt = otherImage.alt;
            modalLabel.textContent = newType === 'before' ? 'Before' : 'After';
            modalLabel.className = `modal-label ${newType}-label`;
        }
    });
    
    closeModal.addEventListener('click', () => {
        dataModal.style.display = 'none';
    });
    
    dataModal.addEventListener('click', (e) => {
        if (e.target === dataModal) {
            dataModal.style.display = 'none';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (dataModal.style.display === 'block') {
            if (e.key === 'Escape') {
                dataModal.style.display = 'none';
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                switchBtn.click();
            }
        }
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', initDataCleaningZoom);
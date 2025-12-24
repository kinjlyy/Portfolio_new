// Chatbot Logic
function toggleChatbot() {
    let chatbot = document.getElementById("chatbot-container");
    // Toggle logic: if none or empty -> block, else -> none
    if (chatbot.style.display === "none" || chatbot.style.display === "") {
        chatbot.style.display = "block";
    } else {
        chatbot.style.display = "none";
    }
}

function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}
document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetShape = document.querySelector(targetId);
            if (targetShape) {
                targetShape.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close sidebar if open (mobile)
                const sidebar = document.getElementById('sidebar');
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    // Sidebar Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Enhanced Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Also trigger children if they have stagger classes
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100); // 100ms delay per item
                });
            }
        });
    }, observerOptions);

    // Observe Sections for general fade-in
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Observe Timeline Items individually for slide-in
    document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(item => {
        item.classList.add('slide-up-item');
        observer.observe(item);
    });
    // Modal Logic
    const modal = document.getElementById('certModal');
    const modalCaption = document.getElementById('modalCaption');
    const modalImgContainer = document.getElementById('modalImgContainer');
    const closeModal = document.querySelector('.close-modal');

    window.openModal = function (element) {
        if (!modal || !modalCaption) return;

        const titleElement = element.querySelector('.cert-title');
        const imgElement = element.querySelector('.cert-img');

        // Set Title
        if (titleElement) {
            modalCaption.innerText = titleElement.innerText;
        }

        // Set Image
        modalImgContainer.innerHTML = ''; // Clear previous
        if (imgElement) {
            const imgClone = imgElement.cloneNode();
            imgClone.style.maxWidth = "90%";
            imgClone.style.maxHeight = "80vh";
            imgClone.style.objectFit = "contain";
            imgClone.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
            modalImgContainer.appendChild(imgClone);
        } else {
            // Handle placeholder case
            const placeholder = document.createElement('div');
            placeholder.innerText = "No Preview Available";
            placeholder.style.color = "#fff";
            placeholder.style.fontSize = "1.5rem";
            modalImgContainer.appendChild(placeholder);
        }

        modal.style.display = "flex";
    }

    if (closeModal) {
        closeModal.onclick = function () {
            modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Dynamic Style Injection
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .slide-up-item {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .slide-up-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Contact Form AJAX Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Loading State
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            formStatus.innerHTML = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent Successfully!';
                    formStatus.classList.add('success');
                    contactForm.reset(); // Clear form fields
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                        formStatus.classList.remove('success');
                    }, 5000);
                } else {
                    // Error
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerHTML = "Oops! There was a problem submitting your form";
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.innerHTML = "Oops! There was a problem submitting your form";
                formStatus.classList.add('error');
            } finally {
                // Reset Button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

}); // End DOMContentLoaded

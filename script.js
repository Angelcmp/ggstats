document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js cargado correctamente.');

    const cards = document.querySelectorAll('.news-item, .stat-card');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Intersection Observer para animaciones de tarjetas
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% de la tarjeta visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Deja de observar una vez que la animación se ha aplicado
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    // Lógica de modo claro/oscuro
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'light-mode') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else {
        // Por defecto, si no hay preferencia, usa el modo oscuro y guarda la preferencia
        body.classList.add('dark-mode'); // Asegurarse de que el modo oscuro sea el predeterminado si no hay preferencia
        localStorage.setItem('theme', 'dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
});
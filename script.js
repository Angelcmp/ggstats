document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    function updateThemeButton() {
        // Fade out
        themeToggleBtn.classList.remove('fade-in');
        themeToggleBtn.classList.add('fade-out');
        setTimeout(() => {
            if (body.classList.contains('light-mode')) {
                themeToggleBtn.innerHTML = '<span style="font-size:1.3em;color:#FFD600;">🌞</span>';
            } else {
                themeToggleBtn.innerHTML = '<span style="font-size:1.3em;color:#222;">🌚</span>';
            }
            // Fade in
            themeToggleBtn.classList.remove('fade-out');
            themeToggleBtn.classList.add('fade-in');
            setTimeout(() => {
                themeToggleBtn.classList.remove('fade-in');
            }, 350);
        }, 150);
    }

    if (currentTheme) {
        body.classList.add(currentTheme);
        updateThemeButton();
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateThemeButton();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
        updateThemeButton();
    });
});

// =====================================================
// script.js — shared by every page of the site.
// Each part only runs if that page has the matching element.
// =====================================================

// 1. Split titles with class="split" into letters that drop in one by one
document.querySelectorAll('.split').forEach(title => {
    const text = title.textContent;
    title.setAttribute('aria-label', text);   // screen readers still read the whole word
    title.textContent = '';
    [...text].forEach((letter, i) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.setAttribute('aria-hidden', 'true');
        span.style.animationDelay = (i * 0.08) + 's';
        title.appendChild(span);
    });
});

// 2. Typing effect (only on pages that have a .typed element)
const typed = document.querySelector('.typed');
if (typed) {
    const phrases = typed.dataset.phrases.split('|');   // phrases come from the HTML
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const phrase = phrases[phraseIndex];
        typed.textContent = phrase.slice(0, charIndex);

        if (!deleting && charIndex < phrase.length) {
            charIndex++;
            setTimeout(type, 90);
        } else if (!deleting) {
            deleting = true;
            setTimeout(type, 1500);
        } else if (charIndex > 0) {
            charIndex--;
            setTimeout(type, 40);
        } else {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 300);
        }
    }
    setTimeout(type, 1200);
}

// 3. Nav bar gets a background once you scroll down
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// 4. Reveal elements when they scroll into view
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 5. Numbers count up when they appear
function countUp(el) {
    const target = Number(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.number').forEach(el => countObserver.observe(el));

// 6. Glow on cards follows the mouse
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
});

// 7. Fade out before going to another page of the site
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', e => {
        // Let Ctrl/Cmd-click etc. open a new tab as normal
        if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === '_blank') return;
        e.preventDefault();
        document.body.classList.add('leaving');
        setTimeout(() => { window.location.href = link.href; }, 300);
    });
});

// If you come back with the browser's Back button, show the page again
window.addEventListener('pageshow', () => {
    document.body.classList.remove('leaving');
});

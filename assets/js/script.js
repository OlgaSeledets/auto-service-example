'use strict';

const services = {
  diagnostics: {
    title: 'Диагностика',
    description: 'Проводим комплексную проверку электронных систем автомобиля. Помогаем определить источник неисправности до начала ремонта.',
    image: 'assets/images/diagnostics.webp',
    imageAlt: 'Диагностический планшет',
    features: ['Считывание и анализ ошибок', 'Проверка датчиков и исполнительных механизмов', 'Поиск неисправностей электронных систем']
  },
  keys: {
    title: 'Иммобилайзер и ключи',
    description: 'Восстанавливаем работу штатной системы доступа и выполняем необходимые операции с ключами автомобиля.',
    image: 'assets/images/keys.webp',
    imageAlt: 'Автомобильный ключ',
    features: ['Привязка и регистрация ключей', 'Работа с иммобилайзером', 'Восстановление доступа к автомобилю']
  },
  programming: {
    title: 'Программирование ЭБУ',
    description: 'Работаем с программным обеспечением электронных блоков управления, выполняем предусмотренные автомобилем адаптации и настройки.',
    image: 'assets/images/programming.webp',
    imageAlt: 'Ноутбук с программой диагностики',
    features: ['Чтение и запись программного обеспечения', 'Адаптация и кодирование модулей', 'Проверка после программных работ']
  },
  'ecu-repair': {
    title: 'Ремонт электронных блоков',
    description: 'Диагностируем электронные модули и при технической возможности восстанавливаем их работоспособность.',
    image: 'assets/images/ecu-repair.webp',
    imageAlt: 'Электронный блок управления',
    features: ['Диагностика неисправного блока', 'Восстановление электронных компонентов', 'Проверка работы после ремонта']
  },
  wiring: {
    title: 'Ремонт электропроводки',
    description: 'Находим повреждения электрических цепей, восстанавливаем контакты и соединения.',
    image: 'assets/images/wiring.webp',
    imageAlt: 'Работа с проводкой автомобиля',
    features: ['Поиск обрывов и коротких замыканий', 'Проверка разъёмов и соединений', 'Восстановление повреждённых участков']
  },
  installation: {
    title: 'Установка электрооборудования',
    description: 'Аккуратно устанавливаем и подключаем дополнительное оборудование с учётом конструкции автомобиля.',
    image: 'assets/images/installation.webp',
    imageAlt: 'Автомобильный видеорегистратор',
    features: ['Подключение сигнализаций и камер', 'Установка видеорегистраторов', 'Монтаж парктроников и аксессуаров']
  }
};

const header = document.querySelector('.site-header');
const backTop = document.querySelector('.back-top');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const modal = document.getElementById('service-dialog');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI() {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle('scrolled', isScrolled);
  backTop.classList.toggle('visible', window.scrollY > 640);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

function setMenuOpen(open) {
  menuToggle.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.inert = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) mobileMenu.querySelector('a')?.focus();
  else menuToggle.focus({ preventScroll: true });
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) setMenuOpen(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 780 && mobileMenu.classList.contains('is-open')) setMenuOpen(false);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

// Карточки услуг открывают полноценное доступное диалоговое окно.
let previousFocus = null;
function openService(key) {
  const service = services[key];
  if (!service) return;
  previousFocus = document.activeElement;
  document.getElementById('dialog-title').textContent = service.title;
  document.getElementById('dialog-description').textContent = service.description;
  const image = document.getElementById('dialog-image');
  image.src = service.image;
  image.alt = service.imageAlt;
  document.getElementById('dialog-list').replaceChildren(...service.features.map(item => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
  modal.showModal();
  document.body.classList.add('dialog-open');
  modal.querySelector('.dialog-close').focus();
}
function closeService() { if (modal.open) modal.close(); }
document.querySelectorAll('[data-service]').forEach(card => {
  card.addEventListener('click', () => openService(card.dataset.service));
});
modal.querySelector('.dialog-close').addEventListener('click', closeService);
modal.addEventListener('click', event => {
  if (event.target === modal) closeService();
});
modal.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  previousFocus?.focus({ preventScroll: true });
});
document.getElementById('dialog-contact').addEventListener('click', closeService);

// Без JS-критических зависимостей: блоки видны, если анимации недоступны.
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  document.documentElement.classList.add('supports-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shown');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px 45px 0px' });
  document.querySelectorAll('.reveal').forEach((element, index) => {
    if (element.classList.contains('service-card')) {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
    }
    revealObserver.observe(element);
  });
}

if ('IntersectionObserver' in window) {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -54% 0px' });
  document.querySelectorAll('#home, #services, #equipment, #contacts').forEach(section => sectionObserver.observe(section));
}

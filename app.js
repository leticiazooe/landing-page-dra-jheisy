const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const copyButton = document.querySelector("[data-copy-message]");
const copyFeedback = document.querySelector("[data-copy-feedback]");
const contactMessage = document.querySelector("#contactMessage");
const year = document.querySelector("[data-year]");

if (year) year.textContent = new Date().getFullYear();

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

const revealItems = [...document.querySelectorAll("[data-reveal]")];

revealItems.forEach((item) => {
  const delay = item.getAttribute("data-reveal-delay");
  if (delay) item.style.setProperty("--reveal-delay", `${delay}ms`);
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (copyButton && copyFeedback && contactMessage) {
  copyButton.addEventListener("click", async () => {
    const text = contactMessage.value;
    try {
      await navigator.clipboard.writeText(text);
      copyFeedback.textContent = "Mensagem copiada.";
      copyButton.querySelector(".button__arrow").textContent = "✓";
    } catch {
      contactMessage.focus();
      contactMessage.select();
      document.execCommand("copy");
      copyFeedback.textContent = "Mensagem selecionada para copiar.";
    }

    window.setTimeout(() => {
      copyFeedback.textContent = "";
      const arrow = copyButton.querySelector(".button__arrow");
      if (arrow) arrow.textContent = "↗";
    }, 2600);
  });
}
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const copyButton = document.querySelector("[data-copy-message]");
const copyFeedback = document.querySelector("[data-copy-feedback]");
const contactMessage = document.querySelector("#contactMessage");
const year = document.querySelector("[data-year]");
const hero = document.querySelector("[data-hero]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) year.textContent = new Date().getFullYear();

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
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

/* Entrada premium do hero sem alterar escala ou enquadramento da foto */
if (hero) {
  if (reduceMotion.matches) {
    hero.classList.add("is-ready");
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("is-ready"));
    });
  }
}

/* Reveals editoriais */
const revealItems = [...document.querySelectorAll("[data-reveal]")];

revealItems.forEach((item, index) => {
  const delay = item.getAttribute("data-reveal-delay");
  if (delay) item.style.setProperty("--reveal-delay", `${delay}ms`);

  if (!item.hasAttribute("data-motion")) {
    const variants = ["up", "left", "up", "right", "scale"];
    item.dataset.motion = variants[index % variants.length];
  }
});

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Accordion fluido */
document.querySelectorAll(".accordion details").forEach((details) => {
  const summary = details.querySelector("summary");
  const content = details.querySelector(".accordion__content");

  if (!summary || !content) return;

  summary.addEventListener("click", (event) => {
    if (reduceMotion.matches || typeof content.animate !== "function") return;

    event.preventDefault();

    if (details.open) {
      const animation = content.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-8px)" }
        ],
        { duration: 260, easing: "cubic-bezier(.22,.61,.36,1)" }
      );

      animation.addEventListener("finish", () => {
        details.open = false;
      }, { once: true });
    } else {
      details.open = true;
      content.animate(
        [
          { opacity: 0, transform: "translateY(-10px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" }
      );
    }
  });
});

/* Microinterações discretas em desktop */
if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".about-card, .contact-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-y * 1.2).toFixed(2)}deg) rotateY(${(x * 1.2).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

if (copyButton && copyFeedback && contactMessage) {
  copyButton.addEventListener("click", async () => {
    const text = contactMessage.value;

    try {
      await navigator.clipboard.writeText(text);
      copyFeedback.textContent = "Mensagem copiada.";
    } catch {
      contactMessage.focus();
      contactMessage.select();
      document.execCommand("copy");
      copyFeedback.textContent = "Mensagem selecionada para copiar.";
    }

    window.setTimeout(() => {
      copyFeedback.textContent = "";
    }, 2600);
  });
}

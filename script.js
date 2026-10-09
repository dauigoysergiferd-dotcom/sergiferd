// SJY Programmer Profile interactions
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const year = document.getElementById("year");
  const copyButton = document.getElementById("copyUsername");
  const copyHint = document.getElementById("copyHint");
  const toast = document.getElementById("toast");

  if (year) year.textContent = new Date().getFullYear();

  // Toggle the compact navigation on phones and small tablets.
  toggle?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Close navigation menu" : "Open navigation menu");
  });
  links.forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }));

  // Highlight the tab corresponding to the section in view.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach(item => item.classList.add("visible"));
  }

  // Copy the profile username and show a small confirmation toast.
  copyButton?.addEventListener("click", async () => {
    const username = copyButton.dataset.copy || "Sergi";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(username);
      } else {
        const field = document.createElement("textarea");
        field.value = username;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("Copy failed");
      }
      if (copyHint) copyHint.innerHTML = `Username copied: <code>${username}</code>`;
      if (toast) {
        toast.textContent = `Username "${username}" copied`;
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 2200);
      }
    } catch {
      if (copyHint) copyHint.textContent = `Your username is: ${username}`;
    }
  });
});

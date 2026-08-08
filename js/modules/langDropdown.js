// Scope: langDropdown — generic open/close behavior for any
// .lang-dropdown on the page. Adding a third language later only
// means one more <li><a> in the markup; this code doesn't change.

export function initLangDropdowns() {
  const dropdowns = document.querySelectorAll(".lang-dropdown");
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".lang-dropdown-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      dropdowns.forEach((d) => d.classList.remove("open"));
      dropdown.classList.toggle("open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((d) => {
      d.classList.remove("open");
      const t = d.querySelector(".lang-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dropdowns.forEach((d) => d.classList.remove("open"));
  });
}

export function setLangDropdownLabel(dropdown, label) {
  const current = dropdown.querySelector(".lang-current");
  if (current) current.textContent = label;
}

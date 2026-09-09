function getLuminance(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const adjust = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  r = adjust(r);
  g = adjust(g);
  b = adjust(b);

  return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

function checkContrast() {
  const fgColor = document.getElementById('foreground').value;
  const bgColor = document.getElementById('background').value;

  const fgLuminance = getLuminance(fgColor);
  const bgLuminance = getLuminance(bgColor);

  const L1 = Math.max(fgLuminance, bgLuminance);
  const L2 = Math.min(fgLuminance, bgLuminance);
  const contrastRatio = (L1 + 0.05) / (L2 + 0.05);

  document.getElementById('contrast-ratio').textContent = `${contrastRatio.toFixed(2)} : 1`;
  const resultList = document.getElementById('result');
  resultList.classList.remove('hidden');

  const checks = [
      { threshold: 3, element: "check1" },
      { threshold: 4.5, element: "check2" },
      { threshold: 4.5, element: "check3" },
      { threshold: 7, element: "check4" },
      { threshold: 3, element: "check5" },
      { threshold: 3, element: "check6" }
  ];

  let passedCount = 0;

  checks.forEach(check => {
      const indicator = document.getElementById(check.element);
      indicator.className = "status-indicator";
      if (contrastRatio >= check.threshold) {
          indicator.classList.add('passed');
          passedCount++;
      } else {
          indicator.classList.add('failed');
      }
  });

  document.getElementById('preview').style.color = fgColor;
  document.getElementById('preview').style.backgroundColor = bgColor;

  // Fortschrittsleiste aktualisieren
  document.getElementById('progress').style.width = `${passedCount * 16.66666}%`;

  // Bewertungstext aktualisieren
  let progressText = document.getElementById('progress-text');
  if (passedCount === 6) {
      progressText.innerHTML = 'Alle hier geprüften Kontrastanforderungen sind erfüllt.<span class="result-item--meta">Kontrast allein bestätigt keine vollständige Barrierefreiheit.</span>';
  } else if (passedCount >= 4) {
      progressText.innerHTML = 'Einige Kontrastanforderungen sind erfüllt.<span class="result-item--meta">Prüfe die Auswertung für Textgrößen und Bedienelemente einzeln.</span>';
  } else {
      progressText.innerHTML = 'Erhöhe den Kontrast zwischen Vorder- und Hintergrund.<span class="result-item--meta">Die benötigte Schwelle hängt von Inhalt und Textgröße ab.</span>';
  }
}

document.getElementById('foreground').addEventListener('input', checkContrast);
document.getElementById('background').addEventListener('input', checkContrast);

checkContrast(); // Initiale Berechnung


// DROPDOWN
const button = document.getElementById("dropdownButton");
const menu = document.getElementById("dropdownMenu");
const options = menu.querySelectorAll(".dropdown-item");
const resultItems = document.querySelectorAll(".result-item");

let selectedIndex = 0;

function updateResultVisibility(selectedOption) {
resultItems.forEach(item => {
if (selectedOption === "WCAG Level AA") {
  item.style.display = item.classList.contains("result-item-aa") ? "inline-flex" : "none";
} else if (selectedOption === "WCAG Level AAA") {
  item.style.display = item.classList.contains("result-item-aaa") ? "inline-flex" : "none";
}
});
}

button.addEventListener("click", () => {
const expanded = button.getAttribute("aria-expanded") === "true";
button.setAttribute("aria-expanded", !expanded);
menu.setAttribute("aria-hidden", expanded);
});

options.forEach((option, index) => {
option.addEventListener("click", () => {
const selectedOption = option.textContent.trim();
button.textContent = selectedOption;
button.setAttribute("aria-expanded", "false");
menu.setAttribute("aria-hidden", "true");
selectedIndex = index;
updateResultVisibility(selectedOption);
});
});

document.addEventListener("keydown", (e) => {
if (menu.getAttribute("aria-hidden") === "false") {
if (e.key === "ArrowDown") {
  selectedIndex = (selectedIndex + 1) % options.length;
  options[selectedIndex].focus();
} else if (e.key === "ArrowUp") {
  selectedIndex = (selectedIndex - 1 + options.length) % options.length;
  options[selectedIndex].focus();
} else if (e.key === "Enter") {
  options[selectedIndex].click();
} else if (e.key === "Escape") {
  button.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  button.focus();
}
}
});

updateResultVisibility("WCAG Level AA");





const openModalBtn = document.getElementById("openModal");
        const modal = document.getElementById("modal");
        const overlay = document.getElementById("modalOverlay");
        const saveBtn = document.getElementById("saveSettings");
        const darkModeCheckbox = document.getElementById("darkMode");
        const easyLanguageCheckbox = document.getElementById("easyLanguage");
        const largeTextCheckbox = document.getElementById("largeText");

        function toggleModal(show) {
            if (show) {
                modal.classList.remove("hidden");
                overlay.classList.remove("hidden");
                document.body.classList.add("modal-open");
            } else {
                modal.classList.add("hidden");
                overlay.classList.add("hidden");
                document.body.classList.remove("modal-open");
            }
        }

        function updateBodyClass(checkbox, className) {
            if (checkbox.checked) {
                document.body.classList.add(className);
            } else {
                document.body.classList.remove(className);
            }
        }

        openModalBtn.addEventListener("click", () => toggleModal(true));
        overlay.addEventListener("click", () => toggleModal(false));

        darkModeCheckbox.addEventListener("change", () => updateBodyClass(darkModeCheckbox, "dark-mode"));
        easyLanguageCheckbox.addEventListener("change", () => updateBodyClass(easyLanguageCheckbox, "easy-language"));
        largeTextCheckbox.addEventListener("change", () => updateBodyClass(largeTextCheckbox, "large-text"));

        saveBtn.addEventListener("click", () => toggleModal(false));

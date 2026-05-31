const components = [
        "navbar",
        "hero",
        "marquee",
        "why",
        "serve",
        "process",
        "footer",
      ];

      async function loadComponents() {
        await Promise.all(
          components.map(async (name) => {
            const host = document.querySelector(`[data-component="${name}"]`);
            if (!host) return;

            const response = await fetch(`components/${name}.html`);
            if (!response.ok) {
              throw new Error(`Unable to load ${name}.html`);
            }

            host.innerHTML = await response.text();
          }),
        );
      }

      function initTypewriter() {
        const out = document.getElementById("typed-out");
        const cursor = document.querySelector(".cursor");
        if (!out || !cursor) return;

        const parts = [
          { text: "Your Business\nDeserves to Be ", hi: false },
          { text: "Found Online.", hi: true },
        ];
        const chars = [];
        parts.forEach((p) =>
          p.text.split("").forEach((c) => chars.push({ c, hi: p.hi })),
        );

        let i = 0;

        function render() {
          let html = "";
          let inHi = false;
          for (let k = 0; k < i; k++) {
            const { c, hi } = chars[k];
            if (c === "\n") {
              if (inHi) {
                html += "</span>";
                inHi = false;
              }
              html += "<br>";
              continue;
            }
            if (hi && !inHi) {
              html += '<span class="accent">';
              inHi = true;
            }
            if (!hi && inHi) {
              html += "</span>";
              inHi = false;
            }
            html += c === "&" ? "&amp;" : c === "<" ? "&lt;" : c;
          }
          if (inHi) html += "</span>";
          out.innerHTML = html;
        }

        function type() {
          if (i < chars.length) {
            i++;
            render();
            setTimeout(type, 42);
          } else {
            setTimeout(() => {
              cursor.style.transition = "opacity 0.4s";
              cursor.style.opacity = "0";
            }, 2000);
          }
        }

        setTimeout(type, 650);
      }

      function initMarquee() {
        const track = document.getElementById("mq-track");
        if (!track) return;

        const areas = [
          "Valencia",
          "Newhall",
          "Saugus",
          "Canyon Country",
          "Stevenson Ranch",
          "Castaic",
          "Acton",
          "Agua Dulce",
          "Sand Canyon",
          "Westridge",
          "Fair Oaks Ranch",
          "Hasley Canyon",
          "Old Town Newhall",
          "Placerita Canyon",
          "Sulphur Springs",
        ];

        function makeItem(label) {
          const li = document.createElement("span");
          li.className = "marquee-item";
          const sep = document.createElement("span");
          sep.className = "marquee-sep";
          li.appendChild(sep);
          li.appendChild(document.createTextNode(label));
          return li;
        }

        [...areas, ...areas].forEach((area) => track.appendChild(makeItem(area)));

        function setDuration() {
          const width = track.scrollWidth / 2;
          const speed = 55;
          track.style.animationDuration = width / speed + "s";
        }

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(setDuration);
        } else {
          setTimeout(setDuration, 100);
        }
        window.addEventListener("resize", setDuration);
      }

      function initFadeIns() {
        const els = document.querySelectorAll(".fade-in");
        if (!els.length) return;

        if (!("IntersectionObserver" in window)) {
          els.forEach((el) => el.classList.add("is-visible"));
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.18 },
        );

        els.forEach((el) => observer.observe(el));
      }

      document.addEventListener("DOMContentLoaded", async () => {
        try {
          await loadComponents();
          initTypewriter();
          initMarquee();
          initFadeIns();
        } catch (error) {
          console.error(error);
        }
      });

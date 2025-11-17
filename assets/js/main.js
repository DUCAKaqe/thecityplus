const qs = (sel, scope = document) => scope.querySelector(sel);
const qsa = (sel, scope = document) => [...scope.querySelectorAll(sel)];

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatDate = (date) =>
  date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" });

const setClock = () => {
  const now = new Date();
  const timeEl = qs("#currentTime");
  const dateEl = qs("#currentDate");
  if (timeEl) timeEl.textContent = formatTime(now);
  if (dateEl) dateEl.textContent = formatDate(now);
};

const initShell = () => {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = qs(".mobile-toggle");
  const nav = qs(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }
};

const renderHome = () => {
  const data = window.CityPulseData;
  if (!data) return;
  renderCityMeta(data.city);
  renderClimate(data.weather);
  renderTraffic(data.traffic);
  renderKpi(data.kpis);
  renderAlertsTicker(data.alertsTicker);
  renderTransportStatus(data.transportStatus);
  renderEnergySummary(data.energy);
  renderMiniMapWidget(data.miniMapZones);
  renderTrendChart(data.trendAqi);
  renderNewsList(data.news);
  initFactWidget(data.dailyFacts);
  renderQuickActions(data.emergencyContacts);
};

const renderCityMeta = (city) => {
  if (!city) return;
  const name = qs("#cityName");
  const coords = qs("#cityCoordinates");
  if (name) name.textContent = `${city.name} · ${city.country}`;
  if (coords) coords.textContent = city.coordinates;
};

const getAqiState = (value) => {
  if (value <= 50) return { label: "Good", tone: "good" };
  if (value <= 100) return { label: "Satisfactory", tone: "fair" };
  if (value <= 200) return { label: "Moderate", tone: "moderate" };
  if (value <= 300) return { label: "Poor", tone: "poor" };
  return { label: "Severe", tone: "severe" };
};

const renderClimate = (weather) => {
  const wrap = qs("#climatePanel");
  if (!wrap) return;
  const city = window.CityPulseData?.city;
  const maxVal = Math.max(...weather.hourly);
  const aqiState = getAqiState(weather.aqi);
  wrap.innerHTML = `
    <div class="climate-panel">
      <div class="climate-main">
        <div>
          <p class="eyebrow">${city ? `${city.name} · ${city.country}` : "City"}</p>
          <div class="temp-reading">
            <span class="temp">${weather.temperature}°C</span>
            <div>
              <p class="muted">${weather.condition}</p>
              <p class="muted">Feels like ${weather.realFeel}°C</p>
            </div>
          </div>
        </div>
        <div class="aqi-chip aqi-${aqiState.tone}">
          <p>AQI ${weather.aqi}</p>
          <small>${aqiState.label}</small>
        </div>
      </div>

      <div class="climate-meta-grid">
        <div><span>Humidity</span><strong>${weather.humidity}%</strong></div>
        <div><span>Wind</span><strong>${weather.wind} km/h</strong></div>
        <div><span>UV Index</span><strong>${weather.uvIndex}</strong></div>
        <div><span>Visibility</span><strong>${weather.visibility} km</strong></div>
        <div><span>Sunrise</span><strong>${weather.sunrise}</strong></div>
        <div><span>Sunset</span><strong>${weather.sunset}</strong></div>
      </div>

      <div class="climate-chart">
        <header>
          <p class="eyebrow">Next 6 hours</p>
          <p class="muted">Hourly temperature trend</p>
        </header>
        <div class="chart-line-wrap temp-chart">
          <svg viewBox="0 0 300 160" preserveAspectRatio="none">
            <path d="${weather.hourly
              .map((val, index) => {
                const x = (index / (weather.hourly.length - 1 || 1)) * 300;
                const y = 160 - (val / maxVal) * 150 - 5;
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}" />
          </svg>
          <div class="chart-points">
            ${weather.hourly
              .map((val, index) => {
                const x = (index / (weather.hourly.length - 1 || 1)) * 100;
                const y = 100 - (val / maxVal) * 100;
                return `<span style="left:${x}%; top:${y}%;" title="${index + 6}h · ${val}°C"></span>`;
              })
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderTraffic = (traffic) => {
  const wrap = qs("#trafficPanel");
  if (!wrap) return;
  wrap.innerHTML = traffic
    .map((item) => {
      const percent = Math.round(item.density * 100);
      return `
        <div class="stat-line">
          <div>
            <p class="title">${item.corridor}</p>
            <p class="muted">${percent}% flow</p>
          </div>
          <div class="progress">
            <span style="width:${percent}%"></span>
          </div>
          <span class="trend trend--${item.trend}">${item.trend}</span>
        </div>
      `;
    })
    .join("");
};

const renderKpi = (kpis) => {
  const wrap = qs("#kpiPanel");
  if (!wrap) return;
  wrap.innerHTML = kpis
    .map((kpi) => {
      const percent = Math.round((kpi.value / kpi.target) * 100);
      return `
        <div class="kpi-item">
          <div>
            <p class="title">${kpi.label}</p>
            <p class="muted">${kpi.value}% of ${kpi.target}% target</p>
          </div>
          <div class="ring" role="img" aria-label="${percent}% complete">
            <svg viewBox="0 0 36 36">
              <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="ring-fg" stroke-dasharray="${percent}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span>${percent}%</span>
          </div>
        </div>
      `;
    })
    .join("");
};

const renderTimeline = (timeline) => {
  const wrap = qs("#timeline");
  if (!wrap) return;
  wrap.innerHTML = timeline
    .map(
      (day) => `
        <div>
          <p class="eyebrow">${day.day}</p>
          <ul>
            ${day.events
              .map(
                (event) => `
                  <li class="timeline-${event.type}">
                    <p>${event.label}</p>
                    <small>${event.time}</small>
                  </li>
                `
              )
              .join("") || '<li class="muted">No events</li>'}
          </ul>
        </div>
      `
    )
    .join("");
};

const renderChecklist = (items) => {
  const wrap = qs("#checklist");
  if (!wrap) return;
  wrap.innerHTML = items
    .map(
      (item) => `
        <label class="check-item">
          <input type="checkbox" ${item.done ? "checked" : ""} disabled />
          <div>
            <p class="title">${item.label}</p>
            <p class="muted">${item.detail}</p>
          </div>
        </label>
      `
    )
    .join("");
};

const renderDevices = (devices) => {
  const wrap = qs("#devices");
  if (!wrap) return;
  wrap.innerHTML = devices
    .map(
      (device) => `
        <div class="device">
          <div>
            <p class="title">${device.name}</p>
            <p class="muted">${device.meta}</p>
          </div>
          <span class="status status--${device.status}">${device.status}</span>
        </div>
      `
    )
    .join("");
};

const renderAlertsTicker = (items) => {
  const wrap = qs("#alertsTicker");
  if (!wrap || !items?.length) return;
  let index = 0;
  const render = () => {
    const current = items[index];
    wrap.innerHTML = `<span class="ticker-type">${current.type}</span><p>${current.message}</p>`;
  };
  render();
  if (window.CityPulseTickerInterval) clearInterval(window.CityPulseTickerInterval);
  window.CityPulseTickerInterval = setInterval(() => {
    index = (index + 1) % items.length;
    render();
  }, 5000);
};

const renderTransportStatus = (status) => {
  const wrap = qs("#transportStatus");
  if (!wrap) return;
  wrap.innerHTML = `
    <div><span>Bus network</span><strong>${status.bus}</strong></div>
    <div><span>Metro</span><strong>${status.metro}</strong></div>
    <div><span>E-bikes available</span><strong>${status.bikes}</strong></div>
    <div><span>Smart parking slots</span><strong>${status.parking}</strong></div>
  `;
};

const renderEnergySummary = (energy) => {
  const wrap = qs("#energySummary");
  if (!wrap) return;
  wrap.innerHTML = `
    <div>
      <span>Demand level</span>
      <strong>${energy.demand}</strong>
    </div>
    <div>
      <span>Renewable mix</span>
      <strong>${energy.renewable}%</strong>
    </div>
    <div>
      <span>Outage risk</span>
      <strong>${energy.outageRisk}</strong>
    </div>
    <div>
      <span>Water reserves</span>
      <strong>${energy.waterReserve}%</strong>
    </div>
  `;
};

const renderMiniMapWidget = (zones) => {
  const wrap = qs("#miniMapWidget");
  if (!wrap || !zones?.length) return;
  wrap.innerHTML = `
    <div class="mini-grid"></div>
    <div class="mini-detail">
      <p class="eyebrow" id="miniZoneName"></p>
      <h3 id="miniZoneTitle"></h3>
      <ul id="miniZoneStats"></ul>
    </div>
  `;
  const grid = wrap.querySelector(".mini-grid");
  const nameEl = wrap.querySelector("#miniZoneName");
  const titleEl = wrap.querySelector("#miniZoneTitle");
  const statsEl = wrap.querySelector("#miniZoneStats");
  const setDetail = (zone) => {
    nameEl.textContent = zone.code;
    titleEl.textContent = zone.name;
    statsEl.innerHTML = `
      <li>Population: <strong>${zone.population}</strong></li>
      <li>Cleanliness: <strong>${zone.cleanliness}</strong></li>
      <li>Facilities: <strong>${zone.facilities}</strong></li>
    `;
  };
  zones.forEach((zone, idx) => {
    const btn = document.createElement("button");
    btn.textContent = zone.code;
    btn.addEventListener("click", () => {
      grid.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      setDetail(zone);
    });
    if (idx === 0) btn.classList.add("is-active");
    grid.appendChild(btn);
  });
  setDetail(zones[0]);
};

const renderTrendChart = (points) => {
  const wrap = qs("#trendChart");
  if (!wrap || !points?.length) return;
  const maxValue = Math.max(...points.map((p) => p.value));
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * 300;
      const y = 160 - (point.value / maxValue) * 150 - 5;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  wrap.innerHTML = `
    <div class="chart-line-wrap">
      <svg viewBox="0 0 300 160" preserveAspectRatio="none">
        <path d="${path}" />
      </svg>
      <div class="chart-points">
        ${points
          .map((point, index) => {
            const x = (index / (points.length - 1 || 1)) * 100;
            const y = 100 - (point.value / maxValue) * 100;
            return `<span style="left:${x}%; top:${y}%;" title="${point.hour}h · ${point.value} AQI"></span>`;
          })
          .join("")}
      </div>
    </div>
  `;
};

const renderNewsList = (news) => {
  const wrap = qs("#newsList");
  if (!wrap || !news?.length) return;
  wrap.innerHTML = news
    .map(
      (item) => `
        <li>
          <span>${item.tag}</span>
          <p>${item.title}</p>
        </li>
      `
    )
    .join("");
};

const renderTempTrend = (weather) => {
  const wrap = qs("#tempTrend");
  if (!wrap) return;
  const maxVal = Math.max(...weather.hourly);
  wrap.innerHTML = `
    <div class="chart-bars">
      ${weather.hourly
        .map(
          (value, idx) => `
            <span>
              <i style="height:${(value / maxVal) * 100}%"></i>
              <small>${idx * 4}h</small>
            </span>
          `
        )
        .join("")}
    </div>
  `;
};

const initFactWidget = (facts) => {
  const el = qs("#factWidget");
  if (!el || !facts?.length) return;
  let index = 0;
  const render = () => {
    el.textContent = facts[index];
  };
  render();
  if (window.CityPulseFactInterval) clearInterval(window.CityPulseFactInterval);
  window.CityPulseFactInterval = setInterval(() => {
    index = (index + 1) % facts.length;
    render();
  }, 6000);
};

const renderQuickActions = (actions) => {
  const wrap = qs("#quickActions");
  const response = qs("#actionResponse");
  if (!wrap || !actions?.length) return;
  wrap.innerHTML = actions
    .map(
      (action) => `
        <button type="button" data-number="${action.number}">
          <span>${action.icon}</span>
          <strong>${action.label}</strong>
        </button>
      `
    )
    .join("");
  wrap.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.querySelector("strong").textContent;
      const number = btn.dataset.number;
      if (response) response.textContent = `${label} · ${number}`;
    });
  });
};

const renderAlertsPage = () => {
  const { alerts } = window.CityPulseData;
  const grid = qs("#alertsGrid");
  const filterButtons = qsa(".filters .chip");
  if (!grid) return;
  let currentFilter = "all";

  const draw = () => {
    grid.innerHTML = alerts
      .filter((alert) => currentFilter === "all" || alert.category === currentFilter)
      .map(
        (alert) => `
          <article class="card alert-card fade-in">
            <div class="card-header">
              <span class="badge badge--${alert.category}">${alert.badge}</span>
              <p class="muted">${alert.time}</p>
            </div>
            <h2>${alert.title}</h2>
            <p>${alert.body}</p>
            <p class="eyebrow">${alert.category}</p>
          </article>
        `
      )
      .join("") || '<p class="muted">No alerts in this category.</p>';
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentFilter = btn.dataset.filter;
      draw();
    });
  });

  draw();
};

const renderMapPage = () => {
  const { zones, city } = window.CityPulseData;
  const map = qs("#cityMap");
  const modal = qs("#zoneModal");
  const overlay = qs("#activeZoneCard");
  const historyList = qs("#zoneHistory");
  const historyCount = qs("#historyCount");
  const historyPanel = qs("#zoneHistoryPanel");
  const categoryRow = qs("#categoryRow");
  const searchInput = qs("#zoneSearch");
  const historyButton = qs("#historyButton");
  const mapGrid = qs("#mapGrid");
  const mapView = qs("#mapView");
  const pinOverlay = qs("#pinOverlay");
  if (
    !map ||
    !modal ||
    !overlay ||
    !historyList ||
    !historyCount ||
    !historyPanel ||
    !categoryRow ||
    !searchInput ||
    !historyButton ||
    !mapGrid ||
    !mapView ||
    !pinOverlay
  )
    return;

  renderMapMeta(city);

  const slug = (val) => val.toLowerCase().replace(/[^a-z]+/g, "-");
  const categoryMeta = [
    { key: "all", label: "All civic nodes", icon: "🧭", detail: "Complete network" },
    { key: "parks", label: "Parks", icon: "🌿", detail: "Urban green pockets" },
    { key: "health", label: "Health", icon: "🏥", detail: "Clinics & hospitals" },
    { key: "education", label: "Education", icon: "🏫", detail: "Schools & institutes" },
    { key: "commerce", label: "Commerce", icon: "🛍️", detail: "Retail & hubs" }
  ];

  const stats = zones.reduce(
    (acc, zone) => {
      const key = slug(zone.type);
      acc[key] = (acc[key] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    },
    { all: 0 }
  );

  categoryRow.innerHTML = categoryMeta
    .map(
      (cat) => `
        <button class="category-card ${cat.key === "all" ? "is-active" : ""}" data-zone-filter="${cat.key}">
          <div class="category-icon">${cat.icon}</div>
          <div>
            <strong>${cat.label}</strong>
            <small>${stats[cat.key] || 0} locations · ${cat.detail}</small>
          </div>
        </button>`
    )
    .join("");

  const categoryButtons = qsa(".category-card", categoryRow);
  const staticHistory = ["park", "health", "edu", "mall"].map((id) => zones.find((zone) => zone.id === id)).filter(Boolean);

  const createMapPins = () => {
    map.querySelectorAll(".map-zone").forEach((node) => node.remove());
    zones.forEach((zone) => {
      const btn = document.createElement("button");
      btn.className = `map-zone map-zone--${zone.id}`;
      btn.dataset.zoneId = zone.id;
      btn.dataset.zoneType = slug(zone.type);
      btn.dataset.label = zone.name;
      btn.style.setProperty("--x", `${zone.position.x}%`);
      btn.style.setProperty("--y", `${zone.position.y}%`);
      btn.innerHTML = `<span>${zone.name}</span>`;
      btn.addEventListener("mouseenter", () => btn.classList.add("is-hover"));
      btn.addEventListener("mouseleave", () => btn.classList.remove("is-hover"));
      btn.addEventListener("click", () => selectZone(zone));
      map.appendChild(btn);
    });
  };

  const categoryIcon = {
    parks: "🌿",
    health: "🏥",
    education: "🏫",
    commerce: "🛍️",
    all: "🧭"
  };

  const formatHistoryItem = (zone) => `
    <li data-zone-id="${zone.id}">
      <div class="history-avatar">${categoryIcon[slug(zone.type)] || "📍"}</div>
      <div>
        <strong>${zone.name}</strong>
        <p class="location-meta-inline">${zone.type}${zone.address ? " · " + zone.address : ""}</p>
      </div>
    </li>
  `;

  const updateOverlay = (zone) => {
    if (!zone) {
      overlay.innerHTML = `<p class="muted">Search by category or keyword to explore civic locations.</p>`;
      mapView.classList.remove("is-focused");
      pinOverlay.innerHTML = "";
      return;
    }
    overlay.innerHTML = `
      <h3>${zone.name}</h3>
      <p class="muted">${zone.description}</p>
    `;
  };

  const focusPin = (zone, opts = { silent: false }) => {
    const pin = map.querySelector(`.map-zone[data-zone-id="${zone.id}"]`);
    if (!pin) return;
    qsa(".map-zone").forEach((btn) => btn.classList.remove("is-active"));
    pin.classList.add("is-active");

    const mapRect = map.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const centerX = pinRect.left + pinRect.width / 2 - mapRect.left;
    const topY = pinRect.top - mapRect.top;
    const clampedX = Math.min(Math.max(centerX, 130), mapRect.width - 130);
    const clampedY = Math.max(topY, 90);

    pinOverlay.style.setProperty("--pin-x", `${clampedX}px`);
    pinOverlay.style.setProperty("--pin-y", `${clampedY}px`);
    pinOverlay.innerHTML = `
      <h3>${zone.name}</h3>
      <p class="muted">${zone.description}</p>
      <footer>
        <span>${zone.address || "Delhi NCR"}</span>
        <button type="button" class="ghost active-zone-action" data-open-zone="${zone.id}">Open details</button>
      </footer>
    `;
    qs(".pin-overlay .active-zone-action")?.addEventListener("click", () => openZoneModal(zone));
    mapView.classList.add("is-focused");
    if (opts.silent) {
      mapView.classList.remove("is-focused");
      pinOverlay.innerHTML = "";
    }
  };

  const highlightZones = (activeId, visibleIds) => {
    qsa(".map-zone").forEach((btn) => {
      const isVisible = visibleIds.includes(btn.dataset.zoneId);
      btn.classList.toggle("is-muted", !isVisible);
      btn.classList.toggle("is-active", btn.dataset.zoneId === activeId);
    });
    qsa("#zoneHistory li[data-zone-id]").forEach((item) => {
      const zoneId = item.dataset.zoneId;
      const isVisible = visibleIds.includes(zoneId);
      item.style.opacity = isVisible ? "1" : "0.35";
      item.classList.toggle("is-active", zoneId === activeId);
    });
  };

  let currentFilter = "all";
  let searchTerm = "";
  let currentZone = null;
  let historyActivated = false;
  let showingStaticHistory = false;

  const updateHistoryVisibility = () => {
    const shouldShow = historyActivated;
    historyPanel.hidden = !shouldShow;
    mapGrid.classList.toggle("has-history", shouldShow);
  };

  const getVisibleZones = () =>
    zones.filter((zone) => {
      const filterMatch = currentFilter === "all" || slug(zone.type) === currentFilter;
      const searchMatch =
        zone.name.toLowerCase().includes(searchTerm) ||
        (zone.address || "").toLowerCase().includes(searchTerm) ||
        zone.type.toLowerCase().includes(searchTerm);
      return filterMatch && searchMatch;
    });

  const setHistoryContent = (items, label = `${items.length} locations`) => {
    historyCount.textContent = label;
    historyList.innerHTML = items.length ? items.map(formatHistoryItem).join("") : `<li class="empty-state">No locations found.</li>`;
  };

  const updateHistory = () => {
    const matches = getVisibleZones();
    setHistoryContent(matches, `${matches.length} / ${zones.length}`);
    updateHistoryVisibility();
    showingStaticHistory = false;
    return matches;
  };

  const selectZone = (zone, opts = { silent: false }) => {
    currentZone = zone;
    updateOverlay(zone);
    if (zone) {
      focusPin(zone, opts);
    } else {
      mapView.classList.remove("is-focused");
      pinOverlay.innerHTML = "";
      qsa(".map-zone").forEach((btn) => btn.classList.remove("is-active"));
    }
    const visible = (showingStaticHistory ? zones : getVisibleZones()).map((item) => item.id);
    highlightZones(zone ? zone.id : null, visible);
  };

  const applyFilter = (filter, options = { silent: false }) => {
    currentFilter = filter;
    categoryButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.zoneFilter === filter));
    const matches = updateHistory();
    if (options.silent) {
      selectZone(null, { silent: true });
    } else {
      selectZone(matches[0] || null);
    }
  };

  const handleSearch = (value) => {
    searchTerm = value.trim().toLowerCase();
    const matches = updateHistory();
    selectZone(matches[0] || null);
  };

  historyList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-zone-id]");
    if (!item) return;
    const zone = zones.find((z) => z.id === item.dataset.zoneId);
    if (zone) {
      selectZone(zone);
    }
  });

  categoryRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-zone-filter]");
    if (!button) return;
    historyActivated = true;
    applyFilter(button.dataset.zoneFilter);
  });

  searchInput.addEventListener("input", (event) => {
    if (event.target.value.trim().length > 0) {
      historyActivated = true;
    }
    handleSearch(event.target.value);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal") || event.target.classList.contains("close-modal")) {
      closeModal(modal);
    }
  });

  historyButton.addEventListener("click", () => {
    historyActivated = true;
    updateHistoryVisibility();
    showingStaticHistory = true;
    setHistoryContent(staticHistory, `${staticHistory.length} past`);
    selectZone(null);
  });

  createMapPins();
  applyFilter("all", { silent: true });
  updateHistoryVisibility();
};

const openZoneModal = (zone) => {
  const modal = qs("#zoneModal");
  if (!modal) return;
  qs("#zoneType").textContent = zone.type;
  qs("#zoneTitle").textContent = zone.name;
  qs("#zoneDescription").textContent = zone.description;
  const meta = qs("#zoneMeta");
  const items = [];
  if (zone.address) {
    items.push(`<li><span>Address</span><strong>${zone.address}</strong></li>`);
  }
  items.push(
    ...zone.contacts.map((contact) => `<li><span>${contact.label}</span><strong>${contact.value}</strong></li>`)
  );
  meta.innerHTML = items.join("");
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = (modal) => {
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
};

const renderMapMeta = (city) => {
  if (!city) return;
  const setText = (id, value) => {
    const el = qs(`#${id}`);
    if (el && value) el.textContent = value;
  };
  setText("mapCityName", `${city.name}, ${city.country}`);
  setText("mapCoordinates", city.coordinates);
  setText("mapTimezone", city.timezone);
  setText("mapPopulation", city.population);
  setText("mapArea", city.area);
};

const renderConnectPage = () => {
  const form = qs("#feedbackForm");
  const { socials } = window.CityPulseData;
  const socialList = qs("#socialList");
  const modal = qs("#successModal");
  if (socialList) {
    socialList.innerHTML = socials.map((item) => `<li><strong>${item.label}</strong><span>${item.handle}</span></li>`).join("");
  }
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const errors = validateForm(formData);
      showErrors(errors);
      if (Object.keys(errors).length === 0) {
        form.reset();
        populateSocialTags();
        openModal(modal);
      }
    });
  }
  const closers = qsa("#successModal .close-modal");
  closers.forEach((btn) =>
    btn.addEventListener("click", () => {
      closeModal(modal);
    })
  );
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        closeModal(modal);
      }
    });
  }
};

const validateForm = (formData) => {
  const errors = {};
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();

  if (name.length < 3) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (message.length < 10) errors.message = "Message should be at least 10 characters.";

  return errors;
};

const showErrors = (errors) => {
  qsa(".error").forEach((el) => (el.textContent = ""));
  Object.entries(errors).forEach(([key, value]) => {
    const el = qs(`[data-error="${key}"]`);
    if (el) el.textContent = value;
  });
};

const populateSocialTags = () => {
  const list = qs("#socialTags");
  if (!list) return;
  list.innerHTML = window.CityPulseData.socials
    .map((item) => `<span class="tag">${item.handle}</span>`)
    .join("");
};

const openModal = (modal) => {
  if (!modal) return;
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
};

const setCityPills = () => {
  const city = window.CityPulseData?.city;
  if (!city) return;
  qsa("[data-city-pill]").forEach((el) => {
    el.textContent = `${city.name}, ${city.country}`;
  });
};

const initAlertsFilter = () => {
  if (document.body.dataset.page === "alerts") {
    renderAlertsPage();
  }
};

const initMap = () => {
  if (document.body.dataset.page === "map") {
    renderMapPage();
  }
};

const initConnect = () => {
  if (document.body.dataset.page === "connect") {
    renderConnectPage();
  }
};

const initHome = () => {
  if (document.body.dataset.page === "home") {
    renderHome();
  }
};

const initLanding = () => {
  if (document.body.dataset.page !== "landing") return;
  const topBtn = qs("#ctaTop");
  const bottomBtn = qs("#ctaBottom");
  const headerBtn = qs("#landingCTA");
  const attach = (btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  };
  attach(topBtn);
  attach(bottomBtn);
  attach(headerBtn);
};

const bootstrap = () => {
  initShell();
  setClock();
  setInterval(setClock, 1000 * 30);
  setCityPills();
  initHome();
  initAlertsFilter();
  initMap();
  initConnect();
  initLanding();
};

document.addEventListener("DOMContentLoaded", bootstrap);
"use strict";

const CONFIG = {
  initialCenter: [26.3098, 50.1466],
  initialZoom: 15,
  placeColors: {
    academic: "#2563eb",
    housing: "#f59e0b",
    grass: "#16a34a",
    parking: "#64748b",
    service: "#dc2626",
    other: "#7c3aed"
  }
};

const TEXT = {
  en: {
    title: "KFUPM Campus Map",
    subtitle: "Buildings, services, regions, and paths",
    languageButton: "العربية",
    locationButton: "My location",
    searchLabel: "Search",
    searchPlaceholder: "Building number or name",
    categoryLabel: "Category",
    allCategories: "All categories",
    regionsLabel: "Show regions",
    networkLabel: "Show routing network",
    resetButton: "Show entire campus",
    emptyMessage: "Select a place on the map to view its information.",
    demoWarning: "Demo geometry only—replace the sample coordinates before publishing.",
    loading: "Loading map data…",
    loadError: "Could not load the data files.",
    noResults: "No matching places",
    unknown: "Not provided",
    yes: "Yes",
    no: "No",
    yourLocation: "Your location"
  },
  ar: {
    title: "خريطة جامعة الملك فهد",
    subtitle: "المباني والخدمات والمناطق والمسارات",
    languageButton: "English",
    locationButton: "موقعي",
    searchLabel: "بحث",
    searchPlaceholder: "رقم المبنى أو اسمه",
    categoryLabel: "التصنيف",
    allCategories: "جميع التصنيفات",
    regionsLabel: "إظهار المناطق",
    networkLabel: "إظهار شبكة المسارات",
    resetButton: "إظهار الحرم بالكامل",
    emptyMessage: "اختر موقعاً من الخريطة لعرض معلوماته.",
    demoWarning: "الحدود المعروضة تجريبية—استبدل الإحداثيات قبل نشر الموقع.",
    loading: "جاري تحميل بيانات الخريطة…",
    loadError: "تعذر تحميل ملفات البيانات.",
    noResults: "لا توجد نتائج مطابقة",
    unknown: "غير متوفر",
    yes: "نعم",
    no: "لا",
    yourLocation: "موقعك"
  }
};

const state = {
  language: "en",
  regions: null,
  places: null,
  network: null,
  regionLayer: null,
  placeLayer: null,
  networkLayer: L.layerGroup(),
  featureLayers: new Map(),
  selectedPlaceId: null
};

const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true
}).setView(CONFIG.initialCenter, CONFIG.initialZoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

state.networkLayer.addTo(map);

const elements = {
  title: document.querySelector("#app-title"),
  subtitle: document.querySelector("#app-subtitle"),
  languageButton: document.querySelector("#language-button"),
  locationButton: document.querySelector("#location-button"),
  searchLabel: document.querySelector("#search-label"),
  searchInput: document.querySelector("#search-input"),
  categoryLabel: document.querySelector("#category-label"),
  categoryFilter: document.querySelector("#category-filter"),
  regionsToggle: document.querySelector("#regions-toggle"),
  regionsLabel: document.querySelector("#regions-label"),
  networkToggle: document.querySelector("#network-toggle"),
  networkLabel: document.querySelector("#network-label"),
  resetButton: document.querySelector("#reset-button"),
  searchResults: document.querySelector("#search-results"),
  emptyMessage: document.querySelector("#empty-message"),
  placeContent: document.querySelector("#place-content"),
  placeCategory: document.querySelector("#place-category"),
  placeName: document.querySelector("#place-name"),
  placeDescription: document.querySelector("#place-description"),
  placeDetails: document.querySelector("#place-details"),
  demoWarning: document.querySelector("#demo-warning"),
  status: document.querySelector("#status-message")
};

function currentText() {
  return TEXT[state.language];
}

function localizedName(properties) {
  if (state.language === "ar") {
    return properties.arName || properties.enName || properties.id;
  }
  return properties.enName || properties.arName || properties.id;
}

function localizedDescription(properties) {
  if (state.language === "ar") {
    return properties.descriptionAr || properties.descriptionEn || "";
  }
  return properties.descriptionEn || properties.descriptionAr || "";
}

function humanizeKey(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .trim();
}

function formatValue(value) {
  const text = currentText();

  if (value === true) return text.yes;
  if (value === false) return text.no;
  if (value === null || value === undefined || value === "") return text.unknown;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.style.background = isError
    ? "rgba(153, 27, 27, 0.92)"
    : "rgba(23, 33, 27, 0.88)";
  elements.status.hidden = false;
}

function hideStatus() {
  elements.status.hidden = true;
}

function regionStyle(feature) {
  const level = Number(feature.properties.level || 0);
  const colors = ["#005f3c", "#0f766e", "#0891b2", "#7c3aed"];

  return {
    color: colors[Math.min(level, colors.length - 1)],
    weight: Math.max(1, 3 - level * 0.65),
    dashArray: level === 0 ? null : "7 5",
    fillColor: colors[Math.min(level, colors.length - 1)],
    fillOpacity: level === 0 ? 0.035 : 0.055
  };
}

function placeStyle(feature) {
  const category = feature.properties.category || "other";
  const color = CONFIG.placeColors[category] || CONFIG.placeColors.other;
  const selected = feature.properties.id === state.selectedPlaceId;

  return {
    color: selected ? "#111827" : color,
    fillColor: color,
    fillOpacity: selected ? 0.78 : 0.57,
    weight: selected ? 4 : 2
  };
}

function buildRegionLayer() {
  if (state.regionLayer) map.removeLayer(state.regionLayer);

  const orderedFeatures = [...state.regions.features].sort(
    (a, b) =>
      Number(a.properties.renderOrder || 0) -
      Number(b.properties.renderOrder || 0)
  );

  state.regionLayer = L.geoJSON(
    { type: "FeatureCollection", features: orderedFeatures },
    {
      style: regionStyle,
      onEachFeature(feature, layer) {
        layer.bindTooltip(localizedName(feature.properties), {
          permanent: false,
          direction: "center",
          className: "region-label"
        });
      }
    }
  );

  if (elements.regionsToggle.checked) state.regionLayer.addTo(map);
}

function buildPlaceLayer() {
  if (state.placeLayer) map.removeLayer(state.placeLayer);
  state.featureLayers.clear();

  const selectedCategory = elements.categoryFilter.value;
  const visibleFeatures = state.places.features.filter(
    feature =>
      selectedCategory === "all" ||
      feature.properties.category === selectedCategory
  );

  state.placeLayer = L.geoJSON(
    { type: "FeatureCollection", features: visibleFeatures },
    {
      style: placeStyle,
      pointToLayer(feature, latlng) {
        const color =
          CONFIG.placeColors[feature.properties.category] ||
          CONFIG.placeColors.other;
        return L.circleMarker(latlng, {
          radius: 7,
          color,
          fillColor: color,
          fillOpacity: 0.75,
          weight: 2
        });
      },
      onEachFeature(feature, layer) {
        const id = feature.properties.id;
        state.featureLayers.set(id, layer);
        layer.bindTooltip(localizedName(feature.properties));
        layer.on("click", () => selectPlace(id, true));
      }
    }
  ).addTo(map);
}

function buildNetworkLayer() {
  state.networkLayer.clearLayers();

  const nodesById = new Map(
    state.network.nodes.map(node => [node.id, node])
  );

  for (const edge of state.network.edges) {
    const coordinates = edge.geometry?.length
      ? edge.geometry
      : [nodesById.get(edge.from)?.coordinates, nodesById.get(edge.to)?.coordinates];

    const validCoordinates = coordinates.filter(Boolean);
    if (validCoordinates.length < 2) continue;

    const latLngs = validCoordinates.map(([longitude, latitude]) => [
      latitude,
      longitude
    ]);

    L.polyline(latLngs, {
      color: edge.details?.accessible === false ? "#dc2626" : "#0f766e",
      weight: 4,
      opacity: 0.78,
      dashArray: edge.details?.stairs ? "4 6" : null
    })
      .bindTooltip(edge.id)
      .addTo(state.networkLayer);
  }

  for (const node of state.network.nodes) {
    const [longitude, latitude] = node.coordinates;
    L.circleMarker([latitude, longitude], {
      radius: node.kind === "entrance" ? 5 : 3,
      color: "#ffffff",
      fillColor: node.kind === "entrance" ? "#dc2626" : "#111827",
      fillOpacity: 1,
      weight: 1.5
    })
      .bindTooltip(`${node.id} · ${node.kind}`)
      .addTo(state.networkLayer);
  }

  if (!elements.networkToggle.checked) map.removeLayer(state.networkLayer);
}

function populateCategories() {
  const previousValue = elements.categoryFilter.value || "all";
  const categories = [...new Set(
    state.places.features.map(feature => feature.properties.category || "other")
  )].sort();

  elements.categoryFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = currentText().allCategories;
  elements.categoryFilter.append(allOption);

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = humanizeKey(category);
    elements.categoryFilter.append(option);
  }

  elements.categoryFilter.value = categories.includes(previousValue)
    ? previousValue
    : "all";
}

function selectPlace(id, moveMap = false) {
  const feature = state.places.features.find(
    candidate => candidate.properties.id === id
  );
  if (!feature) return;

  state.selectedPlaceId = id;
  buildPlaceLayer();
  renderPlacePanel(feature.properties);
  elements.searchResults.hidden = true;

  if (moveMap) {
    const layer = state.featureLayers.get(id);
    if (layer?.getBounds) map.fitBounds(layer.getBounds(), { padding: [45, 45], maxZoom: 19 });
    else if (layer?.getLatLng) map.setView(layer.getLatLng(), 18);
  }
}

function renderPlacePanel(properties) {
  elements.emptyMessage.hidden = true;
  elements.placeContent.hidden = false;
  elements.placeCategory.textContent = humanizeKey(properties.category || "other");
  elements.placeName.textContent = localizedName(properties);
  elements.placeDescription.textContent = localizedDescription(properties);
  elements.placeDescription.hidden = !localizedDescription(properties);
  elements.placeDetails.replaceChildren();

  const commonDetails = {};
  if (properties.number) commonDetails.number = properties.number;
  if (properties.regionId) commonDetails.region = properties.regionId;

  const details = { ...commonDetails, ...(properties.details || {}) };

  for (const [key, value] of Object.entries(details)) {
    const row = document.createElement("div");
    row.className = "detail-row";

    const term = document.createElement("dt");
    term.textContent = humanizeKey(key);

    const description = document.createElement("dd");
    description.textContent = formatValue(value);

    row.append(term, description);
    elements.placeDetails.append(row);
  }
}

function normalizedSearchText(feature) {
  const properties = feature.properties;
  return [
    properties.id,
    properties.number,
    properties.enName,
    properties.arName,
    properties.category,
    properties.descriptionEn,
    properties.descriptionAr,
    ...(properties.aliases || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function renderSearchResults() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase();
  elements.searchResults.replaceChildren();

  if (!query) {
    elements.searchResults.hidden = true;
    return;
  }

  const matches = state.places.features
    .filter(feature => normalizedSearchText(feature).includes(query))
    .slice(0, 12);

  elements.searchResults.hidden = false;

  if (!matches.length) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.style.padding = "0 0.7rem";
    message.textContent = currentText().noResults;
    elements.searchResults.append(message);
    return;
  }

  for (const feature of matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "result-button";

    const name = document.createElement("strong");
    name.textContent = localizedName(feature.properties);

    const category = document.createElement("small");
    category.textContent = humanizeKey(feature.properties.category || "other");

    button.append(name, category);
    button.addEventListener("click", () => selectPlace(feature.properties.id, true));
    elements.searchResults.append(button);
  }
}

function updateLanguage() {
  const text = currentText();
  const isArabic = state.language === "ar";

  document.documentElement.lang = state.language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  elements.title.textContent = text.title;
  elements.subtitle.textContent = text.subtitle;
  elements.languageButton.textContent = text.languageButton;
  elements.locationButton.textContent = text.locationButton;
  elements.searchLabel.textContent = text.searchLabel;
  elements.searchInput.placeholder = text.searchPlaceholder;
  elements.categoryLabel.textContent = text.categoryLabel;
  elements.regionsLabel.textContent = text.regionsLabel;
  elements.networkLabel.textContent = text.networkLabel;
  elements.resetButton.textContent = text.resetButton;
  elements.emptyMessage.textContent = text.emptyMessage;
  elements.demoWarning.textContent = text.demoWarning;

  if (state.places) {
    populateCategories();
    buildRegionLayer();
    buildPlaceLayer();
    renderSearchResults();

    if (state.selectedPlaceId) {
      const selectedFeature = state.places.features.find(
        feature => feature.properties.id === state.selectedPlaceId
      );
      if (selectedFeature) renderPlacePanel(selectedFeature.properties);
    }
  }
}

function fitCampus() {
  const campusFeature = state.regions.features.find(
    feature => feature.properties.level === 0
  );

  if (!campusFeature) {
    map.setView(CONFIG.initialCenter, CONFIG.initialZoom);
    return;
  }

  const layer = L.geoJSON(campusFeature);
  if (layer.getBounds().isValid()) {
    map.fitBounds(layer.getBounds(), { padding: [30, 30] });
  }
}

elements.languageButton.addEventListener("click", () => {
  state.language = state.language === "en" ? "ar" : "en";
  updateLanguage();
});

elements.locationButton.addEventListener("click", () => {
  map.locate({ setView: true, maxZoom: 18, enableHighAccuracy: true });
});

map.on("locationfound", event => {
  L.circle(event.latlng, {
    radius: event.accuracy,
    color: "#2563eb",
    fillOpacity: 0.08,
    weight: 1
  }).addTo(map);

  L.circleMarker(event.latlng, {
    radius: 7,
    color: "white",
    fillColor: "#2563eb",
    fillOpacity: 1,
    weight: 3
  })
    .bindTooltip(currentText().yourLocation)
    .addTo(map);
});

map.on("locationerror", event => setStatus(event.message, true));

elements.searchInput.addEventListener("input", renderSearchResults);

elements.categoryFilter.addEventListener("change", () => {
  buildPlaceLayer();
  renderSearchResults();
});

elements.regionsToggle.addEventListener("change", () => {
  if (elements.regionsToggle.checked) state.regionLayer.addTo(map);
  else map.removeLayer(state.regionLayer);
});

elements.networkToggle.addEventListener("change", () => {
  if (elements.networkToggle.checked) state.networkLayer.addTo(map);
  else map.removeLayer(state.networkLayer);
});

elements.resetButton.addEventListener("click", fitCampus);

async function loadData() {
  try {
    setStatus(currentText().loading);

    const [regionsResponse, placesResponse, networkResponse] = await Promise.all([
      fetch("data/regions.geojson"),
      fetch("data/places.geojson"),
      fetch("data/network.json")
    ]);

    if (![regionsResponse, placesResponse, networkResponse].every(response => response.ok)) {
      throw new Error("One or more data files returned an error.");
    }

    [state.regions, state.places, state.network] = await Promise.all([
      regionsResponse.json(),
      placesResponse.json(),
      networkResponse.json()
    ]);

    populateCategories();
    buildRegionLayer();
    buildPlaceLayer();
    buildNetworkLayer();
    fitCampus();
    hideStatus();
  } catch (error) {
    console.error(error);
    setStatus(currentText().loadError, true);
  }
}

updateLanguage();
loadData();

"use strict";

const DATA_FILES = {
  regions: "data/regions.geojson",
  places: "data/places.geojson",
  network: "data/network.json"
};

const CATEGORY_COLORS = {
  academic: "#2868a9",
  administration: "#7655a6",
  housing: "#d77b28",
  mosque: "#19896b",
  parking: "#6d7880",
  grass: "#55a447",
  sport: "#bb3f72",
  service: "#9a6a31",
  food: "#d24c3f",
  medical: "#c33a3a",
  other: "#496b5d"
};

const TEXT = {
  en: {
    appTitle: "KFUPM Campus Map",
    appSubtitle: "Buildings, services, regions, and paths",
    languageButton: "العربية",
    locationButton: "My location",
    addPlace: "Add a place",
    download: "Download places.geojson",
    downloadDirty: "Download places.geojson *",
    editorTitle: "Add a place",
    editorInstructions: "Click at least three points on the map to draw the place boundary.",
    enName: "English name",
    arName: "Arabic name",
    number: "Number",
    category: "Category",
    region: "Region",
    noRegion: "No region",
    descriptionEn: "English description",
    descriptionAr: "Arabic description",
    detailsJson: "Optional details (JSON)",
    undo: "Undo point",
    clear: "Clear points",
    save: "Save place",
    cancel: "Cancel",
    point: "point",
    points: "points",
    search: "Search",
    searchPlaceholder: "Building number or name",
    allCategories: "All categories",
    showRegions: "Show regions",
    showNetwork: "Show routing network",
    reset: "Show entire campus",
    empty: "Select a place on the map to view its information.",
    deletePlace: "Delete this place",
    demoWarning: "Demo geometry only—replace the sample coordinates before publishing.",
    loading: "Loading map data…",
    loaded: "Map data loaded.",
    loadError: "Could not load the map data. Open this website through GitHub Pages or a local web server.",
    drawingStarted: "Drawing mode is active. Click the map to add polygon points.",
    needPoints: "Add at least three points before saving.",
    needName: "Enter an English or Arabic name.",
    invalidDetails: "Optional details must be a valid JSON object.",
    saved: "Place saved in this browser session.",
    deleted: "Place deleted from this browser session.",
    downloaded: "places.geojson downloaded.",
    deleteConfirm: "Delete this place? You can still restore it by reloading before downloading.",
    noResults: "No matching places.",
    locationUnsupported: "Location is not supported by this browser.",
    locationSearching: "Finding your location…",
    locationDenied: "Your location could not be found.",
    regionLabel: "Region",
    numberLabel: "Number",
    idLabel: "ID",
    categoryLabel: "Category"
  },
  ar: {
    appTitle: "خريطة جامعة الملك فهد",
    appSubtitle: "المباني والخدمات والمناطق والمسارات",
    languageButton: "English",
    locationButton: "موقعي",
    addPlace: "إضافة مكان",
    download: "تنزيل places.geojson",
    downloadDirty: "تنزيل places.geojson *",
    editorTitle: "إضافة مكان",
    editorInstructions: "اضغط على ثلاث نقاط على الأقل في الخريطة لرسم حدود المكان.",
    enName: "الاسم بالإنجليزية",
    arName: "الاسم بالعربية",
    number: "الرقم",
    category: "التصنيف",
    region: "المنطقة",
    noRegion: "بدون منطقة",
    descriptionEn: "الوصف بالإنجليزية",
    descriptionAr: "الوصف بالعربية",
    detailsJson: "تفاصيل اختيارية (JSON)",
    undo: "تراجع عن نقطة",
    clear: "مسح النقاط",
    save: "حفظ المكان",
    cancel: "إلغاء",
    point: "نقطة",
    points: "نقاط",
    search: "بحث",
    searchPlaceholder: "رقم المبنى أو الاسم",
    allCategories: "كل التصنيفات",
    showRegions: "إظهار المناطق",
    showNetwork: "إظهار شبكة المسارات",
    reset: "عرض الحرم كاملًا",
    empty: "اختر مكانًا من الخريطة لعرض معلوماته.",
    deletePlace: "حذف هذا المكان",
    demoWarning: "الإحداثيات تجريبية فقط—استبدلها قبل نشر الموقع.",
    loading: "جارٍ تحميل بيانات الخريطة…",
    loaded: "تم تحميل بيانات الخريطة.",
    loadError: "تعذر تحميل بيانات الخريطة. افتح الموقع عبر GitHub Pages أو خادم محلي.",
    drawingStarted: "وضع الرسم مفعّل. اضغط على الخريطة لإضافة نقاط المضلع.",
    needPoints: "أضف ثلاث نقاط على الأقل قبل الحفظ.",
    needName: "أدخل الاسم بالعربية أو الإنجليزية.",
    invalidDetails: "يجب أن تكون التفاصيل الاختيارية كائن JSON صالحًا.",
    saved: "تم حفظ المكان في جلسة المتصفح الحالية.",
    deleted: "تم حذف المكان من جلسة المتصفح الحالية.",
    downloaded: "تم تنزيل places.geojson.",
    deleteConfirm: "هل تريد حذف هذا المكان؟ يمكنك استعادته بإعادة تحميل الصفحة قبل تنزيل الملف.",
    noResults: "لا توجد أماكن مطابقة.",
    locationUnsupported: "المتصفح لا يدعم تحديد الموقع.",
    locationSearching: "جارٍ تحديد موقعك…",
    locationDenied: "تعذر تحديد موقعك.",
    regionLabel: "المنطقة",
    numberLabel: "الرقم",
    idLabel: "المعرّف",
    categoryLabel: "التصنيف"
  }
};

const elements = {
  appTitle: document.querySelector("#app-title"),
  appSubtitle: document.querySelector("#app-subtitle"),
  languageButton: document.querySelector("#language-button"),
  locationButton: document.querySelector("#location-button"),
  addPlaceButton: document.querySelector("#add-place-button"),
  downloadButton: document.querySelector("#download-button"),
  editor: document.querySelector("#place-editor"),
  editorTitle: document.querySelector("#editor-title"),
  editorInstructions: document.querySelector("#editor-instructions"),
  pointCount: document.querySelector("#point-count"),
  enNameLabel: document.querySelector("#editor-en-name-label"),
  arNameLabel: document.querySelector("#editor-ar-name-label"),
  numberLabel: document.querySelector("#editor-number-label"),
  categoryEditorLabel: document.querySelector("#editor-category-label"),
  regionEditorLabel: document.querySelector("#editor-region-label"),
  descriptionEnLabel: document.querySelector("#editor-description-en-label"),
  descriptionArLabel: document.querySelector("#editor-description-ar-label"),
  detailsLabel: document.querySelector("#editor-details-label"),
  enName: document.querySelector("#editor-en-name"),
  arName: document.querySelector("#editor-ar-name"),
  number: document.querySelector("#editor-number"),
  editorCategory: document.querySelector("#editor-category"),
  editorRegion: document.querySelector("#editor-region"),
  descriptionEn: document.querySelector("#editor-description-en"),
  descriptionAr: document.querySelector("#editor-description-ar"),
  editorDetails: document.querySelector("#editor-details"),
  undoButton: document.querySelector("#undo-point-button"),
  clearButton: document.querySelector("#clear-points-button"),
  saveButton: document.querySelector("#save-place-button"),
  cancelButton: document.querySelector("#cancel-editor-button"),
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
  deleteButton: document.querySelector("#delete-place-button"),
  demoWarning: document.querySelector("#demo-warning"),
  status: document.querySelector("#status-message")
};

const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true
}).setView([26.307, 50.145], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const state = {
  language: "en",
  regions: null,
  places: null,
  network: null,
  regionLayer: null,
  placeLayer: null,
  networkLayer: L.layerGroup().addTo(map),
  editorLayer: L.layerGroup().addTo(map),
  featureLayers: new Map(),
  selectedPlaceId: null,
  dirty: false,
  statusTimer: null,
  editor: {
    active: false,
    points: []
  }
};

function t(key) {
  return TEXT[state.language][key];
}

function textValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function localizedName(properties = {}) {
  if (state.language === "ar") {
    return properties.arName || properties.enName || properties.number || properties.id || "—";
  }
  return properties.enName || properties.arName || properties.number || properties.id || "—";
}

function localizedDescription(properties = {}) {
  return state.language === "ar"
    ? properties.descriptionAr || properties.descriptionEn || ""
    : properties.descriptionEn || properties.descriptionAr || "";
}

function categoryColor(category) {
  return CATEGORY_COLORS[String(category || "other").toLowerCase()] || CATEGORY_COLORS.other;
}

function setStatus(message, isError = false, autoHide = false) {
  window.clearTimeout(state.statusTimer);
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
  elements.status.hidden = false;

  if (autoHide) {
    state.statusTimer = window.setTimeout(() => {
      elements.status.hidden = true;
    }, 2600);
  }
}

function refreshMapLayout() {
  window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
  window.setTimeout(() => map.invalidateSize({ pan: false }), 180);
}

function setDirty(isDirty) {
  state.dirty = isDirty;
  elements.downloadButton.classList.toggle("dirty", isDirty);
  elements.downloadButton.textContent = isDirty ? t("downloadDirty") : t("download");
}

function updatePointCount() {
  const count = state.editor.points.length;
  elements.pointCount.textContent = `${count} ${count === 1 ? t("point") : t("points")}`;
  elements.saveButton.disabled = count < 3;
  elements.undoButton.disabled = count === 0;
  elements.clearButton.disabled = count === 0;
}

function updateLanguage() {
  const isArabic = state.language === "ar";
  document.documentElement.lang = state.language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  elements.appTitle.textContent = t("appTitle");
  elements.appSubtitle.textContent = t("appSubtitle");
  elements.languageButton.textContent = t("languageButton");
  elements.locationButton.textContent = t("locationButton");
  elements.addPlaceButton.textContent = t("addPlace");
  elements.editorTitle.textContent = t("editorTitle");
  elements.editorInstructions.textContent = t("editorInstructions");
  elements.enNameLabel.textContent = t("enName");
  elements.arNameLabel.textContent = t("arName");
  elements.numberLabel.textContent = t("number");
  elements.categoryEditorLabel.textContent = t("category");
  elements.regionEditorLabel.textContent = t("region");
  elements.descriptionEnLabel.textContent = t("descriptionEn");
  elements.descriptionArLabel.textContent = t("descriptionAr");
  elements.detailsLabel.textContent = t("detailsJson");
  elements.undoButton.textContent = t("undo");
  elements.clearButton.textContent = t("clear");
  elements.saveButton.textContent = t("save");
  elements.cancelButton.textContent = t("cancel");
  elements.searchLabel.textContent = t("search");
  elements.searchInput.placeholder = t("searchPlaceholder");
  elements.categoryLabel.textContent = t("category");
  elements.regionsLabel.textContent = t("showRegions");
  elements.networkLabel.textContent = t("showNetwork");
  elements.resetButton.textContent = t("reset");
  elements.emptyMessage.textContent = t("empty");
  elements.deleteButton.textContent = t("deletePlace");
  elements.demoWarning.textContent = t("demoWarning");

  setDirty(state.dirty);
  populateRegionOptions();
  populateCategoryOptions();
  updatePointCount();
  buildRegionLayer();
  buildPlaceLayer();
  renderSearchResults();

  if (state.selectedPlaceId) selectPlace(state.selectedPlaceId, false);
  refreshMapLayout();
}

function getRegionName(regionId) {
  if (!regionId || !state.regions) return "";
  const feature = state.regions.features.find((item) => item.properties?.id === regionId);
  return feature ? localizedName(feature.properties) : regionId;
}

function populateRegionOptions() {
  const selected = elements.editorRegion.value;
  elements.editorRegion.replaceChildren();

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = t("noRegion");
  elements.editorRegion.append(emptyOption);

  for (const feature of state.regions?.features || []) {
    const option = document.createElement("option");
    option.value = feature.properties?.id || "";
    option.textContent = localizedName(feature.properties);
    elements.editorRegion.append(option);
  }

  elements.editorRegion.value = Array.from(elements.editorRegion.options).some(
    (option) => option.value === selected
  )
    ? selected
    : "";
}

function populateCategoryOptions() {
  const current = elements.categoryFilter.value || "all";
  const categories = new Set(Object.keys(CATEGORY_COLORS));
  for (const feature of state.places?.features || []) {
    categories.add(String(feature.properties?.category || "other").toLowerCase());
  }

  elements.categoryFilter.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allCategories");
  elements.categoryFilter.append(allOption);

  Array.from(categories)
    .sort((a, b) => a.localeCompare(b))
    .forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      elements.categoryFilter.append(option);
    });

  elements.categoryFilter.value = Array.from(elements.categoryFilter.options).some(
    (option) => option.value === current
  )
    ? current
    : "all";
}

function buildRegionLayer() {
  if (state.regionLayer) map.removeLayer(state.regionLayer);
  if (!state.regions) return;

  state.regionLayer = L.geoJSON(state.regions, {
    style(feature) {
      const level = Number(feature.properties?.level || feature.properties?.zIndex || 0);
      return {
        color: level > 0 ? "#8a6b22" : "#17563f",
        weight: level > 0 ? 1.5 : 2.5,
        dashArray: level > 0 ? "6 5" : null,
        fillColor: level > 0 ? "#e4bf63" : "#4ca07a",
        fillOpacity: level > 0 ? 0.08 : 0.055
      };
    },
    onEachFeature(feature, layer) {
      layer.bindTooltip(localizedName(feature.properties), {
        sticky: true,
        direction: "top"
      });
    }
  });

  if (elements.regionsToggle.checked) state.regionLayer.addTo(map);
}

function popupNode(feature) {
  const wrapper = document.createElement("div");
  wrapper.className = "map-popup";
  const strong = document.createElement("strong");
  strong.textContent = localizedName(feature.properties);
  wrapper.append(strong);

  const number = feature.properties?.number;
  if (number) {
    const span = document.createElement("span");
    span.textContent = `${t("numberLabel")}: ${number}`;
    wrapper.append(span);
  }
  return wrapper;
}

function buildPlaceLayer() {
  if (state.placeLayer) map.removeLayer(state.placeLayer);
  state.featureLayers.clear();
  if (!state.places) return;

  const selectedCategory = elements.categoryFilter.value || "all";
  state.placeLayer = L.geoJSON(state.places, {
    filter(feature) {
      const category = String(feature.properties?.category || "other").toLowerCase();
      return selectedCategory === "all" || category === selectedCategory;
    },
    style(feature) {
      const color = categoryColor(feature.properties?.category);
      const selected = feature.properties?.id === state.selectedPlaceId;
      return {
        color: selected ? "#111111" : color,
        weight: selected ? 4 : 2,
        fillColor: color,
        fillOpacity: selected ? 0.52 : 0.34
      };
    },
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 7,
        color: categoryColor(feature.properties?.category),
        fillOpacity: 0.7
      });
    },
    onEachFeature(feature, layer) {
      const id = feature.properties?.id;
      if (id) state.featureLayers.set(id, layer);
      layer.bindTooltip(localizedName(feature.properties), { sticky: true });
      layer.bindPopup(() => popupNode(feature));
      layer.on("click", () => {
        if (state.editor.active) {
          return;
        }
        if (id) selectPlace(id, false);
      });
    }
  }).addTo(map);
}

function buildNetworkLayer() {
  state.networkLayer.clearLayers();
  const nodeCoordinates = new Map();

  for (const node of state.network?.nodes || []) {
    const coordinates = node.coordinates || node.point;
    if (!Array.isArray(coordinates) || coordinates.length < 2) continue;
    nodeCoordinates.set(node.id, coordinates);
    L.circleMarker([coordinates[1], coordinates[0]], {
      radius: 3.5,
      color: "#552b8c",
      weight: 1,
      fillColor: "#ffffff",
      fillOpacity: 1
    })
      .bindTooltip(node.id || "node")
      .addTo(state.networkLayer);
  }

  for (const edge of state.network?.edges || []) {
    let path = edge.geometry || edge.path || edge.coordinates;
    if (!Array.isArray(path) && edge.from && edge.to) {
      const from = nodeCoordinates.get(edge.from);
      const to = nodeCoordinates.get(edge.to);
      if (from && to) path = [from, to];
    }
    if (!Array.isArray(path) || path.length < 2) continue;

    L.polyline(
      path.map(([lng, lat]) => [lat, lng]),
      { color: "#552b8c", weight: 3, opacity: 0.7 }
    ).addTo(state.networkLayer);
  }

  if (!elements.networkToggle.checked) map.removeLayer(state.networkLayer);
}

function featureById(id) {
  return state.places?.features.find((feature) => feature.properties?.id === id) || null;
}

function appendDetail(label, value) {
  if (value === null || value === undefined || value === "") return;
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = textValue(value);
  elements.placeDetails.append(term, description);
}

function selectPlace(id, moveMap = true) {
  const feature = featureById(id);
  if (!feature) {
    clearSelection();
    return;
  }

  state.selectedPlaceId = id;
  const properties = feature.properties || {};
  elements.emptyMessage.hidden = true;
  elements.placeContent.hidden = false;
  elements.placeCategory.textContent = properties.category || "other";
  elements.placeName.textContent = localizedName(properties);
  elements.placeDescription.textContent = localizedDescription(properties);
  elements.placeDescription.hidden = !localizedDescription(properties);
  elements.placeDetails.replaceChildren();

  appendDetail(t("numberLabel"), properties.number);
  appendDetail(t("regionLabel"), getRegionName(properties.regionId));
  appendDetail(t("idLabel"), properties.id);
  appendDetail(t("categoryLabel"), properties.category);

  for (const [key, value] of Object.entries(properties.details || {})) {
    appendDetail(key, value);
  }

  buildPlaceLayer();
  const layer = state.featureLayers.get(id);
  if (moveMap && layer) {
    if (typeof layer.getBounds === "function" && layer.getBounds().isValid()) {
      map.fitBounds(layer.getBounds(), { padding: [45, 45], maxZoom: 19 });
    } else if (typeof layer.getLatLng === "function") {
      map.setView(layer.getLatLng(), 18);
    }
  }
}

function clearSelection() {
  state.selectedPlaceId = null;
  elements.emptyMessage.hidden = false;
  elements.placeContent.hidden = true;
  elements.placeDetails.replaceChildren();
  if (state.places) buildPlaceLayer();
}

function searchHaystack(feature) {
  const properties = feature.properties || {};
  return [
    properties.id,
    properties.number,
    properties.enName,
    properties.arName,
    properties.category,
    ...(Array.isArray(properties.aliases) ? properties.aliases : [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function matchingPlaces() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase();
  if (!query || !state.places) return [];
  return state.places.features.filter((feature) => searchHaystack(feature).includes(query)).slice(0, 30);
}

function renderSearchResults() {
  const query = elements.searchInput.value.trim();
  elements.searchResults.replaceChildren();
  elements.searchResults.hidden = !query;
  if (!query) return;

  const matches = matchingPlaces();
  if (matches.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = t("noResults");
    elements.searchResults.append(message);
    return;
  }

  for (const feature of matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    const name = document.createElement("strong");
    name.textContent = localizedName(feature.properties);
    const meta = document.createElement("span");
    meta.textContent = [feature.properties?.number, feature.properties?.category]
      .filter(Boolean)
      .join(" · ");
    button.append(name, meta);
    button.addEventListener("click", () => selectPlace(feature.properties.id, true));
    elements.searchResults.append(button);
  }
}

function fitCampus() {
  const layers = [state.regionLayer, state.placeLayer].filter(Boolean);
  const group = L.featureGroup(layers);
  const bounds = group.getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30] });
  } else {
    map.setView([26.307, 50.145], 15);
  }
}

function resetEditorForm() {
  elements.enName.value = "";
  elements.arName.value = "";
  elements.number.value = "";
  elements.editorCategory.value = "other";
  elements.editorRegion.value = "";
  elements.descriptionEn.value = "";
  elements.descriptionAr.value = "";
  elements.editorDetails.value = "";
}

function startEditor() {
  state.editor.active = true;
  state.editor.points = [];
  resetEditorForm();
  redrawEditorGeometry();
  elements.editor.hidden = false;
  elements.addPlaceButton.disabled = true;
  document.body.classList.add("drawing-mode");
  setStatus(t("drawingStarted"), false, true);
  refreshMapLayout();
}

function stopEditor() {
  state.editor.active = false;
  state.editor.points = [];
  state.editorLayer.clearLayers();
  elements.editor.hidden = true;
  elements.addPlaceButton.disabled = false;
  document.body.classList.remove("drawing-mode");
  updatePointCount();
  refreshMapLayout();
}

function addEditorPoint(latlng) {
  if (!state.editor.active || !latlng) return;
  state.editor.points.push([
    Number(latlng.lng.toFixed(7)),
    Number(latlng.lat.toFixed(7))
  ]);
  redrawEditorGeometry();
}

function redrawEditorGeometry() {
  state.editorLayer.clearLayers();
  const latLngs = state.editor.points.map(([lng, lat]) => [lat, lng]);

  if (latLngs.length >= 3) {
    L.polygon(latLngs, {
      color: "#d48806",
      weight: 3,
      dashArray: "8 5",
      fillColor: "#ffc247",
      fillOpacity: 0.28,
      interactive: false
    }).addTo(state.editorLayer);
  } else if (latLngs.length >= 2) {
    L.polyline(latLngs, {
      color: "#d48806",
      weight: 3,
      dashArray: "8 5",
      interactive: false
    }).addTo(state.editorLayer);
  }

  latLngs.forEach((latlng, index) => {
    L.circleMarker(latlng, {
      radius: 6,
      color: "#8d5900",
      weight: 2,
      fillColor: "#ffffff",
      fillOpacity: 1,
      interactive: false
    })
      .bindTooltip(String(index + 1), { permanent: true, direction: "top", offset: [0, -5] })
      .addTo(state.editorLayer);
  });

  updatePointCount();
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function createUniqueId(seed) {
  const base = slugify(seed) || `place-${Date.now().toString(36)}`;
  const used = new Set((state.places?.features || []).map((feature) => feature.properties?.id));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function parseDetails() {
  const raw = elements.editorDetails.value.trim();
  if (!raw) return {};
  const details = JSON.parse(raw);
  if (!details || Array.isArray(details) || typeof details !== "object") {
    throw new Error("Details must be an object");
  }
  return details;
}

function savePlace() {
  if (state.editor.points.length < 3) {
    setStatus(t("needPoints"), true, true);
    return;
  }

  const enName = elements.enName.value.trim();
  const arName = elements.arName.value.trim();
  const number = elements.number.value.trim();
  if (!enName && !arName) {
    setStatus(t("needName"), true, true);
    (state.language === "ar" ? elements.arName : elements.enName).focus();
    return;
  }

  let details;
  try {
    details = parseDetails();
  } catch (error) {
    setStatus(t("invalidDetails"), true, true);
    elements.editorDetails.focus();
    return;
  }

  const category = elements.editorCategory.value.trim().toLowerCase() || "other";
  const ring = state.editor.points.map((point) => [...point]);
  ring.push([...ring[0]]);
  const id = createUniqueId(enName || arName || number || category);

  const feature = {
    type: "Feature",
    properties: {
      id,
      number: number || null,
      enName,
      arName,
      aliases: [enName, arName, number].filter(Boolean),
      category,
      regionId: elements.editorRegion.value || null,
      entranceNodeIds: [],
      descriptionEn: elements.descriptionEn.value.trim(),
      descriptionAr: elements.descriptionAr.value.trim(),
      details
    },
    geometry: {
      type: "Polygon",
      coordinates: [ring]
    }
  };

  state.places.features.push(feature);
  setDirty(true);
  stopEditor();
  populateCategoryOptions();
  elements.categoryFilter.value = "all";
  buildPlaceLayer();
  selectPlace(id, true);
  renderSearchResults();
  setStatus(t("saved"), false, true);
}

function deleteSelectedPlace() {
  if (!state.selectedPlaceId || !state.places) return;
  if (!window.confirm(t("deleteConfirm"))) return;

  state.places.features = state.places.features.filter(
    (feature) => feature.properties?.id !== state.selectedPlaceId
  );
  state.selectedPlaceId = null;
  setDirty(true);
  populateCategoryOptions();
  clearSelection();
  renderSearchResults();
  setStatus(t("deleted"), false, true);
}

function downloadPlaces() {
  if (!state.places) return;
  const output = JSON.parse(JSON.stringify(state.places));
  output.metadata = {
    ...(output.metadata || {}),
    updatedAt: new Date().toISOString(),
    status: "edited"
  };

  const blob = new Blob([`${JSON.stringify(output, null, 2)}\n`], {
    type: "application/geo+json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "places.geojson";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus(t("downloaded"), false, true);
}

function locateUser() {
  if (!navigator.geolocation) {
    setStatus(t("locationUnsupported"), true, true);
    return;
  }
  setStatus(t("locationSearching"));
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latlng = [position.coords.latitude, position.coords.longitude];
      map.setView(latlng, 18);
      L.circleMarker(latlng, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#1677ff",
        fillOpacity: 1
      }).addTo(map);
      elements.status.hidden = true;
    },
    () => setStatus(t("locationDenied"), true, true),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}

async function loadJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function loadData() {
  setStatus(t("loading"));
  try {
    [state.regions, state.places, state.network] = await Promise.all([
      loadJson(DATA_FILES.regions),
      loadJson(DATA_FILES.places),
      loadJson(DATA_FILES.network)
    ]);

    if (!Array.isArray(state.regions?.features) || !Array.isArray(state.places?.features)) {
      throw new Error("Invalid GeoJSON data");
    }

    populateRegionOptions();
    populateCategoryOptions();
    buildRegionLayer();
    buildPlaceLayer();
    buildNetworkLayer();
    fitCampus();
    setDirty(false);
    setStatus(t("loaded"), false, true);
  } catch (error) {
    console.error(error);
    setStatus(t("loadError"), true, false);
  } finally {
    refreshMapLayout();
  }
}

map.on("click", (event) => {
  if (state.editor.active) addEditorPoint(event.latlng);
});

elements.languageButton.addEventListener("click", () => {
  state.language = state.language === "en" ? "ar" : "en";
  updateLanguage();
});
elements.locationButton.addEventListener("click", locateUser);
elements.addPlaceButton.addEventListener("click", startEditor);
elements.downloadButton.addEventListener("click", downloadPlaces);
elements.undoButton.addEventListener("click", () => {
  state.editor.points.pop();
  redrawEditorGeometry();
});
elements.clearButton.addEventListener("click", () => {
  state.editor.points = [];
  redrawEditorGeometry();
});
elements.saveButton.addEventListener("click", savePlace);
elements.cancelButton.addEventListener("click", stopEditor);
elements.deleteButton.addEventListener("click", deleteSelectedPlace);
elements.searchInput.addEventListener("input", renderSearchResults);
elements.categoryFilter.addEventListener("change", () => {
  buildPlaceLayer();
  if (state.selectedPlaceId && !state.featureLayers.has(state.selectedPlaceId)) clearSelection();
});
elements.regionsToggle.addEventListener("change", () => {
  if (!state.regionLayer) return;
  if (elements.regionsToggle.checked) state.regionLayer.addTo(map);
  else map.removeLayer(state.regionLayer);
});
elements.networkToggle.addEventListener("change", () => {
  if (elements.networkToggle.checked) state.networkLayer.addTo(map);
  else map.removeLayer(state.networkLayer);
});
elements.resetButton.addEventListener("click", fitCampus);
window.addEventListener("resize", refreshMapLayout);

updateLanguage();
loadData();

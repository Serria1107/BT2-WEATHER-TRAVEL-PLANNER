const weatherCities = [
  { id: "bien-hoa", title: "Biên Hòa", temperature: 32, humidity: 68, condition: "sunny" },
  { id: "da-lat", title: "Đà Lạt", temperature: 18, humidity: 82, condition: "cloudy" },
  { id: "vung-tau", title: "Vũng Tàu", temperature: 27, humidity: 76, condition: "rainy" }
];

const STORAGE_KEYS = {
  itinerary: "weather-travel-planner.itinerary.v1",
  city: "weather-travel-planner.city.v1"
};

const conditionDetails = {
  sunny: { label: "Nắng", icon: "☀", shortTip: "Nắng ấm" },
  rainy: { label: "Mưa", icon: "☂", shortTip: "Có mưa" },
  cloudy: { label: "Mây", icon: "☁", shortTip: "Trời nhiều mây" }
};

const citySelect = document.querySelector("#city-select");
const weatherCard = document.querySelector("#weather-card");
const weatherCity = document.querySelector("#weather-city");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const weatherCondition = document.querySelector("#weather-condition");
const weatherTipShort = document.querySelector("#weather-tip-short");
const suggestionText = document.querySelector("#suggestion-text");
const cityBackdrop = document.querySelector(".city-backdrop");
const cityBackdropImages = Array.from(document.querySelectorAll(".city-backdrop__image"));
const fallbackBackdrop = document.querySelector('[data-city-backdrop="fallback"]');

const itineraryForm = document.querySelector("#itinerary-form");
const placeTitleInput = document.querySelector("#place-title");
const visitTimeInput = document.querySelector("#visit-time");
const formHint = document.querySelector("#form-hint");
const itineraryList = document.querySelector("#itinerary-list");
const resultCount = document.querySelector("#result-count");
const searchInput = document.querySelector("#search-input");
const statusFilter = document.querySelector("#status-filter");
const sortOrder = document.querySelector("#sort-order");
const pageSizeSelect = document.querySelector("#page-size");
const pagination = document.querySelector("#pagination");
const previousPageButton = document.querySelector("#previous-page");
const nextPageButton = document.querySelector("#next-page");
const pageIndicator = document.querySelector("#page-indicator");
const appNotice = document.querySelector("#app-notice");

let noticeTimeout;
let itinerary = loadItinerary();
let selectedCityId = loadSelectedCityId();
let currentPage = 1;

function showNotice(message, kind = "info") {
  window.clearTimeout(noticeTimeout);
  appNotice.textContent = message;
  appNotice.dataset.kind = kind;
  appNotice.hidden = false;

  noticeTimeout = window.setTimeout(() => {
    appNotice.hidden = true;
  }, 6000);
}

function setFormHint(message, isError = false) {
  formHint.textContent = message;
  formHint.classList.toggle("is-error", isError);
}

function loadItinerary() {
  let savedValue;

  try {
    savedValue = window.localStorage.getItem(STORAGE_KEYS.itinerary);
  } catch {
    showNotice("Trình duyệt không cho phép đọc LocalStorage. Lịch trình hiện tại sẽ không được khôi phục.", "error");
    return [];
  }

  if (savedValue === null) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(savedValue);
    const isValid = Array.isArray(parsedValue) && parsedValue.every((place) => (
      place !== null
      && typeof place === "object"
      && typeof place.id === "string"
      && typeof place.title === "string"
      && typeof place.visitTime === "string"
      && !Number.isNaN(Date.parse(place.visitTime))
      && typeof place.visited === "boolean"
    ));

    if (!isValid) {
      showNotice("Dữ liệu lịch trình đã lưu không đúng định dạng nên chưa được khôi phục. Hãy kiểm tra hoặc thêm lại các địa điểm.", "error");
      return [];
    }

    return parsedValue;
  } catch {
    showNotice("Không thể đọc dữ liệu lịch trình đã lưu. Dữ liệu cũ chưa bị tự động ghi đè.", "error");
    return [];
  }
}

function loadSelectedCityId() {
  try {
    const savedCityId = window.localStorage.getItem(STORAGE_KEYS.city);
    if (savedCityId === null) {
      return weatherCities[0].id;
    }
    if (!weatherCities.some((city) => city.id === savedCityId)) {
      showNotice("Thành phố đã lưu không hợp lệ; đang hiển thị thành phố mặc định.", "error");
      return weatherCities[0].id;
    }
    return savedCityId;
  } catch {
    showNotice("Không thể đọc thành phố đã lưu; đang hiển thị thành phố mặc định.", "error");
    return weatherCities[0].id;
  }
}

function saveItinerary() {
  try {
    window.localStorage.setItem(STORAGE_KEYS.itinerary, JSON.stringify(itinerary));
    return true;
  } catch {
    showNotice("Không thể lưu lịch trình vào LocalStorage. Thay đổi vẫn còn trên trang hiện tại.", "error");
    return false;
  }
}

function saveSelectedCity() {
  try {
    window.localStorage.setItem(STORAGE_KEYS.city, selectedCityId);
    return true;
  } catch {
    showNotice("Không thể lưu thành phố đã chọn vào LocalStorage.", "error");
    return false;
  }
}

function getCurrentCity() {
  return weatherCities.find((city) => city.id === selectedCityId) ?? weatherCities[0];
}

function getSmartSuggestion(city) {
  let temperatureAdvice;

  if (city.temperature < 15) {
    temperatureAdvice = "Trời se lạnh, nên mang áo len hoặc áo khoác.";
  } else if (city.temperature <= 30) {
    temperatureAdvice = "Hãy chọn trang phục thoải mái, phù hợp với thời tiết.";
  } else {
    temperatureAdvice = "Nhớ mang nước uống, kính râm và kem chống nắng.";
  }

  const conditionAdvice = {
    sunny: "Ưu tiên hoạt động ngoài trời và giữ đủ nước.",
    rainy: "Nên chuẩn bị ô hoặc áo mưa cho chuyến đi.",
    cloudy: "Thời tiết dịu, có thể mang thêm áo khoác mỏng."
  }[city.condition];

  return `${temperatureAdvice} ${conditionAdvice}`;
}

function renderWeather() {
  const city = getCurrentCity();
  const condition = conditionDetails[city.condition];

  renderCityBackdrop(city.id);
  citySelect.value = city.id;
  weatherCity.textContent = city.title;
  temperature.textContent = String(city.temperature);
  humidity.textContent = `${city.humidity}%`;
  weatherCondition.textContent = condition.label;
  weatherIcon.textContent = condition.icon;
  weatherIcon.setAttribute("aria-label", condition.label);
  weatherTipShort.textContent = condition.shortTip;
  suggestionText.textContent = getSmartSuggestion(city);

  weatherCard.classList.remove("weather-card--sunny", "weather-card--rainy", "weather-card--cloudy");
  weatherCard.classList.add(`weather-card--${city.condition}`);
}

function setActiveBackdrop(image) {
  cityBackdropImages.forEach((backdropImage) => {
    backdropImage.classList.toggle("is-active", backdropImage === image);
  });
  cityBackdrop.classList.remove("has-no-image");
}

function renderCityBackdrop(cityId) {
  const selectedBackdrop = cityBackdropImages.find((image) => image.dataset.cityBackdrop === cityId);

  if (selectedBackdrop && !selectedBackdrop.dataset.failed) {
    if (selectedBackdrop.complete && selectedBackdrop.naturalWidth === 0) {
      selectedBackdrop.dataset.failed = "true";
    } else {
      setActiveBackdrop(selectedBackdrop);
      return;
    }
  }

  if (fallbackBackdrop && !fallbackBackdrop.dataset.failed) {
    if (fallbackBackdrop.complete && fallbackBackdrop.naturalWidth === 0) {
      fallbackBackdrop.dataset.failed = "true";
    } else {
      setActiveBackdrop(fallbackBackdrop);
      return;
    }
  }

  cityBackdropImages.forEach((image) => image.classList.remove("is-active"));
  cityBackdrop.classList.add("has-no-image");
}

function handleBackdropError(event) {
  const failedImage = event.currentTarget;
  failedImage.dataset.failed = "true";

  if (failedImage === fallbackBackdrop) {
    if (!cityBackdropImages.some((image) => image !== fallbackBackdrop && image.classList.contains("is-active"))) {
      fallbackBackdrop.classList.remove("is-active");
      cityBackdrop.classList.add("has-no-image");
      showNotice("Không thể tải ảnh phong cảnh dự phòng; đang dùng nền màu để giữ nội dung dễ đọc.", "error");
    }
    return;
  }

  if (failedImage.classList.contains("is-active")) {
    renderCityBackdrop(selectedCityId);
    showNotice("Không thể tải ảnh của thành phố này; đã chuyển sang ảnh dự phòng.", "error");
  }
}

cityBackdropImages.forEach((image) => {
  image.addEventListener("error", handleBackdropError);
  if (image.complete && image.naturalWidth === 0) {
    handleBackdropError({ currentTarget: image });
  }
});

function normalizeVietnamese(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi");
}

function getFilteredItinerary() {
  const searchTerm = normalizeVietnamese(searchInput.value.trim());
  let visiblePlaces = itinerary.filter((place) => normalizeVietnamese(place.title).includes(searchTerm));

  if (statusFilter.value === "pending") {
    visiblePlaces = visiblePlaces.filter((place) => !place.visited);
  } else if (statusFilter.value === "visited") {
    visiblePlaces = visiblePlaces.filter((place) => place.visited);
  }

  visiblePlaces.sort((first, second) => {
    const comparison = first.title.localeCompare(second.title, "vi", { sensitivity: "base" });
    return sortOrder.value === "desc" ? -comparison : comparison;
  });

  return visiblePlaces;
}

function formatVisitTime(value) {
  const visitDate = new Date(value);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(visitDate);
}

function createItineraryItem(place) {
  const item = document.createElement("article");
  item.className = "itinerary-item";

  const main = document.createElement("div");
  main.className = "itinerary-item__main";

  const title = document.createElement("h3");
  title.className = "itinerary-item__title";
  title.textContent = place.title;
  title.classList.toggle("is-visited", place.visited);

  const status = document.createElement("span");
  status.className = "itinerary-item__status";
  status.classList.toggle("is-visited", place.visited);
  status.textContent = place.visited ? "Đã đến" : "Chưa đến";

  const time = document.createElement("p");
  time.className = "itinerary-item__time";
  time.textContent = `◷  ${formatVisitTime(place.visitTime)}`;
  main.append(title, status, time);

  const actions = document.createElement("div");
  actions.className = "itinerary-item__actions";

  const statusButton = document.createElement("button");
  statusButton.className = "status-button";
  statusButton.type = "button";
  statusButton.dataset.action = "toggle";
  statusButton.dataset.id = place.id;
  statusButton.textContent = place.visited ? "Hoàn tác" : "Đánh dấu đã đến";
  statusButton.setAttribute("aria-label", place.visited ? `Đánh dấu ${place.title} là chưa đến` : `Đánh dấu ${place.title} là đã đến`);
  statusButton.setAttribute("aria-pressed", String(place.visited));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = place.id;
  deleteButton.textContent = "×";
  deleteButton.setAttribute("aria-label", `Xóa ${place.title}`);

  actions.append(statusButton, deleteButton);
  item.append(main, actions);
  return item;
}

function renderItinerary() {
  const visiblePlaces = getFilteredItinerary();
  const pageSize = pageSizeSelect.value === "all" ? visiblePlaces.length : Number(pageSizeSelect.value);
  const totalPages = pageSize > 0 ? Math.ceil(visiblePlaces.length / pageSize) : 0;

  if (totalPages > 0) {
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
  } else {
    currentPage = 1;
  }

  const startIndex = pageSizeSelect.value === "all" ? 0 : (currentPage - 1) * pageSize;
  const pagePlaces = pageSizeSelect.value === "all"
    ? visiblePlaces
    : visiblePlaces.slice(startIndex, startIndex + pageSize);

  itineraryList.replaceChildren();

  if (itinerary.length === 0) {
    itineraryList.append(createEmptyState("⌖", "Chuyến đi bắt đầu từ đây", "Thêm địa điểm đầu tiên để tạo lịch trình của riêng bạn."));
    resultCount.textContent = "0 địa điểm";
    pagination.hidden = true;
    return;
  }

  if (visiblePlaces.length === 0) {
    itineraryList.append(createEmptyState("⌕", "Không tìm thấy địa điểm", "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."));
    resultCount.textContent = `0 / ${itinerary.length} địa điểm`;
    pagination.hidden = true;
    return;
  }

  for (const place of pagePlaces) {
    itineraryList.append(createItineraryItem(place));
  }

  const visibleStart = startIndex + 1;
  const visibleEnd = startIndex + pagePlaces.length;
  resultCount.textContent = `Hiển thị ${visibleStart}–${visibleEnd} / ${visiblePlaces.length} địa điểm`;
  pagination.hidden = totalPages <= 1;
  pageIndicator.textContent = `Trang ${currentPage} / ${totalPages}`;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= totalPages;
}

function createEmptyState(icon, title, description) {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";

  const iconElement = document.createElement("span");
  iconElement.className = "empty-state__icon";
  iconElement.setAttribute("aria-hidden", "true");
  iconElement.textContent = icon;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const message = document.createElement("p");
  message.textContent = description;
  emptyState.append(iconElement, heading, message);
  return emptyState;
}

function createId() {
  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

citySelect.addEventListener("change", () => {
  selectedCityId = citySelect.value;
  renderWeather();
  saveSelectedCity();
});

itineraryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = placeTitleInput.value.trim();
  const visitTime = visitTimeInput.value;

  if (!title) {
    setFormHint("Vui lòng nhập tên địa điểm.", true);
    placeTitleInput.focus();
    return;
  }

  if (!visitTime || Number.isNaN(Date.parse(visitTime))) {
    setFormHint("Vui lòng chọn ngày và giờ ghé thăm hợp lệ.", true);
    visitTimeInput.focus();
    return;
  }

  itinerary.unshift({
    id: createId(),
    title,
    visitTime,
    visited: false
  });
  currentPage = 1;
  renderItinerary();
  const saved = saveItinerary();
  itineraryForm.reset();
  setFormHint("Chọn ngày và giờ dự kiến cho điểm dừng chân.");
  placeTitleInput.focus();

  if (saved) {
    showNotice(`Đã thêm “${title}” vào lịch trình.`, "success");
  }
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderItinerary();
});

for (const control of [statusFilter, sortOrder, pageSizeSelect]) {
  control.addEventListener("change", () => {
    currentPage = 1;
    renderItinerary();
  });
}

itineraryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const placeIndex = itinerary.findIndex((place) => place.id === button.dataset.id);
  if (placeIndex === -1) {
    return;
  }

  if (button.dataset.action === "toggle") {
    itinerary[placeIndex].visited = !itinerary[placeIndex].visited;
    renderItinerary();
    saveItinerary();
    return;
  }

  if (button.dataset.action === "delete") {
    const item = button.closest(".itinerary-item");
    const deletedTitle = itinerary[placeIndex].title;
    itinerary = itinerary.filter((place) => place.id !== button.dataset.id);
    const saved = saveItinerary();
    item.classList.add("is-removing");
    item.animate(
      [{ opacity: 1, transform: "translateX(0)", maxHeight: "90px" }, { opacity: 0, transform: "translateX(10px)", maxHeight: "0", marginBlock: "0", paddingBlock: "0" }],
      { duration: 180, easing: "ease-in", fill: "forwards" }
    ).finished.then(() => {
      renderItinerary();
      if (saved) {
        showNotice(`Đã xóa “${deletedTitle}” khỏi lịch trình.`, "success");
      }
    }).catch(() => {
      renderItinerary();
    });
  }
});

previousPageButton.addEventListener("click", () => {
  currentPage -= 1;
  renderItinerary();
});

nextPageButton.addEventListener("click", () => {
  currentPage += 1;
  renderItinerary();
});

renderWeather();
renderItinerary();

const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initMessages();
  updateAuthUI();

  const page = document.body.dataset.page;

  if (page === "home") {
    initHomePage();
  }

  if (page === "login") {
    initAuthPage();
  }
});

function initSmoothScroll() {
  document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.scrollTarget;
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${targetId}`);
    });
  });
}

function initMessages() {
  const hashTarget = window.location.hash.replace("#", "");
  if (hashTarget) {
    const element = document.getElementById(hashTarget);
    if (element) {
      window.setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }
}

function showMessage(text, type = "info") {
  const messageBox = document.getElementById("message-box");

  if (!messageBox) {
    return;
  }

  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.hidden = false;
}

function clearMessage() {
  const messageBox = document.getElementById("message-box");

  if (!messageBox) {
    return;
  }

  messageBox.textContent = "";
  messageBox.className = "message";
  messageBox.hidden = true;
}

function initHomePage() {
  const formSection = document.getElementById("form-section");
  const carForm = document.getElementById("car-form");
  const carsList = document.getElementById("cars-list");

  initCarFormFields();

  document.querySelectorAll("[data-open-form]").forEach((button) => {
    button.addEventListener("click", () => {
      showForm(formSection);
      resetCarForm();
      showMessage("Le formulaire est pret pour la prochaine etape.", "success");
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleStaticAction(button));
  });

  carsList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button || !carsList.contains(button)) {
      return;
    }

    handleStaticAction(button);
  });

  document.querySelectorAll("[data-close-details]").forEach((element) => {
    element.addEventListener("click", closeDetails);
  });

  document.querySelector("[data-cancel-edit]")?.addEventListener("click", () => {
    resetCarForm();
    formSection?.classList.add("is-hidden");
    showMessage("Modification annul\u00e9e.", "warning");
  });

  carForm?.addEventListener("submit", handleCarFormSubmit);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetails();
    }
  });

  if (carsList) {
    loadCars();
  }
}

async function handleStaticAction(button) {
  const action = button.dataset.action;
  const card = button.closest("[data-car-card]");

  if (action === "details") {
    openDetails(card);
    return;
  }

  if (action === "vote") {
    await handleVote(card, button);
    return;
  }

  if (action === "edit") {
    handleEditCar(card);
    return;
  }

  if (action === "delete") {
    await handleDeleteCar(card);
  }
}

function initCarFormFields() {
  ["car-brand", "car-price", "car-speed", "car-description"].forEach((id) => {
    document.getElementById(id)?.removeAttribute("required");
  });
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    return null;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

function requireActionAuth() {
  const headers = getAuthHeaders();

  if (!headers) {
    showMessage("Vous devez \u00eatre connect\u00e9 pour effectuer cette action.", "warning");
    return null;
  }

  return headers;
}

async function handleCarFormSubmit(event) {
  event.preventDefault();

  const headers = requireActionAuth();

  if (!headers) {
    return;
  }

  const payload = getCarFormPayload();

  if (!payload.name) {
    showMessage("Veuillez saisir le nom de la voiture.", "warning");
    return;
  }

  const carId = getInputValue("car-id");
  const editing = Boolean(carId);
  const endpoint = editing ? `${API_BASE_URL}/cars/${carId}` : `${API_BASE_URL}/cars`;
  const method = editing ? "PUT" : "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      resetCarForm();
      await loadCars();
      showMessage(editing ? "Voiture modifi\u00e9e avec succ\u00e8s." : "Voiture ajout\u00e9e avec succ\u00e8s.", "success");
      return;
    }

    if (response.status === 401) {
      showMessage("Vous devez \u00eatre connect\u00e9 pour effectuer cette action.", "warning");
      return;
    }

    if (response.status === 404) {
      showMessage(data.message || "Voiture introuvable.", "error");
      return;
    }

    if (response.status === 400) {
      showMessage(data.message || "Veuillez saisir le nom de la voiture.", "warning");
      return;
    }

    showMessage("Une erreur est survenue.", "error");
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

function getCarFormPayload() {
  return {
    name: getInputValue("car-name"),
    brand: emptyToNull(getInputValue("car-brand")),
    price: numberOrNull(getInputValue("car-price")),
    speed: numberOrNull(getInputValue("car-speed")),
    description: emptyToNull(getInputValue("car-description")),
    image_url: emptyToNull(getInputValue("car-image"))
  };
}

function getInputValue(id) {
  const value = document.getElementById(id)?.value;
  return value === undefined || value === null ? "" : String(value).trim();
}

function emptyToNull(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? null : text;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

function handleEditCar(card) {
  const headers = requireActionAuth();

  if (!headers || !card) {
    return;
  }

  fillFormFromCard(card);
  showMessage("Modification de la voiture s\u00e9lectionn\u00e9e.", "success");
}

async function handleDeleteCar(card) {
  const headers = requireActionAuth();
  const carId = card?.dataset.id;

  if (!headers) {
    return;
  }

  if (!carId) {
    showMessage("Voiture introuvable.", "error");
    return;
  }

  if (!window.confirm("Supprimer cette voiture ?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
      method: "DELETE",
      headers
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      await loadCars();
      showMessage("Voiture supprim\u00e9e avec succ\u00e8s.", "success");
      return;
    }

    if (response.status === 401) {
      showMessage("Vous devez \u00eatre connect\u00e9 pour effectuer cette action.", "warning");
      return;
    }

    if (response.status === 404) {
      showMessage(data.message || "Voiture introuvable.", "error");
      return;
    }

    showMessage("Une erreur est survenue.", "error");
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

async function handleVote(card, button) {
  const token = getToken();
  const carId = card?.dataset.id;

  if (!token) {
    showMessage("Vous devez \u00eatre connect\u00e9 pour voter.", "warning");
    return;
  }

  if (!carId) {
    showMessage("Voiture introuvable.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}/vote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 201) {
      showMessage("Vote enregistr\u00e9 avec succ\u00e8s.", "success");
      await refreshCarVotes(card);
      disableVoteButton(button);
      return;
    }

    if (response.status === 401) {
      showMessage("Vous devez \u00eatre connect\u00e9 pour voter.", "warning");
      return;
    }

    if (response.status === 409) {
      showMessage("Vous avez d\u00e9j\u00e0 vot\u00e9 pour cette voiture.", "warning");
      await refreshCarVotes(card);
      disableVoteButton(button);
      return;
    }

    if (response.status === 404) {
      showMessage("Voiture introuvable.", "error");
      return;
    }

    showMessage("Une erreur est survenue.", "error");
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

function disableVoteButton(button) {
  if (!button) {
    return;
  }

  button.disabled = true;
  button.textContent = "D\u00e9j\u00e0 vot\u00e9";
  button.setAttribute("aria-disabled", "true");
}

async function refreshCarVotes(card) {
  const carId = card?.dataset.id;

  if (!card || !carId) {
    return;
  }

  try {
    const votes = await getCarVotes(carId, { throwOnError: true });
    updateCarVotes(card, votes);
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

function updateCarVotes(card, votesCount) {
  const formattedVotes = formatVotes(votesCount);
  const voteValue = card.querySelector(".vote-count strong");
  const details = document.getElementById("car-details");

  card.dataset.votes = formattedVotes;

  if (voteValue) {
    voteValue.textContent = formattedVotes;
  }

  if (details?.dataset.carId === card.dataset.id) {
    document.getElementById("details-votes").textContent = formattedVotes;
  }
}

async function loadCars() {
  const carsList = document.getElementById("cars-list");

  if (!carsList) {
    return;
  }

  showMessage("Chargement des voitures...", "info");

  try {
    const response = await fetch(`${API_BASE_URL}/cars`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error("\u00c9chec de la requ\u00eate des voitures");
    }

    const cars = Array.isArray(data.cars) ? data.cars : [];

    if (cars.length === 0) {
      carsList.innerHTML = "";
      showMessage("Aucune voiture disponible.", "warning");
      return;
    }

    const carsWithVotes = await Promise.all(
      cars.map(async (car) => ({
        ...car,
        votes: await getCarVotes(car.id)
      }))
    );

    renderCars(carsWithVotes);
    clearMessage();
  } catch (error) {
    carsList.innerHTML = "";
    showMessage("Impossible de charger les voitures.", "error");
  }
}

async function getCarVotes(carId, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${carId}/votes`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (options.throwOnError) {
        throw new Error("\u00c9chec de la requ\u00eate des votes");
      }

      return 0;
    }

    return Number.isFinite(Number(data.votes)) ? Number(data.votes) : 0;
  } catch (error) {
    if (options.throwOnError) {
      throw error;
    }

    return 0;
  }
}

function renderCars(cars) {
  const carsList = document.getElementById("cars-list");

  if (!carsList) {
    return;
  }

  carsList.innerHTML = "";
  cars.forEach((car) => {
    carsList.appendChild(createCarCard(car));
  });
}

function createCarCard(car) {
  const card = document.createElement("article");
  card.className = "car-card";
  card.dataset.carCard = "";
  card.dataset.id = car.id;
  card.dataset.name = car.name || "";
  card.dataset.brand = car.brand || "";
  card.dataset.price = formatPrice(car.price);
  card.dataset.speed = formatSpeed(car.speed);
  card.dataset.rawPrice = car.price ?? "";
  card.dataset.rawSpeed = car.speed ?? "";
  card.dataset.description = car.description || "";
  card.dataset.imageUrl = car.image_url || "";
  card.dataset.votes = formatVotes(car.votes);

  const imageWrap = document.createElement("div");
  imageWrap.className = "car-image";

  const image = document.createElement("img");
  image.src = car.image_url || "assets/logo.png";
  image.alt = car.name || "Voiture Santos Car";
  imageWrap.appendChild(image);

  const speedChip = document.createElement("span");
  speedChip.className = "speed-chip";
  speedChip.appendChild(createIcon("bolt"));
  speedChip.appendChild(document.createTextNode(formatSpeed(car.speed)));
  imageWrap.appendChild(speedChip);

  const body = document.createElement("div");
  body.className = "car-body";

  const brand = document.createElement("p");
  brand.className = "car-brand";
  brand.textContent = car.brand || "Santos Car";
  body.appendChild(brand);

  const title = document.createElement("h3");
  title.textContent = car.name || "Voiture Santos Car";
  body.appendChild(title);

  const description = document.createElement("p");
  description.className = "car-summary";
  description.textContent = shortDescription(car.description);
  body.appendChild(description);

  const meta = document.createElement("div");
  meta.className = "car-meta";
  meta.appendChild(createPriceMeta(car.price));
  meta.appendChild(createVotesMeta(car.votes));
  body.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "card-actions";
  actions.appendChild(createActionButton("button ghost", "details", "D\u00e9tails"));
  actions.appendChild(createActionButton("button secondary", "vote", "Voter", "thumb_up"));
  actions.appendChild(createActionButton("button ghost", "edit", "Modifier"));
  actions.appendChild(createActionButton("button danger", "delete", "Supprimer"));
  body.appendChild(actions);

  card.appendChild(imageWrap);
  card.appendChild(body);

  return card;
}

function createIcon(name) {
  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = name;
  return icon;
}

function createPriceMeta(price) {
  const priceMeta = document.createElement("div");
  const label = document.createElement("span");
  const value = document.createElement("strong");

  label.textContent = "Prix";
  value.textContent = formatPrice(price);
  priceMeta.appendChild(label);
  priceMeta.appendChild(value);

  return priceMeta;
}

function createVotesMeta(votesCount) {
  const votes = document.createElement("div");
  votes.className = "vote-count";
  const value = document.createElement("strong");

  votes.appendChild(createIcon("favorite"));
  value.textContent = formatVotes(votesCount);
  votes.appendChild(value);

  return votes;
}

function createActionButton(className, action, label, iconName) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.dataset.action = action;

  if (iconName) {
    button.appendChild(createIcon(iconName));
  }

  button.appendChild(document.createTextNode(label));
  return button;
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Prix non renseign\u00e9";
  }

  return `${Number(price).toLocaleString("en-US")}$`;
}

function formatSpeed(speed) {
  if (speed === null || speed === undefined || speed === "") {
    return "Vitesse non renseign\u00e9e";
  }

  return `${Number(speed)} km/h`;
}

function formatVotes(votesCount) {
  const votes = Number(votesCount);
  return `Votes : ${Number.isFinite(votes) ? votes : 0}`;
}

function shortDescription(description = "") {
  const text = description.trim();

  if (!text) {
    return "Description bient\u00f4t disponible.";
  }

  return text.length > 96 ? `${text.slice(0, 93)}...` : text;
}

function openDetails(card) {
  const details = document.getElementById("car-details");

  if (!details || !card) {
    return;
  }

  const image = card.querySelector(".car-image img");
  const name = card.dataset.name || "Voiture Santos Car";
  const brand = card.dataset.brand || "Santos Car";
  const price = card.dataset.price || "";
  const speed = card.dataset.speed || "";
  const votes = card.dataset.votes || "Votes : bient\u00f4t disponible";
  const description = card.dataset.description || "Description bient\u00f4t disponible.";

  details.dataset.carId = card.dataset.id || "";
  document.getElementById("details-image").src = image?.getAttribute("src") || "assets/logo.png";
  document.getElementById("details-image").alt = name;
  document.getElementById("details-brand").textContent = brand;
  document.getElementById("details-title").textContent = name;
  document.getElementById("details-price").textContent = price;
  document.getElementById("details-speed").textContent = speed;
  document.getElementById("details-votes").textContent = votes;
  document.getElementById("details-description").textContent = description;

  details.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
}

function closeDetails() {
  const details = document.getElementById("car-details");

  if (!details) {
    return;
  }

  details.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function fillFormFromCard(card) {
  const formSection = document.getElementById("form-section");

  if (!card) {
    return;
  }

  showForm(formSection);
  document.getElementById("car-id").value = card.dataset.id || "";
  document.getElementById("car-name").value = card.dataset.name || "";
  document.getElementById("car-brand").value = card.dataset.brand || "";
  document.getElementById("car-price").value = card.dataset.rawPrice || "";
  document.getElementById("car-speed").value = card.dataset.rawSpeed || "";
  document.getElementById("car-description").value = card.dataset.description || "";
  document.getElementById("car-image").value = card.dataset.imageUrl || "";
  updateCarFormMode(true);
}

function showForm(formSection) {
  if (!formSection) {
    return;
  }

  formSection.classList.remove("is-hidden");
  formSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetCarForm() {
  const form = document.getElementById("car-form");

  if (!form) {
    return;
  }

  form.reset();
  document.getElementById("car-id").value = "";
  updateCarFormMode(false);
}

function updateCarFormMode(editing) {
  const submitButton = document.querySelector("#car-form button[type='submit']");

  if (submitButton) {
    submitButton.textContent = editing ? "Enregistrer" : "Ajouter une voiture";
  }
}

function cleanNumber(value = "") {
  const number = value.replace(/[^0-9]/g, "");
  return number ? Number(number) : "";
}

function getToken() {
  return localStorage.getItem("santosToken");
}

function getUser() {
  const storedUser = localStorage.getItem("santosUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("santosUser");
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken());
}

function updateAuthUI() {
  const loggedIn = isLoggedIn();
  const user = getUser();

  document.querySelectorAll("[data-auth-visible]").forEach((element) => {
    const mode = element.dataset.authVisible;
    element.hidden = (mode === "logged-in" && !loggedIn) || (mode === "logged-out" && loggedIn);
  });

  document.querySelectorAll("[data-auth-username]").forEach((element) => {
    element.textContent = loggedIn && user?.username ? user.username : "";
  });

  document.querySelectorAll("[data-logout]").forEach((button) => {
    if (button.dataset.logoutReady === "true") {
      return;
    }

    button.dataset.logoutReady = "true";
    button.addEventListener("click", handleLogout);
  });
}

function handleLogout() {
  localStorage.removeItem("santosToken");
  localStorage.removeItem("santosUser");
  updateAuthUI();
  showMessage("D\u00e9connexion r\u00e9ussie.", "success");
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

function initAuthPage() {
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
  });

  document.getElementById("register-form")?.addEventListener("submit", handleRegisterSubmit);
  document.getElementById("login-form")?.addEventListener("submit", handleLoginSubmit);
}

async function handleRegisterSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("register-username")?.value.trim();
  const email = document.getElementById("register-email")?.value.trim();
  const password = document.getElementById("register-password")?.value;

  if (!username || !email || !password) {
    showMessage("Veuillez remplir tous les champs.", "warning");
    return;
  }

  try {
    const result = await postJson("/register", { username, email, password });

    if (result.ok) {
      event.target.reset();
      showMessage("Inscription r\u00e9ussie. Vous pouvez maintenant vous connecter.", "success");
      return;
    }

    if (result.status === 409) {
      showMessage(result.data.message || "Cet utilisateur existe d\u00e9j\u00e0.", "warning");
      return;
    }

    showMessage(result.data.message || "Une erreur est survenue.", "error");
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const identifier = document.getElementById("login-identifier")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!identifier || !password) {
    showMessage("Veuillez remplir tous les champs.", "warning");
    return;
  }

  try {
    const result = await postJson("/login", { identifier, password });

    if (result.ok && result.data.token) {
      localStorage.setItem("santosToken", result.data.token);

      if (result.data.user) {
        localStorage.setItem("santosUser", JSON.stringify(result.data.user));
      }

      updateAuthUI();
      showMessage("Connexion r\u00e9ussie.", "success");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
      return;
    }

    showMessage("Identifiants incorrects.", "error");
  } catch (error) {
    showMessage("Une erreur est survenue.", "error");
  }
}

function switchAuthTab(target) {
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    const active = tab.dataset.authTab === target;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.classList.toggle("is-hidden", form.dataset.authForm !== target);
  });

  clearMessage();
}

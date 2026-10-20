// Shelter/type controls and pet cards are rendered from shelterData.js.
const shelterSelect = document.getElementById("shelterSelect");
const typeSection = document.getElementById("petTypeSection");
const petGrid = document.getElementById("petGrid");
const typeButtons = [...document.querySelectorAll(".pet-type-buttons button")];
const typeMap = { All: null, Cats: "Cat", Dogs: "Dog", Birds: "Bird", Reptiles: "Reptile", Other: "Other" };
let selectedShelter = null;
let selectedType = "All";

shelters.forEach((shelter) => {
  const option = document.createElement("option");
  option.value = shelter.id;
  option.textContent = `${shelter.name} (${shelter.city})`;
  shelterSelect.appendChild(option);
});

function renderPets() {
  petGrid.replaceChildren();
  if (!selectedShelter) return;
  const wantedType = typeMap[selectedType];
  const visiblePets = selectedShelter.pets.filter((pet) => !wantedType || pet.type === wantedType || (wantedType === "Bird" && pet.type === "Parrot"));
  visiblePets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "pet-card";
    const image = document.createElement("img");
    image.className = "pet-img";
    image.src = pet.image;
    image.alt = pet.name;
    // Some supplied data filenames are not in the provided image folder.
    image.addEventListener("error", () => { image.src = "images/dog1.jpg"; }, { once: true });
    const name = document.createElement("h3");
    name.textContent = pet.name;
    const details = document.createElement("button");
    details.type = "button";
    details.textContent = "View Details";
    details.addEventListener("click", () => {
      window.location.href = `pet.html?id=${encodeURIComponent(pet.id)}&shelter=${encodeURIComponent(selectedShelter.id)}`;
    });
    card.append(image, name, details);
    petGrid.appendChild(card);
  });
}

function updateTypeButtons() {
  const availableTypes = new Set(selectedShelter.pets.map((pet) => pet.type));
  typeButtons.forEach((button) => {
    const category = typeMap[button.dataset.type];
    const hasMatchingPets = button.dataset.type === "All" || availableTypes.has(category) || (button.dataset.type === "Birds" && availableTypes.has("Parrot"));
    button.disabled = !hasMatchingPets;
    button.classList.toggle("active", button.dataset.type === selectedType);
    button.setAttribute("aria-pressed", String(button.dataset.type === selectedType));
  });
}

shelterSelect.addEventListener("change", () => {
  selectedShelter = shelters.find((shelter) => shelter.id === shelterSelect.value) || null;
  typeSection.hidden = !selectedShelter;
  selectedType = "All";
  updateTypeButtons();
  renderPets();
});

typeButtons.forEach((button) => button.addEventListener("click", () => {
  if (!selectedShelter || button.disabled) return;
  selectedType = button.dataset.type;
  updateTypeButtons();
  renderPets();
}));

// Returning from Pet Details restores that shelter. A direct Browse navigation has no query string.
const requestedShelter = new URLSearchParams(window.location.search).get("shelter");
if (requestedShelter && shelters.some((shelter) => shelter.id === requestedShelter)) {
  shelterSelect.value = requestedShelter;
  shelterSelect.dispatchEvent(new Event("change"));
}

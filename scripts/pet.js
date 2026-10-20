// Read the selected pet and shelter from the URL and render their details.
const params = new URLSearchParams(window.location.search);
const petId = params.get("id");
const shelterId = params.get("shelter");
const shelter = shelters.find((item) => item.id === shelterId);
const pet = shelter?.pets.find((item) => item.id === petId);
const detailsHost = document.getElementById("petDetails");
const backLink = document.getElementById("backLink");

if (!pet || !shelter) {
  detailsHost.textContent = "That pet could not be found. Please choose a pet from the browse page.";
} else {
  backLink.href = `browse.html?shelter=${encodeURIComponent(shelter.id)}`;
  const image = document.createElement("img");
  image.className = "pet-img";
  image.src = pet.image;
  image.alt = pet.name;
  image.addEventListener("error", () => { image.src = "images/dog1.jpg"; }, { once: true });
  const heading = document.createElement("h2");
  heading.textContent = pet.name;
  const block = document.createElement("div");
  block.className = "detail-block";
  const total = pet.adoptionFee + shelter.processingFee;
  const rows = [
    ["Age & Breed", `${pet.age} year old ${pet.breed} (${pet.type})`],
    ["Health", pet.health],
    ["Traits", pet.traits.join(", ")],
    ["Days at Shelter", `${pet.daysAtShelter} days`],
    ["Adoption Fee", `$${pet.adoptionFee}`],
    ["Shelter Processing Fee", `$${shelter.processingFee}`],
    ["Total (before taxes)", `$${total}`]
  ];
  rows.forEach(([label, value]) => {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value));
    block.appendChild(paragraph);
  });
  const apply = document.createElement("button");
  apply.type = "button";
  apply.textContent = "Apply to Adopt this Pet";
  apply.addEventListener("click", () => {
    const query = new URLSearchParams({ petId: pet.id, petName: pet.name, petType: pet.type, petBreed: pet.breed, adoptionFee: pet.adoptionFee, processingFee: shelter.processingFee });
    window.location.href = `apply.html?${query.toString()}`;
  });
  detailsHost.append(image, heading, block, apply);
}

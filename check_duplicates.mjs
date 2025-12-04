
import cities from "./ecuador_cities.json" assert { type: "json" };

const ids = new Set();
const duplicates = [];

cities.forEach(city => {
  const id = `${city.province}-${city.name}`
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  if (ids.has(id)) {
    duplicates.push({ id, city });
  } else {
    ids.add(id);
  }
});

if (duplicates.length > 0) {
  console.log("Found duplicates:", duplicates);
} else {
  console.log("No duplicates found.");
}

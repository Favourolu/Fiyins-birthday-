// The guest list has 18 entries, but "Idowu" and "idowu" are the same name
// typed twice with different casing — since usernames must be unique, the
// second one is disambiguated as idowu2123 (see build notes).
const PARTICIPANT_NAMES = [
  "Fiyin",
  "chiamaka",
  "Anne",
  "pelumi",
  "Eniola",
  "pipe",
  "ore",
  "deo",
  "delight",
  "prisca",
  "Favour",
  "Idowu",
  "Alex",
  "Serah",
  "Anjola",
  "chioma",
  "murewa",
  "idowu",
  "Ranti",
];

const seen = new Map();
const PARTICIPANTS = PARTICIPANT_NAMES.map((name) => {
  const base = name.toLowerCase();
  const count = (seen.get(base) || 0) + 1;
  seen.set(base, count);
  const username = count === 1 ? `${base}123` : `${base}${count}123`;
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return { username, displayName: count === 1 ? name : `${capitalized} ${count}` };
});

const SHARED_PASSWORD = "Fiyin@22";

module.exports = { PARTICIPANTS, SHARED_PASSWORD };

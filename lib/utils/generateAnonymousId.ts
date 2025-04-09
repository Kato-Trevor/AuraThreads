export function generateAnonymousUsername() {
  const adjectives = [
    "Calm", "Witty", "Silent", "Brave", "Gentle", "Bright", "Swift", "Clever", "Chill", "Wise"
  ];

  const animals = [
    "Koala", "Fox", "Panda", "Owl", "Tiger", "Dolphin", "Wolf", "Otter", "Lynx", "Eagle"
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNumber = Math.floor(100 + Math.random() * 900);

  return `${randomAdjective}${randomAnimal}${randomNumber}`;
}
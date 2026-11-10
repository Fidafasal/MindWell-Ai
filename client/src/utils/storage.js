const CHECKINS_KEY = "mindwell_checkins";

export function getCheckins() {
  try {
    const savedData = localStorage.getItem(CHECKINS_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error("Could not load check-ins:", error);
    return [];
  }
}

export function saveCheckin(checkin) {
  const checkins = getCheckins();

  const newCheckin = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...checkin,
    createdAt: new Date().toISOString(),
  };

  const updatedCheckins = [...checkins, newCheckin];

  localStorage.setItem(
    CHECKINS_KEY,
    JSON.stringify(updatedCheckins)
  );

  return updatedCheckins;
}
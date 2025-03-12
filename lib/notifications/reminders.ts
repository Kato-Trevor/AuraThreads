import * as SecureStore from "expo-secure-store";

interface Reminder {
  id: string;
  type: string;
  dueDate: string;
}

const REMINDERS_KEY = "reminders";

const saveData = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving data:", error);
    throw new Error("Failed to save data");
  }
};

const loadData = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
};

export const saveReminders = async (reminders: Reminder[]): Promise<void> => {
  const data = JSON.stringify(reminders);
  await saveData(REMINDERS_KEY, data);
};

export const loadReminders = async (): Promise<Reminder[]> => {
  const data = await loadData(REMINDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addReminder = async (reminder: Reminder): Promise<Reminder> => {
  const reminders = await loadReminders();
  reminders.push(reminder);
  await saveReminders(reminders);
  return reminder;
};

export const editReminder = async (reminder: Reminder): Promise<Reminder> => {
  const reminders = await loadReminders();
  const index = reminders.findIndex((r) => r.id === reminder.id);

  if (index !== -1) {
    reminders[index] = reminder;
    await saveReminders(reminders);
    return reminder;
  } else {
    throw new Error("Reminder not found");
  }
};

export const removeReminder = async (id: string): Promise<Reminder[]> => {
  const reminders = await loadReminders();
  const updatedReminders = reminders.filter((r) => r.id !== id);
  await saveReminders(updatedReminders);
  return updatedReminders;
};

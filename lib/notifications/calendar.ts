import * as Calendar from "expo-calendar";
import { Platform, Alert } from "react-native";

const getOrCreateCalendarId = async (): Promise<string> => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const calendar = calendars.find((cal) => cal.title === "AuraThreads");

  if (calendar) {
    return calendar.id;
  }

  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar", type: "LOCAL" };

  const newCalendarId = await Calendar.createCalendarAsync({
    title: "AuraThreads",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId:
      "id" in defaultCalendarSource ? defaultCalendarSource.id : undefined,
    source: defaultCalendarSource,
    name: "AuraThreads",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  if (!newCalendarId) {
    throw new Error("Failed to create a new calendar.");
  }

  return newCalendarId;
};

export const addDatesToCalendar = async (
  events: { title: string; date: string; description: string }[]
) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Calendar permissions not granted");
      return;
    }

    const calendarId = await getOrCreateCalendarId();

    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear() + 50,
      startDate.getMonth()
    );
    const existingEvents = await Calendar.getEventsAsync(
      [calendarId],
      startDate,
      endDate
    );

    for (const event of events) {
      const eventDate = new Date(event.date);

      if (isNaN(eventDate.getTime())) {
        continue;
      }

      const existingEvent = existingEvents.find(
        (existingEvent) => existingEvent.title === event.title
      );

      if (existingEvent) {
        const isSameEvent =
          new Date(existingEvent.startDate).getTime() === eventDate.getTime() &&
          existingEvent.notes === event.description;

        if (!isSameEvent) {
          await Calendar.updateEventAsync(existingEvent.id, {
            title: event.title,
            startDate: eventDate,
            endDate: new Date(eventDate.getTime() + 60 * 60 * 1000 * 12),
            notes: event.description,
            // timeZone: timezone,
          });
        }
      } else {
        await Calendar.createEventAsync(calendarId, {
          title: event.title,
          startDate: eventDate,
          endDate: new Date(eventDate.getTime() + 60 * 60 * 1000 * 12),
          notes: event.description,
          // timeZone: timezone,
        });
      }
    }
  } catch (error: any) {
    if (error.message.includes("account does not allow calendars")) {
      throw new Error(
        "The account you're trying to use does not allow calendars to be added or modified. Please check your account settings."
      );
    } else {
      throw new Error(`Error adding events to the calendar: ${error.message}`);
    }
  }
};

export const getEventsFromCalendar = async () => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      return [];
    }

    const calendarId = await getOrCreateCalendarId();
    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear() + 50,
      startDate.getMonth()
    );
    const events = await Calendar.getEventsAsync(
      [calendarId],
      startDate,
      endDate
    );

    return events;
  } catch (error: any) {
    throw new Error(
      `Error fetching events from the calendar: ${error.message}`
    );
  }
};

const getDefaultCalendarSource = async () => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendar = calendars.find(
    (cal) => cal.source && cal.source.name === "Default"
  );
  return defaultCalendar?.source || calendars[0].source;
};

export const removeEventsFromCalendar = async (eventTitles: string[]) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Calendar permissions not granted");
      return;
    }

    const calendarId = await getOrCreateCalendarId();

    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear() + 50,
      startDate.getMonth()
    );
    const existingEvents = await Calendar.getEventsAsync(
      [calendarId],
      startDate,
      endDate
    );

    for (const title of eventTitles) {
      const eventToDelete = existingEvents.find(
        (existingEvent) => existingEvent.title === title
      );

      if (eventToDelete) {
        await Calendar.deleteEventAsync(eventToDelete.id);
      }
    }
  } catch (error: any) {
    if (error.message.includes("account does not allow calendars")) {
      throw new Error(
        "The account you're trying to use does not allow calendars to be added or modified. Please check your account settings."
      );
    } else {
      throw new Error(
        `Error removing events from the calendar: ${error.message}`
      );
    }
  }
};

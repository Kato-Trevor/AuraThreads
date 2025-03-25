export const formatTopic = (topic: string): string => {
  return topic
    .replace(/[^a-zA-Z\s]/g, "") // Remove emojis and special characters
    .replace(/\s+/g, "") // Remove spaces
    .trim(); // Remove leading/trailing whitespace
};
import { parse } from "date-fns";

export const convertDates = (dates: string[]) => {
  const monthMap: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  return dates.map((date) => {
    const parts = date.replace(",", "").split(" ");
    const month = monthMap[parts[0]];
    const day = parts[1].replace(/(st|nd|rd|th)/, "").padStart(2, "0");
    const year = parts[2];

    return `${year}-${month}-${day}`;
  });
};

export const convertDateFormat = (date: string) => {
  const monthMap: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const parts = date.replace(",", "").split(" ");
  const month = monthMap[parts[0]];
  const day = parts[1].replace(/(st|nd|rd|th)/, "").padStart(2, "0");
  const year = parts[2];

  return `${year}-${month}-${day}`;
};

export const formatDate = (dateString: string) => {
  try {
    const parsedDate = parse(dateString, "MMMM do, yyyy", new Date());

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Invalid date:", dateString);
    return dateString;
  }
};

import {
  addYears,
  format,
  isBefore,
  addMonths,
  setDate,
  compareAsc,
} from "date-fns";

type Screening = {
  name: string;
  interval: number;
};

const getRandomDate = (baseDate: Date): Date => {
  const randomMonthOffset = Math.floor(Math.random() * 6) + 1;
  const futureDate = addMonths(baseDate, randomMonthOffset);
  return setDate(futureDate, 1);
};

export const calculateScreeningDates = (
  screeningDate: Date,
  age: number,
  gender: string
): { name: string; date: string; completed: boolean; overdue: boolean }[] => {
  const today = new Date();
  const oneMonthFromNow = addMonths(today, 1);

  const screenings: Screening[] = [
    {
      name: "Breast Cancer Screening",
      interval: gender === "female" && age >= 50 && age <= 74 ? 2 : 0,
    },
    {
      name: "Cervical Cancer Screening",
      interval: gender === "female" && age >= 25 && age <= 74 ? 5 : 0,
    },
    {
      name: "Colorectal Cancer Screening",
      interval: age >= 45 && age <= 74 ? 2 : 0,
    },
    {
      name: "Prostate Cancer Screening",
      interval: gender === "male" && age >= 50 ? 4 : 0,
    },
    {
      name: "Skin Cancer Screening",
      interval: 1,
    },
  ];

  const results = screenings
    .filter((screening) => screening.interval !== 0)
    .map((screening) => {
      const lastScreeningDate = addYears(screeningDate, screening.interval);
      const isOverdue = isBefore(lastScreeningDate, today);
      const nextScreeningBaseDate = isOverdue ? today : lastScreeningDate;
      let nextScreeningDate = getRandomDate(nextScreeningBaseDate);

      if (isBefore(nextScreeningDate, oneMonthFromNow)) {
        nextScreeningDate = setDate(addMonths(oneMonthFromNow, 1), 1);
      }

      return {
        ...screening,
        date: format(nextScreeningDate, "MMMM do, yyyy"),
        completed: false,
        overdue: isOverdue,
        rawDate: nextScreeningDate,
      };
    })
    .sort((a, b) => compareAsc(a.rawDate, b.rawDate))
    .map(({ rawDate, ...rest }) => rest);

  return results;
};

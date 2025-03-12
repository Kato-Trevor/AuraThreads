import {
  addYears,
  differenceInYears,
  format,
  isBefore,
  addMonths,
  setDate,
  compareAsc,
} from "date-fns";

export enum Checkup {
  BloodPressure = "Blood Pressure",
  Weight = "Weight",
  WaistCircumference = "Waist Circumference",
  Cholesterol = "Cholesterol",
  BloodSugar = "Blood Sugar",
  VisionTest = "Vision Test",
  DentalCheck = "Dental Check",
  HearingTest = "Hearing Test",
  CervicalScreening = "Cervical Screening",
  BreastCancerScreening = "Breast Cancer Screening",
  ProstateCancerScreening = "Prostate Cancer Screening",
  MentalHealthCheck = "Mental Health Check",
}

type CheckupDate = {
  name: string;
  date: string;
  completed: boolean;
  overdue: boolean;
  rawDate: Date;
};

const getRandomMonthDate = (baseDate: Date): Date => {
  const randomMonthOffset = Math.floor(Math.random() * 6) + 1;
  const futureDate = addMonths(baseDate, randomMonthOffset);
  return setDate(futureDate, 1);
};

export const addYearsToDate = (baseDate: Date, years: number) =>
  addYears(baseDate, years);

export const getCheckupsForAgeGroup = (age: number) => {
  if (age >= 18 && age <= 29) {
    return {
      [Checkup.BloodPressure]: 1,
      [Checkup.Weight]: 1,
      [Checkup.WaistCircumference]: 1,
      [Checkup.Cholesterol]: 5,
      [Checkup.BloodSugar]: 3,
      [Checkup.VisionTest]: 2,
      [Checkup.DentalCheck]: 2,
    };
  } else if (age >= 30 && age <= 49) {
    return {
      [Checkup.BloodPressure]: 1,
      [Checkup.Weight]: 1,
      [Checkup.WaistCircumference]: 1,
      [Checkup.Cholesterol]: 3,
      [Checkup.BloodSugar]: 2,
      [Checkup.VisionTest]: 2,
      [Checkup.DentalCheck]: 2,
      [Checkup.HearingTest]: 3,
    };
  } else if (age >= 50) {
    return {
      [Checkup.BloodPressure]: 1,
      [Checkup.Weight]: 1,
      [Checkup.WaistCircumference]: 1,
      [Checkup.Cholesterol]: 2,
      [Checkup.BloodSugar]: 1,
      [Checkup.VisionTest]: 1,
      [Checkup.DentalCheck]: 1,
      [Checkup.HearingTest]: 2,
      [Checkup.CervicalScreening]: 5,
      [Checkup.BreastCancerScreening]: 2,
      [Checkup.ProstateCancerScreening]: 2,
      [Checkup.MentalHealthCheck]: 1,
    };
  }

  return {};
};

export const calculateCheckupDates = (
  baseDate: Date,
  age: number
): Omit<CheckupDate, "rawDate">[] => {
  const today = new Date();
  const oneMonthFromNow = addMonths(today, 1);
  const checkupsForAgeGroup = getCheckupsForAgeGroup(age);

  const checkupDates: CheckupDate[] = Object.entries(checkupsForAgeGroup).map(
    ([checkup, years]) => {
      const lastCheckupDate = addYears(baseDate, years);
      const isOverdue = isBefore(lastCheckupDate, today);
      const nextCheckupBaseDate = isOverdue ? today : lastCheckupDate;
      let nextCheckupDate = getRandomMonthDate(nextCheckupBaseDate);

      if (isBefore(nextCheckupDate, oneMonthFromNow)) {
        nextCheckupDate = setDate(addMonths(oneMonthFromNow, 1), 1);
      }

      return {
        name: checkup,
        date: format(nextCheckupDate, "MMMM do, yyyy"),
        completed: false,
        overdue: isOverdue,
        rawDate: nextCheckupDate,
      };
    }
  );

  return checkupDates
    .sort((a, b) => compareAsc(a.rawDate, b.rawDate))
    .map(({ rawDate, ...rest }) => rest);
};

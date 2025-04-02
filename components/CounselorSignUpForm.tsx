import React from "react";
import { Formik } from "formik";
import { View, Text } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
import * as Yup from "yup";

const counselorValidationSchema = Yup.object().shape({
  surname: Yup.string()
    .min(3, "Surname must be at least 3 characters")
    .required("Surname is required"),
  givenNames: Yup.string()
    .min(3, "Given names must be at least 3 characters")
    .required("Given names are required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  biography: Yup.string().required("Biography is required"),
  identificationNumber: Yup.string().required("NIN is required"),
});

const CounselorSignUpForm = ({
  handleSubmit,
  isSubmitting,
}: {
  handleSubmit: (values: any) => void;
  isSubmitting: boolean;
}) => {
  return (
    <Formik
      initialValues={{
        surname: "",
        givenNames: "",
        password: "",
        email: "",
        phoneNumber: "",
        biography: "",
        identificationNumber: "",
        role: "counselor",
      }}
      validationSchema={counselorValidationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <>
          <FormField
            title="Surname"
            value={values.surname}
            handleChangeText={handleChange("surname")}
            placeholder="According to National ID"
            otherStyles="mb-1"
          />
          {touched.surname && errors.surname && (
            <Text className="text-red-500 text-sm mb-3">{errors.surname}</Text>
          )}

          <FormField
            title="Given Names"
            value={values.givenNames}
            handleChangeText={handleChange("givenNames")}
            placeholder="According to National ID"
            otherStyles="mb-1"
          />
          {touched.givenNames && errors.givenNames && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.givenNames}
            </Text>
          )}

          <FormField
            title="Email"
            value={values.email}
            handleChangeText={handleChange("email")}
            placeholder="Enter your email"
            otherStyles="mb-1"
          />
          {touched.email && errors.email && (
            <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>
          )}

          <FormField
            title="Phone Number"
            value={values.phoneNumber}
            handleChangeText={handleChange("phoneNumber")}
            placeholder="Enter your phone number"
            otherStyles="mb-1"
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <Text className="text-red-500 text-sm mb-3">{errors.phoneNumber}</Text>
          )}

          <FormField
            title="Biography"
            value={values.biography}
            handleChangeText={handleChange("biography")}
            placeholder="Enter your biography"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            otherStyles="mb-1"
          />
          {touched.biography && errors.biography && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.biography}
            </Text>
          )}

          <FormField
            title="NIN"
            value={values.identificationNumber}
            handleChangeText={handleChange("identificationNumber")}
            placeholder="National Identification No."
            otherStyles="mb-1"
          />
          {touched.identificationNumber && errors.identificationNumber && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.identificationNumber}
            </Text>
          )}

          <FormField
            title="Password"
            value={values.password}
            handleChangeText={handleChange("password")}
            placeholder="Enter your password"
            otherStyles="mt-5"
          />
          {touched.password && errors.password && (
            <Text className="text-red-500 text-sm">{errors.password}</Text>
          )}

          {isSubmitting ? (
            <View className="flex-row justify-center mt-6">
              <ButtonLoadAnimation />
            </View>
          ) : (
            <CustomButton
              title="Sign Up"
              handlePress={handleSubmit}
              containerStyles="mt-6 bg-secondary rounded-full h-14"
              textStyles="text-white font-pbold text-lg"
            />
          )}
        </>
      )}
    </Formik>
  );
};

export default CounselorSignUpForm;

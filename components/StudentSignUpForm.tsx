import React from "react";
import { Formik } from "formik";
import { View, Text } from "react-native";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import ButtonLoadAnimation from "@/components/LoadButtonAnimation";
import * as Yup from "yup";

const studentValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const StudentSignUpForm = ({
  handleSubmit,
  isSubmitting,
}: {
  handleSubmit: (values: any) => void;
  isSubmitting: boolean;
}) => {
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        email: "",
        role: "student",
      }}
      validationSchema={studentValidationSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <>
          <FormField
            title="Username"
            value={values.username}
            handleChangeText={handleChange("username")}
            placeholder="Enter your username"
            otherStyles="mb-1"
          />
          {touched.username && errors.username && (
            <Text className="text-red-500 text-sm mb-3">{errors.username}</Text>
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

export default StudentSignUpForm;
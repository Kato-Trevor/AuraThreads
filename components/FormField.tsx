import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface FormFieldProps {
  value: string;
  title?: string;
  keyboardType?: any;
  placeholder?: string;
  otherStyles?: string;
  autoCompleteType?: any;
  handleChangeText: (e: any) => void;
  disabled?: boolean;
  [key: string]: any;
}

const FormField = ({
  title,
  value,
  placeholder,
  otherStyles,
  keyboardType,
  autoCompleteType,
  handleChangeText,
  disabled = false,
  ...rest
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text
        className={`text-base text-black  ${
          disabled ? "font-pregular" : "font-psemibold"
        } `}
      >
        {title}
      </Text>
      <View className="border border-gray-300 w-full h-16 px-4 bg-gray-100 rounded-xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-black font-pmedium text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          autoComplete={autoCompleteType}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          style={{ color: disabled ? "#B0B0B0" : "black" }}
          {...rest}
        />

        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4"
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#7b7b8b"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

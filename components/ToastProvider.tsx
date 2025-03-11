import Toast from "react-native-toast-message";
import CustomToast from "@/components/CustomToast";
import React, { createContext, useContext, ReactNode } from "react";

interface ToastContextProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showToast = (message: string, type: "success" | "error" | "info") => {
    Toast.show({
      text1: message,
      type: type,
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 50,
      props: {},
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Tell Toast to use your custom Toast component */}
      <Toast
        config={{ success: CustomToast, error: CustomToast, info: CustomToast }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

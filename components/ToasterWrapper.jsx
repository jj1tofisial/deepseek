"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterWrapper() {
  return (
    <Toaster
      toastOptions={{
        success: { style: { background: "black", color: "white" } },
        error: { style: { background: "black", color: "white" } },
      }}
    />
  );
}

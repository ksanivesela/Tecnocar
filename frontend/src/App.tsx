import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#151922",
            color: "#fff",
            border: "1px solid #29303b",
          },
          success: { iconTheme: { primary: "#00E676", secondary: "#090B10" } },
        }}
      />
    </>
  );
}

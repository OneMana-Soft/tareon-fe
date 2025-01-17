import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import store, { persistor } from "@/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "@/utils/i18n"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <App />
          </Provider>
        </PersistGate>
      </Router>
    </ThemeProvider>
  </StrictMode>
);

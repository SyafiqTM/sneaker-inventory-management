import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { UserProvider } from "./context/UserContext.jsx";
import Navbar from "./components/Navbar.jsx";
import LoginModal from "./components/LoginModal.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import AddSneakerPage from "./pages/AddSneakerPage.jsx";
import UpdateSneakerPage from "./pages/UpdateSneakerPage.jsx";
import CartPage from "./pages/CartPage.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/cart";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/add" element={<AddSneakerPage />} />
        <Route path="/edit/:id" element={<UpdateSneakerPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <LoginModal />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import InventoryList from './components/InventoryList.jsx';
import AddItemPage from './pages/AddItemPage.jsx';
import CartPage from './pages/Cartpage.jsx';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<CartPage />} />
              <Route path="/inventory" element={<InventoryList />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
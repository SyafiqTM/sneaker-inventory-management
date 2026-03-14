import { AppBar, Toolbar, Typography, Button, Box, Chip, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../context/UserContext.jsx";

const Navbar = () => {
    const { userName, logout } = useUser();

    return (
        <AppBar position="static">
            <Toolbar>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Box display="flex" alignItems="center">
                            {/* <InventoryIcon sx={{ mr: 1 }} />
                            <Typography variant="h6" component={RouterLink} to="/inventory" color="inherit" sx={{ textDecoration: 'none' }}>
                                Inventory Manager
                            </Typography> */}
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/cart"
                                startIcon={<ShoppingCartIcon />}
                            >
                                Go to Store
                            </Button>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            {userName && (
                                <Chip
                                    icon={<AccountCircleIcon />}
                                    label={userName}
                                    color="default"
                                    sx={{
                                        color: "white",
                                        borderColor: "white",
                                        "& .MuiChip-icon": { color: "white" },
                                    }}
                                    variant="outlined"
                                />
                            )}

                            {userName && (
                                <Button
                                    color="inherit"
                                    onClick={logout}
                                    startIcon={<LogoutIcon />}
                                >
                                    Logout
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" alignItems="center">
                        <InventoryIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
                            Inventory Manager
                        </Typography>
                    </Box>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/add-item"
                        startIcon={<AddIcon />}
                    >
                        Add Item
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

const NavbarNew = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <InventoryIcon sx={{mr: 2}}/>
                <Typography variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}>
                    Nike Inventory Management
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/add-item" startIcon={<AddIcon />}>Add Item</Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}


export default Navbar;
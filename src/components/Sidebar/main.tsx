'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Signin from './AccountBarBtn';
import { SessionProvider, useSession } from 'next-auth/react';
import MenuList from '../SideMenuList';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { usePathname } from "next/navigation";
import { useEffect } from 'react';
import User from '@/models/User';
import { Stack } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
        {
            props: ({ open }) => open,
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            },
        },
    ],
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: "hidden",
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
    },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function SidebarMain({ children, email }: Readonly<{ children: React.ReactNode; email: string; }>) {
    const excludePaths = ['/checkAuth', '/register', '/signin', '/signout', '/api/authErrorSignout', '/signouted', '/error/notStudent'];
    const pathname = usePathname();
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const { data: session } = useSession();
    useEffect(() => {
        const fetchData = async () => {
            if (!email) return;
            const res = await fetch('/api/user?email=' + session?.user?.email);
            const data = await res.json();
            setUser(data.data);
            if (!data.data && !excludePaths.includes(pathname)) {
                redirect('/checkAuth');
            }
        }
        fetchData();
    }, []);

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', width: '100vw', overflow: 'hidden' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} color="default">
                <Toolbar
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        maxWidth: '100vw',
                        overflowX: 'hidden'
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={[
                                { mr: 2 },
                                open && { display: 'none' },
                            ]}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                            noWrap
                            component="div"
                        >
                            <Link href="/" passHref>
                                Linkle
                            </Link>
                        </Typography>
                    </Stack>
                    <Box sx={{ minWidth: 0, flexShrink: 1 }}>
                        <SessionProvider session={session}>
                            <Signin slack_name={user?.slack_name} />
                        </SessionProvider>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                    '& ::-webkit-scrollbar': {
                        display: "none"
                    },
                    '& :hover': {
                        '::-webkit-scrollbar': {
                            display: "inline"
                        }
                    }
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <SessionProvider session={session}>
                        <MenuList />
                    </SessionProvider>
                </List>
            </Drawer>
            <Main open={open} sx={{ p: 0 }}>
                <DrawerHeader />
                {children}
            </Main>
        </Box>
    );
}
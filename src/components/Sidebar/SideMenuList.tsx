import { useSession } from "next-auth/react";

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import GroupsIcon from '@mui/icons-material/Groups';

export default function MenuList() {
    const session = useSession();

    const loginedMenuList = [
        {
            label: 'ダッシュボード',
            href: '/dashboard',
            icon: <DashboardIcon />,
        },
        {
            label: 'クラブ一覧',
            href: '/clubs',
            icon: <GroupsIcon />,
        },
        // TODO: あとで実装する
        /*{
            label: 'イベント一覧',
            href: '/events',
            icon: <DashboardIcon/>,
        },
        {
            label: 'ユーザー一覧',
            href: '/users',
            icon: <DashboardIcon/>,
        },*/
        {
            label: 'サインアウト',
            href: '/signout',
            icon: <LogoutIcon />,
        },
    ];

    const noLoginedMenuList = [
        {
            label: 'クラブ一覧',
            href: '/clubs',
            icon: <GroupsIcon />,
        },
        {
            label: 'サインイン',
            href: '/signin',
            icon: <LoginIcon />,
        },
    ];
    if (!session.data) {
        return (
            <>
                {
                    noLoginedMenuList.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton href={item.href}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </>
        );
    }

    return (
        <>
            {
                loginedMenuList.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton href={item.href}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))
            }
        </>
    );
}
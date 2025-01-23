"use client"
import { Avatar } from "@mui/material";
import { useSession } from "next-auth/react"

import Link from 'next/link';

export default function LoginButton({slack_name}: {slack_name: string}) {
    const { data: session } = useSession()
    if (session?.user) {
        return (
            <>
                <AccountMenu displayName={slack_name ?? 'unknown'} avatar={session.user.image ?? ''} />
            </>
        );
    }
    return (
        <Link href={"/signin"}>
            ログイン
        </Link>
    )
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { redirect } from "next/navigation";

export function AccountMenu({ displayName, avatar }: { displayName: string, avatar: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection={'row'}
                        gap={1}
                        onClick={handleClick}
                        m={2}
                        justifyContent={'center'}
                        justifyItems={'center'}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }} src={ avatar as string} />
                        <Typography textAlign={"center"} alignContent={"center"}>{displayName}</Typography>
                    </Box>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar src={avatar} /> プロフィール
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <Link href="/settings">
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        設定
                    </Link>
                </MenuItem>
                <MenuItem onClick={async () => {
                    redirect('/signout');
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    ログアウト
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
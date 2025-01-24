import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Stack } from '@mui/material';
import Link from 'next/link';

type ClubCardProps = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    availableOn: number;
};

export default function ClubCard({ id, name, description, imageUrl, availableOn }: ClubCardProps) {
    return (
        <Link href={`/clubs/${id}`}>
            <Card sx={{ maxWidth: 320, position: 'relative' }}>
                <CardMedia
                    sx={{ height: 180, width: 320 }}
                    image={imageUrl}
                />
                {availableContents(availableOn)}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Link>
    );
}

const availableContents = (availableOn: number): undefined | React.JSX.Element => {
    if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
        return (
            <Stack direction={'row'} spacing={1} m={1}>
                <Avatar
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                        color: 'white',
                        backgroundColor: '#006',
                        outline: 'transparent',
                        outlineColor: 'navy',
                    }}
                    alt="高等部"
                >
                    高
                </Avatar>
                <Avatar
                    sx={{
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                        backgroundColor: '#0ae',
                        color: 'white'
                    }}
                    alt="中等部"
                >
                    中
                </Avatar>
            </Stack>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Avatar
                sx={{
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                    color: 'white',
                    backgroundColor: '#006',
                    outline: 'transparent',
                    outlineColor: 'navy',
                    m: 1,
                }}
                alt="高等部"
            >
                高
            </Avatar>
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Avatar
                sx={{
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                    m: 1,
                    backgroundColor: '#0ae',
                    color: 'white'
                }}
                alt="中等部"
            >
                中
            </Avatar>
        );
    }
    return undefined;
}

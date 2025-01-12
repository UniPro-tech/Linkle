import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

type ClubCardProps = {
    name: string;
    description: string;
    imageUrl: string;
    availableOn: number;
};

export default function ClubCard({ name, description, imageUrl, availableOn }: ClubCardProps) {
    return (
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
    );
}

const availableContents = (availableOn: number): undefined | React.JSX.Element => {
    if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
        return (
            <>
                <Box
                    component="img"
                    src="/img/jhs.png"
                    sx={{
                        position: 'absolute',
                        top: 140,
                        right: 8,
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
                <Box
                    component="img"
                    src="/img/kotobu.png"
                    sx={{
                        position: 'absolute',
                        top: 140,
                        right: 48,
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
            </>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Box
                component="img"
                src="/img/kotobu.png"
                sx={{
                    position: 'absolute',
                    top: 140,
                    right: 8,
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Box
                component="img"
                src="/img/jhs.png"
                sx={{
                    position: 'absolute',
                    top: 140,
                    right: 8,
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    return undefined;
}

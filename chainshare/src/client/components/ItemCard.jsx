import { Box, Typography, Button, Stack, CardActionArea, Card} from "@mui/material";
import Image from 'next/image'

function ItemCard({
    onClick,
}) {
  return (
    
    <CardActionArea 
        sx={{borderRadius: '15px'}}
        onClick={onClick}
    >
    <Box
        height={"360px"}
        width={"320px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        boxShadow={"0px 4px 14.6px -1px rgba(0, 0, 0, 0.25)"}
        borderRadius={'15px'}
    >
        
        <Stack 
        flexGrow={1} 
        flex={1} 
        height={'100%'} 
        display={'flex'}
        justifyContent={'space-between'}
        spacing={1}
        >
            <Stack>
            <Image
                src="https://media-cdn.bnn.in.th/150987/MacBook_Pro_16-in_Space_Grey_PDP_Image_Position-1__TH-square_medium.jpg"
                width={320}
                height={215}
                style={{
                    objectFit: 'contain',
                  }}
                alt="Picture of the Items"
            />
            <Typography px={2} color={"black"} variant={"h5"}>
                Macbook Pro 16"
            </Typography>
            </Stack>
            <Stack spacing={1}>
            <Typography px={2} color={"purple"} variant={"h5"}>
                1.5 ETH
            </Typography>
            <Stack 
            direction={"row"} 
            spacing={2} 
            justifyContent={'space-between'}
            justifyItems={'flex-end'}
            px={2}
            >
                <Typography  color={"black"} variant={"caption"}>
                    10 days
                </Typography>
                <Typography  color={"black"} variant={"caption"}>
                    x0034r54354657788
                </Typography>
            </Stack>
            </Stack>
        </Stack>
        
    </Box>
    </CardActionArea>
  )
}

export default ItemCard
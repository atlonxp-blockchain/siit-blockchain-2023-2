import { Box, Stack, Typography, Button, Grid, Container} from '@mui/material';
import { COLORS } from './color';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet,faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import ProfileItemCard from './ProfileItemCard';


const liststatus = [
  {
    key: 1,
    status: "borrow"
  },
  {
    key: 1,
    status: "borrow"
  },
  {
    key: 1,
    status: "borrow"
  },
  {
    key: 2,
    status: "report"
  },
  {
    key: 2,
    status: "report"
  },
  {
    key: 3,
    status: "active"
  },
  {
    key: 3,
    status: "active"
  },
  {
    key: 4,
    status: "inactive"
  },
]

const borrowItems = liststatus.filter((item) => item.status === "borrow");
const borrowCount = borrowItems.length;

const listItemBorrow = borrowItems.map((borrowItem, i) => (
  <Stack p={2}>
    <ProfileItemCard key={i} itemStatus={borrowItem.status} />
  </Stack>
));


const reportItems = liststatus.filter((item) => item.status === "report")
const reportCount = reportItems.length;
const listItemReport = reportItems.map((reportItem,i) => (
    <Stack p={2}>
      <ProfileItemCard key={i} itemStatus={reportItem.status}/>
    </Stack>
));

const activeItems = liststatus.filter((item) => item.status === "active")
const activeCount = activeItems.length;
const listItemActive = activeItems.map((activeItem,i) => 
    <Stack p={2}>
      <ProfileItemCard key={i} itemStatus={activeItem.status}/>
    </Stack>
);

const inactiveItems = liststatus.filter((item) => item.status === "inactive")
const inactiveCount = inactiveItems.length;
const listItemInactive = inactiveItems.map((inactiveItem,i) => 
    <Stack p={2}>
      <ProfileItemCard key={i} itemStatus={inactiveItem.status}/>
    </Stack>
);

const ListingsCount = activeCount+inactiveCount;

function Profile() {
    return (
    <Container width={'100%'}>
      <Stack flexGrow={1} direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'column'} justifyContent={'space-between'}>
          <Image src='https://www.cryptonomist.gr/wp-content/uploads/2022/01/FIW6rBzWUAMUzq1.jpeg' width={279} height={279}></Image>
          <Stack flexGrow={1} alignItems={'flex-start'} justifyContent={'space-evenly'}>
            <Typography color={COLORS.gray} fontSize={'20px'} fontWeight={400}>x0622xxxxxxxxx</Typography>
            <Typography fontSize={'32px'} fontWeight={600}>Pigeon</Typography>
            <Typography fontSize={'20px'} fontWeight={400}>Score : 4.5</Typography>
            <Stack direction={'row'} justifyContent={'space-around'}>
              <FontAwesomeIcon icon={faWallet} size='2xl' style={{color: COLORS.darkgray}} />
              <Typography fontSize={'20px'} fontWeight={500} color={COLORS.darkgray} pl={2}>12.50 ETH</Typography>
            </Stack>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <FontAwesomeIcon icon={faHandHoldingDollar} size='2xl' style={{color: COLORS.darkgray}}/>
              <Typography fontSize={'20px'} fontWeight={500} color={COLORS.darkgray} pl={2}>5.50 ETH</Typography>
            </Stack>
            <Button sx={{width: '279px', height: '52px', borderRadius: '15px', color: COLORS.white,bgcolor: COLORS.lightpurple}}>Add listing</Button>
            <Button sx={{width: '279px', height: '52px', borderRadius: '15px', color: COLORS.white,bgcolor: COLORS.lightpurple, border:'3px', borderColor: '#C6A2F4'}}>Edit Profile</Button>
          </Stack>
        </Stack>
        <Box sx={{bgcolor: COLORS.purple, width:"800px", height:"686px", borderRadius:"15px", p:2, overflowY: "auto"}}>
          <Typography fontSize={'24px'} color={COLORS.white}>Borrowing ({borrowCount})</Typography>
          <Grid container spacing={2} pr={4}>
              {listItemBorrow.map((borrowItem, index) => (
                <Grid key={index} item xs={6}> 
                  {borrowItem}
                </Grid>
              ))}
          </Grid>
          <Typography fontSize={'24px'} color={COLORS.white}>Report ({reportCount})</Typography>
          <Grid container spacing={2} pr={4}>
            {listItemReport.map((reportItem, index) => (
              <Grid key={index} item xs={6}> 
                {reportItem}
              </Grid>
            ))}
          </Grid>
          <Typography fontSize={'24px'} color={COLORS.white}>Listings ({ListingsCount})</Typography>
          <Grid container spacing={2} pr={4}>
            {listItemActive.map((activeItem, index) => (
              <Grid key={index} item xs={6}> 
                {activeItem}
              </Grid>
            ))}
            {listItemInactive.map((inactiveItem, index) => (
              <Grid key={index} item xs={6}> 
                {inactiveItem}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
    )
  }
  
export default Profile;
import { Box, Stack } from '@mui/material';
import ItemCard from '../components/ItemCard';
import DetailModal from '../components/DetailModal';
import { useState } from 'react';

function Homepage() {

  const [openModal, setOpenModal] = useState(false);
  return (
    <Stack direction={'row'} spacing={4} >
        <ItemCard onClick={()=>setOpenModal(true)}/>
      <DetailModal open={openModal} onClose={()=>{setOpenModal(false)}}/>
    </Stack>
  )
}

export default Homepage
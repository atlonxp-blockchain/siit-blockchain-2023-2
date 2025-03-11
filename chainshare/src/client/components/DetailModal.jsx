import {
  Box,
  Modal,
  Stack,
  Divider,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "880px",
  height: "650px",
  bgcolor: "white",
  boxShadow: 24,
  borderRadius: "10px",
  paddingBottom: "0px",
};

function DetailModal({ open, onClose, data }) {
  return (
    <Modal open={open} onClose={() => {}}>
      <Box
        bgcolor={"white"}
        sx={style}
        flexDirection={"row"}
        display={"flex"}
        flex={1}
        justifyContent={"space-between"}
      >
        <Stack flexGrow={1} py={2}>
          <Typography variant="h4" px={3}>
            Macbook pro 16
          </Typography>
          <Image
            src="https://media-cdn.bnn.in.th/150987/MacBook_Pro_16-in_Space_Grey_PDP_Image_Position-1__TH-square_medium.jpg"
            width={580}
            height={310}
            style={{
              objectFit: "contain",
            }}
            alt="Picture of the Items"
          />
          <Stack flexGrow={1} flex={1}>
            <Typography variant="body1" px={3}>
              gfdsgjdfklsgjskl;dfgjsdfklgjsf
              <br />
              fgjklsdjfgkldjfgldjsfgjdfgklsd
              <br />
              gflsdkgjldfgjdfklgjdfsgkfdjgsf
              <br />
              jlgksdfkjgdfklgfkgkk
            </Typography>
          </Stack>
          <Typography variant="subtitle" px={3} gutterBottom>
            History : 10
          </Typography>
          <Typography variant="subtitle" px={3}>
            owner : x34320423904923402
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem bgcolor={"black"} />
        <Stack
          width={"300px"}
          flexGrow={1}
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          px={1}
          py={1}
        >
          <IconButton
            onClick={onClose}
            sx={{
              width: "24px",
              height: "24px",
              alignSelf: "flex-end",
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
          <Stack direction={"column"} spacing={2} px={1}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5">
                price
              </Typography>
              <Stack direction={"column"} spacing={1}>
                <Typography variant="h5" >
                  1.5 ETH
                </Typography>
                <Typography variant="subtitle" >
                  10 days
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5" >
                deposit
              </Typography>
              <Typography variant="h5" >
                1.5 ETH
              </Typography>
            </Stack>
            <Divider />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5" >
                total
              </Typography>
              <Typography variant="h5" >
                3.0 ETH
              </Typography>
            </Stack>
            <Button variant={"contained"} onClick={onClose}>Rent</Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default DetailModal;

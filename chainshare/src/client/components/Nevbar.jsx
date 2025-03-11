import { Box, Typography, Button, Stack } from "@mui/material";
import { ConnectWallet } from "@thirdweb-dev/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useConnectionStatus } from "@thirdweb-dev/react";

function Nevbar() {
  const connectionStatus = useConnectionStatus();
  return (
    <Box
      height={"80px"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        direction={"row"}
        width={"80%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography color={"white"} variant={"h3"}>
          LOGO
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <ConnectWallet modalSize="compact" />
          {connectionStatus === "connected" ? (
            <Button
              variant="outlined"
              sx={{
                height: "63px",
                width: "63px",
                color: "white",
                borderColor: "white",
                border: "1px solid",
                borderRadius: "10px",
                "&:hover": {
                  borderColor: "white",
                  border: "2px solid",
                  borderRadius: "10px",
                },
              }}
            >
              <FontAwesomeIcon icon={faUser} size={"2xl"} />
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default Nevbar;

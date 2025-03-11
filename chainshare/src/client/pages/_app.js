import { ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import '@fontsource/fira-sans/300.css';
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/500.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/fira-sans/800.css';
import Nevbar from '../components/Nevbar';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import theme from '../styles/mui_theme';


// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = 'ethereum';

function MyApp({ Component, pageProps }) {
	return (
		<ThirdwebProvider
			activeChain={activeChain}
			clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
		>
			<ThemeProvider theme={theme}>
			<Nevbar />
				<Box 
				bgcolor={'white'} 
				flex={1} 
				flexGrow={1} 
				display={'flex'}
				sx={{position: 'absolute', left:0, right:0, top:"80px", bottom:0, alignItems: 'center', justifyContent: 'center'}}
				>
					
					<Component {...pageProps} />
				</Box>
			</ThemeProvider>
		</ThirdwebProvider>
	);
}

export default MyApp;

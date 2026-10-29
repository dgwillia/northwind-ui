// The @northwind/ui package entry point.
// Product code imports UI only from here, never from @mui/material directly.
export { theme } from './theme/theme';
export { NorthwindProvider } from './theme/NorthwindProvider';
export type { NorthwindProviderProps } from './theme/NorthwindProvider';
// Read or change the colour scheme (light, dark, system) from anywhere inside NorthwindProvider.
export { useColorScheme } from '@mui/material/styles';
// Wrapped components arrive in step 4.

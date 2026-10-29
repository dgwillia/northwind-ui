// The @northwind/ui package entry point.
// Product code imports UI only from here, never from @mui/material directly.

// Theme
export { theme } from './theme/theme';
export { NorthwindProvider } from './theme/NorthwindProvider';
export type { NorthwindProviderProps } from './theme/NorthwindProvider';
// Read or change the colour scheme (light, dark, system) from anywhere inside NorthwindProvider.
export { useColorScheme } from '@mui/material/styles';

// Components
export { Alert } from './components/Alert/Alert';
export type { AlertProps } from './components/Alert/Alert';
export { Button } from './components/Button/Button';
export type { ButtonProps } from './components/Button/Button';
export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';
export { StatusLabel } from './components/StatusLabel/StatusLabel';
export type { StatusLabelProps } from './components/StatusLabel/StatusLabel';
export { TextField } from './components/TextField/TextField';
export type { TextFieldProps } from './components/TextField/TextField';

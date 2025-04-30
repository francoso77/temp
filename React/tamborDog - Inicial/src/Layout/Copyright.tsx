import { Link, Typography } from '@mui/material';

export default function Copyright(props: any) {
  return (
    <Typography variant="body2" color="inherit" {...props} sx={{ fontSize: 15 }}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.tambordog.com/">
        TamborDOG
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
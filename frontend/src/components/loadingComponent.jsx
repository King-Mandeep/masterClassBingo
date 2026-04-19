import Grid from "@mui/material/Grid";
import { NewtonsCradle } from 'ldrs/react';
import 'ldrs/react/NewtonsCradle.css';

export const LoadingComponent = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100vh' }}
    >
      <Grid item>
        <NewtonsCradle size="150" speed="1.4" color="Blue" />
      </Grid>
    </Grid>
  );
};

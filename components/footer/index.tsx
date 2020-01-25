import React from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';

const useFooterStyles = makeStyles(() => ({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
}));

const Footer: React.FC = () => {
  const footerClasses = useFooterStyles();

  return (
    <Box boxShadow={4} className={clsx(footerClasses.footer)}>
      <Grid container alignContent="space-between">
        <Grid item md={4} sm={12} xs={12}>
          <Box py={4} px={3}>
            <Typography>OpenLMS, exercise</Typography>
            <Typography>&copy;{new Date().getFullYear()}</Typography>
          </Box>
        </Grid>
        <Grid item md={8} sm={12} xs={12}>
          <Box p={3}>
            <IconButton target="_blank" href="https://github.com/QuangDuong120198/lms">
              <GitHubIcon />
            </IconButton>
            <IconButton target="_blank" href="https://twitter.com/ngoquangduong">
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;

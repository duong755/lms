import { makeStyles, fade } from '@material-ui/core/styles';

export const useHeaderStyles = makeStyles((theme) => ({
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  brandLink: {
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
      textDecoration: 'none'
    }
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%'
  },
  showMenu: {
    display: 'flex',
    alignItems: 'center'
  },
  hideMenu: {
    display: 'none',
    alignItems: 'center',
    verticalAlign: 'middle'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  username: {
    maxWidth: 150,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 700
  },
  searchRoot: {
    borderRadius: 5,
    padding: theme.spacing(0.25, 1),
    backgroundColor: fade(theme.palette.common.white, 0.2),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.4)
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  searchInput: {
    padding: theme.spacing(0.75, 1)
  },
  searchMenuRoot: {
    borderRadius: 5,
    marginTop: theme.spacing(1),
    padding: theme.spacing(0.25, 1),
    backgroundColor: fade(theme.palette.common.white, 0.2),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.4)
    }
  },
  searchMenuInput: {
    padding: theme.spacing(0.75, 1)
  }
}));

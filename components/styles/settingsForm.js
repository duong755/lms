import { makeStyles } from '@material-ui/core/styles';

export const useSettingsFormStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%'
  },
  form: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }
}));

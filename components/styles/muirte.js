import { makeStyles } from '@material-ui/core/styles';

export const useMuiRteStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  container: {
    borderWidth: 1,
    borderColor: theme.palette.grey[300],
    borderStyle: 'solid',
    borderRadius: theme.spacing(0.5)
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[300],
    borderBottomStyle: 'solid'
  },
  editorContainer: {
    minHeight: 80,
    padding: theme.spacing(2)
  }
}));

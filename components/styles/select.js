import { useTheme } from '@material-ui/core/styles';

/**
 * @param {import('@material-ui/core/styles').Theme} theme
 * @returns {import('react-select').StylesConfig}
 */
export const useSelectStyles = () => {
  const theme = useTheme();
  return {
    control: (base) => ({
      ...base,
      minHeight: 50,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.background.default
    }),
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? theme.palette.secondary.main : theme.palette.background.default,
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: theme.palette.common.white
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: theme.palette.text.primary
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: theme.palette.background.default
    })
  };
};

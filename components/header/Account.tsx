import React from 'react';

import Button from '@material-ui/core/Button';

const Account: React.FC = () => {
  return (
    <div>
      <Button variant="outlined" size="small">
        Sign up
      </Button>
      &nbsp;
      <Button variant="text" size="small">
        Sign in
      </Button>
    </div>
  );
};

export default Account;

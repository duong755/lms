import React from 'react';

import NextLink from 'next/link';
import Button from '@material-ui/core/Button';

const Account: React.FC = () => {
  return (
    <div>
      <NextLink href="/signup" as="/signup" prefetch={false}>
        <Button variant="outlined" size="small">
          Sign up
        </Button>
      </NextLink>
      &nbsp;
      <NextLink href="/signin" as="/signin" prefetch={false}>
        <Button variant="text" size="small">
          Sign in
        </Button>
      </NextLink>
    </div>
  );
};

export default Account;

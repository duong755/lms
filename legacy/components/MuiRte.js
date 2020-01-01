import dynamic from 'next/dynamic';

const MuiRte = dynamic(() => import('mui-rte'), {
  ssr: false
});

export default MuiRte;

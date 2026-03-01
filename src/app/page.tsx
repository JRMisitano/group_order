//import Image from "next/image";
import Button from '@mui/material/Button';
import NextLink from 'next/link'

export default function Home() {
  return (
    <>
      <div> What do you want? </div>
        <NextLink href = '/owner'>
          <Button variant = 'outlined'> Create a Group </Button>
        </NextLink>
        <NextLink href = '/guest'>
          <Button variant = 'outlined'> Add an Order </Button>
        </NextLink> 
    </>
  );
}

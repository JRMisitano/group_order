//import Image from "next/image";
import Button from '@mui/material/Button';
import NextLink from 'next/link'

export default function Home() {
  return (
    <div class = "m-10">
      <div class = "mb-5"> What do you want? </div>
        <NextLink href = '/owner'>
          <Button variant = 'outlined'> Create a Group </Button>
        </NextLink>
    </div>
  );
}

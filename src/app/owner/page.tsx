'use client'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function Owner() {
  const handleDone = () => {
    alert ("it's done")
  }

  const [groupName, setGroupName] = useState(null);
  const [ownerEmail, setOwnerEmail] = useState(null);

  const [restaurantData, setRestaurantData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://group-order.jr373.workers.dev/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        setRestaurantData(data);
        setLoading(false);
      })
  }, [])

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <div class = 'block'> Create a group </div>
      
        <div>
          <TextField
            label="Enter Your Email" 
            sx={{ width: 300 }}
            variant="outlined"
            value={ownerEmail} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setOwnerEmail(event.target.value);
            }}
          />
        </div>  
        <div>
          <TextField
            label="Name Your Group" 
            sx={{ width: 300 }}
            variant="outlined"
            value={groupName} 
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setGroupName(event.target.value);
            }}
          />
        </div>
        <FormControl>
          <InputLabel id="restaurant-select-label">Select Restaurant</InputLabel>
          <Select
            sx={{ width: 300 }}
            label-id= "restaurant-select-label"
            label="Select Restaurant"
           // onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
      </FormControl>

      <div></div>
      <Button onClick = {handleDone} variant = 'outlined'> Done </Button>

    </>
  );
}
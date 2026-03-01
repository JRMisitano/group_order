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

  const [groupName, setGroupName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] =useState(null);
  const [guestEmails, setGuestEmails] = useState([]);

  const [restaurantData, setRestaurantData] = useState(null);


  const [menuData, setMenuData] = useState(null);
  const [isLoadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    fetch('https://group-order.jr373.workers.dev/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        const valuesArray = Object.keys(data).map(key => {
          data[key].id=key;
          return data[key];
        }); 
        setRestaurantData(valuesArray);
        setLoadingMenu(false);
      })
  }, [])

  const cleanGroupName = (groupName) => {
    const cleaned = groupName.replace(/[^a-zA-Z0-9\s]/g, '');
    console.log(cleaned);
    setGroupName(cleaned);  
  }

  const renderGuestEmails = (emails) => {
    const emailFields = [];
    for (let i = 0; i < 3; i++) {
      if( i <= emails.length){
        emailFields.push(
           <TextField
                label="Enter a Guest's Email" 
                sx = {{width: 300}}
                variant = "outlined"
                value = {emails[i]}
                inputProps = {{maxLength : 255}}
                onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                  let temp = guestEmails;
                  temp[i] = event.target.value;
                  console.log(temp)
                  setGuestEmails([...temp]);
                }
              }
            />
        );
      }
    }
    return emailFields;
  };
  /*useEffect(() => {
    fetch(`https://group-order.jr373.workers.dev/api/menu?value=${selectedRestaurant.menu}`)
      .then((res) => res.json())
      .then((data) => {
        const valuesArray = Object.keys(data).map(key => {
          data[key].id=key;
          return data[key];
        }); 
        
        setLoadingMenu(false);
      })
  }, [selectedRestaurant])*/

  if (isLoadingMenu) return <p>Loading...</p>

  return (
    <>
      <div class = 'block'> Create a group </div>
      
        <div class = 'm-5'>
          <TextField
            label="Enter Your Email" 
            sx = {{ width: 300 }}
            variant = "outlined"
            value = {ownerEmail}
            inputProps = {{maxLength : 255}}
            onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
              setOwnerEmail(event.target.value);
            }}
          />
        </div>  
        <div class = 'm-5'>
          <TextField
            label="Name Your Group" 
            sx={{ width: 300 }}
            variant="outlined"
            value={groupName}
            inputProps = {{maxLength : 30}}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s]$/g, '');
              setGroupName(event.target.value);
            }}
          />
        </div>
        <div class = 'm-5'>
          <FormControl>
            <InputLabel id="restaurant-select-label">Select Restaurant</InputLabel>
            <Select
              sx={{ width: 300 }}
              label-id= "restaurant-select-label"
              label="Select Restaurant"
              onChange={setSelectedRestaurant}
            >
            {restaurantData.map((restaurant) => (
              <MenuItem value={restaurant}>{restaurant.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
      </div>

      <div class = 'border'>
        {renderGuestEmails(guestEmails)}
      </div>  

      <div class = 'm-5'>
        <Button onClick = {handleDone} variant = 'outlined'> Done </Button>
      </div>
    </>
  );
}
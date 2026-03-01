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
    postGroup();
  }

  const [isDone, setIsDone] = useState(false);
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

  const renderDoneButton = () => {
    const readyToSubmit = 
      !!groupName && 
      !!ownerEmail && 
      !!selectedRestaurant &&
      !!guestEmails.length &&
      !isDone;
    console.log(readyToSubmit)

    //console.log(groupName , ownerEmail , selectedRestaurant , guestEmails.length , !isDone)
    return (
      <Button 
        onClick = {handleDone} 
        variant = 'outlined'
        disabled = {!readyToSubmit}
      >
        Done 
      </Button>
      )
  }

  const renderGuestEmails = (emails) => {
    const emailFields = [];
    for (let i = 0; i < 3; i++) {
      if( i <= emails.length){
        emailFields.push(
           <div class = "m-5">
            <TextField
                label="Enter a Guest's Email" 
                sx = {{width: 260}}
                variant = "outlined"
                value = {emails[i]}
                inputProps = {{maxLength : 255}}
                key = {i}
                onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                  let temp = guestEmails;
                  temp[i] = event.target.value;
                  setGuestEmails([...temp]);
                }
              }
            />
          </div>
        );
      }
    }
    return emailFields;
  };

  const postGroup = async () => {
    //setError(null); 
    const postData = {
      "name": groupName, 
      "owner": ownerEmail,
      "emails": guestEmails, 
      "restaurant": selectedRestaurant
    }; 

    try {
      const response = await fetch('https://group-order.jr373.workers.dev/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setIsDone(true);
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
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
      <div class = 'text-3xl m-5'> Create a group </div>
      
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
              const cleaned = event.target.value.replace(/[^a-zA-Z0-9\s]$/g, '').trim();
              setGroupName(cleaned);
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedRestaurant(event.target.value);
            }}
            >
            {restaurantData.map((restaurant) => (
              <MenuItem value={restaurant}>{restaurant.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
      </div>

      <div class = 'border m-5 w-75'>
        {renderGuestEmails(guestEmails)}
      </div>  

      <div class = 'm-5'>
        {renderDoneButton()}
      </div>
    </>
  );
}
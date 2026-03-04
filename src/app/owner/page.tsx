'use client'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NextLink from 'next/link'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Menu from '../../components/Menu';

export default function Owner() {
  interface Group {
    name: string;
    owner: string;
    emails: string[];
    restaurant: string;
    orders: object;
    open: boolean;
    id: string;
  }

  const [isDone, setIsDone] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [guestEmails, setGuestEmails] = useState([]);

  const [restaurantData, setRestaurantData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [links, setLinks] = useState(null);

  const [isLoadingRestaurant, setLoadingRestaurant] = useState(true);

  useEffect(() => {
    fetch('https://group-order.jr373.workers.dev/api/restaurants')
      .then((res) => res.json())
      .then((data) => {
        const valuesArray = Object.keys(data).map(key => {
          data[key].id=key;
          return data[key];
        }); 
        setRestaurantData(valuesArray);
        setLoadingRestaurant(false);
      })
  }, [])

  useEffect(() => {
    if (selectedRestaurant) {
      fetch(`https://group-order.jr373.workers.dev/api/menu?value=${selectedRestaurant.menu}`)
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
      })
    }
  }, [selectedRestaurant])


  const handleDone = () => {
    postGroup();
  }

  const completeGroup = (data: Group) => {
    setGroupData(data);
  }

  const generateLink = (type, email) => {
    const host = window.location.host; 
    if (type === "OWNER"){
      const url = `http://${host}/owner/group?email=${encodeURI(email)}&group=${encodeURI(groupData.id)}`;
      return (<a href = {url} target = "_blank">{url}</a>);
    }
    if (type === "GUEST"){
      const url = `http://${host}/guest?email=${encodeURI(email)}&group=${encodeURI(groupData.id)}`;
      return (<a href = {url} target = "_blank">{url}</a>);
    }
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
      setIsDone(true);
      completeGroup(data);
    } catch (err) {
      //setError(err.message); 
      console.error('There was an error!', err);
    }
  };

  const renderDoneButton = () => {
    const readyToSubmit = 
      !!groupName && 
      !!ownerEmail && 
      !!selectedRestaurant &&
      !!guestEmails.length &&
      !isDone;
    
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

  const renderGuestEmails = (emails: string[]) => {
    const emailFields = [];
    for (let i = 0; i < 3; i++) {
      if(i <= emails.length){
        emailFields.push(
           <div class = "m-5" key = {i}>
            <TextField
                label="Enter a Guest's Email" 
                sx = {{width: 260}}
                variant = "outlined"
                value = {emails[i] || ''}
                inputProps = {{maxLength : 255}}
                onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                  const temp = guestEmails;
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

  const renderFinished = () =>{
    return (
      <Modal
        open={isDone}
      >
        <div class = "flex h-screen w-full justify-center"> 
          <div class = "m-25 text-2xl"> 
            <p>Group {groupData.name} Created</p> 
              <p>Owner Link</p> 
              <p>{generateLink("OWNER", groupData.owner)}</p> 
              <p>Guest Links</p>
                {groupData.emails.map((guest) => (
              <p key= 'guest'>{generateLink("GUEST", guest)}</p>
            ))}
          </div> 
        </div>
      </Modal>
    )
  }

  if (isLoadingRestaurant) {return 
    <>
      <p className = 'm-5 text-3xl'>Loading...</p>
    </>
  }

  return (
    <>
      <p class = 'text-3xl m-5'> Create a group </p>
        <div class ='flex'>
          <div>
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
                  value = {selectedRestaurant}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedRestaurant(event.target.value);
                  }}
                >
                {restaurantData.map((restaurant) => (
                    <MenuItem key= {restaurant.name} value={restaurant}>{restaurant.name}</MenuItem>
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
        </div>

        {menuData && <Menu menuData= {menuData} />}

      </div>

      {isDone && renderFinished()}

    </>
  );
}
import Button from '@mui/material/Button';

export default function MenuItem(props) {

  const buttonStyle = { fontSize: '20px', padding: '0px', 'min-width': '40px', 'min-height': '20px'}

  return (
      <div class ='flex justify-between'>
        <p class = 'text-lg p-1 ml-3'>
          {props.item.name} - {props.item.priceString}
        </p>
        {props.addItemCallback && (
          <span class = 'ml-5 mr-5 mb-2'> 
            <Button
              style= {buttonStyle}
              variant = "outlined"
              onClick = {() => {props.addItemCallback(props.item, 'ADD')}}
            > + </Button>
            <span class ="ml-2"/> 
            <Button
              style= {buttonStyle}
              variant = "outlined"
              onClick = {() => {props.addItemCallback(props.item, 'SUBTRACT')}}
            > - </Button>
          </span>)
        } 
      </div>
  );
}
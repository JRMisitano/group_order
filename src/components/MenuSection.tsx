import MenuItem from './MenuItem';

export default function MenuSection(props) {

  const items = [];

  Object.keys(props.items).forEach(key => {
    items.push({...props.items[key], id: key})
  });

  return (
    <>
      <p class = 'text-xl p-1 pl-2'>
      {props.title}
      </p>

      {items.map((item) => 
        <MenuItem key = {item.id} item = {item} addItemCallback = {props.addItemCallback}/>
      )}
    </>
  );
}
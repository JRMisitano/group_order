import MenuItem from './MenuItem';

export default function MenuSection(props) {

const items = [];

Object.keys(props.items).forEach(key => {
  items.push({...props.items[key], id: key})
});

console.log(items)
console.log(props)

  return (
    <>
      <div>
      {props.title}
      </div>

      {items.map((item) => 
        <MenuItem key = {item.id} item = {item} />
      )}
    </>
  );
}
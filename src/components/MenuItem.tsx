export default function MenuItem(props) {


//console.log(props.item)

  return (
    <>
      <div>
      {props.item.name} | {props.item.priceString} | {props.item.id}
      </div>
  
    </>
  );
}
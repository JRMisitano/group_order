import MenuSection from './MenuSection';

export default function Menu(props) {
  
  const menuSections = props.menuData.items;
  const sectionOrder = [
    {key: 'mains', title: 'Mains'},
    {key: 'sides', title: 'Sides'},
    {key: 'drinks', title: 'Drinks'}
    ];

  return (
    <div class = 'm-5 '>
      <p class = 'text-2xl'>Menu</p>
      {sectionOrder.map((sectionOrder) =>
        <MenuSection 
          title = {sectionOrder.title} 
          items = {menuSections[sectionOrder.key]}
          key = {sectionOrder.key} 
          addItemCallback = {props.addItemCallback}
        />
      )}
    </div>
  );
}


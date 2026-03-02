import MenuSection from './MenuSection';

export default function Menu(props) {
  
  const menuSections = props.menuData.items;
  const sectionOrder = [
    {key: 'mains', title: 'Mains'},
    {key: 'sides', title: 'Sides'},
    {key: 'drinks', title: 'Drinks'}
    ];

  return (
    <>
      {sectionOrder.map((sectionOrder) => 
        <MenuSection 
          title = {sectionOrder.title} 
          items = {menuSections[sectionOrder.key]} />
      )}
    </>
  );
}

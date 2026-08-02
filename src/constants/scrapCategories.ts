export interface ScrapCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export const SCRAP_CATEGORIES: ScrapCategory[] = [
  {
    id: 'metal',
    name: 'Metal Scrap',
    icon: 'cube',
    subcategories: [
      'Iron and Steel (Old machinery, HMS, rebar)',
      'Copper (Wires, cables, pipes, motors)',
      'Aluminium (Window frames, utensils, foil)',
      'Brass and Bronze (Taps, valves, sheets)',
      'Lead and Zinc (Batteries, lead sheets)'
    ]
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    icon: 'document-text',
    subcategories: [
      'Newspapers and Books',
      'Cartons and Corrugated Boxes (CFB)',
      'Office Registers and Brown Paper'
    ]
  },
  {
    id: 'plastic_glass',
    name: 'Plastic & Glass',
    icon: 'flask',
    subcategories: [
      'Rigid and Soft Plastics (PET bottles, PVC pipes)',
      'HDPE Containers and Buckets',
      'Glass (Broken bottles, jars, window panes)'
    ]
  },
  {
    id: 'ewaste',
    name: 'Electronic Scrap (E-Waste)',
    icon: 'hardware-chip',
    subcategories: [
      'IT & Appliances (Computers, laptops, circuit boards)',
      'Mobile Phone Batteries and Printer parts',
      'Large Appliances (Fridges, ACs, washing machine compressors)'
    ]
  }
];


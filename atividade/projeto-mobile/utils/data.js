
export const scrollViewData = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  description: `Descrição do item ${i + 1}`,
}));


export const flatListData = Array.from({ length: 80 }, (_, i) => ({
  id: i.toString(),
  name: `Item ${i + 1}`,
}));


export const sectionListData = [
  {
    title: 'Seção 1',
    data: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
  },
  {
    title: 'Seção 2',
    data: ['Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'],
  },
  {
    title: 'Seção 3',
    data: ['Item 11', 'Item 12', 'Item 13', 'Item 14', 'Item 15'],
  },
];

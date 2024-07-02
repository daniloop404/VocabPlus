export interface Word {
    english: string;
    spanish: string;
    image: any; // Cambiar a 'any' para permitir require()
    audio: any; // Cambiar a 'any' para permitir require()
  }
  
  export interface Category {
    name: string;
    nameSpanish: string;
    words: Word[];
    image: any; // Cambiar a 'any' para permitir require()
  }
  
  const categories: Category[] = [
    {
      name: 'Food and Drink',
      nameSpanish: 'Comida y Bebida',
      image: require('../../assets/images/food/food.png'),
      words: [
        { english: 'apple', spanish: 'manzana', image: require('../../assets/images/food/apple.png'), audio: require('../../assets/audios/food/apple.mp3') },
        { english: 'bread', spanish: 'pan', image: require('../../assets/images/food/bread.png'), audio: require('../../assets/audios/food/bread.mp3') },
        { english: 'cheese', spanish: 'queso', image: require('../../assets/images/food/cheese.png'), audio: require('../../assets/audios/food/cheese.mp3') },
      ],
    },
    {
      name: 'Animals',
      nameSpanish: 'Animales',
      image: require('../../assets/images/animals/animals.png'),
      words: [
        { english: 'dog', spanish: 'perro', image: require('../../assets/images/animals/dog.png'), audio: require('../../assets/audios/animals/dog.mp3') },
        { english: 'cat', spanish: 'gato', image: require('../../assets/images/animals/cat.png'), audio: require('../../assets/audios/animals/cat.mp3') },
        { english: 'bird', spanish: 'pájaro', image: require('../../assets/images/animals/bird.png'), audio: require('../../assets/audios/animals/bird.mp3') },
      ],
    },
  ];
  
  export default categories;
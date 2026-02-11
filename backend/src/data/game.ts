export interface GameObject {
  id: number;
  name: string;
  image: string; // Emoji or Image URL
  category: 'fruits' | 'animals' | 'shapes' | 'colors';
  difficulty: 1 | 2 | 3; // 1 = Easy (Apple), 3 = Hard (Octagon/Rhino)
}

export const GAME_DATA: GameObject[] = [
  // Fruits
  { id: 1, name: "Apple", image: "🍎", category: "fruits", difficulty: 1 },
  { id: 2, name: "Banana", image: "🍌", category: "fruits", difficulty: 1 },
  { id: 3, name: "Grapes", image: "🍇", category: "fruits", difficulty: 2 },
  { id: 4, name: "Strawberry", image: "🍓", category: "fruits", difficulty: 2 },
  { id: 5, name: "Pineapple", image: "🍍", category: "fruits", difficulty: 3 },

  // Animals
  { id: 6, name: "Dog", image: "🐶", category: "animals", difficulty: 1 },
  { id: 7, name: "Cat", image: "🐱", category: "animals", difficulty: 1 },
  { id: 8, name: "Lion", image: "🦁", category: "animals", difficulty: 2 },
  { id: 9, name: "Elephant", image: "🐘", category: "animals", difficulty: 2 },
  { id: 10, name: "Giraffe", image: "🦒", category: "animals", difficulty: 3 },
  { id: 11, name: "Octopus", image: "🐙", category: "animals", difficulty: 3 },

  // Shapes
  { id: 12, name: "Circle", image: "🔴", category: "shapes", difficulty: 1 },
  { id: 13, name: "Square", image: "🟦", category: "shapes", difficulty: 1 },
  { id: 14, name: "Triangle", image: "🔺", category: "shapes", difficulty: 2 },
  { id: 15, name: "Star", image: "⭐", category: "shapes", difficulty: 2 },
  { id: 16, name: "Diamond", image: "💠", category: "shapes", difficulty: 3 },

  // Colors
  { id: 17, name: "Red", image: "🟥", category: "colors", difficulty: 1 },
  { id: 18, name: "Blue", image: "🟦", category: "colors", difficulty: 1 },
  { id: 19, name: "Green", image: "🟩", category: "colors", difficulty: 1 },
  { id: 20, name: "Purple", image: "🟪", category: "colors", difficulty: 2 },
  { id: 21, name: "Orange", image: "🟧", category: "colors", difficulty: 2 },
];
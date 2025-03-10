# Décimas - Spanish Poetry Creator

A Next.js application for creating Spanish "Décimas" - a traditional form of poetry with a specific structure.

## About Décimas

A Décima is a form of poetry that consists of 10 verses, each with 8 syllables, following the rhyme pattern ABBAACCDDC.

This application helps poets create Décimas by:
- Counting syllables in real-time as you type
- Highlighting when you've reached the target of 8 syllables per verse
- Suggesting rhyming words based on the rhyme pattern
- Considering Spanish syllable counting rules (e.g., adjacent vowels count as a single syllable)

## Features

- Real-time syllable counting
- Visual feedback on syllable count (red, yellow, green)
- Rhyme suggestions based on the ABBAACCDDC pattern
- Preview of your completed Décima
- Modern, responsive UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/decimas.git
cd decimas
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Details

This project is built with:
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hooks

## How It Works

The application uses custom algorithms to:
1. Count syllables in Spanish text, considering rules like adjacent vowels
2. Identify rhyme patterns in words
3. Suggest rhyming words based on the Décima structure

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the rich tradition of Spanish poetry
- Built with modern web technologies for poets in the digital age

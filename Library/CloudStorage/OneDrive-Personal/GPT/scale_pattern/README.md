# Scale Pattern Visualizer

A web application to help music theory students understand and visualize different scale patterns. This tool provides an interactive way to learn about various musical scales and their interval patterns.

## Features

- Visual representation of scale patterns using whole steps (W) and half steps (H)
- Support for common scales including:
  - Major Scale
  - Natural Minor Scale
  - Harmonic Minor Scale
  - Melodic Minor Scale
  - Church Modes (Dorian, Phrygian, Lydian, Mixolydian, Locrian)
- Clean, modern interface
- Educational descriptions for each scale

## Getting Started

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. Select a scale from the dropdown menu
2. Observe the pattern of whole steps (W) and half steps (H)
3. Read the description to learn more about the selected scale
4. Try different scales to understand their unique patterns

## Understanding the Patterns

- W = Whole Step (2 semitones)
- H = Half Step (1 semitone)
- W+H = Step and a Half (3 semitones)

The arrows between the steps show the progression of the scale pattern.

## Technologies Used

- React
- Vite
- Material-UI
- Emotion (for styling) 
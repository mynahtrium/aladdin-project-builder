# AI Project Builder for Aladdin Platform

This is an AI-driven project generator designed to integrate with the [Aladdin Platform](https://institute-for-future-intelligence.github.io/aladdin/). It guides users through scientific hypothesis testing and generates simulation prompts.

## Features

- **Interactive AI Assistant**: Guides you through defining your hypothesis, design criteria, and experimental variables.
- **Automated Prompt Generation**: Creates optimized prompts for Aladdin based on your inputs.
- **One-Click Integration**: Easily copy prompts and open the Aladdin platform.
- **Data Analysis**: Upload CSV files exported from Aladdin to view and analyze your experimental data.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Chat with the AI**: Start by stating your research hypothesis (e.g., "Can a house produce more energy than it consumes?").
2. **Answer Follow-up Questions**: The AI will ask about design criteria (house style, insulation) and test variables (panel orientation, seasons).
3. **Generate Project**: Once enough information is gathered, the AI will generate a prompt.
4. **Launch Aladdin**: Click "Open Aladdin Platform" and paste the generated prompt into Aladdin's AI input.
5. **Analyze Results**: After running simulations in Aladdin, export the data as CSV and upload it here using the "Upload Aladdin CSV Export" feature.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

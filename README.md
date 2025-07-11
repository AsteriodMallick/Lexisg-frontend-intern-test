# Lexi Legal Assistant - Frontend Interface

A minimal frontend interface for a legal assistant that allows users to ask legal questions, receive AI-generated answers, and view citations from relevant legal documents.

## Features

- **Chat Interface**: ChatGPT-like conversational interface
- **Legal Q&A**: Ask legal questions and receive detailed answers
- **Citation System**: View citations from legal documents with source information
- **PDF Integration**: Click citations to open original PDF documents
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during answer generation

## Tech Stack

- **React.js** with Next.js App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/lexisg-frontend-intern-test.git
cd lexisg-frontend-intern-test
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Example Query

Try this sample legal question:

> "In a motor accident claim where the deceased was self-employed and aged 54–55 years at the time of death, is the claimant entitled to an addition towards future prospects in computing compensation under Section 166 of the Motor Vehicles Act, 1988? If so, how much?"

### Features Demonstrated

1. **Question Input**: Type your legal question in the text area
2. **AI Response**: Receive a detailed legal answer with proper citations
3. **Citation Viewing**: Click on citations to view source information
4. **PDF Access**: Citations link to original legal documents

## Implementation Details

### Citation Handling

Citations are displayed as interactive cards below each AI response. Each citation includes:

- **Quote Text**: Relevant excerpt from the legal document
- **Source**: Document name (e.g., "Dani_Devi_v_Pritam_Singh.pdf")
- **Paragraph Reference**: Specific paragraph location (e.g., "Para 7")
- **External Link**: Direct link to the PDF document

### Simulated API

The application uses a simulated API response for demonstration:

\`\`\`javascript
const simulatedResponse = {
  answer: "Yes, under Section 166 of the Motor Vehicles Act, 1988...",
  citations: [
    {
      text: "as the age of the deceased at the time of accident...",
      source: "Dani_Devi_v_Pritam_Singh.pdf",
      link: "https://lexisingapore-my.sharepoint.com/...",
      paragraph: "Para 7"
    }
  ]
}
\`\`\`

### PDF Integration

When users click on a citation:
1. A modal opens showing PDF information
2. The PDF opens in a new browser tab
3. In a production environment, this would scroll to and highlight the specific paragraph

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── utils.ts              # Utility functions
└── README.md
\`\`\`

## Future Enhancements

- **Real Backend Integration**: Connect to actual legal AI API
- **PDF Viewer**: Embed PDF viewer with paragraph highlighting
- **Search History**: Save and retrieve previous queries
- **Advanced Citations**: Support for multiple citation formats
- **User Authentication**: User accounts and saved conversations
- **Document Upload**: Allow users to upload their own legal documents

## Screenshots

### Main Interface
![Main Interface](screenshot-main.png)

### Citation Modal
![Citation Modal](screenshot-citation.png)

## License

This project is created for the Lexi Singapore frontend internship assessment.

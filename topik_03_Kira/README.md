# KickAI Judge

AI-powered kickboxing judging system using computer vision technology.

## Overview

KickAI Judge analyzes kickboxing matches in real-time using video cameras to provide objective judging assistance. The system detects strikes, assesses impact, and generates statistics to help judges make informed decisions.

## Features

- Real-time strike detection and classification
- Impact assessment and clean hit determination
- Video clip generation with annotations
- Judge dashboard with live statistics
- Mobile app for fans and amateur fighters
- Tournament integration and analytics

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Computer Vision**: Python + OpenCV + TensorFlow/PyTorch
- **Database**: PostgreSQL + InfluxDB
- **Cloud**: AWS/Google Cloud for professional tournaments

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- NVIDIA GPU (GTX 1650+ recommended)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

## Project Structure

```
kickai-judge/
├── backend/                 # Node.js backend services
│   ├── src/
│   │   ├── api/            # REST API endpoints
│   │   ├── models/         # Data models and schemas
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
├── frontend/               # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Frontend utilities
├── computer-vision/        # Python CV processing
│   ├── src/
│   │   ├── models/         # AI models
│   │   ├── processors/     # Video processing
│   │   └── utils/          # CV utilities
├── mobile/                 # React Native mobile app
├── shared/                 # Shared TypeScript types
└── docs/                   # Documentation
```

## License

MIT License - see LICENSE file for details.
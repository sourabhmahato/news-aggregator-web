# News Aggregator Web Application


## ✨ Features

* **Multi-source News Aggregation**: Fetches articles from NewsAPI and World News API
* **Advanced Search & Filtering**: Search by keywords, date range, category, and source
* **Personalized Feed**: Customize sources, categories, and authors
* **Category Filtering**: Filter by Technology, Business, Politics, Sports, Entertainment, and Science
* **Theme System**: Light/Dark mode with persistent storage
* **Responsive Design**: Works on all device sizes
* **Real-time Filtering**: Instant results when changing filters
* **Auto-refresh**: Keeps content fresh automatically

---

## 🛣️ Docker Deployment



### Prerequisites

* Docker and Docker Compose installed
* API keys for NewsAPI and World News API

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_NEWSAPI_KEY=your_newsapi_key_here
REACT_APP_WORLDNEWS_KEY=your_worldnews_key_here
REACT_APP_GNEWS_KEY=your_worldnews_key_here
```

### Production Deployment

```bash
docker-compose up --build
# or run in background
docker-compose up -d --build
```

Access the app at: [http://localhost:3000](http://localhost:3000)
Health Check: [http://localhost:3000/health](http://localhost:3000/health)

Stop the app:

```bash
docker-compose down
```

### Development Deployment

```bash
docker-compose --profile dev up --build
```

Access dev server: [http://localhost:3001](http://localhost:3001)

### Manual Docker Commands

#### Production Build

```bash
docker build -t news-aggregator:latest .
docker run -p 3000:80 \
  -e REACT_APP_NEWSAPI_KEY=your_key \
  -e REACT_APP_WORLDNEWS_KEY=your_key \
  news-aggregator:latest
```

#### Development Build

```bash
docker build -f Dockerfile.dev -t news-aggregator:dev .
docker run -p 3001:3000 \
  -v $(pwd):/app \
  -e REACT_APP_NEWSAPI_KEY=your_key \
  -e REACT_APP_WORLDNEWS_KEY=your_key \
  news-aggregator:dev
```

---

## 📁 Project Structure

```
src/
├── api/                    # API integrations
├── components/             # UI components
├── constants/              # App constants
├── context/                # Context providers
├── services/               # Business logic services
├── types/                  # Type definitions
├── utils/                  # Utility functions
└── styles/                 # Theme & global styles
```

---

## 🔧 Local Development

### Prerequisites

* Node.js 18+ and npm
* API keys for NewsAPI and World News API

### Installation

```bash
npm install
cp .env.example .env  # Add API keys
npm start
```

### Available Scripts

```bash
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from CRA
```

---

## 🔑 API Keys Required

1. [NewsAPI](https://newsapi.org/)
2. [World News API](https://worldnewsapi.com/)
3. [GNews API](https://gnews.io/)

---

## 🦚 Testing

```bash
npm test               # Run tests
npm test -- --coverage # With coverage
npm test -- --watch    # Watch mode
```

---

## 📆 Build for Production

```bash
npm run build
```

Output: `build/` folder

---

## 🚀 Deployment Options

### 1. Docker (Recommended)

* Production: `docker-compose up --build`
* Development: `docker-compose --profile dev up --build`

### 2. Static Hosting

* Netlify / Vercel / AWS S3

### 3. Traditional Hosting

* Upload `build/` folder
* Ensure SPA routing is configured

---

## 🔍 Troubleshooting

### Docker Issues

```bash
docker system prune -a
docker-compose build --no-cache
docker-compose logs news-aggregator
```

### API Issues

* Check `.env` file
* Inspect browser network tab

### Build Issues

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

MIT License

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch
3. Implement and test
4. Submit a pull request

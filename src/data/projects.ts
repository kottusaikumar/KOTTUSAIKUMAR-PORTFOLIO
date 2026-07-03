// Source-of-truth content for the "My Projects" card grid.
// Each entry drives one card: video thumbnail, title, meta tags,
// the one-line "highlight" stat, and the outbound GitHub link.
export const PROJECTS = [
  {
    id: "01",
    name: "AI Resume Screening System",
    category: "NLP Ranking · TF-IDF · BM25 · Skill Matching",
    focus: "NLP Ranking",
    highlight: "Semantic Candidate Match Scoring",
    description:
      "A recruiter-focused screening engine that compares resumes with job descriptions using TF-IDF, BM25, cosine similarity, n-grams, fuzzy matching, synonym mapping, and missing-skill recommendations. The new visual direction treats it like a premium candidate intelligence console rather than a normal dashboard screenshot.",
    video: "/projects/videos/resume-screening.mp4",
    link: "https://github.com/kottusaikumar/AI-Resume-Screening-System",
  },
  {
    id: "02",
    name: "Hybrid RAG Document Assistant",
    category: "RAG · FAISS/BM25 · LangChain · Production Chatbot",
    focus: "RAG",
    highlight: "Hybrid Semantic + Keyword Retrieval",
    description:
      "A document assistant concept built around hybrid retrieval: dense semantic search plus sparse keyword matching, then answer synthesis over grounded context. The project card now uses a document-to-vector-to-answer visual metaphor so recruiters instantly understand the AI workflow.",
    video: "/projects/videos/rag-assistant.mp4",
    link: "https://github.com/kottusaikumar/Hybrid-RAG-Document-Assistant-Production-Chatbot-",
  },
  {
    id: "03",
    name: "TradePro Trading Dashboard",
    category: "Flask · Plotly · Technical Indicators · Market UI",
    focus: "Flask",
    highlight: "OHLC Charting · VWAP · EMA · RSI",
    description:
      "A trading analytics dashboard with interactive multi-pane charts, CSV/RAR local data handling, OHLC transformations, and indicators such as VWAP, EMA, and RSI. The new image gives it a Bloomberg-terminal style premium finance identity.",
    video: "/projects/videos/tradepro-dashboard.mp4",
    link: "https://github.com/kottusaikumar/Tradepro-Trading-Dashboard",
  },
  {
    id: "04",
    name: "Instagram Data Exploration",
    category: "EDA · Pandas · Seaborn · Sentiment + Hashtag Patterns",
    focus: "EDA",
    highlight: "Engagement & Sentiment Analytics",
    description:
      "An exploratory analytics project uncovering engagement patterns across Instagram data: likes, comments, shares, sentiment, captions, hashtag behavior, and trend visualizations. The artwork now feels like a social-intelligence analytics lab instead of a generic chart screenshot.",
    video: "/projects/videos/instagram-analytics.mp4",
    link: "https://github.com/kottusaikumar/Unveiling-Patterns-Instagram-Data-Exploration",
  },
  {
    id: "05",
    name: "Weapon Detection & Identification",
    category: "Computer Vision · VGG19 · Custom CNN · Streamlit",
    focus: "Computer Vision",
    highlight: "VGG19 + Custom CNN Classifier",
    description:
      "A computer-vision app for classifying weapon categories using deep learning models including VGG19 and a custom CNN, delivered through a Streamlit upload/classification workflow. The new image uses a tactical scanning interface to visually reinforce the classification theme.",
    video: "/projects/videos/weapon-detection.mp4",
    link: "https://github.com/kottusaikumar/weapons-Detection-identification-using-Image-Recognition",
  },
];

const { useState, useEffect, useRef } = React;

// Multilingual Dictionary
const I18N = {
  en: {
    appName: "HydroShield Pro",
    liveSubtitle: "AI Flood Early Warning & Evacuation Navigator",
    desktopTag: "v2.4 LTS • Hilly Catchment Hydrological Telemetry",
    sensorsActive: "Sensors Online",
    tabOverview: "Overview",
    tabDirections: "Safe Point Directions",
    tabShelters: "Safe Shelters",
    tabForecast: "24h Forecast",
    tabAlerts: "Civil Defense",
    sosButton: "SOS Emergency",
    refreshIn: "Refresh in",
    useGps: "Live GPS",
    riskTitle: "Catchment Flood Risk",
    hydrologicalFactors: "Contributing Risk Factors",
    weatherMetrics: "Catchment Telemetry",
    rainfall1h: "Rainfall Rate",
    rainfall24h: "24h Accumulated",
    elevation: "Catchment Elevation",
    slope: "Slope Gradient",
    humidity: "Air Humidity",
    pressure: "Pressure",
    soilMoisture: "Soil Saturation",
    windSpeed: "Wind Velocity",
    forecastTitle: "24-Hour Flood Probability Curve",
    sheltersTitle: "Safe Evacuation Shelters",
    sheltersSubtitle: "High-ground ridge centers located above flash torrent valleys",
    findNearestRoute: "Navigate on Google Maps",
    walkingTime: "Walk",
    capacity: "Capacity",
    alertHistory: "Civil Defense Broadcasts",
    emergencySosTitle: "EMERGENCY DISTRESS BEACON",
    sosSubtitle: "Broadcasting real-time GPS coordinates directly to state disaster command",
    shareWhatsapp: "Share Location via WhatsApp",
    call112: "Emergency Call 112",
    callControl: "SDRF Control Room 1077",
    sirenToggle: "Toggle Distress Siren",
    adminTitle: "Disaster Authority Alert Dispatch",
    broadcastAlert: "Broadcast Alert",
    locationLabel: "Target Region",
    riskLevelLabel: "Alert Level",
    messageLabel: "Advisory Message",
    safe: "Low",
    moderate: "Medium",
    high: "High",
    critical: "Critical",
    previewWindows: "Windows Desktop",
    previewMobile: "Mobile App",
    safeRefugeHeader: "NEAREST DESIGNATED SAFE POINT",
    openInGmaps: "Open Turn-by-Turn in Google Maps",
    shareSafeRoute: "Share Evacuation Destination on WhatsApp",
    elevSafetyMargin: "Elevation Safety Advantage",
    currentLocation: "Your Catchment Level",
    safeShelterLevel: "Safe Shelter Ridge",
    ridgeSafetyProtocol: "Mountain Ridge Evacuation Protocols",
    step1Title: "1. Ascend Uphill Immediately",
    step1Desc: "Move away from river ravines, storm drains, and valley streams without delay. Head towards higher elevation ridges.",
    step2Title: "2. Follow Main Ridge Roads via Google Maps",
    step2Desc: "Use paved primary roadways. Keep away from steep mud embankments and unpaved slope edges susceptible to landslides.",
    step3Title: "3. Never Cross Moving Flood Runoff",
    step3Desc: "Even 15 cm (6 inches) of rapid hill torrents can sweep an adult off balance. Turn around; do not wade through gullys.",
    step4Title: "4. Register at Shelter Coordination Desk",
    step4Desc: "Check in on arrival for food rations, dry blankets, potable water, and official family headcounts.",
    altSheltersTitle: "Alternative High-Ground Havens Nearby"
  },
  kn: {
    appName: "ಹೈಡ್ರೋಶೀಲ್ಡ್ ಪ್ರೊ",
    liveSubtitle: "ಪ್ರವಾಹ ಮುನ್ನೆಚ್ಚರಿಕೆ ಮತ್ತು ಸುರಕ್ಷಿತ ಸ್ಥಳ ಮಾರ್ಗದರ್ಶಕ",
    desktopTag: "ಆವೃತ್ತಿ 2.4 • ಗುಡ್ಡಗಾಡು ಜಲಾನಯನ ಟೆಲಿಮೆಟ್ರಿ",
    sensorsActive: "ಸಂವೇದಕಗಳು ಸಕ್ರಿಯ",
    tabOverview: "ಅವಲೋಕನ",
    tabDirections: "ಸುರಕ್ಷಿತ ಸ್ಥಳ ಮಾರ್ಗ",
    tabShelters: "ಸುರಕ್ಷಿತ ಶಿಬಿರಗಳು",
    tabForecast: "೨೪ ಗಂಟೆ ಮುನ್ಸೂಚನೆ",
    tabAlerts: "ವಿಪತ್ತು ನಿರ್ವಹಣೆ",
    sosButton: "SOS ತುರ್ತು",
    refreshIn: "ನವೀಕರಣ",
    useGps: "ಲೈವ್ ಜಿಪಿಎಸ್",
    riskTitle: "ಪ್ರವಾಹ ಅಪಾಯದ ಮಟ್ಟ",
    hydrologicalFactors: "ಅಪಾಯದ ಪ್ರಮುಖ ಅಂಶಗಳು",
    weatherMetrics: "ಬೆಟ್ಟದ ಹವಾಮಾನ ಟೆಲಿಮೆಟ್ರಿ",
    rainfall1h: "ಮಳೆ ತೀವ್ರತೆ",
    rainfall24h: "೨೪ ಗಂಟೆ ಮಳೆ",
    elevation: "ಎತ್ತರ",
    slope: "ಇಳಿಜಾರಿನ ಕೋನ",
    humidity: "ಆರ್ದ್ರತೆ",
    pressure: "ವಾಯುಭಾರ ಒತ್ತಡ",
    soilMoisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
    windSpeed: "ಗಾಳಿಯ ವೇಗ",
    forecastTitle: "೨೪ ಗಂಟೆಗಳ ಅಪಾಯದ ಗ್ರಾಫ್",
    sheltersTitle: "ಸುರಕ್ಷಿತ ನಿರಾಶ್ರಿತ ಶಿಬಿರಗಳು",
    sheltersSubtitle: "ಪ್ರವಾಹದ ಕಣಿವೆಯಿಂದ ಸುರಕ್ಷಿತವಾದ ಎತ್ತರದ ಆಶ್ರಯ ತಾಣಗಳು",
    findNearestRoute: "Google Maps ನಲ್ಲಿ ಮಾರ್ಗ ನೋಡಿ",
    walkingTime: "ನಡೆಯುವ ಸಮಯ",
    capacity: "ಸಾಮರ್ಥ್ಯ",
    alertHistory: "ಎಚ್ಚರಿಕೆ ಇತಿಹಾಸ",
    emergencySosTitle: "ತುರ್ತು SOS ರವಾನೆ",
    sosSubtitle: "ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಕಮಾಂಡ್‌ಗೆ ಲೈವ್ ಸ್ಥಳ ರವಾನಿಸಲಾಗುತ್ತಿದೆ",
    shareWhatsapp: "WhatsApp ನಲ್ಲಿ ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ",
    call112: "ತುರ್ತು ಕರೆ 112",
    callControl: "ನಿಯಂತ್ರಣ ಕೊಠಡಿ 1077",
    sirenToggle: "ಸೈರನ್ ಆನ್/ಆಫ್",
    adminTitle: "ಅಧಿಕಾರಿಗಳ ಪ್ರಸಾರ ಫಲಕ",
    broadcastAlert: "ಪ್ರಸಾರ ಮಾಡಿ",
    locationLabel: "ಉದ್ದೇಶಿತ ಪ್ರದೇಶ",
    riskLevelLabel: "ಅಪಾಯದ ಮಟ್ಟ",
    messageLabel: "ಎಚ್ಚರಿಕೆ ಸಂದೇಶ",
    safe: "ಕಡಿಮೆ",
    moderate: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    critical: "ತುರ್ತು",
    previewWindows: "ವಿಂಡೋಸ್ ಡೆಸ್ಕ್‌ಟಾಪ್",
    previewMobile: "ಮೊಬೈಲ್ ಆ್ಯಪ್",
    safeRefugeHeader: "ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ಆಶ್ರಯ ತಾಣ",
    openInGmaps: "Google Maps ನಲ್ಲಿ ಮಾರ್ಗ ತೆರೆಯಿರಿ",
    shareSafeRoute: "WhatsApp ನಲ್ಲಿ ಸುರಕ್ಷಿತ ತಾಣ ಹಂಚಿಕೊಳ್ಳಿ",
    elevSafetyMargin: "ಎತ್ತರದ ಸುರಕ್ಷತಾ ಅಂತರ",
    currentLocation: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳ",
    safeShelterLevel: "ಸುರಕ್ಷಿತ ಶಿಬಿರದ ಎತ್ತರ",
    ridgeSafetyProtocol: "ಪರ್ವತ ತೆರವು ಸುರಕ್ಷತಾ ನಿಯಮಗಳು",
    step1Title: "೧. ತಕ್ಷಣ ಮೇಲ್ಭಾಗಕ್ಕೆ ತೆರಳಿ",
    step1Desc: "ನದಿ ತೊರೆಗಳು ಹಾಗೂ ಕಣಿವೆ ಕಾಲುವೆಗಳಿಂದ ತಕ್ಷಣ ದೂರವಾಗಿ ಬೆಟ್ಟದ ಎತ್ತರದ ರಸ್ತೆಗೆ ತೆರಳಿ.",
    step2Title: "೨. Google Maps ನ ಮುಖ್ಯ ರಸ್ತೆಯನ್ನು ಬಳಸಿ",
    step2Desc: "ಡಾಂಬರು ಹಾಕಿದ ರಸ್ತೆಗಳನ್ನೇ ಬಳಸಿ; ಭೂಕುಸಿತದ ಸಾಧ್ಯತೆ ಇರುವ ಕಚ್ಚಾ ಮಣ್ಣಿನ ಬದಿಗಳಿಂದ ದೂರವಿರಿ.",
    step3Title: "೩. ಹರಿಯುವ ನೀರಿನಲ್ಲಿ ಕಾಲಿಡಬೇಡಿ",
    step3Desc: "ಕೇವಲ ೧೫ ಸೆಂ.ಮೀ ರಭಸದ ನೀರು ಕೂಡ ಮನುಷ್ಯನನ್ನು ಕೊಚ್ಚಿಕೊಂಡು ಹೋಗಬಲ್ಲದು. ಹಳ್ಳ ದಾಟಬೇಡಿ.",
    step4Title: "೪. ಶಿಬಿರದ ನೋಂದಣಿ ಕೇಂದ್ರಕ್ಕೆ ವರದಿ ಮಾಡಿ",
    step4Desc: "ಸುರಕ್ಷಿತ ಶಿಬಿರ ತಲುಪಿದ ತಕ್ಷಣ ಆಹಾರ, ಕುಡಿಯುವ ನೀರು ಹಾಗೂ ವೈದ್ಯಕೀಯ ನೆರವಿಗೆ ಹೆಸರು ನೋಂದಾಯಿಸಿ.",
    altSheltersTitle: "ಸಮೀಪದ ಇತರ ಸುರಕ್ಷಿತ ಕೇಂದ್ರಗಳು"
  },
  hi: {
    appName: "हाइड्रोशील्ड प्रो",
    liveSubtitle: "बाढ़ पूर्व चेतावनी एवं सुरक्षित स्थल मार्गदर्शक",
    desktopTag: "संस्करण 2.4 • पर्वतीय जलग्रहण टेलीमेट्री",
    sensorsActive: "सेंसर ऑनलाइन",
    tabOverview: "अवलोकन",
    tabDirections: "सुरक्षित स्थल मार्ग",
    tabShelters: "राहत शिविर",
    tabForecast: "24h पूर्वानुमान",
    tabAlerts: "आपदा प्रबंधन",
    sosButton: "SOS आपातकाल",
    refreshIn: "रिफ्रेश",
    useGps: "लाइव GPS",
    riskTitle: "बाढ़ जोखिम स्तर",
    hydrologicalFactors: "जोखिम कारक",
    weatherMetrics: "पर्वतीय टेलीमेट्री",
    rainfall1h: "वर्षा दर",
    rainfall24h: "24h वर्षा",
    elevation: "ऊंचाई",
    slope: "ढलान कोण",
    humidity: "आर्द्रता",
    pressure: "वायुदाब",
    soilMoisture: "मिट्टी नमी",
    windSpeed: "हवा गति",
    forecastTitle: "24-घंटे का जोखिम वक्र",
    sheltersTitle: "सुरक्षित राहत शिविर",
    sheltersSubtitle: "घाटी से सुरक्षित ऊंचे राहत केंद्र",
    findNearestRoute: "Google Maps पर नेविगेट करें",
    walkingTime: "पैदल समय",
    capacity: "क्षमता",
    alertHistory: "चेतावनी इतिहास",
    emergencySosTitle: "आपातकालीन SOS ट्रांसमीटर",
    sosSubtitle: "आपदा नियंत्रण कक्ष को लाइव लोकेशन प्रेषित",
    shareWhatsapp: "WhatsApp पर लोकेशन भेजें",
    call112: "आपातकालीन 112",
    callControl: "कंट्रोल रूम 1077",
    sirenToggle: "सायरन चालू/बंद",
    adminTitle: "प्राधिकरण चेतावनी प्रसारण",
    broadcastAlert: "प्रसारित करें",
    locationLabel: "लक्षित क्षेत्र",
    riskLevelLabel: "जोखिम स्तर",
    messageLabel: "सलाह संदेश",
    safe: "कम",
    moderate: "मध्यम",
    high: "उच्च",
    critical: "गंभीर",
    previewWindows: "विंडोज डेस्कटॉप",
    previewMobile: "मोबाइल ऐप",
    safeRefugeHeader: "निकटतम सुरक्षित शरण स्थल",
    openInGmaps: "Google Maps में दिशा-निर्देश खोलें",
    shareSafeRoute: "WhatsApp पर सुरक्षित स्थल शेयर करें",
    elevSafetyMargin: "ऊंचाई का सुरक्षा लाभ",
    currentLocation: "आपकी वर्तमान ऊंचाई",
    safeShelterLevel: "सुरक्षित शिविर ऊंचाई",
    ridgeSafetyProtocol: "पहाड़ी सुरक्षित निकासी नियम",
    step1Title: "1. तुरंत ऊंचाई की ओर बढ़ें",
    step1Desc: "नदी, नालों और घाटी के रास्तों से तुरंत दूर होकर ऊंची पहाड़ी सड़कों की ओर प्रस्थान करें।",
    step2Title: "2. Google Maps के मुख्य मार्ग का अनुसरण करें",
    step2Desc: "पक्की सड़कों पर रहें; भूस्खलन संभावित कच्ची मिट्टी वाले किनारों से दूर रहें।",
    step3Title: "3. बहते पानी को पार न करें",
    step3Desc: "मात्र 15 सेमी बहता पानी भी व्यक्ति को बहा सकता है। कभी भी नाले में न उतरें।",
    step4Title: "4. राहत शिविर समन्वय केंद्र में रिपोर्ट करें",
    step4Desc: "शिविर पहुंचने पर भोजन, पेयजल और प्राथमिक चिकित्सा हेतु पंजीकरण कराएं।",
    altSheltersTitle: "समीपस्थ अन्य सुरक्षित शरण स्थल"
  }
};

// Web Audio Siren Generator
class AudioSiren {
  constructor() {
    this.ctx = null;
    this.osc = null;
    this.lfo = null;
    this.isPlaying = false;
  }
  start() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx) this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      this.osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.value = 1.8;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 280;
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc.frequency);
      this.osc.frequency.setValueAtTime(750, this.ctx.currentTime);
      this.osc.connect(gain);
      gain.connect(this.ctx.destination);
      this.osc.start();
      this.lfo.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn("Audio Siren error:", e);
    }
  }
  stop() {
    if (this.osc) {
      try {
        this.osc.stop();
        if (this.lfo) this.lfo.stop();
        this.osc.disconnect();
      } catch (e) {}
      this.osc = null;
      this.lfo = null;
    }
    this.isPlaying = false;
  }
}
const siren = new AudioSiren();

// Initial View Mode Detection:
// Laptop / Desktop -> defaults to 'windows'
// Mobile phone -> defaults to 'mobile'
const detectInitialMode = () => {
  const saved = localStorage.getItem('hydroshield_view_mode');
  if (saved === 'windows' || saved === 'mobile') {
    return saved;
  }
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isNarrowScreen = window.innerWidth < 900;
  return (isMobileUA || isNarrowScreen) ? 'mobile' : 'windows';
};

function App() {
  const [viewMode, setViewMode] = useState(detectInitialMode);
  const [lang, setLang] = useState("en");
  const t = I18N[lang] || I18N.en;

  // Active Tab for Mobile & Desktop Right Column
  // 0: Overview, 1: Safe Directions, 2: Shelters, 3: Forecast, 4: Alerts/Admin
  const [activeTab, setActiveTab] = useState(0);
  const [desktopRightTab, setDesktopRightTab] = useState("shelters"); // 'shelters', 'forecast', 'alerts'

  // Locations & Coordinates
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [currentCoords, setCurrentCoords] = useState({ lat: 12.4244, lon: 75.7382, name: "Madikeri / Kodagu" });

  // Telemetry & Predictions
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(600);

  // Shelters & Safe Evacuation Point
  const [sheltersData, setSheltersData] = useState({ shelters: [], nearest_shelter: null });
  const [selectedSafePoint, setSelectedSafePoint] = useState(null);

  // Alerts History
  const [alertHistory, setAlertHistory] = useState([]);

  // Modals
  const [showSosModal, setShowSosModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [sirenActive, setSirenActive] = useState(false);
  const [sosResult, setSosResult] = useState(null);

  // Admin Broadcast form
  const [adminForm, setAdminForm] = useState({
    location: "Madikeri / Kodagu",
    risk_level: "Critical",
    message_en: "IMMEDIATE EVACUATION: Mountain runoff breach detected near river catchment.",
    message_kn: "ತಕ್ಷಣ ತೆರವು: ನದಿ ಜಲಾನಯನ ಪ್ರದೇಶದ ಬಳಿ ಬೆಟ್ಟದ ನೀರಿನ ಉಕ್ಕಿ ಹರಿಯುವಿಕೆ ಪತ್ತೆಯಾಗಿದೆ.",
    message_hi: "तत्काल निकासी: पहाड़ी नदी के जलग्रहण क्षेत्र में जल स्तर खतरे से ऊपर।"
  });
  const [adminBroadcastSuccess, setAdminBroadcastSuccess] = useState(false);

  // Chart references
  const desktopChartRef = useRef(null);
  const mobileChartRef = useRef(null);
  const chartInstance = useRef(null);

  // Clock
  const [clockTime, setClockTime] = useState("09:41");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('hydroshield_view_mode', mode);
  };

  // 1. Initial Load: Locations & Model Info & Alerts
  useEffect(() => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(data => {
        if (data.regions && data.regions.length > 0) {
          setRegions(data.regions);
          setSelectedRegion(data.regions[0].id);
          setCurrentCoords({
            lat: data.regions[0].lat,
            lon: data.regions[0].lon,
            name: data.regions[0].name
          });
        }
      })
      .catch(err => console.error("Error fetching locations:", err));

    fetch("/api/model/info")
      .then(res => res.json())
      .then(data => setModelInfo(data.metadata))
      .catch(err => console.error("Error fetching model info:", err));

    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    fetch("/api/alerts?limit=30")
      .then(res => res.json())
      .then(data => setAlertHistory(data.alerts || []))
      .catch(err => console.error("Error fetching alerts:", err));
  };

  // 2. Fetch Prediction & Telemetry
  const fetchPrediction = (coords = currentCoords) => {
    setLoading(true);
    const url = `/api/weather-and-risk?lat=${coords.lat}&lon=${coords.lon}&name=${encodeURIComponent(coords.name)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTelemetry(data);
        setLoading(false);
        setRefreshCountdown(600);
        fetchAlerts();
        fetchShelters(coords.lat, coords.lon);
      })
      .catch(err => {
        console.error("Telemetry fetch error:", err);
        setLoading(false);
      });
  };

  const fetchShelters = (lat, lon) => {
    fetch(`/api/shelters?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        setSheltersData(data);
        if (data.shelters && data.shelters.length > 0) {
          setSelectedSafePoint(data.nearest_shelter || data.shelters[0]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (currentCoords.lat && currentCoords.lon) {
      fetchPrediction(currentCoords);
    }
  }, [currentCoords]);

  // Auto-refresh 10-minute timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchPrediction(currentCoords);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentCoords]);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // GPS Locate
  const handleUseGps = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    if (!navigator.geolocation) {
      alert("GPS not supported on this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({
          lat: parseFloat(latitude.toFixed(5)),
          lon: parseFloat(longitude.toFixed(5)),
          name: "My GPS Catchment"
        });
        setSelectedRegion(null);
      },
      (err) => alert("GPS Error: " + err.message),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Build Google Maps walking directions URL
  const getGoogleMapsDirectionsUrl = (shelter) => {
    if (!shelter) return "#";
    // Universal Google Maps directions URL with walking travel mode
    return `https://www.google.com/maps/dir/?api=1&origin=${currentCoords.lat},${currentCoords.lon}&destination=${shelter.lat},${shelter.lon}&travelmode=walking`;
  };

  // Build WhatsApp Share Text
  const getWhatsAppShareUrl = (shelter) => {
    if (!shelter) return "#";
    const gmapsUrl = getGoogleMapsDirectionsUrl(shelter);
    const text = `⚠️ EMERGENCY FLASH FLOOD EVACUATION: I am navigating to safe high-ground refuge at ${shelter.name} (${shelter.elevation_m}m). My current GPS: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lon.toFixed(5)}. Google Maps Walking Route: ${gmapsUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  // 3. 24-Hour Forecast Chart.js Management
  const targetChartCanvas = viewMode === 'windows' ? desktopChartRef.current : mobileChartRef.current;
  const isChartVisible = (viewMode === 'windows' && desktopRightTab === 'forecast') || (viewMode === 'mobile' && activeTab === 3);

  useEffect(() => {
    if (!isChartVisible || !targetChartCanvas || !telemetry || !telemetry.forecast_24h) return;

    const ctx = targetChartCanvas.getContext('2d');
    const { times, precipitation, risk_curves } = telemetry.forecast_24h;
    const riskScores = (risk_curves || []).map(r => r.score);

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: times,
        datasets: [
          {
            type: 'bar',
            label: 'Rainfall (mm)',
            data: precipitation,
            backgroundColor: 'rgba(56, 189, 248, 0.55)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            yAxisID: 'yRain'
          },
          {
            type: 'line',
            label: 'Flood Risk %',
            data: riskScores,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 2.5,
            tension: 0.35,
            fill: false,
            yAxisID: 'yRisk'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { size: 10, family: 'Inter' } } },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleFont: { family: 'Inter' },
            bodyFont: { family: 'Inter' }
          }
        },
        scales: {
          x: { ticks: { color: '#64748b', maxTicksLimit: 8, font: { size: 9, family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.03)' } },
          yRain: { type: 'linear', position: 'left', ticks: { color: '#38bdf8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.03)' }, beginAtZero: true },
          yRisk: { type: 'linear', position: 'right', min: 0, max: 100, ticks: { color: '#f97316', font: { size: 9 } }, grid: { drawOnChartArea: false } }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [isChartVisible, telemetry, viewMode, desktopRightTab, activeTab]);

  // Emergency SOS Trigger
  const handleTriggerSos = () => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]);
    setShowSosModal(true);
    fetch("/api/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: currentCoords.lat,
        lon: currentCoords.lon,
        contact: "+91-SOS-STATE-EMERGENCY-DISPATCH",
        location_name: currentCoords.name
      })
    })
      .then(res => res.json())
      .then(data => setSosResult(data))
      .catch(err => console.error(err));
  };

  const toggleSiren = () => {
    if (sirenActive) {
      siren.stop();
      setSirenActive(false);
    } else {
      siren.start();
      setSirenActive(true);
    }
  };

  // Authority Alert Broadcast
  const handleAdminBroadcast = (e) => {
    e.preventDefault();
    fetch("/api/admin/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminForm)
    })
      .then(res => res.json())
      .then(() => {
        setAdminBroadcastSuccess(true);
        setTimeout(() => setAdminBroadcastSuccess(false), 3500);
        fetchPrediction(currentCoords);
        fetchAlerts();
      });
  };

  const riskLevel = telemetry ? telemetry.prediction.risk_level : "Low";
  const primaryShelter = selectedSafePoint || sheltersData.nearest_shelter || sheltersData.shelters[0];
  const userElevation = telemetry ? telemetry.location.elevation_m : 950;
  const shelterElevation = primaryShelter ? primaryShelter.elevation_m : 1150;
  const elevationDelta = shelterElevation - userElevation;

  // Reusable Safe Point Direction & Google Maps View Component
  const renderSafePointDirectionView = () => (
    <div className="evac-center-container">
      {/* Primary Safe Point Refuge Hero Card */}
      {primaryShelter && (
        <div className="safe-refuge-hero">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="safe-badge-verified">
              🛡️ {t.safeRefugeHeader}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold' }}>
              ● Verified Open & Accessible
            </span>
          </div>

          <div>
            <h2 className="safe-refuge-title">{primaryShelter.name}</h2>
            <div className="safe-refuge-type">
              <span>🏛️ {primaryShelter.type || "High-Ground Relief Camp"}</span>
              <span>•</span>
              <span>📍 {primaryShelter.region || currentCoords.name}</span>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="safe-metrics-row">
            <div className="safe-metric-item">
              <span className="safe-metric-label">Walking Distance</span>
              <span className="safe-metric-big">{primaryShelter.distance_km} <span style={{ fontSize: '0.8rem' }}>km</span></span>
              <span className="safe-metric-sub">~{primaryShelter.estimated_walk_mins} min uphill walk</span>
            </div>
            <div className="safe-metric-item">
              <span className="safe-metric-label">Refuge Elevation</span>
              <span className="safe-metric-big" style={{ color: '#10b981' }}>{primaryShelter.elevation_m} <span style={{ fontSize: '0.8rem' }}>m</span></span>
              <span className="safe-metric-sub">
                {elevationDelta >= 0 ? `+${elevationDelta}m above valley floor` : `${elevationDelta}m terrain margin`}
              </span>
            </div>
            <div className="safe-metric-item">
              <span className="safe-metric-label">Refuge Capacity</span>
              <span className="safe-metric-big" style={{ color: '#f59e0b' }}>{primaryShelter.capacity}</span>
              <span className="safe-metric-sub">Food, Medical, Power Gen</span>
            </div>
          </div>

          {/* Google Maps Redirect & Navigation Action Box */}
          <div className="gmaps-action-box">
            <a
              href={getGoogleMapsDirectionsUrl(primaryShelter)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gmaps-navigate"
              title="Open Google Maps for turn-by-turn walking route to this safe place"
            >
              🧭 {t.openInGmaps} ↗
            </a>

            <a
              href={getWhatsAppShareUrl(primaryShelter)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-share-whatsapp-route"
            >
              📲 {t.shareSafeRoute}
            </a>
          </div>

          {/* On-site Provisions & Emergency Contact */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.74rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><b>Emergency Supplies:</b> {primaryShelter.supplies || "First Aid Kits, Clean Drinking Water, Generator Power, Satellite Phone"}</div>
            <div><b>Coordination Helpline:</b> <a href={`tel:${primaryShelter.contact || '112'}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{primaryShelter.contact || "+91 82722 28432 (Disaster Helpline)"}</a></div>
          </div>
        </div>
      )}

      {/* Elevation Safety Advantage Comparator */}
      <div className="elev-compare-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
            ⛰️ {t.elevSafetyMargin}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold' }}>
            Safe High-Ground Ridge
          </span>
        </div>

        <div className="elev-compare-bars">
          <div className="elev-bar-row">
            <span className="elev-bar-label">📍 {t.currentLocation}</span>
            <div className="elev-bar-track">
              <div className="elev-bar-fill" style={{ width: `${Math.min(100, (userElevation / 1400) * 100)}%`, background: '#f59e0b' }}></div>
            </div>
            <span className="elev-bar-val" style={{ color: '#f59e0b' }}>{userElevation}m</span>
          </div>

          <div className="elev-bar-row">
            <span className="elev-bar-label">🛡️ {t.safeShelterLevel}</span>
            <div className="elev-bar-track">
              <div className="elev-bar-fill" style={{ width: `${Math.min(100, (shelterElevation / 1400) * 100)}%`, background: '#10b981' }}></div>
            </div>
            <span className="elev-bar-val" style={{ color: '#10b981' }}>{shelterElevation}m</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Ridge Evacuation Safety Protocol */}
      <div className="evac-steps-card">
        <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
          📋 {t.ridgeSafetyProtocol}
        </span>

        <div className="evac-step-item">
          <div className="evac-step-num">1</div>
          <div className="evac-step-content">
            <div className="evac-step-title">{t.step1Title}</div>
            <div className="evac-step-desc">{t.step1Desc}</div>
          </div>
        </div>

        <div className="evac-step-item">
          <div className="evac-step-num">2</div>
          <div className="evac-step-content">
            <div className="evac-step-title">{t.step2Title}</div>
            <div className="evac-step-desc">{t.step2Desc}</div>
          </div>
        </div>

        <div className="evac-step-item">
          <div className="evac-step-num">3</div>
          <div className="evac-step-content">
            <div className="evac-step-title">{t.step3Title}</div>
            <div className="evac-step-desc">{t.step3Desc}</div>
          </div>
        </div>

        <div className="evac-step-item">
          <div className="evac-step-num">4</div>
          <div className="evac-step-content">
            <div className="evac-step-title">{t.step4Title}</div>
            <div className="evac-step-desc">{t.step4Desc}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Top Device Preview Switcher Bar (Quickly toggle Windows Desktop vs Mobile App) */}
      <header className="preview-switch-bar">
        <div className="preview-switch-left">
          <span className="preview-status-pill">
            <span className="preview-pulse-dot"></span>
            <span>{t.sensorsActive} • 91.9% Random Forest ML</span>
          </span>
          <span style={{ color: '#64748b', fontSize: '0.73rem' }}>
            Catchment: <b style={{ color: '#f1f5f9' }}>{telemetry?.location.name || currentCoords.name}</b>
          </span>
        </div>

        <div className="preview-switch-controls">
          <button
            className={`preview-toggle-btn ${viewMode === 'windows' ? 'active' : ''}`}
            onClick={() => handleSetViewMode('windows')}
            title="Open in Windows Desktop Workstation layout"
          >
            💻 {t.previewWindows}
          </button>
          <button
            className={`preview-toggle-btn ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => handleSetViewMode('mobile')}
            title="Open in Smartphone Mobile App layout"
          >
            📱 {t.previewMobile}
          </button>
        </div>
      </header>

      {/* ====================================================================
          1. WINDOWS DESKTOP WORKSTATION VIEW (Active on Laptop/Desktop)
          ==================================================================== */}
      {viewMode === 'windows' && (
        <main className="windows-app-shell">
          {/* Windows 11 Fluent Titlebar */}
          <div className="win-titlebar">
            <div className="win-title-left">
              <div className="win-app-logo">🌊</div>
              <span className="win-title-text">{t.appName}</span>
              <span className="win-title-tag">{t.desktopTag}</span>
            </div>

            <div className="win-title-center">
              <div className="win-station-badge">
                <span className="preview-pulse-dot"></span>
                <span>Telemetry: STN-{(currentCoords.lat).toFixed(1)}-{(currentCoords.lon).toFixed(1)}</span>
              </div>
              <span>Latency: ~38ms</span>
            </div>

            <div className="win-controls">
              <button className="win-control-btn" title="Minimize">─</button>
              <button className="win-control-btn" title="Maximize">▢</button>
              <button className="win-control-btn close" title="Close">✕</button>
            </div>
          </div>

          {/* Desktop Command Ribbon Controls */}
          <div className="win-ribbon">
            <div className="win-ribbon-left">
              {/* Region Selector */}
              <select
                className="win-select"
                value={selectedRegion || ""}
                onChange={(e) => {
                  const r = regions.find(item => item.id === e.target.value);
                  if (r) {
                    setSelectedRegion(r.id);
                    setCurrentCoords({ lat: r.lat, lon: r.lon, name: r.name });
                  }
                }}
              >
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.state})</option>
                ))}
              </select>

              <button className="win-btn" onClick={handleUseGps} title="Detect coordinates via GPS">
                📍 {t.useGps}
              </button>

              <button
                className="win-btn"
                onClick={() => fetchPrediction(currentCoords)}
                title="Force refresh catchment telemetry"
              >
                🔄 {t.refreshIn}: <b className="num-val">{formatCountdown(refreshCountdown)}</b>
              </button>

              <button
                className="win-btn"
                onClick={() => setShowReportModal(true)}
                style={{ background: 'rgba(2, 132, 199, 0.18)', borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' }}
              >
                📊 91.9% ML Model Report
              </button>
            </div>

            <div className="win-ribbon-right">
              {/* Multilingual Switcher */}
              <div className="lang-pill-group">
                <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
                <button className={`lang-btn ${lang === 'kn' ? 'active' : ''}`} onClick={() => setLang('kn')}>ಕನ್ನಡ</button>
                <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिंदी</button>
              </div>

              {/* Direct Emergency SOS Trigger */}
              <button className="win-btn sos" onClick={handleTriggerSos}>
                🚨 {t.sosButton}
              </button>
            </div>
          </div>

          {/* Active Alert Banner Strip */}
          {telemetry && (
            <div className={`win-alert-strip ${riskLevel}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>
                  {riskLevel === 'Critical' ? '🚨' :
                   riskLevel === 'High' ? '⚠️' :
                   riskLevel === 'Medium' ? '⚡' : '✅'}
                </span>
                <div>
                  <span style={{ fontWeight: '800', marginRight: '8px' }}>
                    [{riskLevel} Alert] {telemetry.location.name}:
                  </span>
                  <span>{telemetry.messages[lang] || telemetry.messages.en}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>Auto-evaluated via Open-Meteo & RF Pipeline</span>
            </div>
          )}

          {/* 3-Column Desktop Workstation Dashboard */}
          <div className="win-workspace">
            {/* COLUMN 1: Telemetry & Risk Assessment */}
            <div className="win-col-left">
              {/* Risk Level Gauge Card */}
              <div className="win-card">
                <div className="win-card-header">
                  <span className="win-card-title">⚡ {t.riskTitle}</span>
                  <span className="win-card-subtitle">Random Forest Classifier</span>
                </div>

                <div className={`win-risk-meter ${riskLevel}`}>
                  <div className={`win-risk-headline ${riskLevel}`}>
                    {riskLevel === 'Critical' ? t.critical :
                     riskLevel === 'High' ? t.high :
                     riskLevel === 'Medium' ? t.moderate : t.safe}
                  </div>
                  <div className="win-risk-meta">
                    <span>Confidence: <b>{telemetry?.prediction.confidence_pct || 85}%</b></span>
                    <span>•</span>
                    <span>Catchment: {telemetry?.location.slope_deg || 24}° Slope</span>
                  </div>
                </div>

                {/* Probability Distribution */}
                {telemetry && (
                  <div className="win-prob-grid">
                    {Object.entries(telemetry.prediction.probabilities).map(([cat, prob]) => {
                      const c = cat === 'Critical' ? '#ef4444' :
                                cat === 'High' ? '#f97316' :
                                cat === 'Medium' ? '#f59e0b' : '#10b981';
                      return (
                        <div className="win-prob-row" key={cat}>
                          <span className="win-prob-label">{cat}</span>
                          <div className="win-prob-track">
                            <div className="win-prob-fill" style={{ width: `${prob}%`, backgroundColor: c }}></div>
                          </div>
                          <span className="win-prob-val" style={{ color: c }}>{prob}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Catchment Telemetry Grid */}
              <div className="win-card">
                <div className="win-card-header">
                  <span className="win-card-title">⛰️ {t.weatherMetrics}</span>
                  <span className="win-card-subtitle">Open-Meteo Live API</span>
                </div>

                {telemetry && (
                  <div className="win-telemetry-grid">
                    <div className="win-metric-tile">
                      <span className="win-metric-label">🌧️ {t.rainfall1h}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.weather.rainfall_1h_mm}</span>
                        <span className="win-metric-unit">mm/h</span>
                      </div>
                      <span className={`win-metric-status ${telemetry.weather.rainfall_1h_mm > 25 ? 'status-danger' : telemetry.weather.rainfall_1h_mm > 5 ? 'status-warning' : 'status-normal'}`}>
                        {telemetry.weather.rainfall_1h_mm > 25 ? 'Torrential' : telemetry.weather.rainfall_1h_mm > 5 ? 'Moderate' : 'Normal'}
                      </span>
                    </div>

                    <div className="win-metric-tile">
                      <span className="win-metric-label">📊 {t.rainfall24h}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.weather.rainfall_24h_mm}</span>
                        <span className="win-metric-unit">mm</span>
                      </div>
                      <span className="win-metric-status status-normal">Cumulative</span>
                    </div>

                    <div className="win-metric-tile">
                      <span className="win-metric-label">⛰️ {t.elevation}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.location.elevation_m}</span>
                        <span className="win-metric-unit">m</span>
                      </div>
                      <span className="win-metric-status status-normal">High Ground</span>
                    </div>

                    <div className="win-metric-tile">
                      <span className="win-metric-label">📐 {t.slope}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.location.slope_deg}</span>
                        <span className="win-metric-unit">°</span>
                      </div>
                      <span className={`win-metric-status ${telemetry.location.slope_deg >= 25 ? 'status-warning' : 'status-normal'}`}>
                        {telemetry.location.slope_deg >= 25 ? 'Steep Gradient' : 'Moderate'}
                      </span>
                    </div>

                    <div className="win-metric-tile">
                      <span className="win-metric-label">💧 {t.soilMoisture}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.weather.soil_moisture_pct}</span>
                        <span className="win-metric-unit">%</span>
                      </div>
                      <span className={`win-metric-status ${telemetry.weather.soil_moisture_pct >= 80 ? 'status-danger' : 'status-normal'}`}>
                        {telemetry.weather.soil_moisture_pct >= 80 ? 'Saturated' : 'Permeable'}
                      </span>
                    </div>

                    <div className="win-metric-tile">
                      <span className="win-metric-label">💨 {t.windSpeed}</span>
                      <div className="win-metric-value-row">
                        <span className="win-metric-val">{telemetry.weather.wind_speed_kmh}</span>
                        <span className="win-metric-unit">km/h</span>
                      </div>
                      <span className="win-metric-status status-normal">Catchment Breeze</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hydrological Factors Breakdown */}
              <div className="win-card">
                <div className="win-card-header">
                  <span className="win-card-title">📋 {t.hydrologicalFactors}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  {telemetry?.prediction.factors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#38bdf8' }}>▹</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: SAFE POINT DIRECTIONS & GOOGLE MAPS NAVIGATION (Replaces Map) */}
            <div className="win-col-center">
              {renderSafePointDirectionView()}
            </div>

            {/* COLUMN 3: Operations Tabs (Shelters, Forecast Chart, Civil Defense) */}
            <div className="win-col-right">
              {/* Tab Header */}
              <div className="win-tabs-header">
                <button
                  className={`win-tab-btn ${desktopRightTab === 'shelters' ? 'active' : ''}`}
                  onClick={() => setDesktopRightTab('shelters')}
                >
                  🛡️ {t.tabShelters} ({sheltersData.shelters.length})
                </button>
                <button
                  className={`win-tab-btn ${desktopRightTab === 'forecast' ? 'active' : ''}`}
                  onClick={() => setDesktopRightTab('forecast')}
                >
                  📈 {t.tabForecast}
                </button>
                <button
                  className={`win-tab-btn ${desktopRightTab === 'alerts' ? 'active' : ''}`}
                  onClick={() => setDesktopRightTab('alerts')}
                >
                  ⚙️ {t.tabAlerts}
                </button>
              </div>

              {/* Sub-tab 1: Safe Evacuation Shelters List */}
              {desktopRightTab === 'shelters' && (
                <div className="win-card" style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="win-card-header">
                    <span className="win-card-title">🛡️ {t.sheltersTitle}</span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981' }}>High-Ground Verified</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '12px' }}>
                    {t.sheltersSubtitle}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sheltersData.shelters.map((s, idx) => (
                      <div
                        key={s.id || idx}
                        className={`win-shelter-card ${primaryShelter?.name === s.name ? 'active-target' : ''}`}
                        onClick={() => setSelectedSafePoint(s)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="win-shelter-top">
                          <span className="win-shelter-name">{s.name}</span>
                          <span className="win-shelter-dist">{s.distance_km} km</span>
                        </div>
                        <div className="win-shelter-meta">
                          <span>⛰️ <b>{s.elevation_m}m</b> elevation</span>
                          <span>👥 {t.capacity}: <b>{s.capacity}</b></span>
                          <span>🚶 {t.walkingTime}: <b>~{s.estimated_walk_mins} min</b></span>
                        </div>
                        <a
                          href={getGoogleMapsDirectionsUrl(s)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="win-btn primary"
                          style={{ marginTop: '4px', padding: '6px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🧭 {t.findNearestRoute} ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: 24-Hour Forecast Curve */}
              {desktopRightTab === 'forecast' && (
                <div className="win-card" style={{ flex: 1 }}>
                  <div className="win-card-header">
                    <span className="win-card-title">📈 {t.forecastTitle}</span>
                    <span className="win-card-subtitle">Hourly Rain & Risk %</span>
                  </div>
                  <div className="win-chart-wrapper" style={{ height: '340px' }}>
                    <canvas ref={desktopChartRef}></canvas>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Civil Defense Broadcasts & Log */}
              {desktopRightTab === 'alerts' && (
                <div className="win-card" style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="win-card-header">
                    <span className="win-card-title">📢 {t.adminTitle}</span>
                  </div>

                  {adminBroadcastSuccess && (
                    <div style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '8px', borderRadius: '6px', fontSize: '0.76rem', marginBottom: '8px' }}>
                      ✅ Authority alert broadcast dispatched successfully!
                    </div>
                  )}

                  <form onSubmit={handleAdminBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <select
                      className="win-select"
                      value={adminForm.risk_level}
                      onChange={(e) => setAdminForm({ ...adminForm, risk_level: e.target.value })}
                    >
                      <option value="Critical">Critical Red Alert (Immediate Evacuation)</option>
                      <option value="High">High Orange Alert (Prepare to Relocate)</option>
                      <option value="Medium">Medium Yellow Alert (Catchment Watch)</option>
                    </select>

                    <textarea
                      className="win-select"
                      rows="2"
                      placeholder="Official advisory text..."
                      value={adminForm.message_en}
                      onChange={(e) => setAdminForm({ ...adminForm, message_en: e.target.value })}
                    ></textarea>

                    <button type="submit" className="win-btn sos" style={{ justifyContent: 'center' }}>
                      📢 {t.broadcastAlert}
                    </button>
                  </form>

                  {/* History List */}
                  <div className="win-card-header" style={{ marginTop: '10px' }}>
                    <span className="win-card-title">📜 {t.alertHistory}</span>
                    <span className="win-card-subtitle">SQLite Master DB</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {alertHistory.map((a) => (
                      <div key={a.id} style={{ background: 'rgba(11,19,36,0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                          <span>{a.created_at}</span>
                          <span style={{ fontWeight: 'bold', color: a.risk_level === 'Critical' ? '#fca5a5' : a.risk_level === 'High' ? '#fdba74' : '#fde047' }}>
                            {a.risk_level}
                          </span>
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#f8fafc' }}>
                          {a.location}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>
                          {a.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ====================================================================
          2. MOBILE SMARTPHONE VIEW (Active on Mobile Phones or when Mobile Preview selected)
          ==================================================================== */}
      {viewMode === 'mobile' && (
        <div className="mobile-app-shell">
          <div className="phone-mockup-frame">
            {/* Phone Status Bar */}
            <div className="mobile-status-bar">
              <span>{clockTime}</span>
              <div className="dynamic-island">
                <div className="dynamic-island-cam"></div>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span>5G</span>
                <span>📶</span>
                <span>🔋 96%</span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="mobile-header">
              <div className="mobile-header-row">
                <div className="mobile-brand">
                  <div className="mobile-brand-icon">🌊</div>
                  <div>
                    <div className="mobile-brand-title">{t.appName}</div>
                    <div className="mobile-brand-sub">
                      <span className="preview-pulse-dot"></span>
                      <span>{t.liveSubtitle}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="win-btn"
                    onClick={() => setShowReportModal(true)}
                    style={{ padding: '5px 8px', fontSize: '0.72rem', background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8' }}
                  >
                    📊 91.9%
                  </button>
                  <button
                    className="win-btn"
                    onClick={() => fetchPrediction(currentCoords)}
                    style={{ padding: '5px 8px', fontSize: '0.72rem' }}
                  >
                    🔄 {formatCountdown(refreshCountdown)}
                  </button>
                </div>
              </div>

              {/* Mobile Filter & Language Bar */}
              <div className="mobile-filter-bar">
                <select
                  className="mobile-select"
                  value={selectedRegion || ""}
                  onChange={(e) => {
                    const r = regions.find(item => item.id === e.target.value);
                    if (r) {
                      setSelectedRegion(r.id);
                      setCurrentCoords({ lat: r.lat, lon: r.lon, name: r.name });
                    }
                  }}
                >
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.state})</option>
                  ))}
                </select>

                <button className="win-btn" style={{ padding: '6px 8px', fontSize: '0.75rem' }} onClick={handleUseGps}>
                  📍 {t.useGps}
                </button>

                <select
                  className="mobile-select"
                  style={{ maxWidth: '85px', fontWeight: 'bold' }}
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>

            {/* Mobile Alert Ribbon */}
            {telemetry && (
              <div className={`win-alert-strip ${riskLevel}`} style={{ padding: '8px 14px' }}>
                <span style={{ fontSize: '16px', marginRight: '6px' }}>
                  {riskLevel === 'Critical' ? '🚨' :
                   riskLevel === 'High' ? '⚠️' :
                   riskLevel === 'Medium' ? '⚡' : '✅'}
                </span>
                <div style={{ flex: 1, fontSize: '0.74rem' }}>
                  <b>{riskLevel} Alert:</b> {telemetry.messages[lang] || telemetry.messages.en}
                </div>
              </div>
            )}

            {/* Mobile Viewport Content */}
            <div className="mobile-viewport">
              {/* TAB 0: OVERVIEW */}
              {activeTab === 0 && telemetry && (
                <div className="mobile-tab-content">
                  {/* Quick Safe Refuge Access Banner */}
                  {primaryShelter && (
                    <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                          🛡️ Nearest Safe Ground Refuge
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                          {primaryShelter.distance_km} km away
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                        {primaryShelter.name}
                      </div>
                      <a
                        href={getGoogleMapsDirectionsUrl(primaryShelter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gmaps-navigate"
                        style={{ padding: '10px 14px', fontSize: '0.84rem' }}
                      >
                        🧭 Open Google Maps Route ↗
                      </a>
                    </div>
                  )}

                  {/* Risk Hero Meter */}
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">⚡ {t.riskTitle}</span>
                      <span className="win-card-subtitle">AI Model</span>
                    </div>

                    <div className={`win-risk-meter ${riskLevel}`}>
                      <div className={`win-risk-headline ${riskLevel}`}>
                        {riskLevel === 'Critical' ? t.critical :
                         riskLevel === 'High' ? t.high :
                         riskLevel === 'Medium' ? t.moderate : t.safe}
                      </div>
                      <div className="win-risk-meta">
                        <span>Confidence: <b>{telemetry.prediction.confidence_pct}%</b></span>
                      </div>
                    </div>

                    {/* Probability Bars */}
                    <div className="win-prob-grid">
                      {Object.entries(telemetry.prediction.probabilities).map(([cat, prob]) => {
                        const c = cat === 'Critical' ? '#ef4444' :
                                  cat === 'High' ? '#f97316' :
                                  cat === 'Medium' ? '#f59e0b' : '#10b981';
                        return (
                          <div className="win-prob-row" key={cat}>
                            <span className="win-prob-label">{cat}</span>
                            <div className="win-prob-track">
                              <div className="win-prob-fill" style={{ width: `${prob}%`, backgroundColor: c }}></div>
                            </div>
                            <span className="win-prob-val" style={{ color: c }}>{prob}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Catchment Telemetry Grid */}
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">⛰️ {t.weatherMetrics}</span>
                      <span className="win-card-subtitle">Open-Meteo Live</span>
                    </div>

                    <div className="win-telemetry-grid">
                      <div className="win-metric-tile">
                        <span className="win-metric-label">🌧️ {t.rainfall1h}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.weather.rainfall_1h_mm}</span>
                          <span className="win-metric-unit">mm/h</span>
                        </div>
                      </div>
                      <div className="win-metric-tile">
                        <span className="win-metric-label">📊 {t.rainfall24h}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.weather.rainfall_24h_mm}</span>
                          <span className="win-metric-unit">mm</span>
                        </div>
                      </div>
                      <div className="win-metric-tile">
                        <span className="win-metric-label">⛰️ {t.elevation}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.location.elevation_m}</span>
                          <span className="win-metric-unit">m</span>
                        </div>
                      </div>
                      <div className="win-metric-tile">
                        <span className="win-metric-label">📐 {t.slope}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.location.slope_deg}</span>
                          <span className="win-metric-unit">°</span>
                        </div>
                      </div>
                      <div className="win-metric-tile">
                        <span className="win-metric-label">💧 {t.soilMoisture}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.weather.soil_moisture_pct}</span>
                          <span className="win-metric-unit">%</span>
                        </div>
                      </div>
                      <div className="win-metric-tile">
                        <span className="win-metric-label">💨 {t.windSpeed}</span>
                        <div className="win-metric-value-row">
                          <span className="win-metric-val">{telemetry.weather.wind_speed_kmh}</span>
                          <span className="win-metric-unit">km/h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hydrological Factors */}
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">📋 {t.hydrologicalFactors}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                      {telemetry.prediction.factors.map((f, i) => (
                        <div key={i} style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ color: '#38bdf8' }}>▹</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: SAFE POINT DIRECTIONS & GOOGLE MAPS */}
              {activeTab === 1 && (
                <div className="mobile-tab-content">
                  {renderSafePointDirectionView()}
                </div>
              )}

              {/* TAB 2: SHELTERS */}
              {activeTab === 2 && (
                <div className="mobile-tab-content">
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">🛡️ {t.sheltersTitle}</span>
                      <span style={{ fontSize: '0.7rem', color: '#10b981' }}>{sheltersData.shelters.length} Available</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '12px' }}>
                      {t.sheltersSubtitle}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sheltersData.shelters.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className={`win-shelter-card ${primaryShelter?.name === s.name ? 'active-target' : ''}`}
                          onClick={() => {
                            setSelectedSafePoint(s);
                            setActiveTab(1); // Switch to directions tab
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="win-shelter-top">
                            <span className="win-shelter-name">{s.name}</span>
                            <span className="win-shelter-dist">{s.distance_km} km</span>
                          </div>
                          <div className="win-shelter-meta">
                            <span>⛰️ <b>{s.elevation_m}m</b></span>
                            <span>👥 {t.capacity}: <b>{s.capacity}</b></span>
                            <span>🚶 {t.walkingTime}: <b>~{s.estimated_walk_mins}m</b></span>
                          </div>
                          <a
                            href={getGoogleMapsDirectionsUrl(s)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="win-btn primary"
                            style={{ marginTop: '4px', padding: '6px', fontSize: '0.76rem', justifyContent: 'center' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            🧭 {t.findNearestRoute} ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FORECAST */}
              {activeTab === 3 && (
                <div className="mobile-tab-content">
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">📈 {t.forecastTitle}</span>
                    </div>
                    <div className="win-chart-wrapper" style={{ height: '300px' }}>
                      <canvas ref={mobileChartRef}></canvas>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ALERTS / ADMIN */}
              {activeTab === 4 && (
                <div className="mobile-tab-content">
                  {/* Broadcast Form */}
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">🛡️ {t.adminTitle}</span>
                    </div>

                    {adminBroadcastSuccess && (
                      <div style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', padding: '8px', borderRadius: '6px', fontSize: '0.76rem', marginBottom: '8px' }}>
                        ✅ Alert broadcast logged and dispatched!
                      </div>
                    )}

                    <form onSubmit={handleAdminBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <select
                        className="mobile-select"
                        value={adminForm.risk_level}
                        onChange={(e) => setAdminForm({ ...adminForm, risk_level: e.target.value })}
                      >
                        <option value="Critical">Critical Red Alert (Evacuation)</option>
                        <option value="High">High Orange Alert</option>
                        <option value="Medium">Medium Yellow Alert</option>
                      </select>

                      <textarea
                        className="mobile-select"
                        rows="2"
                        placeholder="Advisory message..."
                        value={adminForm.message_en}
                        onChange={(e) => setAdminForm({ ...adminForm, message_en: e.target.value })}
                      ></textarea>

                      <button type="submit" className="win-btn sos" style={{ justifyContent: 'center' }}>
                        📢 {t.broadcastAlert}
                      </button>
                    </form>
                  </div>

                  {/* History */}
                  <div className="win-card">
                    <div className="win-card-header">
                      <span className="win-card-title">📜 {t.alertHistory}</span>
                      <span className="win-card-subtitle">SQLite DB</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                      {alertHistory.map((a) => (
                        <div key={a.id} style={{ background: 'rgba(15,23,42,0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                            <span>{a.created_at}</span>
                            <span style={{ fontWeight: 'bold', color: a.risk_level === 'Critical' ? '#fca5a5' : a.risk_level === 'High' ? '#fdba74' : '#fde047' }}>
                              {a.risk_level}
                            </span>
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#f8fafc' }}>
                            {a.location}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px' }}>
                            {a.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating SOS button on mobile */}
            <button className="mobile-floating-sos" onClick={handleTriggerSos}>
              🚨 {t.sosButton}
            </button>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="mobile-bottom-nav">
              <button className={`mobile-nav-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
                <span className="mobile-nav-icon">⚡</span>
                <span>{t.tabOverview}</span>
              </button>
              <button className={`mobile-nav-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                <span className="mobile-nav-icon">🧭</span>
                <span>{t.tabDirections}</span>
              </button>
              <button className={`mobile-nav-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
                <span className="mobile-nav-icon">🛡️</span>
                <span>{t.tabShelters}</span>
              </button>
              <button className={`mobile-nav-btn ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
                <span className="mobile-nav-icon">📈</span>
                <span>{t.tabForecast}</span>
              </button>
              <button className={`mobile-nav-btn ${activeTab === 4 ? 'active' : ''}`} onClick={() => setActiveTab(4)}>
                <span className="mobile-nav-icon">⚙️</span>
                <span>{t.tabAlerts}</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ====================================================================
          SHARED MODAL 1: EMERGENCY SOS DISTRESS BEACON
          ==================================================================== */}
      {showSosModal && (
        <div className="modal-overlay" onClick={() => setShowSosModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title" style={{ color: '#fca5a5' }}>
                🚨 {t.emergencySosTitle}
              </div>
              <button className="modal-dialog-close" onClick={() => setShowSosModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-dialog-body">
              <div style={{ background: '#070b14', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Live Distress Catchment GPS
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', marginTop: '3px' }}>
                  {currentCoords.lat.toFixed(5)}° N, {currentCoords.lon.toFixed(5)}° E
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                  {currentCoords.name}
                </div>
              </div>

              <button
                className="win-btn"
                onClick={toggleSiren}
                style={{
                  background: sirenActive ? '#dc2626' : 'rgba(30,41,59,0.85)',
                  borderColor: sirenActive ? '#f87171' : 'rgba(255,255,255,0.15)',
                  justifyContent: 'center',
                  padding: '10px'
                }}
              >
                📢 {sirenActive ? 'Stop Distress Siren' : t.sirenToggle}
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `EMERGENCY FLASH FLOOD SOS: I am trapped in a hilly flood hazard zone at ${currentCoords.name}. GPS: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lon.toFixed(5)}. Google Maps: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lon}. Immediate rescue required!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="win-btn"
                style={{ background: '#059669', borderColor: '#34d399', color: '#fff', justifyContent: 'center', padding: '10px', textDecoration: 'none' }}
              >
                📲 {t.shareWhatsapp}
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href="tel:112" className="win-btn" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', padding: '9px' }}>
                  📞 {t.call112}
                </a>
                <a href="tel:1077" className="win-btn" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', padding: '9px' }}>
                  📞 {t.callControl}
                </a>
              </div>

              {sosResult && (
                <div style={{ background: 'rgba(16,185,129,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', color: '#a7f3d0' }}>
                  ✅ Emergency SOS beacon registered in control database: Beacon ID #{sosResult.sos_id}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SHARED MODAL 2: RANDOM FOREST ML MODEL REPORT
          ==================================================================== */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div className="modal-dialog-title">
                📊 Random Forest Model & Hydrological Performance
              </div>
              <button className="modal-dialog-close" onClick={() => setShowReportModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.14)', border: '1px solid #10b981', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Model Accuracy</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>{modelInfo?.accuracy_pct || '91.88%'}</div>
                </div>
                <div style={{ background: 'rgba(56, 189, 248, 0.14)', border: '1px solid #38bdf8', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Dataset Size</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>{modelInfo?.total_samples || 1600} samples</div>
                </div>
              </div>

              <div style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#f1f5f9' }}>
                  Feature Importance (Catchment Dynamics):
                </div>
                {modelInfo?.feature_importances && Object.entries(modelInfo.feature_importances).map(([f, imp]) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', padding: '4px 0' }}>
                    <span style={{ color: '#94a3b8' }}>{f}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(imp * 100).toFixed(0)}%`, height: '100%', background: '#38bdf8' }}></div>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#38bdf8', width: '38px', textAlign: 'right' }}>{(imp * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.74rem', color: '#fde68a' }}>
                📌 <b>Hydrological Catchment Architecture:</b> Uses elevation, slope angle, 1-hour rainfall burst intensity, antecedent 24h accumulation, and soil moisture saturation to predict flash flooding in mountain ravines.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

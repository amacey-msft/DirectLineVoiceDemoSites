# Custom Web Sites with AI Chat Integration

A Flask-based web application featuring AI chat integration with Azure Bot Framework and Text-to-Speech capabilities.

## Features
- 🤖 AI-powered chat widget with Azure Bot Framework
- 🎤 Advanced Text-to-Speech with Azure Speech Services
- 🎨 Multiple themed pages (Springfield Government, Contoso Coffee)
- 📱 Responsive design with mobile support
- ⚡ Real-time speech synthesis with customizable voices

## URL for Example Sites:
## Includes Directline Speech and TTS Configuration ##
Contoso Coffee: https://2025demowebappexample-gja6b0hrg3evghd2.eastus2-01.azurewebsites.net/contoso

Springfield Government: https://2025demowebappexample-gja6b0hrg3evghd2.eastus2-01.azurewebsites.net/springfield

## Chat agent examples, less functional than above ##
Ravenna City: https://2025demowebappexample-gja6b0hrg3evghd2.eastus2-01.azurewebsites.net/

IRS Example: https://2025demowebappexample-gja6b0hrg3evghd2.eastus2-01.azurewebsites.net/irs

### Prerequisites
- Python 3.8+
- Azure subscription with:
  - Bot Framework registration
  - Speech Services resource
  - App Service (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/govsite-ai-chat.git
   cd govsite-ai-chat
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure credentials
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

### Configuration

Update `static/config/chat-config.js` with your Azure credentials:

```javascript
const CHAT_CONFIG = {
    directLineSecret: 'your-directline-secret',
    speechKey: 'your-speech-key',
    speechRegion: 'your-region'
};
```

## Deployment Options

### Option 1: Azure App Service (Recommended)
- Easy deployment with GitHub integration
- Built-in SSL and custom domains
- Auto-scaling capabilities

### Option 2: Azure Static Web Apps
- Perfect for frontend-heavy applications
- Integrated CI/CD with GitHub
- Built-in authentication

### Option 3: Docker Container
- Consistent deployment across environments
- Easy scaling with Azure Container Instances

## Customization Guide

### Creating New Themed Pages
1. Create new HTML template in `templates/`
2. Create corresponding CSS file in `static/css/`
3. Add route in `app.py`
4. Customize chat widget colors in CSS

### Modifying TTS Settings
- Edit voice options in `static/js/tts-settings.js`
- Customize UI in the HTML templates
- Adjust styling in theme-specific CSS files

## Project Structure
```
GovSite/
├── app.py                          # Flask application
├── templates/                      # HTML templates
│   ├── springfield_homepage.html   # Government theme
│   └── contoso.html                # Coffee shop theme
├── static/
│   ├── css/                        # Stylesheets
│   ├── js/                         # JavaScript files
│   ├── config/                     # Configuration files
│   └── images/                     # Static images
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

## Known Issues
1. Testing on iOS using Safari proved unreliable for TTS readout.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License - see LICENSE file for details

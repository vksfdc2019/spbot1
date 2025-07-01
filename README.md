# 🤖 Sparring Bot - AI-Powered Customer Service Training Platform

## Overview

The Sparring Bot is a comprehensive voice-enabled training system designed to help customer service agents improve their skills through realistic conversation scenarios. The platform features AI-powered client simulation, real-time scoring, user management, and extensive customization options.

## ✨ Key Features

### Core Training Features
- **Voice-Only Training**: Complete hands-free operation using speech recognition and synthesis
- **AI Client Simulation**: Realistic customer personalities with OpenAI GPT-4 integration
- **Real-Time Scoring**: Instant feedback with 0-3 scale evaluation system
- **Multiple Scenarios**: Customizable training scenarios for different industries
- **Session Analytics**: Detailed performance tracking and improvement suggestions

### User Management & Administration
- **Role-Based Access**: Admin, User, and Client roles with appropriate permissions
- **User Authentication**: Secure JWT-based login system
- **Admin Dashboard**: Comprehensive management interface for users, scenarios, and analytics
- **Session History**: Complete tracking of all training sessions with detailed analytics

### Customization & Configuration
- **Custom Personalities**: Create and edit AI client personalities and traits
- **Scenario Management**: Add, edit, and manage training scenarios
- **Performance Analytics**: Track progress across personalities and scenarios
- **Extensible Architecture**: Built for easy feature additions and integrations

### Technical Features
- **Modern UI**: Responsive, glassmorphism design with intuitive interface
- **Real-Time Communication**: WebSocket-based instant feedback and scoring
- **Secure Data Storage**: Encrypted password storage and session management
- **Cloud-Ready**: Easy deployment to Heroku, Vercel, AWS, and other platforms

## 📋 Requirements

### 1. API Keys & Licenses

#### Required:
- **OpenAI API Key** (for AI conversation and scoring)
  - Cost: ~$0.06 per 1K tokens (very affordable for training sessions)
  - Get your key: https://platform.openai.com/api-keys

#### Free (Built-in):
- **Web Speech API** (Speech Recognition & Synthesis)
- **WebRTC** (Real-time communication)

### 2. System Requirements

- **Node.js** 18+ 
- **Modern Web Browser** (Chrome, Safari, Firefox, Edge)

## 🪟 Windows Installation v2.0

### ⚡ Super Quick Setup (One-Click)

1. **Download the project** as a ZIP file or clone with Git
2. **Extract** to a folder like `C:\sparring-bot`
3. **Install Node.js 18+** from https://nodejs.org (if not already installed)
4. **Run the enhanced setup script**:
   - Right-click `scripts\windows-setup.bat` and "Run as administrator"
   - The script will automatically install dependencies and build the frontend
5. **Configure your OpenAI API key** in the `.env` file
6. **Start the application**:
   - Double-click `scripts\windows-start.bat`
   - Your browser will open automatically to http://localhost:8080

### 🔧 Advanced PowerShell Installation

For power users and enterprise deployment:
```powershell
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\Install-SparringBot.ps1 -ApiKey "your_api_key_here"
```

### 📦 Windows Package Builder

Create a complete deployment package:
```cmd
scripts\create-windows-package.bat
```
This creates a `sparring-bot-windows` folder ready for distribution.

### 🆕 What's New in Windows v2.0:
- ✅ **One-click installation** with automatic frontend building
- ✅ **Enhanced error handling** and troubleshooting
- ✅ **PowerShell script** for advanced users
- ✅ **Package builder** for enterprise deployment
- ✅ **Improved startup scripts** with better user guidance
- ✅ **Cost optimization** with GPT-4o Mini by default
- ✅ **Session tracking** and analytics features included
- ✅ **Enhanced Installation Scripts** - Better error handling and user guidance
- ✅ **System Validation Tools** - Comprehensive pre-launch system checks
- ✅ **Deployment Testing** - Full end-to-end deployment verification
- ✅ **Automatic Dependency Management** - One-click setup with all dependencies
- ✅ **Improved Error Messages** - Clear troubleshooting instructions
- ✅ **PowerShell Integration** - Advanced deployment options for enterprises
- ✅ **Package Creation** - Easy distribution package builder
- ✅ **Cost Optimization** - GPT-4o Mini configured by default (90% cost savings)
- ✅ **Session Analytics** - Built-in tracking and progress monitoring

### Windows Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `windows-setup.bat` | Complete installation and setup | Run once for initial setup |
| `windows-start.bat` | Start the application | Run each time to start |
| `windows-validate.bat` | System compatibility check | Run to verify installation |
| `windows-test.bat` | Basic functionality test | Quick system verification |
| `windows-deploy-test.bat` | Complete deployment test | Full end-to-end testing |
| `create-windows-package.bat` | Build distribution package | For deploying to other systems |

### Detailed Windows Instructions
See [WINDOWS_INSTALL.md](./WINDOWS_INSTALL.md) for complete step-by-step instructions, troubleshooting, and advanced options.

## 🚀 Quick Start Guide

### Step 1: Setup Environment

1. **Clone/Download** the project to your computer
2. **Get OpenAI API Key**:
   - Visit https://platform.openai.com/api-keys
   - Create an account if needed
   - Generate a new API key
   - Copy the key (starts with 'sk-...')

3. **Configure API Key**:
   - Open the `.env` file in the project root
   - Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### Step 2: Install Dependencies

Open Terminal/Command Prompt in the project folder and run:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Start the Application

```bash
# Start both server and client (recommended)
npm run dev

# OR start separately:
# Terminal 1 - Start server:
npm run server

# Terminal 2 - Start client:
npm run client
```

### Step 4: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. **Login with default credentials**:
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ **Important**: Change this password immediately after first login!

## 👥 User Roles & Access

### Administrator Role
- **Full System Access**: Manage all users, scenarios, and system settings
- **User Management**: Create, edit, and delete user accounts
- **Scenario Customization**: Add, modify, and remove training scenarios
- **Client Personalities**: Configure AI client behaviors and traits
- **Analytics Dashboard**: View comprehensive training analytics
- **System Configuration**: Manage all platform settings

### User Role (Agents/Trainees)
- **Training Sessions**: Access voice training interface
- **Personal Analytics**: View their own training history and progress
- **Session Reports**: Review detailed feedback from completed sessions
- **Profile Management**: Update personal information

### Getting Started:
1. **First Login**: Use admin/admin123 to access the system
2. **Change Password**: Immediately update the default admin password
3. **Create Users**: Add user accounts for agents/trainees
4. **Customize Training**: Configure scenarios and personalities for your industry
5. **Start Training**: Users can now access the training interface

## 🎯 How to Use

### For Administrators:

1. **User Management**:
   - Create user accounts for agents
   - Assign appropriate roles and permissions
   - Monitor user activity and training progress

2. **Customize Training Content**:
   - Add new customer personalities with specific traits
   - Create industry-specific scenarios
   - Configure difficulty levels and expectations

3. **Analytics & Reporting**:
   - Track overall training effectiveness
   - Monitor performance trends across users
   - Identify areas for improvement

### For Agents/Trainees:

1. **Setup Session**:
   - Log in with your assigned credentials
   - Enter your name for the training session
   - Select client personality type:
     - **Normal**: Polite customer asking standard questions
     - **Unhappy**: Customer dissatisfied with previous service
     - **Angry**: Frustrated customer with service complaints
     - **Aggressive**: Very demanding and potentially hostile customer

2. **Start Training**:
   - Click "Start Training Session"
   - Allow microphone permissions when prompted
   - Click "Start Call Simulation"

3. **Monitor Progress**:
   - Watch real-time scoring (0-3 scale)
   - Review feedback suggestions
   - Track overall performance metrics

### During Training Sessions:

1. **Listen to AI Client**:
   - The AI will speak first with a customer scenario
   - Different personalities will have different tones and concerns

2. **Respond Naturally**:
   - Click "Start Recording" when ready to respond
   - Speak clearly into your microphone
   - Address the customer's concerns professionally

3. **Receive Feedback**:
   - Get instant scoring on your response
   - Review improvement suggestions
   - Learn from real-time feedback

4. **Continue Conversation**:
   - The AI client will respond to your answers
   - Handle multiple interactions in one session
   - Practice de-escalation and problem-solving

## 📊 Scoring System

### Score Meanings:
- **3 (Excellent)**: Outstanding customer service performance
- **2 (Satisfactory)**: Adequate performance with room for improvement  
- **1 (Needs Improvement)**: Below standard, requires thorough training
- **0 (Critical)**: Immediate intervention required

### Evaluation Criteria:
- **Tone and Professionalism**
- **Empathy and Understanding**
- **Problem-Solving Approach**
- **Addressing Customer Concerns**
- **De-escalation Skills**
- **Clear Communication**
- **Offering Solutions**

## 🛠 Technical Architecture

### Backend (Node.js + Express):
- **Socket.io**: Real-time communication between client and server
- **OpenAI API**: AI conversation generation and response scoring
- **Express**: Web server and API endpoints

### Frontend (React):
- **React Router**: Navigation between dashboard and session pages
- **Socket.io Client**: Real-time communication with server
- **Web Speech API**: Browser-based speech recognition and synthesis
- **Lucide React**: Modern icons and UI components

### AI Services:
- **Conversation AI**: Generates realistic customer dialogue based on personality types
- **Scoring AI**: Evaluates agent responses using advanced language models
- **Dynamic Scenarios**: Creates varied car repair service scenarios

## 📁 Project Structure

```
sparring-bot/
├── server.js              # Main server file
├── package.json           # Server dependencies
├── .env                   # Environment variables (API keys)
├── services/
│   ├── aiService.js       # OpenAI integration for conversations
│   └── scoringService.js  # AI-powered response scoring
└── client/                # React frontend application
    ├── src/
    │   ├── components/
    │   │   ├── TrainingDashboard.js  # Main setup page
    │   │   └── SessionPage.js        # Training session interface
    │   ├── App.js         # Main React app component
    │   └── App.css        # Styling and responsive design
    └── package.json       # Client dependencies
```

## 🕐 Development Timeline

### Basic Version (2-3 days):
- ✅ Voice recognition and synthesis
- ✅ AI conversation generation
- ✅ Real-time scoring system
- ✅ Modern UI interface
- ✅ Session management

### Enhanced Version (1 week):
- 📊 Advanced analytics and reporting
- 🎯 Custom training scenarios
- 👥 Multi-user support
- 📱 Mobile responsiveness
- 🔧 Admin configuration panel

## 🚀 Deployment Options

### Local Deployment (Recommended for Training Centers):
1. Install on training computers
2. Run locally for best performance
3. No internet dependency during sessions

### Cloud Deployment:
1. Deploy to services like Heroku, Vercel, or AWS
2. Access from anywhere with internet
3. Centralized training management

## 🔧 Advanced Features & Configuration

### API Endpoints

The Sparring Bot includes a comprehensive REST API for system management:

#### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - Create new user (admin only)
- `POST /api/auth/change-password` - Change user password
- `GET /api/auth/me` - Get current user profile

#### User Management (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Configuration Management
- `GET /api/personalities` - List client personalities
- `POST /api/personalities` - Create new personality (admin only)
- `PUT /api/personalities/:id` - Update personality (admin only)
- `DELETE /api/personalities/:id` - Delete personality (admin only)

- `GET /api/scenarios` - List training scenarios
- `POST /api/scenarios` - Create new scenario (admin only)
- `PUT /api/scenarios/:id` - Update scenario (admin only)
- `DELETE /api/scenarios/:id` - Delete scenario (admin only)

#### Session Analytics
- `GET /api/sessions/history` - Get session history
- `GET /api/sessions/stats` - Get training analytics
- `GET /api/sessions/:id` - Get specific session details
- `DELETE /api/sessions/:id` - Delete session (admin only)

### Data Storage

The system uses JSON-based file storage for simplicity:
- `/data/scenarios.json` - Training scenarios and personalities
- `/data/sessions.json` - Training session history
- `/data/users.json` - User accounts and profiles

For production deployments with high usage, consider migrating to:
- **PostgreSQL** or **MongoDB** for user/session data
- **Redis** for session caching and real-time features

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt encryption for user passwords
- **Role-Based Access**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation for all API endpoints
- **CORS Protection**: Configured for secure cross-origin requests

### Customization Options

#### Adding New Industries
1. **Create Industry-Specific Scenarios**:
   ```json
   {
     "id": "healthcare_complaint",
     "name": "Medical Billing Issue",
     "description": "Patient confused about medical charges",
     "context": "Insurance claim was denied, patient doesn't understand why",
     "expectedIssues": ["Insurance policies", "Billing procedures", "Patient rights"]
   }
   ```

2. **Design Custom Personalities**:
   ```json
   {
     "id": "concerned_patient",
     "name": "Concerned Patient",
     "description": "Worried about medical procedure costs",
     "traits": ["Health-focused", "Cost-conscious", "Needs reassurance"]
   }
   ```

#### Extending Training Features
- **Custom Scoring Metrics**: Modify `services/scoringService.js`
- **Additional AI Models**: Integrate with different OpenAI models
- **Voice Customization**: Configure speech synthesis voices
- **Advanced Analytics**: Add performance tracking metrics

## 🔧 Customization

### Add New Customer Scenarios:
Edit `services/aiService.js` - `CAR_SCENARIOS` array to add new car repair situations.

### Modify Scoring Criteria:
Update `services/scoringService.js` - `scoreAgentResponse()` function to adjust evaluation parameters.

### Change Client Personalities:
Modify `services/aiService.js` - `CLIENT_PERSONALITIES` object to add new customer types.

## 🎯 Best Practices for Training

### For Trainers:
1. **Start with Normal clients** for new agents
2. **Progress to difficult personalities** as skills improve
3. **Review session reports** for targeted feedback
4. **Set improvement goals** based on scoring trends

### For Agents:
1. **Listen actively** to customer concerns
2. **Show empathy** in your responses
3. **Offer specific solutions** rather than generic answers
4. **Stay professional** even with aggressive customers
5. **Practice regularly** to improve scores

## 🆘 Troubleshooting

### Common Issues:

**Microphone not working:**
- Check browser permissions
- Ensure microphone is connected
- Try refreshing the page

**AI not responding:**
- Verify OpenAI API key is correct
- Check internet connection
- Ensure API key has sufficient credits

**Speech recognition errors:**
- Speak clearly and at normal pace
- Reduce background noise
- Use Chrome browser for best compatibility

**Connection issues:**
- Restart the server: `npm run server`
- Clear browser cache
- Check firewall settings

### Getting Help:

1. **Check console logs** in browser developer tools
2. **Verify API key** is properly configured
3. **Test microphone** in browser settings
4. **Restart application** if issues persist

## 💡 Tips for Maximum Effectiveness

### Training Environment:
- **Quiet space** for clear audio
- **Good microphone quality** for accurate recognition
- **Consistent practice schedule** for skill development
- **Regular feedback sessions** with trainers

### Performance Optimization:
- **Short, focused sessions** (15-30 minutes)
- **Specific scenario practice** based on real customer issues
- **Role reversal exercises** where agents play difficult customers
- **Group discussions** about challenging interactions

## 🔮 Future Enhancements

### Planned Features:
- **Multi-language support** for diverse training needs
- **Video integration** for visual cues and body language training
- **Industry-specific scenarios** (retail, healthcare, finance)
- **Advanced analytics dashboard** with performance trends
- **Integration with CRM systems** for real customer data scenarios
- **Mobile app version** for on-the-go training

## 📞 Support

For technical support or feature requests, please check the troubleshooting section above or review the code documentation.

---

**Ready to transform your customer service training? Start building better agent skills today with the Sparring Bot! 🚀**

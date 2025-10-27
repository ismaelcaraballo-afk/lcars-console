# 🎤 Voice Commands Guide

The LCARS AI Console features **Star Trek-style voice recognition**. Just like in the show, all commands start with **"Computer"** followed by your instruction.

## How to Use Voice Control

### 1. Activate Voice Recognition
Click the **microphone button** in the top-right corner of the screen (next to the clock).

When active:
- The microphone icon will glow
- A pulsing animation indicates the system is listening
- You'll hear an activation beep

### 2. Say "Computer" + Your Command
All voice commands follow this pattern:
```
Computer, [your command]
```

### 3. The System Responds
- A confirmation beep plays
- A toast notification shows what action was taken
- The interface navigates to the requested panel

## Supported Voice Commands

### Navigation Commands

| Say This | What Happens |
|----------|-------------|
| "Computer, open dashboard" | Goes to main dashboard |
| "Computer, show home" | Goes to main dashboard |
| "Computer, open tasks" | Opens Task Manager |
| "Computer, show task manager" | Opens Task Manager |
| "Computer, open weather" | Opens Weather Panel |
| "Computer, show weather" | Opens Weather Panel |
| "Computer, open calendar" | Opens Calendar |
| "Computer, show events" | Opens Calendar |
| "Computer, open analytics" | Opens Analytics |
| "Computer, show stats" | Opens Analytics |
| "Computer, open space" | Opens Space Exploration panel |
| "Computer, show NASA" | Opens Space Exploration panel |
| "Computer, open travel" | Opens Travel Calculator |
| "Computer, calculate route" | Opens Travel Calculator |
| "Computer, open notifications" | Opens Notifications |
| "Computer, show alerts" | Opens Notifications |
| "Computer, open terminal" | Opens Terminal/CLI |
| "Computer, show console" | Opens Terminal/CLI |
| "Computer, open AI" | Opens AI Chat |
| "Computer, start chat" | Opens AI Chat |
| "Computer, open settings" | Opens Settings |

## Example Voice Interactions

### Scenario 1: Check Weather
```
You: "Computer, open weather"
LCARS: *beep* "Voice Command: Opening Weather Panel"
Result: Weather panel displays with 7-day forecast
```

### Scenario 2: Manage Tasks
```
You: "Computer, show tasks"
LCARS: *beep* "Voice Command: Opening Task Manager"
Result: Task Manager opens with all your tasks
```

### Scenario 3: Navigate to Space Panel
```
You: "Computer, open space"
LCARS: *beep* "Voice Command: Opening Space Panel"
Result: NASA APOD and ISS tracker displayed
```

## Browser Compatibility

Voice recognition works in modern browsers that support the Web Speech API:

✅ **Fully Supported:**
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Safari 14.1+
- Opera

⚠️ **Limited/No Support:**
- Firefox (no native support yet)
- Older browsers

### Checking Support
The microphone button **only appears** if your browser supports voice recognition. If you don't see it, try using Chrome or Edge.

## Privacy & Security

### Your Voice Data
- Voice processing happens **entirely in your browser**
- No audio is sent to external servers
- The Web Speech API may use your browser's speech engine
- Chrome/Edge may send audio to Google/Microsoft for processing

### Permissions
- Your browser will ask for microphone permission
- You can revoke permission anytime in browser settings
- Voice recognition stops when you close the tab

## Tips for Best Results

### 1. Clear Commands
✅ Good: "Computer, open weather"  
❌ Bad: "Um... computer... maybe... weather?"

### 2. Quiet Environment
- Minimize background noise
- Speak clearly and at normal volume
- Position microphone appropriately

### 3. Natural Speech
- Speak naturally - no need to be robotic!
- Use normal pace and tone
- The system understands casual phrasing

### 4. Wait for Beep
- Listen for activation beep before speaking
- Wait for confirmation beep after command
- If no beep, check microphone permissions

## Troubleshooting

### "Voice recognition not supported"
**Solution**: Use Chrome, Edge, or Safari 14.1+

### Microphone button doesn't appear
**Causes**:
- Browser doesn't support Web Speech API
- Using Firefox or older browser

**Solution**: Switch to Chrome or Edge

### Commands not recognized
**Checklist**:
- [ ] Did you say "Computer" first?
- [ ] Is microphone icon pulsing (listening)?
- [ ] Is there background noise?
- [ ] Did you grant microphone permission?

**Try**:
1. Click microphone button again to restart
2. Speak more clearly
3. Reduce background noise
4. Check browser console for errors

### Voice stops listening
**Cause**: Browser auto-stops after period of silence

**Solution**: The system auto-restarts. Just say your command again.

### Permission denied
**Solution**:
1. Click lock icon in address bar
2. Reset microphone permission
3. Refresh page
4. Grant permission when prompted

## Advanced Usage

### Continuous Listening
Once activated, the voice system:
- Stays active until you click microphone button again
- Auto-restarts after each command
- Listens continuously for "Computer"
- Ignores other speech

### Multiple Commands
You can chain actions by voice:
1. "Computer, open tasks"
2. Wait for navigation
3. "Computer, open calendar"
4. Continue navigating

### Deactivation
Click the microphone button again to stop voice recognition:
- Icon stops pulsing
- Deactivation beep plays
- System stops listening

## Future Voice Features (Planned)

🚧 **Coming Soon:**
- Voice task creation: "Computer, create task called [name]"
- Voice queries: "Computer, what's the weather?"
- Voice settings: "Computer, change theme"
- Custom wake words beyond "Computer"
- Voice confirmation for actions

---

## Quick Reference Card

**Activate**: Click microphone button  
**Deactivate**: Click microphone button again  
**Command Format**: "Computer, [action]"  
**Most Common**: 
- "Computer, open dashboard"
- "Computer, show tasks"
- "Computer, open weather"

---

**Live Long and Prosper!** 🖖

*Voice commands working as of LCARS Console v4.0*

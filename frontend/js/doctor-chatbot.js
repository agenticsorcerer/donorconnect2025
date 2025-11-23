// Doctor Chatbot Logic
(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    // Help popup elements
    const helpPopup = document.getElementById('chatbot-help-popup');
    const helpPopupClose = document.getElementById('help-popup-close');
    const helpPopupYes = document.getElementById('help-popup-yes');
    const helpPopupNo = document.getElementById('help-popup-no');
    
    // Create audio context for sound notification
    let audioContext = null;
    let notificationSound = null;
    
    // Function to play notification sound
    function playNotificationSound() {
      try {
        // Create audio context if not exists
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create a pleasant notification sound (beep)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound
        oscillator.frequency.value = 800; // Higher pitch
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        // Play a second beep for a nice notification effect
        setTimeout(() => {
          const oscillator2 = audioContext.createOscillator();
          const gainNode2 = audioContext.createGain();
          
          oscillator2.connect(gainNode2);
          gainNode2.connect(audioContext.destination);
          
          oscillator2.frequency.value = 1000;
          oscillator2.type = 'sine';
          
          gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator2.start(audioContext.currentTime);
          oscillator2.stop(audioContext.currentTime + 0.2);
        }, 150);
      } catch (error) {
        console.log('Sound notification not available:', error);
      }
    }
    
    // Function to show help popup
    function showHelpPopup() {
      // Check if user has already interacted with chatbot
      const hasInteracted = localStorage.getItem('chatbot_interacted');
      
      // Don't show if user already interacted or popup was dismissed
      if (hasInteracted === 'true') {
        return;
      }
      
      if (helpPopup) {
        helpPopup.classList.add('show');
        // Play notification sound
        playNotificationSound();
        
        // Add vibration if supported (mobile)
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }
    
    // Function to hide help popup
    function hideHelpPopup() {
      if (helpPopup) {
        helpPopup.classList.remove('show');
      }
    }
    
    // Show popup after 3 seconds of page load
    setTimeout(() => {
      showHelpPopup();
    }, 3000);
    
    // Close popup handlers
    if (helpPopupClose) {
      helpPopupClose.addEventListener('click', function() {
        hideHelpPopup();
        localStorage.setItem('chatbot_interacted', 'true');
      });
    }
    
    // Yes button - open chatbot
    if (helpPopupYes) {
      helpPopupYes.addEventListener('click', function() {
        hideHelpPopup();
        localStorage.setItem('chatbot_interacted', 'true');
        // Open chatbot window
        if (chatbotWindow) {
          chatbotWindow.classList.add('active');
          if (chatbotInput) {
            chatbotInput.focus();
          }
        }
      });
    }
    
    // No button - just close
    if (helpPopupNo) {
      helpPopupNo.addEventListener('click', function() {
        hideHelpPopup();
        localStorage.setItem('chatbot_interacted', 'true');
      });
    }
    
    // Mark as interacted when user opens chatbot manually
    if (chatbotButton) {
      chatbotButton.addEventListener('click', function() {
        localStorage.setItem('chatbot_interacted', 'true');
        hideHelpPopup(); // Hide popup if open
      });
    }
    
    // Medical knowledge base for doctor responses
    const medicalKnowledge = {
      'donate': {
        keywords: ['donate', 'donation', 'donor', 'give blood'],
        response: 'As a medical professional, I recommend blood donation for eligible individuals. To donate blood, you must be: 18-65 years old, weigh at least 50kg, be in good health, and have no recent illnesses. Before donation, ensure you are well-hydrated and have eaten a healthy meal. After donation, rest for 15-20 minutes, drink plenty of fluids, and avoid heavy physical activity for 24 hours.'
      },
      'eligibility': {
        keywords: ['eligible', 'who can', 'can i', 'requirements', 'qualify'],
        response: 'Blood donation eligibility criteria: Age 18-65 years, minimum weight 50kg, good general health, hemoglobin level above 12.5g/dL for women and 13.5g/dL for men. You cannot donate if you have: recent infections, certain medications, recent tattoos/piercings (within 6 months), pregnancy, or certain medical conditions. Always consult with a healthcare provider if you have specific health concerns.'
      },
      'benefits': {
        keywords: ['benefits', 'advantage', 'good for', 'help', 'healthy'],
        response: 'Blood donation has several health benefits: 1) Reduces risk of heart disease by lowering iron levels, 2) Stimulates production of new blood cells, 3) Helps maintain healthy iron levels, 4) Provides a free health checkup, 5) Can reduce risk of certain cancers. Additionally, donating blood can give you a sense of satisfaction knowing you\'re helping save lives. Regular donors often report feeling healthier and more energetic.'
      },
      'frequency': {
        keywords: ['often', 'frequency', 'how many times', 'interval', 'when'],
        response: 'The recommended frequency for blood donation is: Whole blood donation - every 56 days (approximately 2 months), Platelet donation - every 7 days (up to 24 times per year), Plasma donation - every 28 days. It\'s important to wait the recommended interval between donations to allow your body to replenish blood cells. Over-donation can lead to iron deficiency and fatigue.'
      },
      'preparation': {
        keywords: ['prepare', 'before', 'what to do', 'ready', 'preparation'],
        response: 'Before donating blood: 1) Eat a healthy meal rich in iron (red meat, spinach, beans), 2) Drink plenty of water (at least 2-3 glasses), 3) Get adequate sleep the night before, 4) Avoid alcohol 24 hours before, 5) Bring a valid ID, 6) Wear comfortable clothing with sleeves that can be rolled up. Avoid fatty foods before donation as they can affect blood tests.'
      },
      'after': {
        keywords: ['after', 'recovery', 'care', 'what to do', 'post'],
        response: 'After blood donation: 1) Rest for 15-20 minutes before leaving, 2) Drink extra fluids for the next 24-48 hours, 3) Avoid heavy lifting or strenuous exercise for 24 hours, 4) Keep the bandage on for 4-6 hours, 5) If you feel dizzy, lie down with feet elevated, 6) Eat iron-rich foods to help replenish. If you experience any unusual symptoms, contact the donation center or seek medical attention.'
      },
      'safety': {
        keywords: ['safe', 'risk', 'dangerous', 'harmful', 'infection'],
        response: 'Blood donation is very safe when done at licensed blood banks. All equipment is sterile and used only once. The process is supervised by trained medical professionals. The amount of blood taken (about 450ml) is safe and your body replaces it within 24-48 hours. There is no risk of contracting diseases as all needles are new and sterile. Minor side effects like dizziness or bruising are rare and temporary.'
      },
      'health': {
        keywords: ['health', 'medical', 'condition', 'disease', 'illness'],
        response: 'If you have any health concerns or medical conditions, it\'s important to discuss them with the medical staff at the donation center. Certain conditions like diabetes (well-controlled), high blood pressure (controlled), and heart disease (stable) may still allow donation. However, conditions like HIV, hepatitis, cancer, or certain medications may disqualify you. Always be honest about your health history for your safety and the recipient\'s safety.'
      },
      'blood group': {
        keywords: ['blood group', 'blood type', 'compatible', 'matching'],
        response: 'Blood groups are categorized as A, B, AB, and O, each with positive (+) or negative (-) Rh factor. Universal donors are O-negative (can donate to all), and universal recipients are AB-positive (can receive from all). However, it\'s best to match exact blood types when possible. Your blood group is determined by genetics and doesn\'t change. Knowing your blood group is important for medical emergencies.'
      },
      'default': {
        response: 'Thank you for your question. As a medical assistant, I recommend consulting with a healthcare professional for personalized medical advice. For blood donation specifically, you can contact your local blood bank or visit our donation center. If you have questions about eligibility, preparation, or post-donation care, I\'m here to help. What would you like to know?'
      }
    };
    
    // Check if elements exist before adding event listeners
    if (!chatbotButton || !chatbotWindow || !chatbotClose || !chatbotInput || !chatbotSend || !chatbotMessages) {
      console.warn('Chatbot elements not found. Some elements may be missing.');
      return;
    }
    
    // Open/Close chatbot
    chatbotButton.addEventListener('click', function() {
      chatbotWindow.classList.toggle('active');
      if (chatbotWindow.classList.contains('active')) {
        chatbotInput.focus();
      }
    });
    
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.remove('active');
    });
    
    // Send message function
    function sendMessage(messageText, isUser = true) {
      if (!messageText.trim()) return;
      
      // Add user message
      if (isUser) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
          <div class="message-avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="message-content">
            <p>${messageText}</p>
          </div>
        `;
        chatbotMessages.appendChild(userMessage);
        chatbotInput.value = '';
        scrollToBottom();
      }
      
      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message bot-message typing-indicator';
      typingIndicator.innerHTML = `
        <div class="message-avatar">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face" alt="Doctor" class="doctor-message-avatar" onerror="this.onerror=null; this.src='https://via.placeholder.com/80/dc3545/ffffff?text=Dr.'">
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      chatbotMessages.appendChild(typingIndicator);
      scrollToBottom();
      
      // Get doctor response
      setTimeout(() => {
        typingIndicator.remove();
        const response = getDoctorResponse(messageText);
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `
          <div class="message-avatar">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face" alt="Doctor" class="doctor-message-avatar" onerror="this.onerror=null; this.src='https://via.placeholder.com/80/dc3545/ffffff?text=Dr.'">
          </div>
          <div class="message-content">
            <p>${response}</p>
          </div>
        `;
        chatbotMessages.appendChild(botMessage);
        scrollToBottom();
      }, 1000 + Math.random() * 1000); // Simulate thinking time
    }
    
    // Get doctor response based on user input
    function getDoctorResponse(userInput) {
      const input = userInput.toLowerCase();
      
      // Check against medical knowledge base
      for (const [key, data] of Object.entries(medicalKnowledge)) {
        if (key === 'default') continue;
        
        for (const keyword of data.keywords) {
          if (input.includes(keyword)) {
            return data.response;
          }
        }
      }
      
      // Check for specific question patterns
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return 'Hello! I\'m Dr. Health Assistant. I\'m here to provide medical guidance, especially about blood donation. What would you like to know?';
      }
      
      if (input.includes('thank')) {
        return 'You\'re welcome! I\'m glad I could help. If you have any more questions about blood donation or health, feel free to ask. Remember, when in doubt, always consult with a healthcare professional for personalized advice.';
      }
      
      if (input.includes('pain') || input.includes('hurt')) {
        return 'If you experience pain during or after blood donation, it\'s usually minimal. During donation, you might feel a slight pinch when the needle is inserted. After donation, you may experience mild bruising or soreness at the needle site, which is normal and should resolve within a few days. If you experience severe pain, dizziness, or any concerning symptoms, please contact the donation center or seek medical attention immediately.';
      }
      
      if (input.includes('weight') || input.includes('kg')) {
        return 'The minimum weight requirement for blood donation is typically 50kg (110 pounds). This ensures that the amount of blood taken (approximately 450ml) is safe relative to your body size. If you weigh less than 50kg, you may not be eligible to donate. Your weight will be checked during the screening process before donation.';
      }
      
      if (input.includes('age') || input.includes('old')) {
        return 'The age requirement for blood donation is typically 18-65 years. Some countries may allow 16-17 year olds with parental consent. There\'s no upper age limit if you\'re healthy, but some centers may have specific policies. Always check with your local blood bank for their specific age requirements.';
      }
      
      // Default response
      return medicalKnowledge.default.response;
    }
    
    // Scroll to bottom of messages
    function scrollToBottom() {
      setTimeout(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }, 100);
    }
    
    // Send button click
    chatbotSend.addEventListener('click', function() {
      const message = chatbotInput.value.trim();
      if (message) {
        sendMessage(message, true);
      }
    });
    
    // Enter key to send
    chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const message = chatbotInput.value.trim();
        if (message) {
          sendMessage(message, true);
        }
      }
    });
    
    // Quick question buttons
    quickButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const question = this.getAttribute('data-question');
        sendMessage(question, true);
      });
    });
  });
})();


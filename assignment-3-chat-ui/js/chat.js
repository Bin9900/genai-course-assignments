/**
 * NovaMind Chat UI — chat.js
 * Author: Student
 * Description: Handles all chat interactions, message display, and UI features.
 */

$(document).ready(function () {

  /* ═══════════════════════════════════════════
     1. STATE
  ═══════════════════════════════════════════ */
  let messageCount = 0;
  let isTyping = false;
  let conversationStarted = false;
  let chatHistory = []; // For export feature

  /* ═══════════════════════════════════════════
     2. MOCK AI RESPONSES
  ═══════════════════════════════════════════ */
  const aiResponses = [
    "That's a great question! Let me break this down step by step. The concept you're asking about has several important dimensions to consider. First, we need to look at the foundational principles, and then build up to the more complex aspects.",
    "I'd be happy to help you with that! Here's what you need to know:\n\n**Key Points:**\n• The core idea revolves around structured thinking\n• Breaking complex problems into smaller parts helps enormously\n• Practice and iteration are crucial for mastery\n\nWould you like me to elaborate on any of these points?",
    "Excellent question! From my analysis, there are a few approaches you could take here. The most effective strategy typically involves understanding the problem space first, then systematically working through possible solutions. Let me know if you'd like a deeper dive.",
    "Sure! Here's a concise explanation:\n\nThe process involves three main stages:\n1. **Planning** — Define your goals clearly\n2. **Execution** — Implement with consistent effort\n3. **Review** — Iterate based on feedback\n\nThis cycle repeats until you achieve the desired outcome.",
    "Absolutely! This is a fascinating topic. The short answer is: it depends on context. However, in most practical scenarios, the optimal approach balances efficiency with clarity. The key trade-off to consider is complexity versus maintainability.",
    "Great point! I think the most important thing here is to start with a clear mental model. Once you have that foundation, the implementation details become much more manageable. What specific aspect would you like to explore further?",
    "I can definitely help with that! Here's a quick overview:\n\nThe core principle is straightforward — focus on what matters most and systematically eliminate obstacles. In practice, this means being deliberate about priorities and not letting perfect be the enemy of good.",
    "That's something worth exploring carefully. From multiple perspectives, there are both advantages and trade-offs to consider. The best approach often depends on your specific constraints, goals, and available resources. Could you share more context?",
    "Interesting! Let me think through this with you. The fundamental concept here is rooted in how systems interact with each other. When you understand the underlying mechanics, patterns emerge that make complex problems much more tractable.",
    "Of course! The straightforward answer is to start small and iterate. Many people make the mistake of over-planning before taking action. A better strategy: build a minimal version, test it, gather feedback, and improve from there."
  ];

  /* ═══════════════════════════════════════════
     3. UTILITY: GET CURRENT TIME
  ═══════════════════════════════════════════ */
  function getTime() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  /* ═══════════════════════════════════════════
     4. FORMAT MESSAGE TEXT (markdown-lite)
  ═══════════════════════════════════════════ */
  function formatText(text) {
    // Escape HTML first
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks
    safe = safe.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Bullet list items (• or -)
    safe = safe.replace(/^[•\-] (.+)$/gm, '<li>$1</li>');
    safe = safe.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>');

    // Numbered list
    safe = safe.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Line breaks
    safe = safe.replace(/\n/g, '<br>');

    return safe;
  }

  /* ═══════════════════════════════════════════
     5. ADD MESSAGE
  ═══════════════════════════════════════════ */
  function addMessage(text, sender) {
    messageCount++;
    const time = getTime();
    const isUser = sender === 'user';
    const rowClass = isUser ? 'user-row' : 'ai-row';
    const bubbleClass = isUser ? 'user-bubble' : 'ai-bubble-msg';
    const avatarClass = isUser ? 'user-avatar-msg' : 'ai-avatar';
    const avatarContent = isUser
      ? '<span>S</span>'
      : '<i class="fa-solid fa-brain"></i>';
    const senderName = isUser ? 'You' : 'NovaMind';
    const formattedText = formatText(text);

    // Save to history for export
    chatHistory.push({ sender: senderName, time, text });

    const messageHTML = `
      <div class="message-row ${rowClass}" id="msg-${messageCount}">
        <div class="msg-avatar ${avatarClass}">${avatarContent}</div>
        <div class="msg-content">
          <div class="msg-header">
            <span class="msg-name">${senderName}</span>
            <span class="msg-time">${time}</span>
          </div>
          <div class="msg-bubble ${bubbleClass}">${formattedText}</div>
        </div>
      </div>
    `;

    // Insert before typing indicator
    $(messageHTML).insertBefore('#typingIndicator');

    scrollToBottom();
  }

  /* ═══════════════════════════════════════════
     6. SCROLL TO BOTTOM
  ═══════════════════════════════════════════ */
  function scrollToBottom(smooth = true) {
    const $section = $('#messagesSection');
    $section.animate(
      { scrollTop: $section[0].scrollHeight },
      smooth ? 350 : 0
    );
  }

  /* ═══════════════════════════════════════════
     7. SHOW / HIDE TYPING INDICATOR
  ═══════════════════════════════════════════ */
  function showTyping() {
    isTyping = true;
    $('#typingIndicator').fadeIn(200);
    scrollToBottom();
  }

  function hideTyping() {
    isTyping = false;
    $('#typingIndicator').fadeOut(150);
  }

  /* ═══════════════════════════════════════════
     8. GET RANDOM AI RESPONSE
  ═══════════════════════════════════════════ */
  function getAiResponse() {
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }

  /* ═══════════════════════════════════════════
     9. SEND MESSAGE
  ═══════════════════════════════════════════ */
  function sendMessage() {
    const $input = $('#messageInput');
    const text = $input.val().trim();

    if (!text || isTyping) return;

    // Hide welcome screen on first message
    if (!conversationStarted) {
      conversationStarted = true;
      $('#welcomeScreen').fadeOut(300, function () {
        $(this).remove();
      });

      // Add first history item
      const snippet = text.length > 28 ? text.substring(0, 28) + '…' : text;
      const $newItem = $(`
        <li class="history-item active">
          <i class="fa-regular fa-comment"></i>
          <span>${$('<div>').text(snippet).html()}</span>
        </li>
      `);
      $('#chatHistoryList .history-item.active').removeClass('active');
      $('#chatHistoryList').prepend($newItem);
    }

    // Add user message
    addMessage(text, 'user');

    // Clear & reset input
    $input.val('').trigger('input');
    $('#sendBtn').prop('disabled', true);

    // Simulate AI response
    const delay = 1000 + Math.random() * 1000;
    showTyping();

    setTimeout(function () {
      hideTyping();
      const response = getAiResponse();
      addMessage(response, 'ai');
    }, delay);
  }

  /* ═══════════════════════════════════════════
     10. INPUT HANDLING
  ═══════════════════════════════════════════ */

  // Enable/disable send button + auto-resize
  $('#messageInput').on('input', function () {
    const text = $(this).val().trim();
    $('#sendBtn').prop('disabled', text.length === 0);

    // Auto-resize
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
  });

  // Enter to send, Shift+Enter for newline
  $('#messageInput').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!$(this).val().trim() || isTyping) return;
      sendMessage();
    }
  });

  // Send button click
  $('#sendBtn').on('click', function () {
    sendMessage();
  });

  /* ═══════════════════════════════════════════
     11. SUGGESTION CARDS
  ═══════════════════════════════════════════ */
  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    if (prompt) {
      $('#messageInput').val(prompt).trigger('input');
      sendMessage();
    }
  });

  /* ═══════════════════════════════════════════
     12. SIDEBAR TOGGLE (Mobile)
  ═══════════════════════════════════════════ */
  function openSidebar() {
    $('#sidebar').addClass('open');
    $('#sidebarOverlay').addClass('active');
    $('body').css('overflow', 'hidden');
  }

  function closeSidebar() {
    $('#sidebar').removeClass('open');
    $('#sidebarOverlay').removeClass('active');
    $('body').css('overflow', '');
  }

  $('#hamburgerBtn').on('click', openSidebar);
  $('#sidebarClose').on('click', closeSidebar);
  $('#sidebarOverlay').on('click', closeSidebar);

  // Close sidebar on window resize if desktop
  $(window).on('resize', function () {
    if ($(window).width() >= 992) {
      closeSidebar();
    }
  });

  /* ═══════════════════════════════════════════
     13. NEW CHAT BUTTON
  ═══════════════════════════════════════════ */
  $('#newChatBtn').on('click', function () {
    // Reset conversation
    conversationStarted = false;
    chatHistory = [];
    messageCount = 0;
    isTyping = false;

    // Remove all messages
    $('.message-row:not(#typingIndicator .message-row)').remove();
    $('#typingIndicator').hide();

    // Re-insert welcome screen
    const welcomeHTML = `
      <div class="welcome-screen" id="welcomeScreen">
        <div class="welcome-content">
          <div class="welcome-icon">
            <div class="welcome-orb"><i class="fa-solid fa-brain"></i></div>
          </div>
          <h1 class="welcome-title">What can I help you with?</h1>
          <p class="welcome-subtitle">Ask anything — I'm here to assist, explain, and create.</p>
          <div class="suggestion-grid" id="suggestionGrid">
            <div class="suggestion-card" data-prompt="Explain how neural networks work in simple terms">
              <div class="card-icon"><i class="fa-solid fa-network-wired"></i></div>
              <div class="card-body-content">
                <h3 class="card-title">Explain concepts</h3>
                <p class="card-desc">How do neural networks work in simple terms?</p>
              </div>
            </div>
            <div class="suggestion-card" data-prompt="Write a Python function to sort a list of dictionaries by a specific key">
              <div class="card-icon"><i class="fa-solid fa-code"></i></div>
              <div class="card-body-content">
                <h3 class="card-title">Write code</h3>
                <p class="card-desc">Python function to sort a list of dictionaries</p>
              </div>
            </div>
            <div class="suggestion-card" data-prompt="Give me 5 creative marketing ideas for a student startup">
              <div class="card-icon"><i class="fa-solid fa-lightbulb"></i></div>
              <div class="card-body-content">
                <h3 class="card-title">Brainstorm ideas</h3>
                <p class="card-desc">5 creative marketing ideas for a student startup</p>
              </div>
            </div>
            <div class="suggestion-card" data-prompt="Help me write a professional email to request a project deadline extension">
              <div class="card-icon"><i class="fa-solid fa-pen-nib"></i></div>
              <div class="card-body-content">
                <h3 class="card-title">Draft content</h3>
                <p class="card-desc">Write a professional email for a deadline extension</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#messagesWrapper').prepend($(welcomeHTML).hide().fadeIn(300));

    // Reset input
    $('#messageInput').val('').trigger('input');

    // Close sidebar on mobile
    if ($(window).width() < 992) closeSidebar();
  });

  /* ═══════════════════════════════════════════
     14. DARK / LIGHT THEME TOGGLE (Bonus)
  ═══════════════════════════════════════════ */
  $('#themeToggle').on('click', function () {
    const $html = $('html');
    const isDark = $html.attr('data-theme') === 'dark';

    $html.attr('data-theme', isDark ? 'light' : 'dark');
    $('#themeIcon')
      .toggleClass('fa-moon', !isDark)
      .toggleClass('fa-sun', isDark);
  });

  /* ═══════════════════════════════════════════
     15. EXPORT CHAT (Bonus)
  ═══════════════════════════════════════════ */
  $('#exportBtn').on('click', function () {
    if (chatHistory.length === 0) {
      alert('No messages to export yet!');
      return;
    }

    let content = 'NovaMind Chat Export\n';
    content += '='.repeat(40) + '\n\n';

    chatHistory.forEach(function (msg) {
      content += `[${msg.time}] ${msg.sender}:\n${msg.text}\n\n`;
    });

    // Use Blob API to create downloadable file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const $a = $('<a>')
      .attr('href', url)
      .attr('download', 'novamind-chat-export.txt')
      .appendTo('body');
    $a[0].click();
    $a.remove();
    URL.revokeObjectURL(url);
  });

  /* ═══════════════════════════════════════════
     16. HISTORY ITEM CLICKS
  ═══════════════════════════════════════════ */
  $(document).on('click', '.history-item', function () {
    $('.history-item').removeClass('active');
    $(this).addClass('active');
    if ($(window).width() < 992) closeSidebar();
  });

  /* ═══════════════════════════════════════════
     17. ATTACH BUTTON (UI only)
  ═══════════════════════════════════════════ */
  $('.attach-btn').on('click', function () {
    // UI demonstration — no backend
    const $btn = $(this);
    $btn.css('color', 'var(--accent)');
    setTimeout(() => $btn.css('color', ''), 400);
  });

  /* ═══════════════════════════════════════════
     18. INITIAL FOCUS
  ═══════════════════════════════════════════ */
  $('#messageInput').focus();

}); // END document.ready

/**
 * main.js
 * 
 * Handles the DOM manipulation, animations, and state for the 
 * International Expansion QuickScan conversational UI.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatHistory = document.getElementById("chat-history");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const submitBtn = chatForm.querySelector(".submit-btn");
    const progressBar = document.getElementById("progress-bar");
    const resultContainer = document.getElementById("result-container");
    const advisoryOutput = document.getElementById("advisory-output");
    const leadForm = document.getElementById("lead-form");
    const emailInput = document.getElementById("email-input");
    const inputArea = document.getElementById("input-area");

    // Conversation State
    let currentStep = 0;
    const maxSteps = 3;
    const answers = {
        currentStatus: "",
        goals: "",
        previousAttempts: ""
    };

    // Questions Sequence definition
    const questions = [
        {
            text: "Welcome to Boost Business. To start, briefly tell us what your company does and where you are right now (which countries are you active in)?",
            options: null
        },
        {
            text: "Thanks! Briefly tell us where you would like to go internationally. What are your international goals?",
            options: null
        },
        {
            text: "Got it. Finally, what have you already tried regarding international expansion? What worked and what didn't work?",
            options: null
        }
    ];

    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    /**
     * Add a message bubble to the chat
     */
    function addMessage(text, sender, isHTML = false) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender}`;

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";

        if (isHTML) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }

        msgDiv.appendChild(bubble);
        chatHistory.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    /**
     * Add options as clickable chips below a system message
     */
    function addOptions(options) {
        if (!options || options.length === 0) return;

        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options-list message system";
        optionsContainer.style.background = "transparent";
        optionsContainer.style.border = "none";

        options.forEach(opt => {
            const chip = document.createElement("button");
            chip.className = "option-chip";
            chip.textContent = opt;
            chip.onclick = () => {
                userInput.value = opt;
                userInput.focus();
            };
            optionsContainer.appendChild(chip);
        });

        chatHistory.appendChild(optionsContainer);
        scrollToBottom();
    }

    /**
     * Show a typing indicator temporarily
     */
    function showTypingIndicator(callback, duration = 800) {
        const indicator = document.createElement("div");
        indicator.className = "typing-indicator message system";
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        chatHistory.appendChild(indicator);
        scrollToBottom();

        // Temporarily disable input
        userInput.disabled = true;
        submitBtn.disabled = true;

        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
            userInput.disabled = false;
            submitBtn.disabled = false;
            if (currentStep < maxSteps) {
                userInput.focus();
            }
            callback();
        }, duration);
    }

    /**
     * Update the progress bar
     */
    function updateProgress() {
        const percentage = (currentStep / maxSteps) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    /**
     * Ask the next question in the sequence
     */
    function askQuestion() {
        if (currentStep >= maxSteps) return;

        const question = questions[currentStep];

        showTypingIndicator(() => {
            addMessage(question.text, "system");
            if (question.options) {
                addOptions(question.options);
                userInput.placeholder = "Type or select an option...";
            } else {
                userInput.placeholder = "Type your answer here...";
            }
            updateProgress();
        }, currentStep === 0 ? 500 : 800);
    }

    /**
     * Handle the generation and display of the final advisory
     */
    function completeProcess() {
        updateProgress();
        inputArea.classList.add("hidden");

        // No longer relying on FormSubmit, so no hidden fields needed

        showTypingIndicator(() => {
            addMessage("Thank you. I am analyzing your inputs and generating your strategic direction...", "system");

            setTimeout(async () => {
                // Generate the output using the OpenAI API rule engine
                const outputHTML = await window.AdvisoryEngine.generateAdvisory(
                    answers.currentStatus,
                    answers.goals,
                    answers.previousAttempts
                );

                // Show result container smoothly
                advisoryOutput.innerHTML = outputHTML;
                resultContainer.classList.remove("hidden");

                // Scroll down to the result
                setTimeout(() => {
                    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

            }, 1200); // Simulate processing time

        }, 1000);
    }

    /**
     * Handle user chat submission
     */
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const val = userInput.value.trim();
        if (!val) return;

        // Clear input immediately
        userInput.value = "";

        // Remove options from previous message to keep chat clean
        const chips = document.querySelectorAll(".options-list");
        chips.forEach(c => c.remove());

        // Process answer
        addMessage(val, "user");

        // Save to state
        if (currentStep === 0) answers.currentStatus = val;
        else if (currentStep === 1) answers.goals = val;
        else if (currentStep === 2) answers.previousAttempts = val;

        currentStep++;

        if (currentStep < maxSteps) {
            askQuestion();
        } else {
            completeProcess();
        }
    });

    /**
     * Handle Final Lead Capture Submission
     */
    leadForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const submitBtnLead = leadForm.querySelector(".cta-btn");
        submitBtnLead.disabled = true;
        submitBtnLead.textContent = "Opening Email...";

        // Provide a download of the JSON file automatically for the user to view locally (Bonus)
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ ...answers }, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `Boost-Business-QuickScan-Answers-${Date.now()}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (e) { }

        // Generate the mailto link
        const subject = encodeURIComponent("QuickScan Request: Full Report Needed");
        const body = encodeURIComponent(`Hello Boost Business,

I have completed the Quick Internationalisation Expansion Scan. Please find my answers below and contact me with the full report.

1. Current Status & Countries:
${answers.currentStatus}

2. International Goals:
${answers.goals}

3. Previous Attempts & Results:
${answers.previousAttempts}

Looking forward to your strategic advice!`);

        const mailtoLink = `mailto:hello@boostbusiness.global?subject=${subject}&body=${body}`;

        // Open the user's email client natively
        window.location.href = mailtoLink;

        // Update UI locally to show success.
        setTimeout(() => {
            document.getElementById("lead-capture").innerHTML = `
                <div style="animation: fadeInUp 0.5s ease-out;">
                    <div style="font-size: 3rem; color: var(--accent-secondary); margin-bottom: 1rem;">&#10003;</div>
                    <h3>Almost there!</h3>
                    <p style="color: var(--text-secondary)">Your email client has been opened automatically. <strong>Please send the prepared email</strong> to us, so we can start working on your customized roadmap.</p>
                </div>
            `;
        }, 500);
    });

    // Start the conversation on load
    setTimeout(() => {
        askQuestion();
    }, 400); // Slight delay for aesthetic entrance
});

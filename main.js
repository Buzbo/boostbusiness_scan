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
    const maxSteps = 4;
    const answers = {
        goal: "",
        stage: "",
        service: "",
        markets: ""
    };

    // Questions Sequence definition
    const questions = [
        {
            text: "Welcome to Boost Business. What best describes your international expansion goal?",
            options: ["Enter a new country", "Scale marketplaces", "Build distribution", "Hire local sales", "Full international expansion", "Other"]
        },
        {
            text: "Got it. What stage are you currently in with this goal?",
            options: ["Idea phase", "Early traction", "Revenue generating", "Scaling", "Established but stuck"]
        },
        {
            text: "What type of local commercial boost do you need most right now?",
            options: ["Dedicated Country Manager", "One-time Market Entry Strategy", "Finding Local Talent"]
        },
        {
            text: "Understood. Finally, what specific markets are you targeting? (You can type freely)",
            options: null // Free text input only
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

        showTypingIndicator(() => {
            addMessage("Thank you. I am analyzing your inputs and generating your strategic direction...", "system");

            setTimeout(() => {
                // Generate the output using the rule engine
                const outputHTML = window.AdvisoryEngine.generateAdvisory(
                    answers.goal,
                    answers.stage,
                    answers.service,
                    answers.markets
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
        if (currentStep === 0) answers.goal = val;
        else if (currentStep === 1) answers.stage = val;
        else if (currentStep === 2) answers.service = val;
        else if (currentStep === 3) answers.markets = val;

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
        const email = emailInput.value.trim();
        if (!email) return;

        const submitBtnLead = leadForm.querySelector(".cta-btn");
        submitBtnLead.disabled = true;
        submitBtnLead.textContent = "Processing...";

        // Create the structured data object
        const leadData = {
            email: email,
            goal: answers.goal,
            stage: answers.stage,
            service_needed: answers.service,
            target_markets: answers.markets,
            advisory_type: window.AdvisoryEngine.detectCategory(answers.goal, window.AdvisoryEngine.goals) + "-" + window.AdvisoryEngine.detectCategory(answers.service, window.AdvisoryEngine.services),
            created_at: new Date().toISOString()
        };

        // Simulate API call / save locally
        setTimeout(() => {
            // Save to LocalStorage to act as a mock database
            let existingLeads = [];
            try {
                existingLeads = JSON.parse(localStorage.getItem('boostLeads')) || [];
            } catch (err) {
                console.error("Local storage error", err);
            }

            existingLeads.push(leadData);
            localStorage.setItem('boostLeads', JSON.stringify(existingLeads));

            // Console log for verification
            console.log("LEAD CAPTURED:", JSON.stringify(leadData, null, 2));

            // Optional: Provide a download of the JSON file automatically for the user to view
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leadData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `lead-${Date.now()}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            // Success State
            document.getElementById("lead-capture").innerHTML = `
                <div style="animation: fadeInUp 0.5s ease-out;">
                    <div style="font-size: 3rem; color: #4ade80; margin-bottom: 1rem;">&#10003;</div>
                    <h3>Roadmap Sent</h3>
                    <p style="color: var(--text-secondary)">Your customized roadmap has been sent to <strong>${email}</strong>. Our commercial director will be in touch shortly.</p>
                </div>
            `;

        }, 1200);
    });

    // Start the conversation on load
    setTimeout(() => {
        askQuestion();
    }, 400); // Slight delay for aesthetic entrance
});

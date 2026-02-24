/**
 * advisoryLogic.js
 * 
 * Local, rule-based logic engine that uses keyword matching on the user's
 * free text inputs to distribute 7 targeted strategic paragraphs
 * based on the Boost Business core methodologies.
 */

const AdvisoryEngine = {

    // Core Distilled Knowledge Blocks based on 7 common problems
    blocks: {
        intro: `<p>Thank you for sharing your current status and goals. Expanding internationally is a major step. Statistics show that <strong>78% of B2B buyers</strong> prefer purchasing from local representatives who speak their language and understand their culture.</p>`,

        situation1: `<p><strong>1️⃣ Entering a New Country: Speed Through Local Commercial Execution</strong><br>
Expanding into a new country is not a marketing exercise — it is a commercial execution challenge. The biggest delay in international growth is not strategy, but local access. Without relationships, cultural understanding and market credibility, growth slows down immediately.<br><br>
The fastest and lowest-risk way to enter a new market is through deploying an experienced local commercial professional. Someone who already understands the ecosystem, speaks the language fluently and has an existing network within your target sector.<br><br>
Boost Business specializes in seconding senior local sales professionals who represent your brand directly in-market. This gives you immediate traction without the risk and delay of building a full internal team from scratch. If long-term internal hiring is preferred, we can transition toward permanent recruitment once the market is validated.</p>`,

        situation2: `<p><strong>2️⃣ Scaling Through Local Sales, Not Remote Management</strong><br>
Many companies try to expand internationally from headquarters. They manage distributors remotely, follow up digitally and hope growth follows. In reality, revenue increases when someone local is physically present in the market.<br><br>
Local sales execution means visiting clients, building relationships, negotiating pricing, opening doors, and managing commercial partnerships.<br><br>
Boost Business deploys plug-and-play commercial experts who operate under your brand while remaining flexible. This allows you to scale up or down depending on seasonality or performance — without long-term payroll commitments. If your strategy evolves, we also support permanent recruitment to internalize the role.</p>`,

        situation3: `<p><strong>3️⃣ Distribution Only Works When Locally Managed</strong><br>
Signing a distributor does not equal growth. Distribution requires continuous commercial management, performance tracking and relationship building. Without local commercial oversight, distributors prioritize their own portfolio. Your product becomes secondary.<br><br>
Boost Business provides either a local commercial professional managing distributor performance on your behalf, or the recruitment of a permanent country sales manager. This ensures distribution becomes an active revenue channel rather than a passive agreement.</p>`,

        situation4: `<p><strong>4️⃣ Flexible Expansion Model: Detach First, Recruit Later</strong><br>
International expansion carries uncertainty. Committing to full payroll in an unvalidated market increases financial risk. Recruiting locally feels too risky and expensive if it fails.<br><br>
A phased approach is often more effective: Deploy a senior local commercial professional through secondment, validate traction and revenue potential, and transition to permanent recruitment if justified.<br><br>
Boost Business operates exactly in this structure. Our core service is deploying experienced local commercial professionals who accelerate your market entry. This structure ensures faster market access, controlled cost and scalable growth.</p>`,

        situation5: `<p><strong>5️⃣ Marketplace Growth Requires Local Expertise</strong><br>
Marketplaces like Amazon and bol.com are powerful channels, but they are highly competitive and operationally complex. Success depends on local market insight, pricing discipline and advertising optimization.<br><br>
Instead of building in-house expertise immediately, companies can leverage specialized marketplace professionals through a project-based or secondment model. Boost Business provides marketplace experts on a flexible basis, combining operational management with commercial oversight. This allows you to treat marketplaces as a strategic revenue channel without overbuilding internal structure.</p>`,

        situation6: `<p><strong>6️⃣ We Have Revenue — But Growth Has Plateaued</strong><br>
If international sales exist but growth is flat or plateaued, the issue is often local execution. Pricing may be misaligned. Key accounts are underdeveloped. Opportunities are not actively pursued.<br><br>
Scaling requires renewed commercial energy in-market. Boost Business deploys senior local professionals who re-open pipelines, strengthen relationships and actively drive new business. Instead of adding complexity, we reinforce the commercial engine where it matters most.</p>`,

        situation7: `<p><strong>7️⃣ We Invested Heavily — Now Expansion Must Deliver ROI</strong><br>
After investing heavily in product development, expansion cannot become another cost center. Every new market must contribute to revenue recovery.<br><br>
The challenge is accelerating ROI without increasing fixed overhead too quickly. Boost Business operates with flexible commercial deployment. You gain senior local expertise, immediate market access and measurable traction — without building full internal structures prematurely. This allows controlled scaling with aligned incentives and financial discipline.</p>`,

        // The closer (Pushing for email)
        outro: `<p>Every region requires a unique tactical approach. To identify exactly which of our 240+ local experts fits your specific needs in these markets, enter your email below. Our Commercial Director will review your inputs and personally reach out to you for a personalised roadmap.</p>`
    },

    /**
     * Checks if any given keywords exist within a text string.
     */
    hasAnyKeyword(text, keywords) {
        const lowerText = text.toLowerCase();
        return keywords.some(kw => lowerText.includes(kw));
    },

    /**
     * Generates the advisory block using static Keyword matching.
     */
    generateAdvisory: function (currentStatus, goals, previousAttempts) {

        // Combine all user text to scan for intent broadly
        const combinedText = `${currentStatus} ${goals} ${previousAttempts}`.toLowerCase();

        let outputHTML = this.blocks.intro;

        // --- KEYWORD MATCHING ENGINE (7 SITUATIONS) --- //

        // 1. Entering a New Country / Don't know where to start
        const kwNewCountry = ["new country", "where to start", "germany", "explore", "don't know", "how to enter", "entry", "start from scratch"];

        // 2. Remote Management / Headquarters issues
        const kwRemote = ["remote", "headquarters", "distance", "emails", "from here", "internally", "our office"];

        // 3. Distributor Issues
        const kwDistributor = ["distributor", "partner", "agency", "underperforming", "reseller", "wholesale"];

        // 4. Hiring Risk / Too Expensive
        const kwHiringRisk = ["hire", "recruiting", "risky", "expensive", "payroll", "country manager", "full-time", "employ"];

        // 5. Marketplaces
        const kwMarketplace = ["amazon", "bol.com", "marketplace", "online", "e-commerce", "ecommerce", "webshop"];

        // 6. Plateaued Growth / Flat Revenue
        const kwPlateau = ["flat", "plateau", "revenue", "stagnate", "stuck", "no growth", "slow", "plateaued", "not growing"];

        // 7. ROI / Heavy Investment
        const kwROI = ["roi", "invest", "heavy", "cost", "return", "scale fast", "budget", "burn"];

        // Determine which specific strategic block to serve based on priority
        // Prioritize specific pain points (Plateau, ROI, Marketplaces, Distributors) before general ones

        if (this.hasAnyKeyword(combinedText, kwPlateau)) {
            outputHTML += this.blocks.situation6;
        } else if (this.hasAnyKeyword(combinedText, kwDistributor)) {
            outputHTML += this.blocks.situation3;
        } else if (this.hasAnyKeyword(combinedText, kwMarketplace)) {
            outputHTML += this.blocks.situation5;
        } else if (this.hasAnyKeyword(combinedText, kwHiringRisk)) {
            outputHTML += this.blocks.situation4;
        } else if (this.hasAnyKeyword(combinedText, kwRemote)) {
            outputHTML += this.blocks.situation2;
        } else if (this.hasAnyKeyword(combinedText, kwROI)) {
            outputHTML += this.blocks.situation7;
        } else if (this.hasAnyKeyword(combinedText, kwNewCountry)) {
            outputHTML += this.blocks.situation1;
        } else {
            // Default Fallback if no strong keywords are detected - provide Situation 1 (New Entry)
            outputHTML += this.blocks.situation1;
        }

        // Always append the closing call to action
        outputHTML += this.blocks.outro;

        // Return immediately (Simulating async behavior of the previous fetch for seamless UI)
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(outputHTML);
            }, 600); // Slight delay for the typing indicator aesthetic
        });
    }
};

window.AdvisoryEngine = AdvisoryEngine;

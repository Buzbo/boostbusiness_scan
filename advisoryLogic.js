/**
 * advisoryLogic.js
 * 
 * Rule-based engine for generating customized advisory output 
 * based on keyword detection in user inputs. No LLM calls.
 */

const AdvisoryEngine = {
    // Stage keywords and mapping
    stages: {
        idea: ["idea", "concept", "thinking", "starting", "scratch"],
        early: ["early", "traction", "some sales", "just launched", "beginning", "validating"],
        revenue: ["revenue", "generating", "selling", "growing", "steady"],
        scaling: ["scale", "scaling", "fast", "growth", "expanding rapidly", "high volume"],
        stuck: ["stuck", "plateau", "established", "flat", "stagnating", "hard time"]
    },

    // Goal keywords and mapping
    goals: {
        country: ["new country", "enter", "market entry", "new market", "border"],
        marketplaces: ["marketplace", "amazon", "bol", "zalando", "platforms"],
        distribution: ["distribution", "distributor", "retail", "b2b", "wholesale", "partners"],
        full_expansion: ["full", "everything", "all out", "dominate", "aggressive", "overall strategy"]
    },

    // Service Needs mapping
    services: {
        retention: ["dedicated", "manager", "account", "country", "ongoing", "sales agent"],
        project: ["one-time", "strategy", "analysis", "blueprint", "research"],
        recruitment: ["finding", "talent", "hire", "recruiting", "payroll", "local employee"]
    },

    /**
     * Determines the category of an input string based on predefined keyword mapping.
     */
    detectCategory(input, mappingObj) {
        const lowerInputStr = input.toLowerCase();
        for (const [category, keywords] of Object.entries(mappingObj)) {
            if (keywords.some(kw => lowerInputStr.includes(kw))) {
                return category;
            }
        }
        return "other"; // fallback
    },

    /**
     * Generates the 6-10 sentence advisory block based on detected parameters.
     */
    generateAdvisory(goalInput, stageInput, serviceInput, targetMarkets) {
        const goalCategory = this.detectCategory(goalInput, this.goals);
        const stageCategory = this.detectCategory(stageInput, this.stages);
        const serviceCategory = this.detectCategory(serviceInput, this.services);
        const markets = targetMarkets.trim() || "your target markets";

        let output = "";

        // Complex conditional matrix building the strategic advisory response

        // 1. Retention / Dedicated Manager focused
        if (serviceCategory === "retention") {
            if (stageCategory === "early" || stageCategory === "idea") {
                output = `Entering ${markets} at an early stage requires a lean, validation-first approach. Setting up a full local entity prematurely is a costly mistake. Instead, you need immediate 'feet on the ground' to validate commercial viability. We match you with a dedicated Country Manager from our exclusive portfolio of over 240+ commercial experts. They become an extension of your brand for 10 to 12 hours a week, instantly providing the local network, language skills, and cultural nuance you lack. We operate strictly on a retention plus success-fee model, ensuring our agents are fiercely incentivized to generate rapid local traction for you without the heavy overhead.`;
            } else {
                output = `Since you are already established and generating revenue, conquering ${markets} demands aggressive, localized penetration. Attempting cross-border sales from your current headquarters often bottlenecks growth. You need a dedicated, native B2B Account Manager. Our philosophy is 'no silos in business': our local professionals integrate directly into your CRM (like Hubspot) and operate as your localized commercial department. By tapping into our network of 240+ elite professionals in markets like the UK, DE, and ES, we can deploy a dedicated sales force in weeks. This allows you to scale rapidly without navigating complex foreign labor laws or entity setups.`;
            }
        }

        // 2. Project / Strategy focused
        else if (serviceCategory === "project") {
            output = `A successful push into ${markets} cannot rely on guesswork. Whether it is dominating Amazon EU, establishing B2B distribution, or building a direct sales engine, you first require a solid foundation. We deploy our senior commercial directors to execute a highly targeted Go-to-Market Analysis for your specific industry. We map the entire landscape: identifying the right Tier-1 partners, dissecting competitor models, and producing a concrete execution blueprint. Because we are operators, not just consultants, our strategy is built for immediate local execution. Once the roadmap is proven, we can easily transition to plugging our local experts into the field to drive the revenue.`;
        }

        // 3. Recruitment focused
        else if (serviceCategory === "recruitment") {
            output = `Hiring permanent local sales talent in ${markets} is high-risk. The cost of a bad commercial hire in a foreign territory involves both capital loss and immense opportunity cost. Traditional recruitment agencies fail to understand the nuanced 'hunter' mentality required to open a new region. We bypass those agencies entirely. We leverage our proprietary database of 240+ proven international commercial experts to find the perfect match for your product category and culture. We handle the rigorous screening, ensuring your new hire already possesses the required local network to open doors from day one. They join your payroll directly, entirely de-risking your localization hire.`;
        }

        // 4. Fallback / Full Expansion Catch-all
        else {
            if (stageCategory === "stuck") {
                output = `It is common to hit a growth plateau in ${markets} when initial organic momentum slows down. We suspect the bottleneck lies in either unoptimized local distribution, linguistic barriers, or simply a lack of direct local presence. Our core belief is that 78% of B2B buyers prefer purchasing from local representatives. We bypass your plateau by injecting immediate local momentum. From our network of 240+ commercial professionals, we deploy interim sales directors to diagnose your bottlenecks and execute rapid turnaround campaigns, restoring aggressive scaling to your foreign operations.`;
            } else {
                output = `A full, aggressive international expansion into ${markets} requires a meticulously synchronized commercial rollout. Success demands deep local networks and native understanding, which takes years to build organically. By partnering with Boost Business, you instantly gain an elite decentralized team. Whether you need a part-time Country Manager to validate early traction, or a strategic market-entry project, we provide the 'feet on the ground'. Our proven model offers maximum flexibility and localized execution without the burden of setting up foreign infrastructure.`;
            }
        }

        // Add the generic CTA ending
        output += `\n\n<br><strong>We have compiled a more detailed analysis and roadmap based on your inputs. Start your local journey with a dedicated booster by entering your email below.</strong>`;

        return output;
    }
};

// Make it available globally
window.AdvisoryEngine = AdvisoryEngine;

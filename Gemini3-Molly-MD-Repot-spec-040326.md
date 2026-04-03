Technical Specification: Artistic MDRI Flow System (v2.1.0)
Date: April 3, 2026
Status: Final Specification
Target Audience: System Architects, Regulatory Affairs Officers, AI Engineers, Product Designers
1. Executive Summary
The Artistic MDRI Flow System is a production-grade, agentic AI application designed to bridge the gap between complex medical device regulations and actionable intelligence. Built on a foundation of "Artistic Agentic Flow," the system prioritizes both aesthetic excellence and functional rigor. It provides a multi-agent orchestration environment where users can transform raw regulatory text into comprehensive, template-aligned reports and reusable AI skills.
The system features a "WOW" UI system with 10 dynamic Pantone-based style packs, full bilingual support (English and Traditional Chinese), and a real-time telemetry dashboard. At its core, the Medical Device Regulation Intelligence (MDRI) module executes a three-step agent chain—Web Research, Report Generation, and Skill Creation—ensuring that regulatory insights are grounded in the latest web-searched evidence and formatted for immediate professional use.
2. Goals, Non-Goals, and Product Principles
2.1 Goals
Regulatory Acceleration: Reduce the time required to summarize and report on new FDA/international guidances from days to minutes.
Aesthetic Distinction: Move beyond generic "AI dashboard" aesthetics using a curated design system that reinforces professional focus.
Human-in-the-Loop (HITL): Ensure every AI-generated artifact is editable and requires human approval before progressing to the next stage of the pipeline.
Bilingual Versatility: Support global regulatory teams with seamless switching between English and Traditional Chinese UI and outputs.
Knowledge Persistence: Transform one-off regulatory tasks into reusable "Skills" that encode the logic of the successful workflow.
2.2 Non-Goals
Legal Advice: The system does not provide legal or final compliance decisions; it generates drafts for professional review.
Automated Submission: The system does not automatically submit documents to regulatory bodies like the FDA.
Real-time Monitoring: While it performs web research, it is not a 24/7 "crawler" for new regulations; it acts on user-provided triggers.
2.3 Product Principles
Provenance First: Every claim must be traceable back to the input text or a cited web source.
Editability by Default: No AI output is final. The UI must provide robust editing tools at every step.
Architectural Honesty: Telemetry should reflect real system health, token usage, and latency without simulation.
3. Information Architecture (Modules)
The application is organized into a persistent left-navigation sidebar with four primary modules:
3.1 WOW Control Center (Dashboard)
The entry point for the system. It provides a high-level overview of system health and activity.
Telemetry Chips: Real-time indicators for Active Jobs, Token Usage, Avg Latency, and Provider Health.
Activity Chart: A visual histogram of system requests over a 24-hour cycle.
Live Log Terminal: A scrolling, color-coded log of all system events (Info, Warn, Error, Success).
3.2 Medical Device Regulation Intelligence (MDRI)
The primary functional module for processing regulatory data.
Input Panel: Text areas for raw regulation text and report templates.
Agent Chain Progress: A visual stepper showing the status of the 3-step pipeline.
Artifact Viewer: A rich Markdown previewer for the generated summary, report, and skill.md.
3.3 Agent Studio (Advanced Orchestration)
A dedicated space for fine-tuning agent prompts and selecting specific models.
Prompt Editor: Allows users to override the default system instructions for each agent.
Model Selector: Provides a dropdown to switch between Gemini 3 Flash, Pro, and other available models.
Handoff Logic: Controls how data is passed between agents (e.g., "Pass raw output" vs "Pass edited version").
3.4 Settings & Customization
The configuration hub for the system's "WOW" features.
Theme Toggle: Light and Dark mode switching.
Language Selector: English and Traditional Chinese (繁體中文).
Style Palette: Selection of 10 Pantone-based color styles.
Jackslot: A randomized style selector for quick aesthetic refreshes.
4. WOW UI & Design System
The "Artistic" component of the system is driven by a sophisticated design token system implemented via Tailwind CSS v4 and React state.
4.1 Pantone Style Packs
The system includes 10 predefined styles, each mapped to a specific Pantone Color of the Year or a significant palette:
Classic Blue (19-4052): Deep, stable, and professional.
Viva Magenta (18-1750): Bold, energetic, and forward-thinking.
Illuminating (13-0647): Bright, optimistic, and high-visibility.
Very Peri (17-3938): Creative, futuristic, and calm.
Living Coral (16-1546): Warm, approachable, and vibrant.
Ultra Violet (18-3838): Mystical, complex, and visionary.
Greenery (15-0343): Fresh, growth-oriented, and organic.
Rose Quartz (13-1520): Soft, balanced, and empathetic.
Marsala (18-1438): Grounded, sophisticated, and robust.
Radiant Orchid (18-3224): Expressive, exotic, and confident.
Each style defines a set of CSS variables for:
primary: Main brand color (buttons, active states).
secondary: Accent backgrounds.
accent: Micro-interactions.
background: Page-level background.
text: Primary typography color.
card: Component-level background.
border: Structural separation.
4.2 The Jackslot Mechanism
The "Jackslot" is a unique UI feature that gamifies the design experience. When triggered, it selects a random style from the PANTONE_STYLES array. This is not just a randomizer; it serves as a "design reset" that can help users find a visual environment that best suits their current cognitive load or the specific jurisdiction they are researching (e.g., using "Classic Blue" for formal FDA reports and "Greenery" for environmental health regulations).
4.3 Bilingual Implementation
The system uses a TRANSLATIONS constant to manage all UI strings. The Language state (en | zh) reactively updates every label, placeholder, and tooltip in the application without requiring a page reload. This ensures that global teams can collaborate on the same instance while maintaining their preferred linguistic context.
5. Agentic Workflow: The MDRI Pipeline
The core value proposition of the system is its 3-step agentic chain, designed to handle the "Medical Device Regulation Intelligence" workflow.
5.1 Agent 1: Web Research & Summary
Objective: Transform a short news snippet or raw regulation text into a 2000-3000 word comprehensive summary.
AI Tooling: Utilizes the googleSearch tool within the Gemini API to ground the response in current web data.
Output Structure:
Executive Summary.
Regulatory Landscape (Global context).
Key Requirements (Extracted from input + web).
Evidence Map (A Markdown table linking claims to sources).
Sources Consulted (A list of URLs and titles).
5.2 Agent 2: Comprehensive Regulation Report
Objective: Align the research from Step 1 with a specific professional template (e.g., the FDA Cybersecurity Guidance template).
Word Count Target: 3000-4000 words.
Logic: This agent acts as a "Regulatory Writer." It takes the summary, the original input, and the template as context. It ensures that the final output follows the specific headings and sub-headings required by the chosen jurisdiction.
Key Feature: It preserves the "Small Conclusion" (小結) and "References" (參考資料) sections from the provided FDA template, enriching them with the new research findings.
5.3 Agent 3: Skill.md Generation
Objective: Meta-cognition. The system analyzes the successful workflow and generates a skill.md file.
Content:
Frontmatter: Name and description of the skill.
Triggers: When to use this specific logic again.
Methodology: Step-by-step instructions for a future agent to replicate the result.
Quality Checklist: How to verify the output of this skill.
Value: This allows the system to "learn" from its own successful report generations, creating a library of reusable regulatory skills.
6. Data Management & Artifacts
The system treats every AI output as a versioned "Artifact."
6.1 Artifact Schema
Every artifact is stored with the following metadata:
id: Unique identifier.
title: Human-readable name.
content: The raw Markdown or text.
type: input | summary | report | skill.
timestamp: When it was generated.
model: The specific model used (e.g., gemini-3-flash-preview).
version: Incremental version number for edits.
6.2 The Handoff Logic
The system uses a "Gated Handoff" pattern. After Agent 1 finishes, the user can edit the summary in the Artifact Viewer. Once satisfied, the user clicks "Approve & Next." This "Approved Summary" is then passed to Agent 2. This prevents "hallucination propagation," where an error in the first step is magnified in the second.
7. Telemetry & Live Logging
To maintain professional trust, the system provides transparent operational data.
7.1 Telemetry Metrics
Active Jobs: Number of agents currently processing.
Token Usage: Cumulative tokens consumed in the current session (estimated).
Latency: Average response time from the Gemini API.
Provider Health: Status of the connection to Google AI Studio.
7.2 Live Log System
The log system captures four levels of events:
INFO: System state changes (e.g., "Tab switched to MDRI").
SUCCESS: Successful completion of an agent step.
WARN: Non-critical issues (e.g., "Input text is shorter than recommended").
ERROR: API failures or validation errors.
Logs are displayed in a monospace font terminal at the bottom of the dashboard, providing a "developer-grade" view of the application's inner workings.
8. Technical Stack & Implementation Details
8.1 Frontend Framework
React 19: Utilizing the latest concurrent rendering features and hooks.
Vite: For lightning-fast development and optimized production builds.
TypeScript: Ensuring type safety across the complex artifact and style schemas.
8.2 Styling & Animation
Tailwind CSS v4: Using the new @theme block for dynamic Pantone style injection.
Motion (formerly Framer Motion): Powering the "WOW" transitions, tab switching, and the Jackslot animation.
Lucide React: A consistent, high-quality icon set for all UI elements.
8.3 AI Integration
@google/genai SDK: Direct integration with Gemini models.
Search Grounding: Leveraging the googleSearch tool for real-time regulatory research.
React Markdown: For high-fidelity rendering of the generated reports, including tables and citations.
9. Security & Compliance
9.1 API Key Handling
The system follows a "Security First" approach to API keys:
Environment Injection: Keys are primarily read from process.env.GEMINI_API_KEY.
No UI Exposure: Keys are never displayed in the UI, logs, or exported artifacts.
Redaction: Any error messages containing sensitive strings are automatically redacted before being logged to the terminal.
9.2 Regulatory Baseline
The system is pre-configured with the FDA Medical Device Cybersecurity Guidance (2022) as its default template. This ensures that even without user input, the system is "aware" of the two major pillars:
Secure Product Development Framework (SPDF).
Cybersecurity Transparency.
10. Future Roadmap
10.1 Multi-Jurisdiction Expansion
Adding dedicated templates and research allowlists for:
EU MDR/IVDR: European Union Medical Device Regulations.
TFDA: Taiwan Food and Drug Administration.
PMDA: Japan's Pharmaceuticals and Medical Devices Agency.
10.2 Document OCR Integration
Implementing client-side or server-side OCR to allow users to upload scanned PDF guidances and transform them into Markdown inputs for the MDRI pipeline.
10.3 Collaborative Review
Adding a "Reviewer Mode" where multiple users can leave comments on artifacts before they are approved for the next step in the agent chain.
11. Conclusion
The Artistic MDRI Flow System represents a new paradigm in regulatory intelligence. By combining high-end design with rigorous agentic workflows, it empowers regulatory professionals to stay ahead of the rapidly evolving digital health landscape. The system's ability to not only generate reports but also "learn" new skills makes it a self-evolving asset for any medical device manufacturer.
12. 20 Comprehensive Follow-up Questions
Style Customization: How can I add my own custom Pantone colors to the style palette?
Model Selection: Which Gemini model is best for the "Web Research" step versus the "Report Writing" step?
Search Grounding: How does the system handle conflicting information found on the web during the research phase?
Bilingual Logic: If I provide a Traditional Chinese input but select English output, how does the system handle technical terminology translation?
Artifact Versioning: Can I revert to a previous version of a summary after I have already approved it?
Template Flexibility: How do I define "Required Sections" in a custom template to ensure the agent doesn't skip them?
Token Management: Is there a way to limit the word count of the summary to save on token usage?
Jackslot Logic: Can the Jackslot be configured to only cycle through "Dark Mode" compatible styles?
Evidence Mapping: How does the system verify the credibility of the sources listed in the Evidence Map?
Skill.md Usage: How do I actually "run" a generated skill.md file in a future session?
Telemetry Accuracy: How are the "Token Usage" estimates calculated, and how accurate are they?
Data Privacy: Is any of the pasted regulation text stored on a server, or is it all handled in the session?
FDA Guidance Updates: How often should I update the default FDA template as new guidances are released?
Error Recovery: What happens if the Gemini API times out during the 4000-word report generation?
Markdown Rendering: Does the system support rendering complex diagrams (like Mermaid.js) within the reports?
Export Options: Can I export the entire "MDRI Bundle" (Summary, Report, Skill, Logs) as a single ZIP file?
Jurisdiction Detection: Can the system automatically detect the jurisdiction (e.g., US vs EU) based on the input text?
Prompt Engineering: How can I modify the "Agent Studio" prompts to include specific company-level compliance rules?
Latency Optimization: Are there plans to implement "streaming" for the long report generation to improve the user experience?
System Scaling: How many concurrent "Agent Chains" can the system handle before performance degrades?

/**
 * Blog posts data
 * Add new posts here to publish them on the blog
 */

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string // ISO date string
  readTime: string // e.g., "5 min read"
  tags: string[]
  content: string // Markdown or HTML content
  published: boolean // Set to false to hide from blog index
}

export const blogPosts: BlogPost[] = [
  {
    slug: "workflow-mapping-before-you-automate",
    title: "Map the Work Before You Automate It",
    description:
      "Most automation projects fail because they automate the wrong thing. Here's how to map your workflows first so you invest in the changes that actually move margin.",
    date: "2026-02-20T00:00:00Z",
    readTime: "6 min read",
    tags: ["Workflow Mapping", "Automation", "Operations"],
    content: `<h2>The Expensive Mistake</h2>
    <p>Imagine a staffing firm that spends $40K on a CRM integration to automate proposal generation. Sounds reasonable—proposals take time. But the real bottleneck was never proposals. It was the 11-step intake process that happened <em>before</em> a proposal was ever written. They automated the fast part and left the slow part untouched.</p>
    <p>This pattern plays out constantly in service businesses. Someone buys software, hires a consultant, or builds an internal tool to solve a problem they haven't actually diagnosed. The instinct is understandable—something feels slow, so you try to speed it up. But "feels slow" and "is the bottleneck" are two different things.</p>

    <hr>

    <h2>What Workflow Mapping Actually Is</h2>
    <p>Workflow mapping is documenting what actually happens in your business—not what's supposed to happen, not what's in the SOP binder from 2019. What people actually do, step by step, when a client engagement moves from first contact to final invoice.</p>
    <p>It sounds simple. It's not. Most operators are too close to their own process to see it clearly. They skip steps because they're "obvious." They forget the workarounds their team invented because the real process broke two years ago.</p>
    <p>A proper workflow map captures:</p>
    <ul>
      <li><strong>Every handoff</strong> — who passes work to whom, and how</li>
      <li><strong>Every decision point</strong> — where does someone have to make a judgment call vs. follow a rule</li>
      <li><strong>Every wait state</strong> — where does work sit idle waiting for approval, input, or a response</li>
      <li><strong>Every tool switch</strong> — how many times does someone copy-paste between systems</li>
    </ul>
    <p>That last one is usually where the real cost lives.</p>

    <h2>Where the Money Actually Leaks</h2>
    <p>When we map workflows for clients, we consistently find that the biggest margin drains aren't in the obvious places. They're in:</p>
    <ul>
      <li><strong>Re-entry:</strong> The same data gets typed into 3 different systems by 3 different people</li>
      <li><strong>Approval bottlenecks:</strong> Work stalls for 48 hours waiting for one person to click "approve" on something that doesn't need their review</li>
      <li><strong>Exception handling:</strong> 20% of jobs don't fit the standard process, and each one requires 3x the labor to manage</li>
      <li><strong>Status chasing:</strong> Project managers spend 5+ hours/week asking "where is this?" because there's no single source of truth</li>
    </ul>
    <p>None of these show up on a P&L. They live inside labor costs, buried in the salaries of people who spend half their day on work that shouldn't exist.</p>

    <h2>How to Map Your Core Workflow</h2>
    <p>You don't need fancy software for this. A whiteboard, a spreadsheet, or even a legal pad works. Here's the process:</p>

    <h3>1. Pick one revenue-generating workflow</h3>
    <p>Don't try to map everything. Pick the workflow that touches the most revenue. For most service businesses, that's the client delivery pipeline—from signed contract to final deliverable.</p>

    <h3>2. Walk it with the people who do the work</h3>
    <p>Sit with each person who touches the process. Not their manager. Not the person who designed the process. The person who actually does it every day. Ask them: "Show me exactly what you do when a new project comes in."</p>

    <h3>3. Document the gaps</h3>
    <p>You'll hear things like:</p>
    <ul>
      <li>"Well, technically I'm supposed to use the form, but it doesn't have a field for X, so I email Sarah instead"</li>
      <li>"I check three different places to see if the client has paid"</li>
      <li>"I don't know who's responsible for this step, so I just do it myself to make sure it happens"</li>
    </ul>
    <p>These gaps are your gold. Each one is a specific, fixable problem with a real cost attached.</p>

    <h3>4. Estimate the cost of each gap</h3>
    <p>For every workaround, ask: How many times per week does this happen? How long does it take? Multiply by the loaded hourly cost of the person doing it. You'll be surprised how fast $5K/month in waste adds up from "small" inefficiencies.</p>

    <h2>Then—and Only Then—Automate</h2>
    <p>Once you have a clear map with costs attached, the automation priorities become obvious. You're not guessing anymore. You're investing in the changes with the highest ROI, in order.</p>
    <p>Sometimes the fix isn't even technology. Sometimes it's removing an unnecessary approval step, combining two roles, or standardizing an exception that shouldn't be an exception.</p>
    <p>The map tells you what to do. Without it, you're buying solutions for problems you haven't verified exist.</p>

    <hr>

    <p><strong>CappaWork's Diagnostic Phase starts with workflow mapping.</strong> We document what's actually happening in your business before we recommend any changes. Because the most expensive automation is the one that automates the wrong thing.</p>`,
    published: true,
  },
  {
    slug: "four-levers-of-profitability",
    title: "The Four Levers Every Service Business Should Measure",
    description:
      "Revenue is a vanity metric. Profit comes from four specific levers: customers, average order value, frequency, and margin. Here's how to actually move them.",
    date: "2026-02-27T00:00:00Z",
    readTime: "7 min read",
    tags: ["Profitability", "Unit Economics", "Growth"],
    content: `<h2>Revenue Is a Vanity Metric</h2>
    <p>A $5M service business with 8% net margin takes home $400K. A $3M business with 20% margin takes home $600K. The second business is smaller, more profitable, and almost certainly less stressful to run.</p>
    <p>But most operators obsess over the top line. They chase revenue growth without understanding <em>which</em> kind of growth actually makes them money.</p>
    <p>Profit isn't a single number you can push. It's the output of four levers, and understanding which one to pull—and when—is the difference between scaling profitably and scaling into a wall.</p>

    <hr>

    <h2>The Four Levers</h2>
    <p>Every service business's profit equation breaks down the same way:</p>
    <p><strong>Profit = Customers × Average Order Value × Frequency × Margin</strong></p>
    <p>That's it. Every strategic decision you make—hiring, pricing, automation, marketing—affects one or more of these four levers. Let's break each one down.</p>

    <h3>Lever 1: Customers</h3>
    <p>How many active clients do you have? This is the lever most people default to. "We need more clients" is the most common growth strategy, and it's usually the most expensive.</p>
    <p><strong>What most operators miss:</strong> Acquiring a new customer costs 5–7x more than retaining an existing one. Before you spend on marketing, ask: What's my retention rate? If clients churn after one engagement, you're filling a leaky bucket.</p>
    <p><strong>What to measure:</strong></p>
    <ul>
      <li>Customer acquisition cost (CAC) — fully loaded, including sales team time</li>
      <li>Customer lifetime value (LTV) — total revenue per client over the relationship</li>
      <li>LTV:CAC ratio — should be at least 3:1 to be sustainable</li>
    </ul>

    <h3>Lever 2: Average Order Value (AOV)</h3>
    <p>What's the average revenue per engagement? This is often the easiest lever to move and the one most service businesses ignore.</p>
    <p><strong>What most operators miss:</strong> You're probably underpricing. If you haven't raised prices in 18 months, you've effectively given yourself a pay cut (inflation). And if fewer than 20% of prospects push back on price, you're too cheap.</p>
    <p><strong>Ways to move it:</strong></p>
    <ul>
      <li>Bundle services instead of selling à la carte</li>
      <li>Add a premium tier with faster delivery or additional support</li>
      <li>Price on value delivered, not hours worked</li>
      <li>Standardize your scope—custom scoping for every client compresses AOV</li>
    </ul>

    <h3>Lever 3: Frequency</h3>
    <p>How often does a client buy from you? For project-based businesses, this is the difference between a one-time $30K engagement and a $120K/year relationship.</p>
    <p><strong>What most operators miss:</strong> You already have the trust. The client already knows you deliver. Selling a second engagement to an existing client is 10x easier than closing a new one. But most service businesses don't have a systematic way to identify when a client is ready for more.</p>
    <p><strong>Ways to move it:</strong></p>
    <ul>
      <li>Build a natural Phase 2 into every engagement (diagnostic → implementation)</li>
      <li>Create recurring revenue through retainers, maintenance, or advisory packages</li>
      <li>Implement a 90-day check-in process after project completion</li>
      <li>Track which clients have unresolved problems you can solve</li>
    </ul>

    <h3>Lever 4: Margin</h3>
    <p>What percentage of each dollar actually becomes profit? This is where most service businesses leave the most money on the table, and it's the lever that benefits most from operational improvement.</p>
    <p><strong>What most operators miss:</strong> Labor is your biggest cost, and most of it is invisible. When a $75/hour employee spends 2 hours/day on tasks that could be automated, that's $39K/year in wasted labor. Multiply by 10 employees and you're looking at $390K in margin you're leaving on the table.</p>
    <p><strong>Ways to move it:</strong></p>
    <ul>
      <li>Automate repetitive internal workflows (data entry, status updates, reporting)</li>
      <li>Standardize delivery so you're not reinventing the process for every client</li>
      <li>Eliminate tool sprawl—every redundant subscription is a margin leak</li>
      <li>Measure utilization—what percentage of billable time is actually billable?</li>
    </ul>

    <h2>Which Lever to Pull First</h2>
    <p>Here's the framework:</p>
    <ul>
      <li><strong>If your margins are below 15%:</strong> Fix margin first. No amount of growth will save a business that loses money on every engagement.</li>
      <li><strong>If your margins are healthy but clients buy once and leave:</strong> Fix frequency. You're doing expensive work to acquire clients and then letting them walk away.</li>
      <li><strong>If retention is strong but deal sizes are flat:</strong> Increase AOV. You've earned the right to charge more.</li>
      <li><strong>If all three are solid:</strong> Now invest in acquiring more customers. You've earned the right to scale.</li>
    </ul>
    <p>Most businesses pull the levers in the wrong order. They throw money at marketing (customers) when they should be fixing delivery costs (margin) or adding a Phase 2 offering (frequency).</p>

    <h2>What This Looks Like in Practice</h2>
    <p>One of our clients—a consulting firm doing $4M—came to us wanting more leads. When we ran the numbers:</p>
    <ul>
      <li>Their margin on the average engagement was 12% (they thought it was 25%)</li>
      <li>Only 15% of clients came back for a second engagement</li>
      <li>Their AOV hadn't changed in two years</li>
    </ul>
    <p>Getting more leads would have scaled a broken model. Instead, they focused on margin (automated 30% of their internal reporting) and frequency (added a quarterly advisory retainer). Result: revenue grew 10%, but profit grew 45%.</p>
    <p>That's the power of pulling the right lever.</p>

    <hr>

    <p><strong>CappaWork's Diagnostic starts by measuring all four levers in your business.</strong> We don't guess which one matters most—we calculate it. Because sustainable growth starts with knowing your numbers, not just growing your top line.</p>`,
    published: true,
  },
]

/**
 * Get all published blog posts, sorted by date (newest first)
 */
export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug && post.published)
}

/**
 * Get all post slugs (for static generation)
 */
export function getAllPostSlugs(): string[] {
  return blogPosts.filter((post) => post.published).map((post) => post.slug)
}

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
    slug: "your-first-app-in-an-afternoon",
    title: "Your First App in an Afternoon: A Claude Code Guide for Non-Developers",
    description:
      "For project managers and designers who want to build, not just spec. Learn how to build a real, working web application using Claude Code—no coding experience required.",
    date: "2026-01-07T00:00:00Z",
    readTime: "15 min read",
    tags: ["Claude Code", "Tutorial", "No-Code", "Product Management"],
    content: `<h2>Let's Talk About That Fear</h2>
    <p>You've been managing software projects for years. You've written PRDs, designed wireframes, worked with developers. You <em>understand</em> how apps work. But when it comes to actually building one yourself, there's that voice:</p>
    <p><em>"I'm not technical enough."</em><br>
    <em>"I don't know how to code."</em><br>
    <em>"The terminal is scary."</em></p>
    <p>Here's the truth: <strong>You're about to build a real, working web application this afternoon.</strong> Not a tutorial. Not a toy. A real app you could show to users, deploy to the internet, and actually use.</p>
    <p>And you won't write most of the code yourself.</p>
    
    <hr>
    
    <h2>What Is Claude Code? (In Human Terms)</h2>
    <p>Remember when you had to write every email yourself? Then autocomplete showed up. Then ChatGPT started writing whole emails for you.</p>
    <p><strong>Claude Code is that... but for building software.</strong></p>
    <p>Instead of typing code character by character, you tell Claude what you want in plain English:</p>
    <ul>
      <li>"Create a landing page with a pricing section"</li>
      <li>"Add user authentication"</li>
      <li>"Connect this to a database"</li>
    </ul>
    <p>Claude reads your request, writes the code, runs the commands, creates the files, and shows you the result. You review it like you'd review a designer's mockup. If something's not right, you ask for changes.</p>
    <p><strong>You're still in control.</strong> You're just not doing the typing.</p>
    
    <h2>The Terminal: Less Scary Than You Think</h2>
    <p>The "terminal" (that black screen with text) is just a way to talk to your computer using words instead of clicking buttons.</p>
    <p>Think of it like this:</p>
    <ul>
      <li><strong>Finder/Explorer</strong> = Visual way to manage files (you click folders)</li>
      <li><strong>Terminal</strong> = Text way to manage files (you type folder names)</li>
    </ul>
    <p>They do the same things. Terminal is just faster once you know a few commands.</p>
    <p><strong>You only need to know 3 commands for this tutorial:</strong></p>
    <ol>
      <li><code>mkdir foldername</code> - Make a new folder</li>
      <li><code>cd foldername</code> - Go into that folder</li>
      <li><code>claude</code> - Start Claude Code</li>
    </ol>
    <p>That's it. You can do this.</p>
    
    <h2>What You'll Build Today</h2>
    <p>We're building <strong>TaskFlow</strong> - a simple task management app. By the end of this tutorial, you'll have:</p>
    <ul>
      <li>✅ A professional landing page</li>
      <li>✅ User sign-up and login</li>
      <li>✅ A dashboard where users can create and view tasks</li>
      <li>✅ A database storing everything</li>
      <li>✅ The app live on the internet</li>
    </ul>
    <p><strong>Time commitment:</strong> 2-3 hours if you're following along carefully. Maybe 4 hours if it's your absolute first time.</p>
    <p><strong>Cost:</strong> Free (we'll use free tiers of all services)</p>
    
    <h2>Before We Start: What You Need</h2>
    <h3>1. Install Claude Code</h3>
    <p>Open your terminal (on Mac: search "Terminal" in Spotlight, on Windows: search "Command Prompt").</p>
    <p>Type this and press Enter:</p>
    <pre><code>npm install -g @anthropic/claude-code</code></pre>
    <p><em>Wait for it to finish. You'll see text scrolling by. That's normal.</em></p>
    
    <h3>2. Get Your Free Accounts</h3>
    <p>Open these websites and create accounts (all have free tiers):</p>
    <ul>
      <li><a href="https://clerk.com" target="_blank" rel="noopener noreferrer">Clerk.com</a> - For user login/signup</li>
      <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase.com</a> - For database</li>
      <li><a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel.com</a> - For hosting your app</li>
      <li><a href="https://posthog.com" target="_blank" rel="noopener noreferrer">PostHog.com</a> - For analytics (optional)</li>
    </ul>
    <p>Don't set anything up yet. Just create the accounts. We'll come back to them.</p>
    
    <h2>Your First Project: Step by Step</h2>
    
    <h3>STEP 1: Create Your Project Folder</h3>
    <p>Think of this like creating a new folder for a client project. Everything about TaskFlow will live here.</p>
    <p><strong>In terminal, type:</strong></p>
    <pre><code>mkdir taskflow
cd taskflow</code></pre>
    <p><strong>What this does:</strong></p>
    <ul>
      <li><code>mkdir taskflow</code> = "Make a new folder called taskflow"</li>
      <li><code>cd taskflow</code> = "Go into that folder"</li>
    </ul>
    <p>You're now "inside" the taskflow folder in your terminal, even though you can't see it visually yet.</p>
    
    <h3>STEP 2: Wake Up Claude</h3>
    <p><strong>Type:</strong></p>
    <pre><code>claude</code></pre>
    <p><strong>Press Enter.</strong></p>
    <p>You'll see some startup text, then:</p>
    <pre><code>How can I help you today?
></code></pre>
    <p><strong>That <code>></code> symbol means Claude is listening.</strong> You can now talk to it in plain English.</p>
    
    <h3>STEP 3: Create the App Foundation</h3>
    <p><strong>Type this message to Claude:</strong></p>
    <pre><code>Create a new Next.js 14 project with TypeScript and Tailwind CSS. 
Use the App Router. 
Don't install any additional packages yet.</code></pre>
    <p><strong>Press Enter.</strong></p>
    <p><strong>What happens next:</strong><br>
    Claude will show you its plan, then start running commands. You'll see text flying by. It's:</p>
    <ul>
      <li>Downloading Next.js (the framework that powers your app)</li>
      <li>Installing TypeScript (makes your code more reliable)</li>
      <li>Setting up Tailwind (for styling)</li>
    </ul>
    <p><strong>This takes 2-3 minutes.</strong> Let it finish.</p>
    <p>When it's done, Claude will say something like:</p>
    <pre><code>✓ Created Next.js project
✓ Installed dependencies

Next steps:
- Run \`npm run dev\` to start the development server</code></pre>
    
    <h3>STEP 4: See Your App (The Magic Moment)</h3>
    <p><strong>Type to Claude:</strong></p>
    <pre><code>Start the development server</code></pre>
    <p>Claude will run <code>npm run dev</code> for you. You'll see:</p>
    <pre><code>Ready started server on 0.0.0.0:3000, url: http://localhost:3000</code></pre>
    <p><strong>Open your web browser</strong> and go to:</p>
    <pre><code>http://localhost:3000</code></pre>
    <p>🎉 <strong>You just built your first web app!</strong></p>
    <p>Yes, it's just the Next.js default page. But it's running on your computer. You made that happen.</p>
    
    <h3>STEP 5: Build the Landing Page</h3>
    <p><strong>Back in terminal (Claude Code is still running), type:</strong></p>
    <pre><code>Create a landing page for TaskFlow with:
- Hero section with headline "Manage Tasks. Ship Faster."  
- Three features: "Simple Interface", "Real-time Sync", "Team Collaboration"
- Pricing section with Free and Pro tiers ($0 and $10/month)
- Call-to-action button "Get Started"
- Use Tailwind CSS to make it look professional</code></pre>
    <p><strong>Press Enter.</strong></p>
    <p>Claude will:</p>
    <ol>
      <li>Show you what it's going to create</li>
      <li>Create/edit the necessary files</li>
      <li>Tell you when it's done</li>
    </ol>
    <p><strong>Go back to your browser</strong> and refresh <code>localhost:3000</code>.</p>
    <p><strong>Your landing page is there.</strong> Professional. Styled. Ready.</p>
    <p>You didn't write HTML. You didn't write CSS. You just described what you wanted.</p>
    
    <h3>STEP 6: Add User Authentication</h3>
    <p><strong>In Claude Code, type:</strong></p>
    <pre><code>I have a Clerk account. Help me add authentication:
1. Install Clerk
2. Create sign-up and sign-in pages  
3. Add a user profile button to the navigation
4. Protect the /dashboard page (only logged-in users can see it)

Stop after installing Clerk and tell me what environment variables I need.</code></pre>
    <p>Claude will install Clerk and then tell you:</p>
    <pre><code>I need these environment variables:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

Add these to a file called .env.local</code></pre>
    <p><strong>Here's what you do:</strong></p>
    <ol>
      <li><strong>Go to Clerk.com dashboard</strong></li>
      <li>Create a new application (call it "TaskFlow")</li>
      <li>You'll see your API keys on the screen</li>
      <li><strong>Copy both keys</strong></li>
      <li><strong>Back in Claude Code, type:</strong></li>
    </ol>
    <pre><code>Create a .env.local file with these keys:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[paste your key]
CLERK_SECRET_KEY=sk_test_[paste your key]</code></pre>
    <ol start="6">
      <li><strong>Then tell Claude:</strong></li>
    </ol>
    <pre><code>Now finish setting up Clerk authentication</code></pre>
    <p>Claude will create the sign-up page, sign-in page, middleware, and everything else.</p>
    <p><strong>Test it:</strong><br>
    Refresh your browser, click "Get Started", and you'll see a real sign-up form. <strong>Create an account with your email.</strong></p>
    <p>You just added enterprise-grade authentication to your app. In 5 minutes.</p>
    
    <h3>STEP 7: Add a Database</h3>
    <p><strong>In Claude Code:</strong></p>
    <pre><code>I have a Supabase project. Help me create a database for tasks.

Stop and show me the SQL I need to run in Supabase.</code></pre>
    <p>Claude will show you SQL that looks like:</p>
    <pre><code>CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);</code></pre>
    <p><strong>Don't panic at the SQL. Just:</strong></p>
    <ol>
      <li><strong>Go to Supabase.com dashboard</strong></li>
      <li>Create a new project (call it "taskflow")</li>
      <li>Go to <strong>SQL Editor</strong> (left sidebar)</li>
      <li><strong>Copy Claude's SQL</strong> and paste it</li>
      <li>Click <strong>Run</strong></li>
      <li><strong>Back in Supabase, go to Settings → API</strong></li>
      <li>Copy your <code>URL</code> and <code>anon public</code> key</li>
      <li><strong>Tell Claude:</strong></li>
    </ol>
    <pre><code>Add these Supabase keys to .env.local:
NEXT_PUBLIC_SUPABASE_URL=[your URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your key]</code></pre>
    <ol start="9">
      <li><strong>Then:</strong></li>
    </ol>
    <pre><code>Now create the dashboard page where users can:
- See their tasks in a list
- Add new tasks with a form
- Mark tasks as complete

Use server components and make it look good.</code></pre>
    <p>Claude builds the entire feature. <strong>Refresh your browser</strong>, go to <code>/dashboard</code>.</p>
    <p><strong>You have a working task manager.</strong> Create a task. Refresh the page. It's still there because it's in your database.</p>
    
    <h3>STEP 8: Deploy to the Internet</h3>
    <p><strong>In Claude Code:</strong></p>
    <pre><code>I want to deploy this to Vercel. Guide me through it.</code></pre>
    <p>Claude will tell you to:</p>
    <ol>
      <li>Install Vercel CLI: <code>npm install -g vercel</code></li>
      <li>Run <code>vercel</code> in your project</li>
      <li>Follow the prompts to link your Vercel account</li>
    </ol>
    <p><strong>Do that.</strong> It takes 2 minutes.</p>
    <p>When done, Vercel gives you a URL like:</p>
    <pre><code>https://taskflow-abc123.vercel.app</code></pre>
    <p><strong>Open that URL.</strong> Your app is live on the internet. Anyone can visit it.</p>
    <p>You just shipped a product.</p>
    
    <h2>What Just Happened?</h2>
    <p>Let's recap what you built in 2-3 hours:</p>
    <ul>
      <li>✅ Professional landing page with pricing</li>
      <li>✅ User authentication (sign-up, login, profile)</li>
      <li>✅ Database-backed task management</li>
      <li>✅ Deployed live to the internet</li>
    </ul>
    <p><strong>In traditional development:</strong> This is 2-3 weeks of work for a developer.</p>
    <p><strong>You did it in an afternoon.</strong></p>
    
    <h2>Understanding What Claude Code Did</h2>
    <p>You might be wondering: "Did I actually build this, or did Claude?"</p>
    <p><strong>Both.</strong> Here's the analogy:</p>
    <p>When you manage a project, you:</p>
    <ul>
      <li>Decide what to build (vision)</li>
      <li>Define requirements (specs)</li>
      <li>Make decisions when things are unclear (judgment)</li>
      <li>Verify the work is right (quality)</li>
    </ul>
    <p><strong>That's exactly what you did here.</strong> Claude was your development team. You were the PM who directed the work.</p>
    <p>The difference: Your "team" writes code in seconds instead of days.</p>
    
    <h2>Common Questions from First-Timers</h2>
    
    <h3>"I don't understand what the code does"</h3>
    <p><strong>That's okay.</strong> You don't need to understand every line. You need to understand:</p>
    <ul>
      <li>What the app <em>does</em> (behavior)</li>
      <li>How to tell Claude to change it (communication)</li>
      <li>How to test if it works (verification)</li>
    </ul>
    <p>You wouldn't rewrite your designer's Figma file. You review the design and give feedback. Same here.</p>
    
    <h3>"What if Claude makes a mistake?"</h3>
    <p>Tell it!</p>
    <p><strong>Example:</strong></p>
    <pre><code>The sign-up button isn't working. When I click it, nothing happens.
Debug this and fix it.</code></pre>
    <p>Claude will find the error and fix it.</p>
    
    <h3>"How do I learn more?"</h3>
    <p><strong>Build more projects.</strong></p>
    <p>Each project teaches you:</p>
    <ul>
      <li>Project 1 (TaskFlow): The basics - auth, database, deployment</li>
      <li>Project 2: Add payments, email notifications, real-time updates</li>
      <li>Project 3: Build something for a real user and get feedback</li>
    </ul>
    <p>You learn by doing, not by reading documentation.</p>
    
    <h3>"Can I actually use this for work?"</h3>
    <p><strong>Yes.</strong> People are shipping real SaaS products built entirely with Claude Code.</p>
    <p>Is it perfect? No. You'll hit issues. You'll need to learn some things. But it's 10x faster than learning to code from scratch.</p>
    
    <h2>Your Next Steps</h2>
    
    <h3>Option 1: Keep Building TaskFlow</h3>
    <p>Add more features:</p>
    <pre><code>Add a way to assign tasks to other team members
Add email notifications when tasks are assigned
Add a calendar view of tasks by due date</code></pre>
    
    <h3>Option 2: Build Something You Actually Need</h3>
    <p>Think of a workflow problem you have:</p>
    <ul>
      <li>Internal tool for your team</li>
      <li>Simple app for a side project idea</li>
      <li>Prototype for a client pitch</li>
    </ul>
    <p><strong>Tell Claude:</strong></p>
    <pre><code>I want to build an app that [describe your idea].
Help me plan out what we need to build first.</code></pre>
    <p>Claude will help you break it down.</p>
    
    <h3>Option 3: Learn the Stack Deeper</h3>
    <pre><code>Explain how Next.js server components work
Show me the file structure of this project
Teach me about database queries</code></pre>
    <p>Ask Claude to teach you as you build.</p>
    
    <h2>The Mindset Shift</h2>
    <p><strong>Before Claude Code:</strong><br>
    "I have an idea → I hire a developer → I wait weeks → I hope they understood my vision"</p>
    <p><strong>With Claude Code:</strong><br>
    "I have an idea → I describe it to Claude → I see it in minutes → I iterate until it's right"</p>
    <p>You're still not a developer. But <strong>you're now a builder.</strong></p>
    <p>That's the difference between thinking about products and shipping products.</p>
    
    <h2>One More Thing: This Is Just The Beginning</h2>
    <p>A year ago, tools like this didn't exist. Claude Code launched recently. It's getting better every month. The free tiers of Clerk, Supabase, and Vercel are getting more generous.</p>
    <p><strong>Right now is the best time to start building.</strong></p>
    <p>In 6 months, you could have:</p>
    <ul>
      <li>5 small projects under your belt</li>
      <li>A side product generating revenue</li>
      <li>The confidence to prototype any idea in days</li>
    </ul>
    <p>Or you could still be thinking about learning to code someday.</p>
    <p><strong>The terminal isn't scary. You just haven't met it yet.</strong></p>
    
    <h2>Start Right Now</h2>
    <p>Open your terminal. Type:</p>
    <pre><code>mkdir my-first-app
cd my-first-app
claude</code></pre>
    <p>Then type:</p>
    <pre><code>I want to build an app that helps [your idea]. 
Where should we start?</code></pre>
    <p><strong>Claude will guide you.</strong></p>
    <p>And when you get stuck? Come back to this guide. Read the relevant section. Keep building.</p>
    <p>You've got this.</p>
    
    <hr>
    
    <p><strong>Nate Pinches</strong><br>
    <em>Built ArborKeySoftware.com (40+ HOA customers) using Claude Code</em><br>
    <em>Still can't write a for-loop from memory</em></p>
    
    <hr>
    
    <p><em>Found this helpful? Share it with another PM or designer who's been curious about building.</em></p>`,
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

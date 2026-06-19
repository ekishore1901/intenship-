const initialNotes = [
  {
    id: "note-1",
    title: "Advanced Git Commands & Workflow Guide",
    description: "A comprehensive guide to git rebase, cherry-pick, reflog, bisect, and advanced branching strategies for teams.",
    category: "Computer Science",
    tags: ["git", "devops", "version-control", "workflow"],
    content: `# Advanced Git Workflow Guide

This document outlines professional Git techniques beyond simple commit, push, and pull commands.

## 1. Interactive Rebasing
Interactive rebasing allows you to modify commits in your branch history. It is perfect for cleaning up local work before merging.

\`\`\`bash
git rebase -i HEAD~4
\`\`\`

Common commands inside the editor:
- \`pick\`: Keep the commit
- \`squash\`: Combine the commit with the previous one, merging messages
- \`fixup\`: Like squash, but discard this commit's log message
- \`reword\`: Modify the commit message

## 2. Git Cherry-Pick
Apply changes introduced by some existing commits onto your current branch.

\`\`\`bash
git cherry-pick <commit-hash>
\`\`\`

## 3. The Power of Git Reflog
If you ever feel you "lost" a commit (e.g., after an incorrect hard reset), Git Reflog tracks every movement of HEAD.

\`\`\`bash
git reflog
# Find your commit hash in the reflog, then reset to it:
git reset --hard <commit-hash>
\`\`\`

## 4. Git Bisect (Debugging)
Find the exact commit that introduced a bug using binary search.

\`\`\`bash
git bisect start
git bisect bad                 # Current version is bad
git bisect good v1.0.0         # v1.0.0 was good
# Git will checkout mid-points. You test and type:
git bisect good   # or: git bisect bad
# Git tells you the culprit commit!
git bisect reset               # Clean up when done
\`\`\`

---
*Created by Senior Architect Alex Mercer. Shared for developer productivity.*`,
    author: {
      name: "Alex Mercer",
      username: "alexm_dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
      bio: "Software Architect | Git Guru | Open Source Advocate"
    },
    views: 1420,
    upvotes: 382,
    downvotes: 4,
    date: "2026-05-15T08:30:00.000Z",
    comments: [
      {
        id: "c1",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
        content: "This git bisect section saved my life today. I had a regression spanning 50 commits and found it in under 3 minutes!",
        date: "2026-05-16T10:15:00.000Z",
        likes: 12
      },
      {
        id: "c2",
        authorName: "Marcus Brody",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
        content: "Awesome cheatsheet. Do you have one for git submodules? They always trip me up.",
        date: "2026-05-17T14:22:00.000Z",
        likes: 5
      }
    ]
  },
  {
    id: "note-2",
    title: "System Design: Scaling Databases to 10M+ Users",
    description: "Detailed architectures for database replication, sharding, caching strategies, and CAP theorem trade-offs.",
    category: "Computer Science",
    tags: ["system-design", "databases", "scaling", "architecture"],
    content: `# Scaling Databases: Architecture & Blueprint

Scaling database layers is one of the most critical aspects of backend system design. Here is the roadmap for scaling from 1 to 10M+ active users.

## 1. Single Node to Read Replicas
When reads dominate writes (e.g., note-sharing sites, social media), introduce replication.

- **Primary DB**: Handles all write transactions.
- **Replica DBs**: Synchronously or asynchronously replicate data. Handles all read transactions.

*Challenge*: Read-after-write consistency (replicas may have a delay).

## 2. Multi-Level Caching
Avoid hitting the database entirely for frequent read requests.

\`\`\`
Client -> CDN -> API Gateway -> Redis Cache -> Read Replicas -> Primary DB
\`\`\`

- **In-Memory Cache (Redis/Memcached)**: Store frequently accessed rows or calculated query results. Use **Write-Through** or **Cache-Aside** policies.

## 3. Database Sharding (Horizontal Partitioning)
Split a single dataset across multiple physical machines.

- **Key-Based Sharding**: Hash the user ID to determine the host database: \`host = hash(userID) % number_of_shards\`
- **Range-Based Sharding**: Store users alphabetically or by region.
- **Directory-Based Sharding**: Query a lookup service to find the host.

## 4. The CAP Theorem Checklist
Remember that in a distributed network partition (P), you must choose:
- **Consistency (C)**: Every read receives the most recent write or an error.
- **Availability (A)**: Every non-failing node returns a response (without guarantee that it contains the most recent write).

Choose **CP** for transactional banking and **AP** for feed-based social media.`,
    author: {
      name: "Diana Chen",
      username: "diana_codes",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
      bio: "Principal Cloud Engineer & System Design Blogger"
    },
    views: 3105,
    upvotes: 914,
    downvotes: 12,
    date: "2026-06-01T12:00:00.000Z",
    comments: [
      {
        id: "c3",
        authorName: "Kenji Sato",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
        content: "Crystal clear explanation of sharding. The layout and diagrams of the query pipeline are very easy to follow.",
        date: "2026-06-02T09:40:00.000Z",
        likes: 28
      }
    ]
  },
  {
    id: "note-3",
    title: "Startup Valuation & Pitch Deck Fundamentals",
    description: "Understanding Pre/Post-money valuation, VC funding cycles, and structure of a 10-slide winning pitch deck.",
    category: "Business",
    tags: ["startup", "pitch-deck", "finance", "venture-capital"],
    content: `# Startup Pitch Deck & Valuation Essentials

An overview of venture capital finance and pitch structure for early-stage startup founders.

## Part 1: Valuation Math
- **Pre-Money Valuation**: The value of the company *before* receiving investment.
- **Post-Money Valuation**: The value of the company *after* investment.

$$\\text{Post-Money Valuation} = \\text{Pre-Money Valuation} + \\text{Investment Amount}$$

*Example*: If a investor puts $2M into a startup at a $8M pre-money valuation:
- Post-money = $8M + $2M = $10M
- The investor owns: $2M / $10M = 20% of the company.

## Part 2: The Core 10-Slide Pitch Deck Structure
Every standard Seed/Series A slide deck should contain these exact slides in order:

1. **Title / Cover**: Bold tagline, logo, and contact.
2. **The Problem**: What painful gap in the market are you solving?
3. **The Solution**: Your product, value proposition, and key features.
4. **Market Size (TAM/SAM/SOM)**:
   - TAM: Total Addressable Market (e.g. Global EdTech)
   - SAM: Serviceable Addressable Market (e.g. English-speaking digital college notes)
   - SOM: Serviceable Obtainable Market (e.g. US Ivy League study share market)
5. **Product / Demo**: Visually compelling screenshots or interactive walkthroughs.
6. **Traction**: Your monthly recurring revenue (MRR), user growth chart, or retention rates.
7. **Business Model**: How do you make money? (Subscriptions, transaction fees, freemium).
8. **Competition**: Grid or matrix showing how you stand out from incumbents.
9. **Team**: Founders' backgrounds, past exits, key credentials.
10. **The Ask**: Amount you are raising, terms, and how you will use the capital.`,
    author: {
      name: "Richard Vance",
      username: "rich_vance",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80",
      bio: "Serial Entrepreneur | VC Consultant | Ex-Y Combinator Alumni"
    },
    views: 890,
    upvotes: 215,
    downvotes: 2,
    date: "2026-06-10T15:45:00.000Z",
    comments: [
      {
        id: "c4",
        authorName: "Elena Rostova",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80",
        content: "Used this format for our seed deck pre-pitch review. Got positive marks on clarity! Appreciate the TAM/SAM/SOM breakdown.",
        date: "2026-06-12T18:10:00.000Z",
        likes: 15
      }
    ]
  },
  {
    id: "note-4",
    title: "Linear Algebra Essentials for Machine Learning",
    description: "An overview of matrix transformations, eigenvectors, eigenvalues, and SVD decomposition for ML algorithms.",
    category: "Mathematics",
    tags: ["linear-algebra", "math", "machine-learning", "ai"],
    content: `# Linear Algebra for ML & Data Science

Linear algebra is the foundation of modern machine learning, especially in deep learning and dimensionality reduction.

## 1. Matrix Transformations
A matrix $A$ can be viewed as a function that transforms vectors from one space to another.
$$y = Ax$$
In Neural Networks, linear transformation is represented as $z = Wx + b$, followed by an activation function.

## 2. Eigenvectors & Eigenvalues
An eigenvector of a square matrix $A$ is a non-zero vector $v$ that changes by only a scalar factor $\\lambda$ when that linear transformation is applied.

$$Av = \\lambda v$$

- **Eigenvalues ($\\lambda$)**: Determine the scale of stretching/shrinking.
- **Eigenvectors ($v$)**: Determine the direction of the principal transformation.

*Why it matters*: In Principal Component Analysis (PCA), the eigenvectors of the data covariance matrix indicate the directions of maximum variance.

## 3. Singular Value Decomposition (SVD)
Every real matrix $A$ of size $m \\times n$ can be factored into three matrices:

$$A = U \\Sigma V^T$$

- $U$: $m \\times m$ orthogonal matrix (left singular vectors).
- $\\Sigma$: $m \\times n$ diagonal matrix with singular values.
- $V^T$: $n \\times n$ transpose of orthogonal matrix (right singular vectors).

SVD is used for compression, collaborative filtering (recommendation systems), and solving linear systems.`,
    author: {
      name: "Prof. Clara Higgins",
      username: "clara_h",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      bio: "Math Professor & Research Advisor in Neural Networks"
    },
    views: 1205,
    upvotes: 410,
    downvotes: 1,
    date: "2026-06-14T09:15:00.000Z",
    comments: []
  },
  {
    id: "note-5",
    title: "Quantum Mechanics: The Double-Slit Experiment",
    description: "Analyzing wave-particle duality, probability density functions, and the implications of observer effect in quantum systems.",
    category: "Physics",
    tags: ["quantum-physics", "science", "double-slit", "mechanics"],
    content: `# Quantum Mechanics: Wave-Particle Duality & The Double Slit

The double-slit experiment is the classic demonstration of the central mystery of quantum mechanics.

## 1. The Setup
When particles (like electrons or photons) are fired through a barrier with two slits:
- **Classical expectations**: Two lines should form on the screen behind the slits, like bullets passing through gaps.
- **Quantum reality**: An **interference pattern** of multiple alternating dark and bright bands emerges. This is characteristic of waves colliding and reinforcing/canceling each other.

## 2. The Wave Function
This behavior is described by the Schrodinger Wave Equation. The state of the particle is a superposition of wave amplitudes:

$$\\Psi(x, t)$$

The probability of finding the particle at position $x$ is the square of the amplitude:

$$P(x) = |\\Psi(x, t)|^2$$

Even when electrons are fired **one at a time**, the wave function passes through both slits simultaneously, causing the electron to interfere with *itself*.

## 3. The Observer Effect
If we place a detector at the slits to observe which slit the electron actually passes through:
- The interference pattern **disappears**.
- The electron behaves like a classic particle, forming two simple bands.
- *Conclusion*: The act of measurement collapses the superposition wave function $\\Psi$ into a single localized state.`,
    author: {
      name: "Dr. Liam Thorne",
      username: "liam_t_phys",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      bio: "Researcher in Quantum Optics & Author of 'The Wave Function'"
    },
    views: 750,
    upvotes: 188,
    downvotes: 3,
    date: "2026-06-16T16:00:00.000Z",
    comments: [
      {
        id: "c5",
        authorName: "Rajesh Kumar",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
        content: "Perfect conceptual notes. The wave function section is written in a very intuitive way. Keep sharing!",
        date: "2026-06-17T11:30:00.000Z",
        likes: 7
      }
    ]
  }
];

const categories = ["All Categories", "Computer Science", "Business", "Mathematics", "Physics", "Creative Writing", "Other"];

const defaultProfile = {
  name: "Jane Doe",
  username: "janedoe",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  bio: "Computer Science student | Passionate notes compiler | AI enthusiast",
  savedNotes: ["note-1", "note-4"],
  myNotes: []
};

// Export to window object for browser access
window.initialNotes = initialNotes;
window.initialCategories = categories;
window.defaultProfile = defaultProfile;

# PromptVault

A curated library of prompts and skills for effective AI collaboration. Organize, discover, and deploy your AI collaboration tools with elegance.

![PromptVault Preview](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop)

## Features

- **Dual Library**: Separate sections for Prompts and Skills
- **Smart Search**: Find prompts and skills by title, description, or tags
- **Category Filtering**: Organize by use case (沟通优化, 代码开发, etc.)
- **One-Click Copy**: Copy any prompt instantly to your clipboard
- **Detailed Views**: See full prompt content and skill instructions
- **Beautiful UI**: Dark, elegant design inspired by Anthropic/Claude aesthetics

## Included Content

### Prompts (8)
- 对话交接 - Context handoff for long conversations
- 需求澄清专家 - Requirement clarification
- 代码审查员 - Code review assistant
- Bug诊断专家 - Systematic debugging
- 学习路径规划师 - Learning path planning
- 技术文档写手 - Technical documentation
- 创意思考伙伴 - Brainstorming partner
- 决策分析助手 - Decision analysis

### Skills (6)
All skills are from [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent:
- Brainstorming
- Test-Driven Development
- Systematic Debugging
- Subagent-Driven Development
- Writing Plans
- Code Review

## Design Philosophy

PromptVault embraces a **dark, elegant aesthetic** with:
- Deep charcoal backgrounds (`#0a0a0a`)
- Purple accents for prompts (`#9b59b6`)
- Teal accents for skills (`#2ecc71`)
- Smooth animations and micro-interactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project is configured for **GitHub Pages** deployment:

1. Push to GitHub
2. Go to Settings → Pages
3. Set source to "GitHub Actions"
4. The workflow will automatically deploy on push to main

## Data Structure

### Prompt
```typescript
interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;      // The actual prompt text
  category: string;
  tags: string[];
  usage: string;        // When to use this prompt
  createdAt: string;
}
```

### Skill
```typescript
interface Skill {
  id: string;
  title: string;
  description: string;
  instructions: string[];  // Step-by-step instructions
  category: string;
  tags: string[];
  source?: string;         // Link to source (e.g., Superpowers)
  createdAt: string;
}
```

## Customization

To add your own prompts or skills, edit `lib/data.ts`:

1. Add new items to the `prompts` or `skills` arrays
2. Update `categories` if adding new categories
3. The UI will automatically reflect your changes

## Adding New Categories

When adding new categories, also add an icon mapping in `page.tsx`:

```typescript
const categoryIcons: Record<string, React.ElementType> = {
  "你的新分类": YourIcon,
  // ... existing mappings
};
```

## Credits

- Skills based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent
- Design inspired by Anthropic/Claude's visual language

## License

MIT License
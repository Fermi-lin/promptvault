"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  Search,
  X,
  BookOpen,
  Terminal,
  ExternalLink,
  MessageSquare,
  Code,
  Lightbulb,
  FileText,
  Brain,
  GitBranch,
  Bug,
  FolderKanban,
  Shield
} from "lucide-react";
import { prompts, skills, categories, stats, Prompt, Skill } from "@/lib/data";

type Tab = "prompts" | "skills";
type ViewMode = "grid" | "list";

const categoryIcons: Record<string, React.ElementType> = {
  "沟通优化": MessageSquare,
  "代码开发": Code,
  "学习成长": Lightbulb,
  "写作创作": FileText,
  "思考分析": Brain,
  "开发流程": GitBranch,
  "问题解决": Bug,
  "项目管理": FolderKanban,
  "代码质量": Shield,
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#a0a0a0] hover:text-[#f5f5f5] hover:border-[#9b59b6]/50 transition-all ${
        copied ? "copy-success border-[#2ecc71]" : ""
      }`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-[#2ecc71]" />
          <span className="text-[#2ecc71]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function PromptCard({
  prompt,
  onClick,
  index,
}: {
  prompt: Prompt;
  onClick: () => void;
  index: number;
}) {
  const Icon = categoryIcons[prompt.category] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="h-full p-6 bg-[#141414] border border-[#2a2a2a] rounded-2xl card-hover hover:border-[#9b59b6]/30">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9b59b6]/20 to-[#9b59b6]/5 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#bb8fce]" />
          </div>
          <span className="text-xs text-[#666666]">{prompt.category}</span>
        </div>

        <h3 className="text-lg font-medium text-[#f5f5f5] mb-2 group-hover:text-[#bb8fce] transition-colors">
          {prompt.title}
        </h3>

        <p className="text-sm text-[#888888] line-clamp-2 mb-4">
          {prompt.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SkillCard({
  skill,
  onClick,
  index,
}: {
  skill: Skill;
  onClick: () => void;
  index: number;
}) {
  const Icon = categoryIcons[skill.category] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="h-full p-6 bg-[#141414] border border-[#2a2a2a] rounded-2xl card-hover hover:border-[#2ecc71]/30">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/5 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#58d68d]" />
          </div>
          {skill.source && (
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#666666] hover:text-[#2ecc71] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <h3 className="text-lg font-medium text-[#f5f5f5] mb-2 group-hover:text-[#58d68d] transition-colors">
          {skill.title}
        </h3>

        <p className="text-sm text-[#888888] line-clamp-2 mb-4">
          {skill.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-[#666666]">
          <Terminal className="w-3 h-3" />
          <span>{skill.instructions.length} instructions</span>
        </div>
      </div>
    </motion.div>
  );
}

function PromptDetail({
  prompt,
  onClose,
}: {
  prompt: Prompt;
  onClose: () => void;
}) {
  const Icon = categoryIcons[prompt.category] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-hidden border border-[#2a2a2a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9b59b6]/20 to-[#9b59b6]/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#bb8fce]" />
              </div>
              <div>
                <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[#f5f5f5]">
                  {prompt.title}
                </h2>
                <p className="text-[#888888] mt-1">{prompt.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888888] hover:text-[#f5f5f5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider">
                  Prompt Content
                </h3>
                <CopyButton text={prompt.content} />
              </div>
              <pre className="whitespace-pre-wrap text-[#a0a0a0]">
                <code>{prompt.content}</code>
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[#1a1a1a] rounded-xl">
                <h4 className="text-sm font-medium text-[#888888] mb-2">Category</h4>
                <p className="text-[#f5f5f5]">{prompt.category}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-xl">
                <h4 className="text-sm font-medium text-[#888888] mb-2">Usage</h4>
                <p className="text-[#a0a0a0] text-sm">{prompt.usage}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#888888] mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkillDetail({
  skill,
  onClose,
}: {
  skill: Skill;
  onClose: () => void;
}) {
  const Icon = categoryIcons[skill.category] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-hidden border border-[#2a2a2a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#58d68d]" />
              </div>
              <div>
                <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[#f5f5f5]">
                  {skill.title}
                </h2>
                <p className="text-[#888888] mt-1">{skill.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888888] hover:text-[#f5f5f5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-4">
                Instructions
              </h3>
              <div className="space-y-3">
                {skill.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-xl"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2ecc71]/20 text-[#58d68d] text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-[#a0a0a0]">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[#1a1a1a] rounded-xl">
                <h4 className="text-sm font-medium text-[#888888] mb-2">Category</h4>
                <p className="text-[#f5f5f5]">{skill.category}</p>
              </div>
              {skill.source && (
                <div className="p-4 bg-[#1a1a1a] rounded-xl">
                  <h4 className="text-sm font-medium text-[#888888] mb-2">Source</h4>
                  <a
                    href={skill.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2ecc71] hover:underline text-sm flex items-center gap-1"
                  >
                    View Source
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#888888] mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span key={tag} className="tag tag-teal">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: "purple" | "teal";
  delay: number;
}) {
  const colorClasses = {
    purple: "from-[#9b59b6]/20 to-[#9b59b6]/5 text-[#bb8fce]",
    teal: "from-[#2ecc71]/20 to-[#2ecc71]/5 text-[#58d68d]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#9b59b6]/20 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-[family-name:var(--font-playfair)] text-[#f5f5f5]">
        {value}
      </p>
      <p className="text-sm text-[#888888] mt-1">{label}</p>
    </motion.div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("prompts");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesCategory =
        selectedCategory === "全部" || prompt.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "全部" || skill.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#2a2a2a] text-sm text-[#888888] mb-8">
              <Sparkles className="w-4 h-4 text-[#9b59b6]" />
              <span>AI Collaboration Library</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-playfair)] text-[#f5f5f5] tracking-tight">
              Prompt
              <span className="gradient-text">Vault</span>
            </h1>

            <p className="mt-6 text-lg text-[#888888] max-w-xl mx-auto leading-relaxed">
              A curated collection of prompts and skills for effective AI
              collaboration. Your personal library for better conversations.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            <StatCard
              icon={BookOpen}
              value={stats.totalPrompts}
              label="Prompts"
              color="purple"
              delay={0.2}
            />
            <StatCard
              icon={Zap}
              value={stats.totalSkills}
              label="Skills"
              color="teal"
              delay={0.3}
            />
            <StatCard
              icon={FolderKanban}
              value={stats.totalCategories}
              label="Categories"
              color="purple"
              delay={0.4}
            />
            <StatCard
              icon={Sparkles}
              value={stats.topTags.length}
              label="Tags"
              color="teal"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("prompts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                activeTab === "prompts"
                  ? "tab-active text-[#f5f5f5]"
                  : "border-[#2a2a2a] text-[#888888] hover:text-[#f5f5f5] hover:border-[#9b59b6]/30"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Prompts</span>
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                activeTab === "skills"
                  ? "tab-active text-[#f5f5f5]"
                  : "border-[#2a2a2a] text-[#888888] hover:text-[#f5f5f5] hover:border-[#9b59b6]/30"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Skills</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <input
                type="text"
                placeholder="Search prompts, skills, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#141414] border border-[#2a2a2a] rounded-xl text-[#f5f5f5] placeholder-[#666666] focus:outline-none focus:border-[#9b59b6]/50 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-[#9b59b6]/20 text-[#bb8fce] border border-[#9b59b6]/50"
                    : "bg-[#141414] text-[#888888] border border-[#2a2a2a] hover:border-[#9b59b6]/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <AnimatePresence mode="wait">
            {activeTab === "prompts" ? (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredPrompts.map((prompt, index) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onClick={() => setSelectedPrompt(prompt)}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredSkills.map((skill, index) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onClick={() => setSelectedSkill(skill)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {((activeTab === "prompts" && filteredPrompts.length === 0) ||
            (activeTab === "skills" && filteredSkills.length === 0)) && (
            <div className="text-center py-20">
              <p className="text-[#666666]">No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#666666] text-sm">
            PromptVault — Personal AI collaboration library
          </p>
          <p className="text-[#444444] text-xs mt-2">
            Inspired by{" "}
            <a
              href="https://github.com/obra/superpowers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b59b6] hover:underline"
            >
              Superpowers
            </a>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedPrompt && (
          <PromptDetail
            prompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
        )}
        {selectedSkill && (
          <SkillDetail
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
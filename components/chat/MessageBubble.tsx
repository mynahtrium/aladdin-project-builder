import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  role: string;
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  return (
    <div className={cn(
      "flex w-full gap-4 p-6",
      role === 'user' ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
        role === 'user' 
          ? "bg-primary border-primary text-primary-foreground" 
          : "bg-purple-600 border-purple-600 text-white"
      )}>
        {role === 'user' ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className={cn(
        "flex flex-col gap-2 min-w-0 max-w-[85%] text-base leading-relaxed",
        role === 'user' 
          ? "items-end" 
          : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-5 py-3 shadow-md backdrop-blur-sm",
          role === 'user' 
            ? "bg-primary text-primary-foreground" 
            : "bg-card/90 text-card-foreground border border-white/10"
        )}>
          {role === 'user' ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                    <div className="rounded-md overflow-hidden my-4 border border-white/10 shadow-sm">
                      <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b border-white/10 flex justify-between items-center backdrop-blur-md">
                        <span>{match[1]}</span>
                      </div>
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1rem', background: 'rgba(0,0,0,0.4)' }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code {...props} className={cn("bg-muted/50 px-1.5 py-0.5 rounded text-sm text-primary-foreground/80 font-mono border border-white/10", className)}>
                      {children}
                    </code>
                  )
                },
                a: ({ node, ...props }) => (
                  <a {...props} className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-4 space-y-1 my-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal pl-4 space-y-1 my-2" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="pl-1" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-2xl font-bold mt-6 mb-4 pb-2 border-b border-white/10" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-xl font-bold mt-5 mb-3" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-lg font-bold mt-4 mb-2" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 last:mb-0" />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 border border-white/10 rounded-lg">
                    <table {...props} className="w-full text-left text-sm" />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead {...props} className="bg-muted/50 text-foreground" />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody {...props} className="divide-y divide-gray-700" />
                ),
                tr: ({ node, ...props }) => (
                  <tr {...props} className="hover:bg-gray-800/30 transition-colors" />
                ),
                th: ({ node, ...props }) => (
                  <th {...props} className="px-4 py-3 font-semibold" />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="px-4 py-3" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote {...props} className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4" />
                ),
              }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

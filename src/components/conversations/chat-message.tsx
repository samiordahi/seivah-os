import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import userAvatar from '@/assets/user-avatar.png';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex gap-4 p-4 group',
      isUser ? 'bg-background' : 'bg-muted/30'
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <AvatarImage src={userAvatar} alt="Usuário" />
        ) : (
          <AvatarFallback className="bg-coral-primary text-white text-xs font-medium">
            AI
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {isUser ? 'Você' : 'Assistente'}
          </span>
        </div>
        
        <div className={cn(
          'prose prose-sm max-w-none',
          'prose-p:leading-relaxed prose-p:mb-2 prose-p:last:mb-0',
          'text-foreground'
        )}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
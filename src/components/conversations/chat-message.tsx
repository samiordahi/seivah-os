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
    <div className="p-4 w-full">
      <div className={cn(
        'flex gap-4 max-w-4xl mx-auto',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <Avatar className="h-8 w-8 shrink-0">
          {isUser ? (
            <AvatarImage src={userAvatar} alt="Usuário" />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-coral-primary to-coral-secondary text-white text-xs font-medium">
              SS
            </AvatarFallback>
          )}
        </Avatar>

        <div className={cn(
          'flex-1 space-y-2 overflow-hidden max-w-[70%]',
          isUser ? 'text-right' : 'text-left'
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-medium text-foreground',
              isUser ? 'justify-end' : 'justify-start'
            )}>
              {isUser ? 'Você' : 'SenSeivah'}
            </span>
          </div>
          
          <div className={cn(
            'inline-block rounded-2xl px-4 py-3 max-w-full',
            isUser 
              ? 'bg-gradient-to-br from-coral-primary/90 to-coral-primary text-white ml-auto' 
              : 'bg-gradient-to-br from-muted/80 to-muted text-foreground mr-auto'
          )}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
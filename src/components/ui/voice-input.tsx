import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Pause, Loader2, X } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export function VoiceInput({ onTranscriptionComplete, disabled = false, size = 'default' }: VoiceInputProps) {
  const { isRecording, isTranscribing, startRecording, stopRecording, cancelRecording } = useVoiceRecorder();
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      try {
        const transcription = await stopRecording();
        if (transcription.trim()) {
          onTranscriptionComplete(transcription);
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    } else {
      await startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isProcessing = isTranscribing;
  const isActive = isRecording || isTranscribing;

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>{formatTime(recordingTime)}</span>
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        size={size === 'sm' ? 'sm' : 'icon'}
        onClick={handleToggleRecording}
        disabled={disabled || isTranscribing}
        className={cn(
          "transition-all duration-200 hover:scale-105 border border-white/40 backdrop-blur-sm",
          isActive && "bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-500/40",
          isRecording && "animate-pulse",
          size === 'sm' && "h-8 w-8",
          size === 'lg' && "h-12 w-12"
        )}
        title={
          isRecording 
            ? "Clique para concluir a gravação" 
            : isTranscribing 
            ? "Transcrevendo..." 
            : "Clique para gravar"
        }
      >
        {isTranscribing ? (
          <Loader2 className={cn(
            "animate-spin",
            size === 'sm' ? "h-3 w-3" : "h-4 w-4"
          )} />
        ) : isRecording ? (
          <Pause className={cn(
            size === 'sm' ? "h-3 w-3" : "h-4 w-4"
          )} />
        ) : (
          <Mic className={cn(
            size === 'sm' ? "h-3 w-3" : "h-4 w-4"
          )} />
        )}
      </Button>

      {isRecording && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={cancelRecording}
          className="text-muted-foreground hover:text-red-600 h-8 w-8"
          title="Cancelar gravação"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
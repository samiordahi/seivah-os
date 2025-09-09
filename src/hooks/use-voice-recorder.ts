import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível acessar o microfone. Verifique as permissões.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsRecording(false);
          setIsTranscribing(true);

          // Combine chunks into single blob
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              
              // Send to transcription service
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { audio: base64Audio }
              });

              if (error) {
                throw error;
              }

              setIsTranscribing(false);
              resolve(data.text || '');
              
            } catch (error) {
              console.error('Transcription error:', error);
              setIsTranscribing(false);
              toast({
                title: 'Erro na transcrição',
                description: 'Não foi possível transcrever o áudio. Tente novamente.',
                variant: 'destructive'
              });
              reject(error);
            }
          };

          reader.onerror = () => {
            setIsTranscribing(false);
            reject(new Error('Failed to read audio file'));
          };

          reader.readAsDataURL(audioBlob);

          // Stop all tracks
          const stream = mediaRecorderRef.current?.stream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
        } catch (error) {
          setIsTranscribing(false);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, [toast]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      chunksRef.current = [];
    }
  }, [isRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  };
};
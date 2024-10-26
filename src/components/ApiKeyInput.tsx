import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { initializeOpenAI } from '@/lib/openai';

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      initializeOpenAI(apiKey);
      toast({
        title: "API Key Set",
        description: "Your OpenAI API key has been successfully configured.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
          className="flex-1"
        />
        <Button type="submit">Set API Key</Button>
      </div>
    </form>
  );
};

export default ApiKeyInput;
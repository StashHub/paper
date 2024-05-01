export const sendMessage = {
  key: 'send-message',
  mutation: async (fileId: string, message: string) => {
    const response = await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        message,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.body;
  },
};

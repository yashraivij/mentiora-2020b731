import { useEffect } from 'react';

const FeedbackFish = () => {
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('feedbackfish-script')) {
      return;
    }

    // Create and append the Feedback Fish script
    const script = document.createElement('script');
    script.id = 'feedbackfish-script';
    script.src = 'https://feedback.fish/ff.js?pid=30c453e52d00bb';
    script.async = true;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.getElementById('feedbackfish-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default FeedbackFish;
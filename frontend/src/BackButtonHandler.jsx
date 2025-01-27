import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButtonHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
      } else {
        App.exitApp();
      }
    };

    const backButtonListener = App.addListener('backButton', handleBackButton);

    return () => {
      backButtonListener.then(listener => listener.remove()).catch(() => {
        App.removeAllListeners('backButton');
      });
    };
  }, [navigate]);

  return null;
};
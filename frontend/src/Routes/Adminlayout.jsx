import React, { useState, useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import CustomLoadingBar from "../Component/LoadingBar.jsx"

export default function Adminlayout() {
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading') {
      setProgress(30); // Start progress when navigation starts
    } else if (navigation.state === 'idle') {
      setProgress(100); // Complete progress when navigation is done
    }
  }, [navigation.state]);

  return (
    <div>
      <CustomLoadingBar progress={progress} />
      <Outlet />
    </div>
  );
}
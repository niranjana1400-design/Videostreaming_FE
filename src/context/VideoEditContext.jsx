import { createContext, useState } from "react";

export const VideoEditContext = createContext();

export const VideoEditProvider = ({ children }) => {
  const [editVideo, setEditVideo] = useState(null);

  return (
    <VideoEditContext.Provider value={{ editVideo, setEditVideo }}>
      {children}
    </VideoEditContext.Provider>
  );
};
import { useState, useEffect } from "react";
import Image from "next/image";

const BackgroundGif = () => {
  const [backgroundCounter, setBackgroundCounter] = useState(1);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    `/forest-${backgroundCounter}.gif`
  );

  const [opacity, setOpacity] = useState(0.1);

  const updateImage = (newImageUrl: string) => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentImageUrl(newImageUrl);
      setOpacity(0.1);
    }, 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundCounter((prevCounter) =>
        prevCounter < 10 ? prevCounter + 1 : 1
      );
      updateImage(`/forest-${backgroundCounter}.gif`);
    }, 15000);
    return () => clearInterval(interval);
  }, [backgroundCounter]);

  return (
    <Image
      src={currentImageUrl}
      alt="SAMI"
      width={1200}
      height={800}
      style={{
        position: "fixed",
        top: "0",
        right: "0",
        zIndex: -1,
        width: "100%",
        height: "100%",
        opacity: opacity,
        transition: "opacity 3s ease",
      }}
    />
  );
};

export default BackgroundGif;

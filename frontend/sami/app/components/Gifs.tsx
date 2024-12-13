import Image from "next/image";

const Gifs = () => {
  return (
    <>
      <Image
        src="/hk2.gif"
        alt="Gifs"
        width={150}
        height={150}
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
        }}
      />
      <Image
        src="/tamas9.gif"
        alt="Gifs"
        width={100}
        height={100}
        style={{
          position: "fixed",
          left: "10px",
          top: "10px",
        }}
      />
      <Image
        src="/bird1.gif"
        alt="Gifs"
        width={100}
        height={150}
        style={{
          position: "fixed",
          right: "0",
          bottom: "0",
        }}
      />
    </>
  );
};

export default Gifs;

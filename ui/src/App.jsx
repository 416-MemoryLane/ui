import { useEffect, useState } from "react";
import { ImageViewer } from "./ImageViewer";

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedImage, setSelectedImage] = useState(undefined);

  const fetchAlbums = async () => {
    const res = await fetch("http://localhost:4321/albums");
    if (res.ok) {
      const json = await res.json();
      setAlbums(json);
    }
    poll();
  };

  const poll = () => {
    setTimeout(async () => {
      fetchAlbums();
    }, 3000);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="w-full flex justify-center align-middle">
      <ImageViewer
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <div className="w-7/12 self-center">
        {albums.map(({ title, images }) => {
          return (
            <div className="flex-row w-full my-5 bg-slate-200 p-5 rounded-xl">
              <p className="text-2xl mb-3 font-semibold">{title}</p>
              <div className="flex flex-row gap-5 flex-wrap">
                {images.map((image) => (
                  <img
                    className="object-cover w-[300px] h-[200px] rounded-lg"
                    onClick={() => setSelectedImage(image)}
                    src={`http://localhost:4321${image}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

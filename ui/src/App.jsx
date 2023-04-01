import { useEffect, useState } from "react";
import { ImageViewer } from "./ImageViewer";
import { AlbumOverview } from "./AlbumOverview";
import { ArrowForwardIcon } from "./Icons/ArrowForwardIcon";

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [showAlbumOverview, setShowAlbumOverview] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");

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

  const handleAlbumSelection = (title) => {
    setSelectedAlbum(title);
    setShowAlbumOverview(true);
  };

  const handleAlbumOverviewBack = () => {
    setShowAlbumOverview(false);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return showAlbumOverview ? (
    <div>
      <AlbumOverview
        title={selectedAlbum}
        images={albums.find((album) => album.title === selectedAlbum).images}
        onBackClick={handleAlbumOverviewBack}
      />
    </div>
  ) : (
    <div className="w-full flex justify-center align-middle">
      <ImageViewer
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
      <div className="w-7/12 self-center">
        {albums.map(({ title, images }) => {
          return (
            <div
              key={`${title}-album`}
              className="flex-row w-full my-5 bg-slate-200 p-5 rounded-xl"
            >
              <div className="flex justify-between">
                <p className="text-2xl mb-3 font-semibold">{title}</p>
                <div className="ml-auto">
                  <ArrowForwardIcon
                    id={`${title}-forwardIcon`}
                    className=""
                    onClick={() => handleAlbumSelection(title)}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-5 flex-wrap">
                {images.map((image, i) => (
                  <img
                    key={`${title}-image-${i}`}
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

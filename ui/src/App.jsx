import { useEffect, useState } from "react";
import { AlbumOverview } from "./AlbumOverview";
import { ArrowForwardIcon } from "./Icons/ArrowForwardIcon";
import { Modal } from "./Modal";

function App() {
  const [albums, setAlbums] = useState([]);
  const [showAlbumOverview, setShowAlbumOverview] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");

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
    }, 100);
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
        albumTitle={selectedAlbum}
        images={albums.find((album) => album.title === selectedAlbum).images}
        onBackClick={handleAlbumOverviewBack}
      />
    </div>
  ) : (
    <div>
      <Modal
        isOpen={isCreateModalOpen}
        callbackFn={() => setIsCreateModalOpen(false)}
      >
        <div className="w-[50rem] flex flex-col gap-5">
          <p className="self-center text-3xl">Create Album</p>
          <input
            className="border-2 rounded-md h-10 p-3"
            placeholder="Enter album name..."
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            type="text"
          />
          <div className="hover:cursor-pointer py-2 rounded-lg border-2 border-emerald-200 self-center bg-emerald-100 px-6">
            Submit
          </div>
        </div>
      </Modal>
      <div className="w-full flex justify-center align-middle">
        <div className="w-7/12 self-center">
          <div className="flex justify-between my-8">
            <p className="text-4xl">Memory Lane</p>
            <div className="flex gap-3">
              <p
                className="self-center bg-slate-200 border-2 border-slate-300 py-2 px-4 rounded-xl hover:shadow-lg hover:cursor-pointer"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add album
              </p>
              <p
                className="self-center bg-rose-100 border-2 border-rose-200 py-2 px-4 rounded-xl hover:shadow-lg hover:cursor-pointer"
                onClick={() => null /** do logout **/}
              >
                Logout
              </p>
            </div>
          </div>
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
                      className="cursor-pointer"
                      onClick={() => handleAlbumSelection(title)}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-5 flex-wrap">
                  {(images.length > 4 ? images.splice(4) : images).map(
                    (image, i) => (
                      <img
                        key={`${title}-image-${i}`}
                        className="object-cover w-[300px] h-[200px] rounded-lg"
                        src={`http://localhost:4321${image}`}
                      />
                    )
                  )}
                  {!images.length && (
                    <div className="h-[200px] w-full flex justify-center align-middle">
                      <p className="text-2xl self-center">No images yet!</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

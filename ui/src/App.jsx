import { useEffect, useState } from "react";
import { AlbumOverview } from "./AlbumOverview";
import { ArrowForwardIcon } from "./Icons/ArrowForwardIcon";
import { Modal } from "./Modal";
import BeatLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";
import { v4 as uuidv4 } from "uuid";

const toastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const initialCredentials = {
  username: "",
  password: "",
};

function App() {
  const [albums, setAlbums] = useState([]);
  const [showAlbumOverview, setShowAlbumOverview] = useState(false);
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Auth
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [credentials, setCredentials] = useState(initialCredentials);
  const [currentUser, setCurrentUser] = useState("");

  // Galactus
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchAlbums = async () => {
    try {
      if (!isLoadingImages) {
        const res = await fetch("http://localhost:4321/albums");
        if (res.ok) {
          const json = await res.json();
          setAlbums(json);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      poll();
    }
  };

  const poll = () => {
    setTimeout(async () => {
      fetchAlbums();
    }, 100);
  };

  useEffect(() => {
    fetchAlbums();
    const token = localStorage.getItem("galactus-token");
    const user = localStorage.getItem("galactus-user");
    if (!!token && !!user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const res = await fetch(
          "https://memory-lane-381119.wl.r.appspot.com/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("galactus-token")}`,
            },
          }
        );
        const json = await res.json();
        if (res.ok) {
          setUsers(json);
        } else {
          notifyError("Unable to fetch users");
        }
      })();
    }
  }, [currentUser]);

  const handleAlbumSelection = (title, albumId) => {
    console.log(albumId);
    setSelectedAlbumTitle(title);
    setSelectedAlbumId(albumId);
    setShowAlbumOverview(true);
  };

  const handleAlbumOverviewBack = () => {
    setSelectedAlbumId("");
    setSelectedAlbumTitle("");
    setShowAlbumOverview(false);
  };

  const notifySuccessfulLogin = (username) =>
    toast.success(`${username} successfully logged in`, toastOptions);

  const notifySuccess = (msg) => toast.success(msg, toastOptions);

  const notifyError = (msg) => toast.error(msg, toastOptions);

  const notifySuccessfulLogout = (username) =>
    toast.success(`${username} successfully logged out`, toastOptions);

  const handleLogin = async () => {
    if (credentials.password.length < 4) {
      alert("Password should be greater than 4 characters.");
    } else {
      setIsLoading(true);
      const res = await fetch(
        "https://memory-lane-381119.wl.r.appspot.com/login",
        {
          method: "POST",
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (res.ok) {
        const user = credentials.username;
        localStorage.setItem("galactus-user", user);
        localStorage.setItem("galactus-token", json.token);
        setCurrentUser(user);
        setCredentials(initialCredentials);
        setIsLoading(false);
        setIsLoginModalOpen(false);
        notifySuccessfulLogin(user);
      } else {
        notifyError(json.message);
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    const user = localStorage.getItem("galactus-user");
    localStorage.removeItem("galactus-user");
    localStorage.removeItem("galactus-token");
    setCurrentUser("");
    notifySuccessfulLogout(user);
  };

  const handleCreateAlbum = async () => {
    setIsLoading(true);
    try {
      const albumUuid = uuidv4();
      const res = await fetch(
        "https://memory-lane-381119.wl.r.appspot.com/add_album",
        {
          method: "POST",
          body: JSON.stringify({
            albumName: newAlbumName,
            username: localStorage.getItem("galactus-user"),
            authorizedUsers: [
              ...selectedUsers.map((user) => user.value),
              currentUser,
            ],
            uuid: albumUuid,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("galactus-token")}`,
          },
        }
      );
      const json = await res.json();
      if (res.ok) {
        const res2 = await fetch("http://localhost:4321/albums", {
          method: "POST",
          body: JSON.stringify({
            albumName: newAlbumName,
            uuid: albumUuid,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res2.ok) {
          setNewAlbumName("");
          setSelectedUsers([]);
          setIsCreateModalOpen(false);
          notifySuccess(json.message);
        } else {
          notifyError(await res2.json());
        }
      } else {
        notifyError(json.error);
      }
    } catch (err) {
      notifyError(JSON.stringify(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return showAlbumOverview ? (
    <div>
      <AlbumOverview
        albumId={selectedAlbumId}
        setIsLoadingImages={setIsLoadingImages}
        albumTitle={selectedAlbumTitle}
        images={
          albums.find((album) => album.title === selectedAlbumTitle).images
        }
        onBackClick={handleAlbumOverviewBack}
      />
    </div>
  ) : (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        isOpen={isCreateModalOpen}
        callbackFn={() => setIsCreateModalOpen(false)}
      >
        <div className="w-[50rem] flex flex-col gap-5">
          <p className="self-center text-3xl">Create Album</p>
          <input
            className="border-[1px] rounded-[4px] border-gray-300 h-10 p-3"
            placeholder="Enter album name..."
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            type="text"
          />
          <MultiSelect
            options={users
              .filter((user) => user !== currentUser)
              .map((user) => ({ value: user, label: user }))}
            value={selectedUsers}
            onChange={setSelectedUsers}
            labelledBy="Select"
          />
          <div
            className="hover:cursor-pointer py-2 rounded-lg border-2 border-emerald-200 self-center bg-emerald-100 px-6"
            onClick={handleCreateAlbum}
          >
            {isLoading ? <BeatLoader color="#36d7b7" /> : "Submit"}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isLoginModalOpen}
        callbackFn={() => setIsLoginModalOpen(false)}
      >
        <div className="w-[30rem] flex flex-col gap-5">
          <p className="self-center text-3xl">Log in</p>
          <input
            className="border-2 rounded-md h-10 p-3"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            type="text"
          />
          <input
            className="border-2 rounded-md h-10 p-3"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            type="password"
          />
          <div
            className="hover:cursor-pointer py-2 rounded-lg border-2 border-emerald-200 self-center bg-emerald-100 px-6"
            onClick={handleLogin}
          >
            {isLoading ? <BeatLoader color="#36d7b7" /> : "Submit"}
          </div>
        </div>
      </Modal>
      <div className="w-full flex justify-center align-middle">
        <div className="w-7/12 self-center">
          <div className="flex justify-between my-8">
            <span className="flex">
              <p className="text-4xl">Memory Lane</p>
              <p className="ml-2 text-4xl text-slate-500">
                {currentUser ? `(Logged in as ${currentUser})` : "(Offline)"}
              </p>
            </span>
            <div className="flex gap-3">
              {currentUser && (
                <p
                  className="self-center bg-slate-200 border-2 border-slate-300 py-2 px-4 rounded-xl hover:shadow-lg hover:cursor-pointer"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Add album
                </p>
              )}
              {currentUser ? (
                <p
                  className="self-center bg-rose-100 border-2 border-rose-200 py-2 px-4 rounded-xl hover:shadow-lg hover:cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              ) : (
                <p
                  className="self-center bg-sky-100 border-2 border-sky-200 py-2 px-4 rounded-xl hover:shadow-lg hover:cursor-pointer"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Login
                </p>
              )}
            </div>
          </div>
          {albums.map(({ albumId, title, images }) => {
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
                      onClick={() => handleAlbumSelection(title, albumId)}
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

import { useState, useMemo} from "react";
import { CloseIcon } from "./Icons/CloseIcon";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const AlbumOverview = ({ title, images, onBackClick }) => {
  const thumbnails = useMemo(() => {
    return images.map((image, i) => {
        let url = `http://localhost:4321${image}`;
        return { src: url, width: 150, height: 100};
    });
  }, []);

  const photos = useMemo(() => {
    return images.map((image, i) => {
      return { src: `http://localhost:4321${image}` };
    });
  }, []);

  const [index, setIndex] = useState(-1);

  return (
    <div className="container mx-auto">
      <CloseIcon onClick={onBackClick}></CloseIcon>
      <PhotoAlbum
        photos={thumbnails}
        layout="rows"
        onClick={({ index }) => setIndex(index)}
        // render like this because we only have the url, ignores width and height
        renderImage={({ photo }) => (
            <img
              src={photo.src}
              alt={photo.title}
            />
        )}
      />
      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </div>
  );
};

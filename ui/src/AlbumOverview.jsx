import { useState, useMemo } from "react";
import { MinusIcon } from "./Icons/MinusIcon";
import { CloseIcon } from "./Icons/CloseIcon";
import { PhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const AlbumOverview = ({ albumTitle, images, onBackClick }) => {
  const thumbnails = useMemo(() => {
    return images.map((image, i) => {
      let url = `http://localhost:4321${image}`;
      const img = new Image();
      img.src = url;
      const width = img.width;
      const height = img.height;
      return { src: url, width: width, height: height, fileName: image.split("/").pop() };
    });
  }, [images]);

  const photos = useMemo(() => {
    return images.map((image, i) => {
      return { src: `http://localhost:4321${image}`};
    });
  }, [images]);

  const [index, setIndex] = useState(-1);

  const handleFileUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("myfile", file);
      try {
        const response = await fetch(
          `http://localhost:4321/albums/${albumTitle}/images`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.text();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    input.click();
  };

const handleFileDelete = async (fileName) => {
    try {
        const response = await fetch(
          `http://localhost:4321/albums/${albumTitle}/images/${fileName}`,
          {
            method: "DELETE"
          }
        );
        const data = await response.text();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
};

  const albumContainer = ({ containerProps, children, containerRef }) => (
    <div
      style={{
        border: "2px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <div ref={containerRef} {...containerProps}>
        {children}
      </div>
    </div>
  );

  const photoFrame = ({
    layout,
    layoutOptions,
    imageProps: { style, ...restImageProps },
    photo
  }) => (
    <div
      style={{
        border: "2px solid #eee",
        borderRadius: "4px",
        boxSizing: "content-box",
        alignItems: "center",
        width: style?.width,
        padding: `20px`,
        margin: "5px",
        position: "relative",
      }}
    >
      <img style={{ ...style, width: "100%" }} {...restImageProps} />
      <MinusIcon
        className="text-gray-600 hover:fill-current hover:text-sky-400 cursor-pointer absolute top-0 right-0 opacity-50 px-1"
        onClick={() => handleFileDelete(photo.fileName)}
      />
    </div>
  );

  return (
    <div className="mx-auto px-8 sm:px-10 lg:px-12">
      <div className="flex justify-between items-center">
        <button className="px-3 hover:text-sky-400" onClick={handleFileUpload}>
          <span className="text-md font-semibold">Add Photo</span>
        </button>
        <h1 className="text-2xl font-bold">{albumTitle}</h1>
        <CloseIcon
          className="hover:fill-current hover:text-sky-400 cursor-pointer"
          onClick={onBackClick}
        ></CloseIcon>
      </div>
      <PhotoAlbum
        photos={thumbnails}
        layout="rows"
        spacing={5}
        onClick={({ index }) => setIndex(index)}
        renderContainer={albumContainer}
        renderPhoto={(props) => photoFrame({ ...props})}
      />
      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        on={{
          view: ({ index }) => {
            setIndex(index);
          },
        }}
        plugins={[Fullscreen, Slideshow, Thumbnails]}
      />
    </div>
  );
};

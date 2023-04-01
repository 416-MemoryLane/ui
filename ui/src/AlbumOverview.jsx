import { useState, useMemo } from "react";
import { CloseIcon } from "./Icons/CloseIcon";
import { PhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const AlbumOverview = ({ title, images, onBackClick }) => {
    const thumbnails = useMemo(() => {
        return images.map((image, i) => {
        let url = `http://localhost:4321${image}`;
        const img = new Image();
        img.src = url;
        const width = img.width;
        const height = img.height;
        return { src: url, width: width, height: height };
        });
    }, [images]);

  const photos = useMemo(() => {
    return images.map((image, i) => {
      return { src: `http://localhost:4321${image}` };
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
          `http://localhost:4321/albums/${title}/images`,
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

  const photoFrame = ({ layout, layoutOptions, imageProps: { alt, style, ...restImageProps } }) => (
    <div
        style={{
            border: "2px solid #eee",
            borderRadius: "4px",
            boxSizing: "content-box",
            alignItems: "center",
            width: style?.width,
            padding: `20px`,
            margin: "5px",
        }}
    >
        <img alt={alt} style={{ ...style, width: "100%"}} {...restImageProps} />
    </div>
);

  return (
    <div className="mx-auto px-8 sm:px-10 lg:px-12">
      <div className="flex justify-between items-center">
        <div className="flex">
          <h1 className="text-2xl font-bold">{title}</h1>
          <button className="px-10" onClick={handleFileUpload}>
            <span className="text-sm font-semibold">Add Photo</span>
          </button>
        </div>
        <div className="flex items-center">
          <CloseIcon className="" onClick={onBackClick}></CloseIcon>
        </div>
      </div>
      <PhotoAlbum
        photos={thumbnails}
        layout="rows"
        spacing={5}
        onClick={({ index }) => setIndex(index)}
        renderContainer={albumContainer}
        renderPhoto={photoFrame}
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

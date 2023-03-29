import { Modal } from "./Modal";

export const ImageViewer = ({ selectedImage, setSelectedImage }) => {
  return (
    selectedImage && (
      <Modal callbackFn={() => setSelectedImage(null)}>
        <img className="object-contain" src={`http://localhost:4321${selectedImage}`} />
      </Modal>
    )
  );
};

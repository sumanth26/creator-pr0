import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineDeleteOutline,MdOutlineFileUpload } from "react-icons/md";
import { FaPen } from "react-icons/fa";
export const ProfileImageModal = ({
  image,
  name,
  handleUpload,
  handleUpdate,
  handleUpdateFileChange,
  handleRemove,
  handleFileChange,
  fileInputRef,
  fileUpdateRef,
  uploading,
  setUploading,
}) => {
  // console.log(image);
  return (
    <Dialog.Root placement={"center"}>
      <Dialog.Trigger asChild>
        <Avatar className="h-14 w-14  mr-4">
          <AvatarImage src={image} className="object-cover" />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin={10}>
            <Dialog.Header>
              {/* <Dialog.Title>Dialog Title</Dialog.Title> */}
            </Dialog.Header>
            <Dialog.Body>
              <div className="flex-col flex justify-center items-center">
                <Avatar className="h-[200px] w-[200px] border-2 text-3xl">
                  <AvatarImage src={image} className="object-cover" />
                  <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
                {/* file input hidden */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileUpdateRef}
                  onChange={handleUpdateFileChange}
                  className="hidden"
                />
                {image === "" ? (
                  <button
                    className="mt-4 border border-white px-4 py-2 rounded-xl bg-[#f2fce1]"
                    onClick={handleUpload}
                  >
                    {uploading ? "Pleas Wait.." : <MdOutlineFileUpload  size={"20px"}/>}
                  </button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    {uploading ? (
                      "pleas wait"
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="mt-4 border border-white px-4 py-2 rounded-xl bg-[#f2fce1]"
                          onClick={handleUpdate}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="mt-4 border border-white px-4 py-2 rounded-xl bg-[#f2fce1]"
                          onClick={handleRemove}
                        >
                          {uploading ? (
                            "Pleas Wait.."
                          ) : (
                            <MdOutlineDeleteOutline size={"18px"} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" color={"white"}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              {/* <Button>Save</Button> */}
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

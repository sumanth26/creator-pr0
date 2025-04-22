import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOffering,
  deleteOffering,
  updateOffering,
} from "@/Redux/offeringsSlice";
import { AppDispatch, RootState } from "@/Redux/store";
import { Input, InputGroup } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BsCurrencyRupee } from "react-icons/bs";
import { Edit } from "lucide-react";

const EditOfferings = ({ offering }: { offering: any }) => {
  const [title, setTitle] = useState(offering.title);
  const [description, setDescription] = useState(offering.description);
  const [price, setPrice] = useState<number>(offering.price);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleteing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const isDisabled = !title || !description || !price;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateOffering({
          id: offering.id,
          title,
          description,
          price,
        })
      ).unwrap();

      toast({
        title: "Offering updated successfully!",

        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error updating offering",
        description: error.message || "Something went wrong",

        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteing(true);
    try {
      await dispatch(deleteOffering(offering.id)).unwrap();
      toast({
        title: "Offering deleted successfully!",

        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error deleting offering",
        description: error.message || "Something went wrong",
        duration: 3000,
      });
    } finally {
      setDeleteing(false);
    }
  };

  return (
    <Dialog.Root placement={"center"}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin={10}>
            <Dialog.Header />
            <Dialog.Body>
              <div className="flex-col flex gap-5">
                <div>
                  <p className="ml-1">Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border w-full rounded-xl h-[50px] mt-1 px-2"
                  />
                </div>
                <div>
                  <p className="ml-1">Description</p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border w-full mt-1 rounded-xl h-[105px] px-2 py-2"
                  />
                </div>
                <div>
                  <p className="ml-1">Price</p>
                  <InputGroup startElement={<BsCurrencyRupee />}>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="border w-full rounded-xl h-[50px] mt-1 px-2"
                    />
                  </InputGroup>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handleUpdate}
                    className={`bg-primary h-[55px] rounded-2xl w-1/2 ${
                      loading || isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={loading || isDisabled}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`bg-primary h-[55px] rounded-2xl w-1/2 ${
                      deleting || isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={deleting || isDisabled}
                  >
                    {loading ? "Deleting" : "Delete"}
                  </button>
                </div>
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" color={"white"}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
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

export default EditOfferings;

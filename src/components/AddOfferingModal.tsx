import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOffering } from "@/Redux/offeringsSlice";
import { AppDispatch, RootState } from "@/Redux/store";
import { Input, InputGroup } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BsCurrencyRupee } from "react-icons/bs";
import { Select } from "@radix-ui/react-select";

const priceOptions = [
  19, 29, 39, 49, 59, 99, 199, 249, 299, 399, 499, 599, 999,
];
const AddOfferingModal = ({ buttonName }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(priceOptions[0]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);
  //   console.log(user)
  const isFormValid =
    title.trim() !== "" && description.trim() !== "" && price > 0;

  const handleAddOffering = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await dispatch(
        addOffering({
          user_id: user.id,
          title,
          description,
          price,
        })
      ).unwrap();

      toast({
        title: "Offering added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPrice(0);
    } catch (error: any) {
      toast({
        title: "Error adding offering",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog.Root placement={"center"}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          {buttonName}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin={10}>
            <Dialog.Header>
              {/* <Dialog.Title>Dialog Title</Dialog.Title> */}
            </Dialog.Header>
            <Dialog.Body>
              <div className="flex-col flex gap-5">
                <div>
                  <p className="ml-1">Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="border w-full rounded-xl h-[50px] mt-1 px-2"
                  />
                </div>
                <div>
                  <p className="ml-1">Description</p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="border w-full mt-1 rounded-xl h-[105px] px-2 py-2"
                  />
                </div>
                <div>
                  <p className="ml-1">Price</p>
                  <select
                    className="border w-full mt-1 rounded-xl h-[50px] px-2 py-2"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  >
                    {priceOptions.map((ele, i) => {
                      return <option value={ele} key={i}>₹{ele}</option>;
                    })}
                  </select>
                  {/* <InputGroup startElement={<BsCurrencyRupee />}>
                    <Input
                      placeholder="Price"
                      type="number"
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="border w-full rounded-xl h-[50px] mt-1 px-2"
                    />
                  </InputGroup> */}
                </div>

                <button
                  onClick={handleAddOffering}
                  className={`bg-primary h-[55px] rounded-2xl text-white ${
                    loading || !isFormValid
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={loading || !isFormValid}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
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

export default AddOfferingModal;

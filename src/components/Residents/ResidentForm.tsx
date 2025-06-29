import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogActionNoClose,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHouse } from "@/services/houseServices";
import { useEffect, useState } from "react";
import {
  fetchBlocksByPhase,
  fetchLotsByBlock,
  fetchStreetsByPhase,
} from "@/services/subdivisionServices";
import useHouseSearchParams from "@/hooks/useHouseSearchParams";
import { Button } from "../ui/button";
import { usePhaseContext } from "@/context/phaseContext";
import { Icon } from "@iconify/react";
import CustomReactSelect from "../CustomReactSelect";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Lot, Phase } from "@/types/subdivisionTypes";
import { houseSchema, HouseSchemaType } from "@/validations/houseSchema";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";

const ResidentForm = () => {
  const { phases } = usePhaseContext();
  const { selectedBlock, selectedStreet, selectedPhase, selectedLot } =
    useHouseSearchParams();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<HouseSchemaType>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      familyName: "",
      phase: "",
      street: "",
      block: "",
      lot: [],
      latestPaymentDate: "",
      latestPaymentAmount: 0,
      mainLot: "",
    },
    mode: "onChange",
  });

  // Watch for lot changes to update the local state and set default mainLot if needed
  const watchedLots = form.watch("lot");
  useEffect(() => {
    if (Array.isArray(watchedLots)) {
      // Set first lot as main lot if no main lot is selected or if the current main lot isn't in the selected lots
      const currentMainLot = form.getValues("mainLot");
      if (
        watchedLots &&
        (!currentMainLot || !watchedLots.includes(currentMainLot))
      ) {
        form.setValue("mainLot", watchedLots[0]);
      } else if (watchedLots.length === 0) {
        form.setValue("mainLot", "");
      }
    }
  }, [watchedLots, form]);

  const addHouseMutation = useMutation({
    mutationFn: addHouse,
    onError: (error) => {
      toast({
        title: "Error Adding House",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "House unit added successfully",
        variant: "default",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "houses",
          selectedPhase,
          selectedBlock,
          selectedStreet,
          selectedLot,
        ],
      });
      form.reset();
      setDialogOpen(false);
    },
  });

  const handleSubmit = (values: HouseSchemaType) => {
    addHouseMutation.mutate(values);
  };

  const watchedPhase = form.watch("phase");
  const watchedBlock = form.watch("block");

  // Fetch form-specific blocks when phase changes in the form
  const {
    data: formBlocks,
    isLoading: isBlocksLoading,
    error: blocksError,
  } = useQuery({
    queryKey: ["form-blocks", watchedPhase],
    queryFn: async () => await fetchBlocksByPhase(watchedPhase),
    enabled: !!watchedPhase,
  });

  // Fetch form-specific streets when phase changes in the form
  const {
    data: formStreets,
    isLoading: isStreetsLoading,
    error: streetsError,
  } = useQuery({
    queryKey: ["form-streets", watchedPhase],
    queryFn: async () => await fetchStreetsByPhase(watchedPhase),
    enabled: !!watchedPhase,
  });

  // Fetch form-specific lots when block changes in the form
  const {
    data: formLots,
    isLoading: isLotsLoading,
    error: lotsError,
  } = useQuery({
    queryKey: ["form-lots", watchedBlock],
    queryFn: async () => await fetchLotsByBlock(watchedBlock),
    enabled: !!watchedBlock,
  });

  const selectOptions = formLots?.map((lot: Lot) => ({
    label: lot.name,
    value: lot.id,
  }));

  useEffect(() => {
    if (watchedPhase) {
      form.setValue("block", "");
      form.setValue("street", "");
      form.setValue("lot", []);
      form.setValue("mainLot", "");
    }
  }, [form, watchedPhase]);

  useEffect(() => {
    if (watchedBlock) {
      form.setValue("lot", []);
      form.setValue("mainLot", "");
    }
  }, [form, watchedBlock]);

  useEffect(() => {
    if (blocksError || streetsError || lotsError) {
      toast({
        title: "Error Loading Data",
        description: "Failed to fetch some data. Please try again.",
        variant: "destructive",
      });
    }
  }, [blocksError, streetsError, lotsError]);

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild className="absolute z-20 right-3 bottom-3">
        <Button variant={"default"} size="lg">
          <span className="mr-2">Add House Unit</span>
          {addHouseMutation.isPending && (
            <Icon
              icon="mingcute:loading-fill"
              className="h-5 w-5 animate-spin"
            />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg max-h-[80%] overflow-y-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle>Create House Unit</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out the details below to add a new house unit to the
            subdivision.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <AlertDialogBody>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter family name"
                          className="input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {phases.map((phase: Phase) => (
                              <SelectItem key={phase.id} value={phase.id}>
                                {phase.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!watchedPhase || isStreetsLoading}
                          >
                            <SelectTrigger className="w-full">
                              {isStreetsLoading ? (
                                <div className="flex items-center">
                                  <Icon
                                    icon="mingcute:loading-line"
                                    className="h-4 w-4 animate-spin mr-2"
                                  />
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                <SelectValue placeholder="Select Street" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {formStreets?.length === 0 && (
                                <p className="p-2">No streets available</p>
                              )}

                              {formStreets?.map((street) => (
                                <SelectItem key={street.id} value={street.id}>
                                  {street.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Block</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!watchedPhase || isBlocksLoading}
                          >
                            <SelectTrigger className="w-full">
                              {isBlocksLoading ? (
                                <div className="flex items-center">
                                  <Icon
                                    icon="mingcute:loading-line"
                                    className="h-4 w-4 animate-spin mr-2"
                                  />
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                <SelectValue placeholder="Select Block" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {formBlocks?.length === 0 && (
                                <p className=" p-2">No blocks available</p>
                              )}
                              {formBlocks?.map((block) => (
                                <SelectItem key={block.id} value={block.id}>
                                  {block.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Lots</FormLabel>
                      <FormControl>
                        <CustomReactSelect
                          showSelectAll={true}
                          options={selectOptions}
                          value={selectOptions?.filter((option) =>
                            Array.isArray(field.value)
                              ? field.value.some(
                                  (val) => String(val) === String(option.value)
                                )
                              : false
                          )}
                          onChange={(selectedOptions) => {
                            const lotValues =
                              selectedOptions?.map((option) => option.value) ||
                              [];
                            field.onChange(lotValues);
                          }}
                          isLoading={isLotsLoading}
                          isDisabled={!watchedBlock || isLotsLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Main Lot Selection */}
                {watchedLots.length > 0 && (
                  <FormField
                    control={form.control}
                    name="mainLot"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Main Lot</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {watchedLots.map((lotId: string) => {
                              const lotOption = selectOptions?.find(
                                (opt) => String(opt.value) === String(lotId)
                              );
                              return (
                                <div
                                  key={lotId}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={lotId}
                                    id={`lot-${lotId}`}
                                    checked={field.value === lotId}
                                  />
                                  <Label
                                    htmlFor={`lot-${lotId}`}
                                    className="cursor-pointer"
                                  >
                                    {lotOption?.label || lotId}
                                  </Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="latestPaymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Latest Payment Date{" "}
                          <span className="text-2xs">
                            (Leave blank if not paid yet)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Popover
                            modal={true}
                            open={open}
                            onOpenChange={setOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                              >
                                {field.value ? field.value : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(
                                      date.toLocaleDateString("en-PH")
                                    );
                                  } else {
                                    field.onChange("");
                                  }
                                }}
                                className="rounded-lg border"
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="latestPaymentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latest Payment Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Latest Payment Amount"
                            className="input"
                            min={0}
                            value={field.value < 0 ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange("");
                              } else if (!isNaN(Number(value))) {
                                field.onChange(Number(value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AlertDialogBody>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => form.reset()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogActionNoClose
                type="submit"
                disabled={addHouseMutation.isPending}
              >
                {addHouseMutation.isPending ? (
                  <>
                    <Icon
                      icon="mingcute:loading-fill"
                      className="h-4 w-4 animate-spin mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  "Add House"
                )}
              </AlertDialogActionNoClose>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResidentForm;

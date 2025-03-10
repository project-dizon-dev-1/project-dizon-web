import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitial } from "@/lib/utils";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { AnnouncementHeaderProps } from "@/types/announcementTypes";
import AnnouncementForm from "./AnnouncementForm";

const AnnouncementHeader = ({ image, first_name }: AnnouncementHeaderProps) => {
  return (
    <>
      <div className="flex h-[84px] w-full  gap-2 rounded-[10px] border-primary-outline bg-white px-8 py-6">
        <Avatar className="h-8 w-8 bg-default">
          <AvatarImage src={image ?? ""} alt="profile picture" />
          <AvatarFallback className="text-default">
            {getInitial(first_name)}
          </AvatarFallback>
        </Avatar>

        <AnnouncementForm>
          <div className="flex w-full gap-2">
            <Input
              className=" rounded-[18px] bg-default border-none"
              placeholder="Announce something publicly."
            />
            <Button className="h-9 w-14 rounded-[18px] bg-default hover:bg-default shadow-none">
              <Icon className="text-default" icon="mingcute:photo-album-fill" />
            </Button>
          </div>
        </AnnouncementForm>
      </div>
      <div className="flex w-full items-center justify-center overflow-hidden py-5">
        <Separator className=" bg-[#DCDFEA]" />
        <p className="px-2 text-[#DCDFEA]">Announcements</p>
        <Separator className=" bg-[#DCDFEA]" />
      </div>
    </>
  );
};

export default AnnouncementHeader;

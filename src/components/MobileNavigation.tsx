import { SIDEBAR_LINKS } from "@/constants/sidebarLinks";
import useUserContext from "@/hooks/useUserContext";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Link } from "react-router";

const MobileNavigation = () => {
  const { user } = useUserContext();
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };
  return (
    <div className="absolute flex items-center w-full justify-center bottom-10 left-1/2 transform -translate-x-1/2 z-50">
      <div
        style={{
          transitionTimingFunction: navOpen
            ? "cubic-bezier(0.68, 0.70, 0.265, 2)"
            : "ease-in-out",
        }}
        className={cn(
          "flex flex-wrap justify-evenly gap-4 pt-8 px-11 h-[550px] sm:h-[300px]  p-5  pb-20 max-w-[612px] w-[612px] duration-500 transition-all bg-white shadow-lg rounded-[50px] z-40",
          {
            " h-0 w-0 p-0 opacity-0 sm:h-0": !navOpen,
          }
        )}
      >
        {SIDEBAR_LINKS[user?.role === "admin" ? "admin" : "resident"].map(
          (link) => (
            <Link
              key={link.label}
              to={link.link}
              onClick={toggleNav}
              className={cn(
                " opacity-0 flex-col items-center gap-2 text-2xs font-semibold py-2 text-nowrap flex transition-all duration-1000 ",
                { "opacity-100 ": navOpen }
              )}
            >
              <Icon icon={link.icon} className="w-5 h-5" />
              {link.label}
            </Link>
          )
        )}
        {SIDEBAR_LINKS["finance"].map((link) => (
          <Link
            key={link.label}
            to={link.link}
            onClick={toggleNav}
            className={cn(
              "opacity-0 flex-col items-center gap-2 text-2xs font-semibold py-2 text-nowrap flex transition-all duration-1000 ",
              { "opacity-100 ": navOpen }
            )}
          >
            <Icon icon={link.icon} className="w-5 h-5" />
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={toggleNav}
        className={cn(
          "absolute flex gap-1 flex-col items-center justify-center text-2xs font-bold w-[96px] h-[78px] right-5 z-50 bg-background bottom-2 left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-lg",
          { "bg-white": !navOpen }
        )}
      >
        <div className="relative h-5 w-5">
          <Icon
            className={cn("absolute top-0 left-0 w-5 h-5 transition-all", {
              "rotate-180 duration-1000": navOpen,
              "opacity-0 duration-1000 ": navOpen,
              "opacity-100 duration-1000 ": !navOpen,
            })}
            icon={"mingcute:classify-fill"}
          />
          <Icon
            className={cn("absolute top-0 left-0 w-5 h-5 transition-all", {
              "rotate-180 duration-1000": navOpen,
              "opacity-100 duration-1000 ": navOpen,
              "opacity-0 duration-1000 rotate-0 ": !navOpen,
            })}
            icon={"mingcute:close-fill"}
          />
        </div>
        {navOpen ? "Close" : "Menu"}
      </button>
    </div>
  );
};

export default MobileNavigation;

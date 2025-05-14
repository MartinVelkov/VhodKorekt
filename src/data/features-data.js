import { UserGroupIcon } from "@heroicons/react/24/solid";
import novo from "../img/novo-stroitelstvo.jpg";
import staro from "../img/staro.jpg"
import kompleks from "../img/kompleks.jpg"
import stroi from "../img/stroi.jpg"

export const featuresData = [
  {
    color: "gray",
    title: "Старо строителство",
    icon: UserGroupIcon,
    photo: staro, // pass photo as string (image path)
  },
  {
    color: "gray",
    title: "Ново Строителство",
    icon: UserGroupIcon,
    photo: novo, // pass photo as string (image path)
  },
  {
    color: "gray",
    title: "За комплекси",
    icon: UserGroupIcon,
    photo: kompleks, // pass photo as string (image path)
  },
  {
    color: "gray",
    title: "За строителни и инвестиционни компании",
    icon: UserGroupIcon,
    photo: stroi, // pass photo as string (image path)
  },
];

export default featuresData;

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tourService } from "@/services/tour.service";

export function useTour(routeName) {
  let steps = [];
  if (routeName === "home") {
    steps = tourService.getStepsByRoute(routeName);
  }
  if (routeName === "list") {
    steps = tourService.getStepsByRoute(routeName);
  }
  if (routeName === "list-summary") {
    steps = tourService.getStepsByRoute(routeName);
  }

  const driverObj = driver({
    showProgress: true,
    steps,
  });

  driverObj.drive();
}

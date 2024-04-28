import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function useTour(routeName) {
  let steps = [];
  console.log(routeName);

  if (routeName === "home") {
    steps = getStepsByRoute(routeName);
  }
    if (routeName === "list") {
      steps = getStepsByRoute(routeName);
    }
  //   if (routeName === "list-summary") {
  //     steps = getStepsByRoute(routeName);
  //   }

  console.log(steps);
  const driverObj = driver({
    showProgress: true,
    steps,
  });

  driverObj.drive();
}

function getStepsByRoute(routeName) {
  const stepsMap = {
    home: [
      {
        element: "#welcome-view",
        popover: {
          title: "First timer",
          description:
            'This is the home page. Click on the button to start the tour, or click on the "i\'m at home here" to go to the list page',
        },
      },
      {
        element: "#language-modal",
        popover: {
          title: "Language Select",
          description:
            "This is the language select button. Click on it to change the language of the app",
        },
      },
    ],

    list: [
      {
        element: "#list-container",
        popover: {
          title: "Product List",
          description:
            "This is the group details. Click on the group name to see the group items. you can activate or deactivate the item by swiping it",
          //   position: "bottom",
        },
      },
      {
        element: "#footer-container",
        popover: {
          title: "Done",
          description:
            "When you finish with the list, click on the done button to see the summary of the list",
        },
      },
    ],

    "list-summary": [
      {
        element: "list-container",
        popover: {
          title: "Summary",
          description: "This is a simple summary for you'r product list.",
          position: "bottom",
        },
        element: "chart-container",
        popover: {
          title: "Summary",
          description:
            "This is a chart summary for you'r products. it will help you to gain more insights about you'r products.",
          position: "bottom",
        },
      },
    ],
  };
  return stepsMap[routeName];
}

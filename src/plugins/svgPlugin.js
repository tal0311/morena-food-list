import { svgService } from "@/services/svg.service";

export default {
    install: (app) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$svg = (iconName) =>  svgService.getSvg(iconName)     }
    }
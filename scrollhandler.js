"use strict";

import { eventBus } from "@/services/event-bus.service.js";

window.onUserScroll = onUserScroll;

function onUserScroll(ev) {
  
    eventBus.emit("userScroll");
}

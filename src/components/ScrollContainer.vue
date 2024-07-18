<template>
    <section class="sc">
        <button :disabled="isAtScrollStart" aria-label="button" @click="scrollSection(1)">
            <span v-html="indicator.right"></span>
        </button>
        <section class="sl" ref="sectionRef">
            <slot></slot>
        </section>
        <button :disabled="isAtScrollEnd" aria-label="button" @click="scrollSection(-1)">
            <span v-html="indicator.left"></span>
        </button>
    </section>


</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default: () => ({
            arrowType: 'chevron',
            scrollType: 'smooth',
            scrollLength: 200,
            firstElClass: '',
            lastElClass: '',
            isIndicatorDisplayedAtScrollEnd: false
        })
    }
});

const isAtScrollEnd = ref(false);
const isAtScrollStart = ref(false);
const observer = ref(null);
const sectionRef = ref(null);

onMounted(() => {
    if (sectionRef.value && props.options.isIndicatorDisplayedAtScrollEnd) {
        setObserver();
    }
});

onBeforeUnmount(() => {
    if (sectionRef.value && observer.value) {
        observer.value.disconnect();
    }
});
const setObserver = () => {
    const options = {
        root: sectionRef.value,
        rootMargin: "0px",
        threshold: 1.0
    };
    const { lastElClass, firstElClass } = props.options
    const lastEl = document.querySelector('.' + lastElClass);
    const firstEl = document.querySelector('.' + firstElClass);
    observer.value = new IntersectionObserver(callback, options);
    observer.value.observe(firstEl);
    observer.value.observe(lastEl);
};
const callback = (entries) => {
    entries.forEach((entry) => {
        const { firstElClass, lastElClass } = props.options
        const classList = Array.from(entry.target.classList)

        if (classList.includes(firstElClass))
            if (entry.isIntersecting) {
                console.debug('Reached the start of the scroll.');
                isAtScrollStart.value = true;
            } else {
                isAtScrollStart.value = false;
            }

        if (classList.includes(lastElClass)) {
            if (entry.isIntersecting) {
                console.debug('Reached the end of the scroll.');
                isAtScrollEnd.value = true;
            } else {
                isAtScrollEnd.value = false;
            }
        }
    });
};
function scrollSection(direction) {
    if (!sectionRef.value) return;
    sectionRef.value.scrollBy({
        left: direction * (props.options.scrollLength || 200),
        behavior: props.options.scrollType || 'smooth'
    });
}
const indicator = computed(() => {
    const arrows = {
        ios: {
            left: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>`,
            right: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>`
        },
        small: {
            left: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-280 360-480l200-200v400Z"/></svg>`,
            right: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M400-280v-400l200 200-200 200Z"/></svg>`
        },
        chevron: {
            left: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>`,
            right: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
        }
    };
    return arrows[props.arrowType] || arrows.ios;
});
</script>
<style scope>
.sc {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    overflow-x: hidden;
    width: 100%;
    justify-content: center;
}

section.sl {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    overflow-x: auto;
}

section.sl::-webkit-scrollbar {
    display: none;
}

div.item {
    background-color: #333;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 5rem;
    width: 200px;
    height: 100px;
}

.sc button {
    position: relative;
    display: grid;
    place-content: center;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
}

.sc button:disabled {
    opacity: 0%;
}

.sc button:first-of-type {
    margin-right: -1rem;
    padding: 0;
    background-color: transparent;
}

.sc button:last-of-type {
    padding: 0;
    margin-left: -1rem;
    background-color: transparent;
}
</style>
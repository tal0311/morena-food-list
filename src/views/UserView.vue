<template>
    <section class="user-page">
        <details>
            <summary>User Info</summary>
            <section class="summary-container">
                <div>
                    user info container
                </div>

            </section>
        </details>

        <details>
            <summary>Goals and preferences</summary>
            <section class="summary-container">
                <div>
                    user lavel , goals, etc
                </div>

            </section>
        </details>

        <details>
            <summary>settings</summary>
            <section class="summary-container">
                <div>
                    lang, notifications, etc
                </div>

            </section>
        </details>

        
    </section>
</template>

<script setup></script>

<style scoped>

details {
    width: 100%;
    box-shadow: 0 0 2px 0px var(--clr4);
    /* outline: 1px solid #c9c9c9; */
    border-radius: 2px;
    padding: 0.5em 0.5em 0;

    summary {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        position: relative;
        font-weight: bold;
        margin: -0.5em -0.5em 0;
        padding: 0.5em;
        color: var(--clr7);
        text-transform: capitalize;
        font-size: 1.5rem;
        cursor: pointer;

        &::marker {
            color: var(--clr7);


            /* content:'' */
        }

        &.has-items .counter {
            color: var(--bClr3);
        }

    }

    &[open] {
        padding: 0.5em;
    }

    &[open] summary {
        /* box-shadow: 0 0 2px 0px #c9c9c9; */
        margin-bottom: 0.5em;
    }


}


details>summary {
 
 list-style: none;
}
summary::-webkit-details-marker {
 display: none
}

summary::after {
 content: " ►";
}
details[open] summary:after {
 content: " ▼";
}
</style>
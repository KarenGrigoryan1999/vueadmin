<template>
    <div class="loader">
        <img class="loader__picture" src="../../assets/logo.png" />
        <h1>{{ titleVariants[idx] }}</h1>
    </div>
</template>

<script>
    export default {
        name: 'Loader',
        data() {
            return {
                titleVariants: [
                    'Ищем данные...',
                    'Грузим инфу...',
                    'Одна нога тут другая там ;-)',
                    'Бежим со всех ног...'
                ],
            }
        },
        computed: {
            idx: (state) => Math.floor(Math.random() * (state.titleVariants.length))
        }
    }
</script>

<style scoped lang="scss">
    .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;

        width: 100%;
        height: 100vh;

        &__picture {
            width: 150px;
            animation: blinker 1s linear infinite;
        }
    }
    @keyframes blinker {
        50% {
            opacity: 0;
        }
    }
</style>
<template>
    <Dialog :open="isOpen" @close="setIsOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen">
            <DialogOverlay class="bg-dark w-full bg-opacity-80 h-full absolute inset-0" />
            <div :class="['relative w-full mx-auto px-4', maxWidth]">
                <div :class="['px-10 py-6 space-y-4', 'bg-dark text-grey-light shadow-xl rounded-xl']">
                    <div class="space-y-1">
                        <DialogTitle v-if="title" class="text-xl">{{ title }}</DialogTitle>
                        <DialogDescription v-if="description">{{ description }}</DialogDescription>
                    </div>

                    <slot name="body" :setIsOpen="setIsOpen">
                        <p v-if="content" class="py-4">
                            {{ content }}
                        </p>
                    </slot>
                    <Button
                        v-if="hasConfirmBtn"
                        @click="setIsOpen(false)"
                        padding="py-2 px-6"
                        class="ml-auto"
                        theme="highlight"
                    >
                        好的
                    </Button>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script>
import { ref } from "vue";
import Button from "@/components/elements/Button.vue";
import { Dialog, DialogOverlay, DialogTitle, DialogDescription } from "@headlessui/vue";

export default {
    components: { Dialog, DialogOverlay, DialogTitle, DialogDescription, Button },

    props: {
        title: String,
        description: String,
        content: String,
        hasConfirmBtn: {
            type: Boolean,
            default: true,
        },
        maxWidth: {
            type: String,
            default: "max-w-sm ",
        },
    },

    setup() {
        // The open/closed state lives outside of the Dialog and
        // is managed by you.
        let isOpen = ref(false);

        return {
            isOpen,
            setIsOpen(value) {
                isOpen.value = value;
            },
        };
    },
};
</script>

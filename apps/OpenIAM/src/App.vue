<template>
    <Toast position="bottom-right"/>
    <ConfirmPopup class="max-w-20rem" group="default">
        <template #message="slotProps">
            <div class="flex flex-column px-3 pt-3 pb-3 gap-2">
                <div class="flex align-items-center gap-2">
                    <i :class="slotProps.message.icon" class="pt-1 text-lg text-primary-500"/>
                    <p>{{ slotProps.message.header }}</p>
                </div>
                <p v-if="slotProps.message.message">{{ "\b" + slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmPopup>
    <router-view/>
</template>
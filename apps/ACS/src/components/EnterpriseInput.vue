<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
    dataName: string,
    dataValue: string | undefined,
    dataDesc: string,
    isEnc?: boolean
}>();

const emit = defineEmits(['update:dataValue']);

const localDataValue = ref(props.dataValue);

watch(() => props.dataValue, (newValue) => {
    localDataValue.value = newValue;
});

const updateDataValue = (value: string) => {
    localDataValue.value = value;
    emit('update:dataValue', value);
};
</script>

<template>
    <div class="field col mb-0">
        <label for="dataName">{{ props.dataName }}</label>
        <InputText
            v-if="!props.isEnc"
            :id="props.dataName"
            type="text"
            v-model="localDataValue"
            @input="updateDataValue.data"
        />
        <Password v-else :id="props.dataName" type="text" v-model="localDataValue" @input="updateDataValue.data" toggleMask>
            <template #content>
                <h6 class="pb-0 mb-0">{{ props.dataDesc }}</h6>
            </template>
        </Password>
        <small v-if="!props.isEnc">{{ props.dataDesc }}</small>
    </div>
</template>

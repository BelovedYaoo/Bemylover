<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import request from '@/service/request';
import { AxiosResponse } from 'axios';
import { BaseFiled } from 'agility-core/src/types/base';

interface IAuthApp extends BaseFiled {
    clientName: string;
    clientId: string;
    clientSecret: string;
    contractScopes: Array<string>;
    allowRedirectUris: Array<string>;
    allowGrantTypes: Array<string>;
    isNewRefresh: boolean;
    accessTokenTimeout: number;
    refreshTokenTimeout: number;
    clientTokenTimeout: number;
    lowerClientTokenTimeout: number;
}

onBeforeMount(() => {
    dataInit();
});

// 数据初始化
const authAppList = ref<IAuthApp[]>([]);
const dataInit = () => {
    request({
        url: '/authApp/queryAll',
        method: 'GET'
    }).then((response: AxiosResponse) => {
        authAppList.value = response.data.data as Array<IAuthApp>;
    });
};
</script>

<template>
    <div class="col-12 sm:col-4 xl:col-3">
        <div class="h-full card">
            <div class="p-input-icon-right w-full mb-4">
                <InputText
                    class="w-full"
                    placeholder="搜索..."
                />
                <i class="pi pi-search"/>
            </div>
        </div>
    </div>
    <div class="col-12 sm:col-8 xl:col-9 h-full">
        <div class="h-full card">
            <TabView :pt="{
        panelContainer: 'flex min-h-0'
    }" class="h-full flex flex-column">
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="public/images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">Amy Elsner</span>
                        </div>
                    </template>
                    <ScrollPanel class="h-full">
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                            eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia
                            deserunt mollit anim id est laborum.
                        </p>
                    </ScrollPanel>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="public/images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">Onyama Limba</span>
                        </div>
                    </template>
                    <p class="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                        architecto
                        beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                        magni
                        dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                        numquam eius modi.
                    </p>
                </TabPanel>
                <TabPanel>
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <Avatar image="public/images/logo.svg" shape="circle"/>
                            <span class="font-bold white-space-nowrap">Ioni Bowcher</span>
                            <Badge value="2"/>
                        </div>
                    </template>
                    <p class="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                        voluptatum
                        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate
                        non
                        provident, similique sunt in culpa qui
                        officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
                        facilis
                        est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
                        nihil
                        impedit quo minus.
                    </p>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<style scoped>
</style>
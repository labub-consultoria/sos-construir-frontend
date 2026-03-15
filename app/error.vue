<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const PHONENUMBER = '5545999976544'
const EMAIL = 'contato@sosconstruir.com.br'
const whatsappMessage = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para minha obra.')

const formatWhatsappLink = (phone: string, message: string) => `https://wa.me/${phone}?text=${message}`

const isDevelopment = import.meta.env.DEV

const errorMessages: Record<number, { title: string; description: string; icon: string }> = {
    404: {
        title: 'Página Não Encontrada',
        description: 'Desculpe, a página que você procura não existe. Mas nossa equipe está pronta para ajudar!',
        icon: 'i-mdi-emoticon-sad-outline',
    },
    500: {
        title: 'Erro Interno',
        description: 'Algo deu errado no nosso servidor. Nossa equipe já foi notificada.',
        icon: 'i-mdi-alert-circle-outline',
    },
}

const currentErrorMessage = computed(() => {
    const status = props.error.status || 500
    return errorMessages[status] || {
        title: `Erro ${status}`,
        description: props.error.message || 'Algo deu errado. Nossa equipe está pronta para ajudar!',
        icon: 'i-mdi-alert-circle-outline',
    }
})
const meta = computed(() => ({
    title: `${currentErrorMessage.value.title} | SOS Construir`,
    description: currentErrorMessage.value.description,
    ogImage: '/og-image.jpg',
}))

useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,

    robots: 'noindex, nofollow',

    // Open Graph
    ogType: 'website',
    ogLocale: 'pt_BR',
    ogSiteName: 'SOS Construir',
    ogTitle: () => meta.value.title,
    ogDescription: () => meta.value.description,
    ogImage: meta.value.ogImage,
    ogImageAlt: 'Página de Erro - SOS Construir',

    // Twitter / X
    twitterSite: '@sosconstruir',
    twitterTitle: () => meta.value.title,
    twitterDescription: () => meta.value.description,
    twitterImage: meta.value.ogImage,
    twitterCard: 'summary_large_image',
})
const errorWhatsappLink = computed(() => {
    return `https://wa.me/${PHONENUMBER}?text=${whatsappMessage}`
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <UApp>
        <AppHeader :cta-link="formatWhatsappLink(PHONENUMBER, whatsappMessage)" cta-text="Solicitar Orçamento" />

        <main class="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-t from-white to-gray-50">
            <div class="max-w-2xl w-full text-center space-y-8">

                <div class="relative inline-flex justify-center items-center">
                    <div class="relative bg-orange-100/50 p-6 rounded-full flex items-center justify-center">
                        <UIcon :name="currentErrorMessage.icon" class="w-16 h-16 text-orange-500" />
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="text-orange-500 font-bold text-xs tracking-widest uppercase">
                        ERRO {{ error.status || 500 }}
                    </div>
                    <h1 class="text-6xl font-extrabold text-blue-500 mb-4">
                        {{ currentErrorMessage.title }}
                    </h1>
                    <p class="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                        {{ currentErrorMessage.description }}
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <UButton variant="ghost" size="xl" class="px-8 py-3" @click="handleError" icon="mdi:arrow-left">
                        Voltar à Home
                    </UButton>
                    <UButton :to="errorWhatsappLink" target="_blank" color="primary" size="xl"
                        class="font-bold px-8 py-3" icon="i-mdi-chat-outline">
                        Fale com a SOS (WhatsApp)
                    </UButton>
                </div>
                <div v-if="isDevelopment"
                    class="text-left text-sm text-gray-500 mt-6 p-4 bg-gray-100 rounded-lg overflow-auto">
                    <p class="font-bold border-b mb-2 pb-1">Debug Info:</p>
                    <p class="font-mono">{{ error.message }}</p>
                    <p v-if="error.stack" class="font-mono text-[10px] mt-2 whitespace-pre" v-html="error.stack"></p>
                </div>
            </div>
        </main>

        <AppFooter :email="EMAIL" :phone-number="PHONENUMBER"
            :whatsapp-link="formatWhatsappLink(PHONENUMBER, whatsappMessage)" />
    </UApp>
</template>
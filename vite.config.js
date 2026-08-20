import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                fr: resolve(__dirname, 'fr/index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                menu: resolve(__dirname, 'menu.html'),
                events: resolve(__dirname, 'events.html'),
                catering: resolve(__dirname, 'catering.html'),
                blog: resolve(__dirname, 'blog.html'),
                location: resolve(__dirname, 'location.html'),
            },
        },
    },
})

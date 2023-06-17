import {resolve} from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@':resolve(__dirname, './src')
    }
  },
  css:{
    devSourcemap:true,
  },
  server:{
    host:'0.0.0.0',
    open:false,
  },
  build:{
    rollupOptions:{
      output:{
        manualChunks:(id:string)=>{
          if(id.includes('node_modules')){
            return "vendor"
          }
        }
      }
    }
  }
})

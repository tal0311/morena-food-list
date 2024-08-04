const prodConfig = {
    MODE: 'production',
    VITE_DATA_URL:"https://cdn.jsdelivr.net/gh/tal0311/grocery-list/src/data/item.json",
    VITE_PROD_URL:"https://tal0311.github.io/morena-food-list/#/list",
    VITE_G_CLIENT_ID:"1010435124018-57p23k49vv6u9k4uflfappnsmvp471i5.apps.googleusercontent.com",
    VITE_SERVER_URL:"http://localhost:3000/api/"
}

const devConfig = {
    MODE: 'development',
    VITE_DATA_URL:"https://cdn.jsdelivr.net/gh/tal0311/grocery-list/src/data/item.json",
    VITE_PROD_URL:"https://tal0311.github.io/morena-food-list/#/list",
    VITE_G_CLIENT_ID:"1010435124018-57p23k49vv6u9k4uflfappnsmvp471i5.apps.googleusercontent.com",
    VITE_SERVER_URL:"http://localhost:3000/api/"
    
}

const stagConfig = {
    MODE: 'staging',
    VITE_DATA_URL:"https://cdn.jsdelivr.net/gh/tal0311/grocery-list/src/data/item.json",
    VITE_PROD_URL:"https://tal0311.github.io/morena-food-list/#/list",
    VITE_G_CLIENT_ID:"1010435124018-57p23k49vv6u9k4uflfappnsmvp471i5.apps.googleusercontent.com",
    VITE_SERVER_URL:"http://localhost:3000/api/"
}

let config={} 

switch (import.meta.env.VITE_VERCEL_ENV) {
    case 'production':
        config = prodConfig;
        break;
    case 'preview':
        config = stagConfig;
        break;
    default:
        config = devConfig;
}

export default config;
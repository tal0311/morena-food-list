

export default {
  install: (app ) => {
    
    app.config.errorHandler = (err, instance, info) => {
        console.error('errorHandler', err, instance, info);
      }
  },
};
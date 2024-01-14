import 'vuetify/styles';
import {createVuetify} from 'vuetify';
import * as components from "vuetify/components";
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components,
  directives,
  theme:{
    themes:{
      light:{
        dark:false,
        colors:{
          primary: '#0065C1',
          secondary: '#BADEFF',
          create: '#1BC100',
          update: '#FFC42E',
          delete: '#FF3131',
        },
      },
    },
  },
});
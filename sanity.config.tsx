import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema'
import {structure} from './structure'
import {frFRLocale} from '@sanity/locale-fr-fr'
import {getDefaultDocumentNode} from './views'

import {theme} from 'https://themer.sanity.build/api/hues?default=1a6629&primary=00c853;600&transparent=8690a0;800'

export default defineConfig({
  name: 'default',
  title: 'Le nouveau Roberto',
  icon: () => <img src="/static/icon.png" alt="roberto v2" style={{maxWidth: '100%'}} />,
  projectId: '45lcq8dx',
  dataset: 'production',
  theme,
  plugins: [
    structureTool({structure, defaultDocumentNode: getDefaultDocumentNode}),
    visionTool(),
    frFRLocale(),
  ],

  studio: {
    components: {
      // Add custom components to the studio
      // logo: () => <img src="https://cdn.sanity.io/images/3do82whm/production/" alt="Logo" />,
    },
  },

  schema: {
    types: schemaTypes,
  },
})

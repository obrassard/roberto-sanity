import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema'
import {structure} from './structure'
import {frFRLocale} from '@sanity/locale-fr-fr'
import {getDefaultDocumentNode} from './views/recipeDetail'

import {theme} from 'https://themer.sanity.build/api/hues?default=1a6629&primary=00c853;600&transparent=8690a0;800'

export default defineConfig({
  name: 'default',
  title: 'Le nouveau Roberto',
  icon: () => <img src="/static/icon.png" alt="roberto v2" style={{maxWidth: '100%'}} />,
  theme,
  projectId: '45lcq8dx',
  dataset: 'production',
  scheduledPublishing: {
    enabled: false,
  },
  plugins: [
    structureTool({structure, defaultDocumentNode: getDefaultDocumentNode}),
    frFRLocale(),
    ...(isDev ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
  },
})

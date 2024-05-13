import {defineField, defineType} from 'sanity'
import styled from 'styled-components'

export const recipeDocument = defineType({
  name: 'recipe',
  title: 'Recettes',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'favorite',
      title: '😍 Ajouter aux recettes favorites',
      type: 'boolean',
      initialValue: false,
      options: {
        layout: 'checkbox',
      },
    }),

    defineField({
      name: 'notes',
      title: 'Instructions / Commentaires',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Citation', value: 'blockquote'},
          ],
        },
      ],
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    }),

    defineField({
      name: 'book',
      title: 'Livre',
      description: 'Dans quel livre se trouve cette recette ?',
      type: 'string',
    }),

    defineField({
      name: 'page',
      title: 'Page',
      description: 'À quelle page se trouve cette recette ?',
      type: 'number',
      validation: (Rule) =>
        Rule.integer()
          .min(1)
          .custom((page, context) => {
            if (context.document?.book && !page) {
              return 'La page est requise si un livre est spécifié'
            } else if (!context.document?.book && page) {
              return 'Le livre est requis si une page est spécifiée'
            }
            return true
          }),
    }),
    defineField({
      name: 'url',
      title: 'Lien de la recette (URL)',
      description: 'À quelle page se trouve cette recette ?',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{type: 'category'}],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'category.icon',
      book: 'book',
      page: 'page',
      url: 'url',
      favorite: 'favorite',
    },
    prepare({title, icon, book, page, url, favorite}) {
      let subtitle = ''
      if (book && page) {
        subtitle = `${book} - Page ${page}`
      } else if (url !== undefined) {
        subtitle = 'En ligne'
      }

      if (favorite) {
        subtitle = '❤️ ' + subtitle
      }

      return {
        title,
        subtitle,
        media: <Preview>{icon}</Preview>,
      }
    },
  },
})

const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: white;
  padding: 10px;
`

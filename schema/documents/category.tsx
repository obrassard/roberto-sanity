import {defineField, defineType} from 'sanity'
import styled from 'styled-components'

export const categoryDocument = defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: () => '📚',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji pour la catégorie',
      validation: (Rule) => Rule.required().min(2).max(3),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
    },
    prepare({title, icon}) {
      return {
        title,
        media: () => <Preview>{icon}</Preview>,
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

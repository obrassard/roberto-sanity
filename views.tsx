// ./deskStructure.js

import {DefaultDocumentNodeResolver} from 'sanity/structure'
import styled from 'styled-components'
import {useClient} from 'sanity'
import {useEffect, useState} from 'react'
import groq from 'groq'
import {PortableText} from '@portabletext/react'

const recipeRefQueries = groq`
*[_type == "recipe" && _id == $id][0] {
    title,
    "images": images[].asset -> url,
    "categories": category -> {
        title,
        icon
    }
}`

const RecipePreview = ({document}: any) => {
  const client = useClient()
  const recipe = document.displayed

  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState<any>(null)

  useEffect(() => {
    client.fetch(recipeRefQueries, {id: recipe._id}).then((data) => {
      if (data.images) {
        setImages(data.images)
      }

      if (data.categories) {
        setCategory(data.categories)
      }
    })
  })

  return (
    <Card>
      <Title>{recipe.title}</Title>
      <Wrapper>
        {recipe.book && (
          <BookContainer>
            <span>📖</span>
            <span>
              Disponible dans le livre <strong>{recipe.book}</strong> à la{' '}
              <strong>page {recipe.page}</strong>
            </span>
          </BookContainer>
        )}
        {recipe.favorite && (
          <LikedContainer>
            <span>❤️</span>
            <span>Recette favorite</span>
          </LikedContainer>
        )}
        {category && (
          <CategoryContainer>
            <span>{category.icon}</span>
            <span>{category.title}</span>
          </CategoryContainer>
        )}
      </Wrapper>
      {recipe.notes && (
        <>
          <SectionTitle>Notes</SectionTitle>
          <PortableText value={recipe.notes} />
        </>
      )}
      {images.length > 0 && (
        <>
          <SectionTitle>Images</SectionTitle>
          <Wrapper>
            {images.map((url) => (
              <img
                key={url}
                src={url}
                alt={recipe.title}
                style={{maxWidth: '100%', borderRadius: '4px'}}
              />
            ))}
          </Wrapper>
        </>
      )}
    </Card>
  )
}

const Card = styled.div`
  background: white;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0;
`
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.8rem;
`

const LikedContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffeded;
  border-radius: 4px;
  color: #ff4d4d;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.5rem 1rem;
`

const BookContainer = styled(LikedContainer)`
  background: #edf5ff;
  color: #4d7fff;
`

const CategoryContainer = styled(LikedContainer)`
  background: #f3f3f3;
  color: #333;
`

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #efefef;
  padding-bottom: 0.6rem;
`

export const getDefaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  // Render the JSON preview only on posts or the siteSettings document
  if (schemaType === 'recipe') {
    return S.document().views([
      S.view.form().title('Modifier la recette'),
      S.view.component(RecipePreview).title('Fiche recette'),
    ])
  }
}

//...rest of structure

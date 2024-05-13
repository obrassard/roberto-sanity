import {DefaultDocumentNodeResolver, usePaneRouter} from 'sanity/structure'
import styled from 'styled-components'
import {useClient} from 'sanity'
import {useEffect, useMemo, useState} from 'react'
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

  const {setView} = usePaneRouter()

  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState<any>(null)

  const recipeUrl = useMemo(() => {
    try {
      return recipe.url ? new URL(recipe.url) : null
    } catch {
      return null
    }
  }, [recipe.url])

  useEffect(() => {
    client.fetch(recipeRefQueries, {id: recipe._id}).then((data) => {
      if (data === null || !data.title) {
        setView('editor')
        return
      }

      if (data.images) {
        setImages(data.images)
      }

      if (data.categories) {
        setCategory(data.categories)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <Title>{recipe.title}</Title>
      <Wrapper>
        {recipe.book && (
          <BookContainer>
            <span>📖</span>
            <span>
              Disponible dans <strong>{recipe.book}</strong> à la{' '}
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
      {recipeUrl && (
        <WebUrlContainer>
          <div>Retrouvez cette recette sur {recipeUrl.hostname}</div>
          <a href={recipeUrl.href} target="_blank" rel="noreferrer">
            Afficher sur le site
          </a>
        </WebUrlContainer>
      )}
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

const WebUrlContainer = styled(LikedContainer)`
  flex-direction: column;
  margin-top: 1.5rem;
  padding: 1.5rem;
  max-width: 450px;
  width: calc(100% - 3rem);
  font-size: 1rem;
  background: #d4f5e2;
  color: #086c32;

  a {
    margin-top: 1rem;
    color: white;
    background: #086c32;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
  }
`

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #efefef;
  padding-bottom: 0.6rem;
`

export const getDefaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  // Render the recipe preview only on recipe document type
  if (schemaType === 'recipe') {
    return S.document().views([
      S.view.component(RecipePreview).title('Fiche recette'),
      S.view.form().title('Modifier la recette'),
    ])
  }
}

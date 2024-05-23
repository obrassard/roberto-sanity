import {ConfigContext} from 'sanity'
import {ListItemBuilder, StructureBuilder, StructureResolver} from 'sanity/structure'

const allRecipes = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .id('recettes')
    .title('Toutes les recettes')
    .icon(() => '🥑')
    .schemaType('recipe')
    .child(S.documentTypeList('recipe')),
)

const categories = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .id('categories')
    .title('Gérer les catégories')
    .icon(() => '⚙️')
    .child(S.documentTypeList('category')),
)

const recipeCategories = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .id('recettes-par-categorie')
    .title('Recettes par catégorie')
    .icon(() => '📖')
    .child(
      S.documentTypeList('category')
        .title('Catégories de recettes')
        .child((categoryId) =>
          S.documentTypeList('recipe')
            .title('Recettes')
            .filter('$categoryId == category._ref')
            .params({categoryId}),
        ),
    ),
)

const favoriteRecipes = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .id('favoris')
    .title('Mes recettes favorites')
    .icon(() => '😍')
    .child(S.documentTypeList('recipe').filter('favorite == true')),
)

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Roberto')
    .items([
      recipeCategories(S, context),
      favoriteRecipes(S, context),
      allRecipes(S, context),
      S.divider(),
      categories(S, context),
    ])

/**
 * Helper for creating and typing composable structure parts.
 */
export default function defineStructure<StructureType>(
  factory: (S: StructureBuilder, context: ConfigContext) => StructureType,
) {
  return factory
}

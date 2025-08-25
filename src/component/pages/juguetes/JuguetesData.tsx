
/**
 * Sebas se supone que acá vamos a llamar todos los juguetes de la BD
 * por ahora tendremos un arreglo de juguetes o un llamado de una API
 */
interface JugueteProps {
    title: string
    slug: string
    content: string
    precio: number
}

const juguetesData: JugueteProps[] = []

juguetesData.push(
    {
        title: 'Juguete 1',
        slug: 'juguete-1',
        content: 'Contenido del juguete 1',
        precio: 100
    },
    {
        title: 'Juguete 2',
        slug: 'juguete-2',
        content: 'Contenido del juguete 2',
        precio: 200
    },
    {
        title: 'Juguete 3',
        slug: 'juguete-3',
        content: 'Contenido del juguete 3',
        precio: 300
    },

    {
        title: 'Juguete 4',
        slug: 'juguete-4',
        content: 'Contenido del juguete 4',
        precio: 400
    },
    {
        title: 'Juguete 5',
        slug: 'juguete-5',
        content: 'Contenido del juguete 5',
        precio: 500
    }

)

export default juguetesData
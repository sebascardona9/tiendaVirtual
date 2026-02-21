interface JugueteProps {
    title: string
    slug: string
    content: string
    precio: number
}

const juguetesData: JugueteProps[] = [
    { title: 'Vela de Coco',     slug: 'vela-coco',     content: 'Aroma tropical a coco fresco del Caribe',      precio: 35000 },
    { title: 'Vela de Sándalo',  slug: 'vela-sandalo',  content: 'Notas cálidas de sándalo y vainilla',          precio: 42000 },
    { title: 'Vela de Lavanda',  slug: 'vela-lavanda',  content: 'Relajante aroma de lavanda pura',              precio: 35000 },
    { title: 'Vela Marina',      slug: 'vela-mar',      content: 'Brisa marina del Caribe colombiano',           precio: 38000 },
    { title: 'Vela de Rosa',     slug: 'vela-rosa',     content: 'Delicado aroma a rosas silvestres frescas',    precio: 40000 },
    { title: 'Vela de Canela',   slug: 'vela-canela',   content: 'Cálido y especiado aroma a canela y cardamomo',precio: 38000 },
]

export default juguetesData

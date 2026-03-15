export interface Municipio {
  codigo: string
  nombre: string
}

export interface Departamento {
  codigo: string
  codigoDane: string
  nombre: string
  municipios: Municipio[]
}

export interface Pais {
  codigo: string
  nombre: string
  departamentos: Departamento[]
}

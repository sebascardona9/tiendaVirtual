import colombiaData from '../data/colombia.json'
import type { Departamento, Municipio } from '../types/ubicacion.types'

const departamentos = colombiaData.pais.departamentos as Departamento[]

export const useColombia = () => {
  const getDepartamentos = (): Departamento[] => departamentos

  const getMunicipios = (codigoDepartamento: string): Municipio[] => {
    if (!codigoDepartamento) return []
    return departamentos.find(d => d.codigo === codigoDepartamento)?.municipios ?? []
  }

  const getDepartamentoNombre = (codigo: string): string =>
    departamentos.find(d => d.codigo === codigo)?.nombre ?? ''

  const getMunicipioNombre = (codigo: string): string => {
    for (const dep of departamentos) {
      const m = dep.municipios.find(m => m.codigo === codigo)
      if (m) return m.nombre
    }
    return ''
  }

  return { getDepartamentos, getMunicipios, getDepartamentoNombre, getMunicipioNombre }
}
